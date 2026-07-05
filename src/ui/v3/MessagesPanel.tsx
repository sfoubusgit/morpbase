import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import {
  listThreads, listMessages, sendMessage, markRead, acceptRequest, blockUser,
  getOrCreateThread, subscribeThread, subscribeInbox, searchCreators,
  type DmThreadSummary, type DmMessage, type CreatorHit,
} from './dmStore';

type MessagesPanelProps = {
  viewerAuthUid?: string | null;
  viewerName: string;
  /** when set, open (or start) a thread with this creator, then clear it */
  target: { authUid: string; name: string } | null;
  onClearTarget: () => void;
  onViewCreator: (authUid: string, name: string) => void;
  onLogin?: () => void;
};

const relTime = (iso: string | null): string => {
  if (!iso) return '';
  const t = new Date(iso).getTime();
  const s = Math.max(0, Math.floor((Date.now() - t) / 1000));
  if (s < 60) return 'now';
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  if (s < 604800) return `${Math.floor(s / 86400)}d`;
  return new Date(iso).toLocaleDateString();
};

const initial = (name: string) => name.trim()[0]?.toUpperCase() ?? '?';

/**
 * The Messages surface — an inbox split into Primary and Requests (first-contact
 * from people you don't follow lands in Requests), plus the open conversation.
 * MorpBase-native attachments (sending a character / scene / prompt) are Phase 3;
 * this ships text, SFW-rated on send, with block + realtime.
 */
export function MessagesPanel({ viewerAuthUid, viewerName, target, onClearTarget, onViewCreator, onLogin }: MessagesPanelProps) {
  const [threads, setThreads] = useState<DmThreadSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'primary' | 'requests'>('primary');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<DmMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<CreatorHit[]>([]);
  const [searching, setSearching] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const refreshThreads = async () => {
    if (!viewerAuthUid) return;
    try { setThreads(await listThreads(viewerAuthUid)); } catch { /* offline */ }
  };

  // open (or create) a thread with someone, then select it
  const openThread = async (authUid: string) => {
    if (!viewerAuthUid) return;
    try {
      const tid = await getOrCreateThread(authUid);
      await refreshThreads();
      setActiveId(tid);
      setSearch(''); setResults([]);
    } catch {
      setErr('Couldn’t open that conversation.');
    }
  };

  // debounced people search
  useEffect(() => {
    const q = search.trim();
    if (q.length < 2 || !viewerAuthUid) { setResults([]); setSearching(false); return; }
    setSearching(true);
    let live = true;
    const t = window.setTimeout(() => {
      searchCreators(q, viewerAuthUid)
        .then(r => { if (live) setResults(r); })
        .catch(() => { if (live) setResults([]); })
        .finally(() => { if (live) setSearching(false); });
    }, 250);
    return () => { live = false; window.clearTimeout(t); };
  }, [search, viewerAuthUid]);

  // initial load + realtime inbox refresh
  useEffect(() => {
    if (!viewerAuthUid) { setThreads([]); setLoading(false); return; }
    let live = true;
    setLoading(true);
    listThreads(viewerAuthUid).then(t => { if (live) { setThreads(t); setLoading(false); } }).catch(() => { if (live) setLoading(false); });
    const unsub = subscribeInbox(viewerAuthUid, () => { void refreshThreads(); });
    return () => { live = false; unsub(); };
  }, [viewerAuthUid]);

  // open (or start) a thread with a target creator, then clear it
  useEffect(() => {
    if (!target || !viewerAuthUid) return;
    void openThread(target.authUid).finally(onClearTarget);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, viewerAuthUid]);

  const active = useMemo(() => threads.find(t => t.threadId === activeId) ?? null, [threads, activeId]);

  // load an opened thread's messages + mark read + subscribe
  useEffect(() => {
    if (!activeId || !viewerAuthUid) { setMessages([]); return; }
    let live = true;
    setErr(null);
    listMessages(activeId).then(m => { if (live) setMessages(m); }).catch(() => {});
    void markRead(activeId, viewerAuthUid).then(() => refreshThreads());
    const unsub = subscribeThread(activeId, m => {
      if (!live) return;
      setMessages(prev => (prev.some(x => x.id === m.id) ? prev : [...prev, m]));
      if (m.senderAuthUid !== viewerAuthUid) void markRead(activeId, viewerAuthUid);
    });
    return () => { live = false; unsub(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId, viewerAuthUid]);

  // keep the thread scrolled to the newest message
  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight }); }, [messages, activeId]);

  const primary = threads.filter(t => !t.isRequest);
  const requests = threads.filter(t => t.isRequest);
  const shown = tab === 'primary' ? primary : requests;

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    const body = draft.trim();
    if (!body || sending || !activeId) return;
    setSending(true); setErr(null);
    try {
      const m = await sendMessage(activeId, body);
      setMessages(prev => [...prev, m]);
      setDraft('');
      void refreshThreads();
    } catch (e2) {
      setErr(e2 instanceof Error ? e2.message : 'Couldn’t send.');
    } finally { setSending(false); }
  };

  const handleAccept = async () => {
    if (!activeId || !viewerAuthUid) return;
    await acceptRequest(activeId, viewerAuthUid);
    await refreshThreads();
    setTab('primary');
  };

  const handleBlock = async () => {
    if (!active || !viewerAuthUid) return;
    if (!window.confirm(`Block @${active.otherName.toLowerCase().replace(/\s+/g, '')}? They won’t be able to message you.`)) return;
    try { await blockUser(active.otherAuthUid); } catch { /* ignore */ }
    setActiveId(null);
    await refreshThreads();
  };

  if (!viewerAuthUid) {
    return (
      <div className="v3-flow">
        <div className="v3-head"><div><div className="v3-eyebrow">Messages</div><h2>Messages</h2></div></div>
        <div className="v3-empty">Log in to message creators. <button type="button" className="v3-btn primary" style={{ marginLeft: 10 }} onClick={onLogin}>Log in</button></div>
      </div>
    );
  }

  return (
    <div className="v3-dm">
      {/* inbox */}
      <aside className={`v3-dm-list${activeId ? ' has-active' : ''}`}>
        <div className="v3-dm-listhd">
          <h2>Messages</h2>
          <div className="v3-dm-search">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              <path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search people to message…"
            />
            {search && <button type="button" className="clr" onClick={() => { setSearch(''); setResults([]); }} aria-label="Clear">✕</button>}
            {search.trim().length >= 2 && (
              <div className="v3-dm-results">
                {searching ? (
                  <div className="v3-dm-results-empty">Searching…</div>
                ) : results.length === 0 ? (
                  <div className="v3-dm-results-empty">No people match “{search.trim()}”.</div>
                ) : (
                  results.map(r => (
                    <button key={r.authUid} type="button" className="v3-dm-result" onClick={() => openThread(r.authUid)}>
                      <span className="av">{r.avatarUrl ? <img src={r.avatarUrl} alt={r.name} /> : initial(r.name)}</span>
                      <span className="nm">{r.name}</span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
          <div className="v3-dm-tabs">
            <button type="button" className={`v3-dm-tab${tab === 'primary' ? ' on' : ''}`} onClick={() => setTab('primary')}>Primary{primary.length > 0 && ` · ${primary.length}`}</button>
            <button type="button" className={`v3-dm-tab${tab === 'requests' ? ' on' : ''}`} onClick={() => setTab('requests')}>Requests{requests.length > 0 && ` · ${requests.length}`}</button>
          </div>
        </div>
        {loading ? (
          <div className="v3-dm-empty">Loading…</div>
        ) : shown.length === 0 ? (
          <div className="v3-dm-empty">{tab === 'primary' ? 'No conversations yet. Open a creator’s profile and hit Message.' : 'No message requests.'}</div>
        ) : (
          <div className="v3-dm-threads">
            {shown.map(t => (
              <button
                key={t.threadId}
                type="button"
                className={`v3-dm-threadrow${t.threadId === activeId ? ' on' : ''}${t.unread ? ' unread' : ''}`}
                onClick={() => setActiveId(t.threadId)}
              >
                <span className="av">{t.otherAvatarUrl ? <img src={t.otherAvatarUrl} alt={t.otherName} /> : initial(t.otherName)}</span>
                <span className="meta">
                  <span className="nm">{t.otherName}<span className="ago">{relTime(t.lastAt)}</span></span>
                  <span className="pv">{t.lastFromMe && t.lastBody ? 'You: ' : ''}{t.lastBody || 'No messages yet'}</span>
                </span>
                {t.unread && <span className="dot" aria-label="Unread" />}
              </button>
            ))}
          </div>
        )}
      </aside>

      {/* conversation */}
      <section className={`v3-dm-thread${activeId ? ' has-active' : ''}`}>
        {!active ? (
          <div className="v3-dm-blank">Select a conversation, or open a creator’s profile to start one.</div>
        ) : (
          <>
            <div className="v3-dm-threadhd">
              <button type="button" className="v3-dm-back" onClick={() => setActiveId(null)} aria-label="Back">←</button>
              <button type="button" className="who" onClick={() => onViewCreator(active.otherAuthUid, active.otherName)} title="View profile">
                <span className="av">{active.otherAvatarUrl ? <img src={active.otherAvatarUrl} alt={active.otherName} /> : initial(active.otherName)}</span>
                <span className="nm">{active.otherName}</span>
              </button>
              <button type="button" className="v3-dm-block" onClick={handleBlock} title="Block this person">Block</button>
            </div>

            {active.isRequest && (
              <div className="v3-dm-request">
                <span><b>{active.otherName}</b> wants to message you.</span>
                <span className="acts">
                  <button type="button" className="v3-btn primary" onClick={handleAccept}>Accept</button>
                  <button type="button" className="v3-btn danger" onClick={handleBlock}>Block</button>
                </span>
              </div>
            )}

            <div className="v3-dm-scroll" ref={scrollRef}>
              {messages.length === 0 ? (
                <div className="v3-dm-empty">Say hi — start the conversation.</div>
              ) : (
                messages.map(m => (
                  <div key={m.id} className={`v3-dm-msg${m.senderAuthUid === viewerAuthUid ? ' mine' : ''}`}>
                    <div className="bubble">{m.body}</div>
                    <div className="t">{relTime(m.createdAt)}</div>
                  </div>
                ))
              )}
            </div>

            {err && <div className="v3-cmp-error" style={{ margin: '0 16px 8px' }}>{err}</div>}
            <form className="v3-dm-composer" onSubmit={handleSend}>
              <input
                value={draft}
                onChange={e => setDraft(e.target.value)}
                placeholder={`Message ${active.otherName}…`}
                maxLength={2000}
              />
              <button type="submit" className="v3-btn primary" disabled={sending || !draft.trim()}>{sending ? '…' : 'Send'}</button>
            </form>
          </>
        )}
      </section>
    </div>
  );
}
