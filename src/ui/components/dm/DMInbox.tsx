import { useCallback, useEffect, useRef, useState } from 'react';
import type { DirectMessage, DMThread } from '../../../types/community';
import { listThreads, listMessages, sendDM, markThreadRead } from '../../../engine/dmStore';
import './DMInbox.css';

type DMInboxProps = {
  authUid: string;
  authName: string;
  initialRecipient?: { authUid: string; name: string } | null;
};

function formatTime(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  return new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

type ActiveThread = { authUid: string; name: string };

export function DMInbox({ authUid, authName, initialRecipient }: DMInboxProps) {
  const [threads, setThreads] = useState<DMThread[]>([]);
  const [loadingThreads, setLoadingThreads] = useState(true);
  const [active, setActive] = useState<ActiveThread | null>(initialRecipient ?? null);
  const [messages, setMessages] = useState<DirectMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const loadThreads = useCallback(async () => {
    const data = await listThreads(authUid);
    setThreads(data);
    setLoadingThreads(false);
  }, [authUid]);

  useEffect(() => { void loadThreads(); }, [loadThreads]);

  // When initialRecipient changes (e.g. from clicking Message on a profile)
  useEffect(() => {
    if (initialRecipient) setActive(initialRecipient);
  }, [initialRecipient?.authUid]); // eslint-disable-line react-hooks/exhaustive-deps

  // Load messages when active thread changes
  useEffect(() => {
    if (!active) { setMessages([]); return; }
    setLoadingMessages(true);
    void listMessages(authUid, active.authUid).then(msgs => {
      setMessages(msgs);
      setLoadingMessages(false);
    });
    void markThreadRead(authUid, active.authUid).then(() => {
      setThreads(prev => prev.map(t =>
        t.otherAuthUid === active.authUid ? { ...t, unreadCount: 0 } : t,
      ));
    });
  }, [authUid, active?.authUid]); // eslint-disable-line react-hooks/exhaustive-deps

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const handleOpenThread = (thread: DMThread) => {
    setActive({ authUid: thread.otherAuthUid, name: thread.otherName });
  };

  const handleSend = async () => {
    if (!active || !body.trim()) return;
    setSending(true);
    setSendError(null);
    try {
      const msg = await sendDM(authUid, authName, active.authUid, active.name, body.trim());
      setMessages(prev => [...prev, msg]);
      setBody('');
      // Refresh threads so the new message shows as last message
      void loadThreads();
    } catch (e) {
      setSendError(e instanceof Error ? e.message : 'Failed to send.');
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  };

  // ── Thread view ──────────────────────────────────────────────────────────────
  if (active) {
    return (
      <div className="dm-inbox">
        <div className="dm-thread-header">
          <button type="button" className="dm-back-btn" onClick={() => setActive(null)}>
            ← All Messages
          </button>
          <span className="dm-thread-name">{active.name}</span>
        </div>

        <div className="dm-message-list">
          {loadingMessages ? (
            <div className="dm-empty">Loading…</div>
          ) : messages.length === 0 ? (
            <div className="dm-empty">No messages yet. Say hello!</div>
          ) : (
            messages.map(msg => {
              const isMine = msg.senderAuthUid === authUid;
              return (
                <div key={msg.id} className={`dm-message${isMine ? ' dm-message--mine' : ''}`}>
                  {msg.promptSnapshot && (
                    <div className="dm-message-snapshot">{msg.promptSnapshot}</div>
                  )}
                  <div className="dm-message-bubble">{msg.body}</div>
                  <div className="dm-message-time">{formatTime(msg.createdAt)}</div>
                </div>
              );
            })
          )}
          <div ref={bottomRef} />
        </div>

        <div className="dm-compose">
          <textarea
            className="dm-compose-input"
            placeholder={`Message ${active.name}… (Enter to send)`}
            value={body}
            rows={2}
            onChange={e => setBody(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={sending}
          />
          {sendError && <p className="dm-send-error">{sendError}</p>}
          <button
            type="button"
            className="dm-send-btn"
            disabled={!body.trim() || sending}
            onClick={() => void handleSend()}
          >
            {sending ? '…' : 'Send'}
          </button>
        </div>
      </div>
    );
  }

  // ── Thread list ──────────────────────────────────────────────────────────────
  return (
    <div className="dm-inbox">
      <div className="dm-inbox-header">
        <span className="dm-inbox-title">Messages</span>
      </div>

      {loadingThreads ? (
        <div className="dm-empty">Loading…</div>
      ) : threads.length === 0 ? (
        <div className="dm-empty">
          No messages yet. Go to a creator's profile and click "Send Message" to start a conversation.
        </div>
      ) : (
        <div className="dm-thread-list">
          {threads.map(thread => (
            <button
              key={thread.otherAuthUid}
              type="button"
              className={`dm-thread-row${thread.unreadCount > 0 ? ' dm-thread-row--unread' : ''}`}
              onClick={() => handleOpenThread(thread)}
            >
              <div className="dm-thread-avatar">
                {thread.otherName.charAt(0).toUpperCase()}
              </div>
              <div className="dm-thread-body">
                <div className="dm-thread-top">
                  <span className="dm-thread-other-name">{thread.otherName}</span>
                  <span className="dm-thread-time">{formatTime(thread.lastMessage.createdAt)}</span>
                </div>
                <div className="dm-thread-preview">
                  {thread.lastMessage.senderAuthUid === authUid ? 'You: ' : ''}
                  {thread.lastMessage.body.length > 60
                    ? thread.lastMessage.body.slice(0, 60) + '…'
                    : thread.lastMessage.body}
                </div>
              </div>
              {thread.unreadCount > 0 && (
                <span className="dm-thread-badge">{thread.unreadCount}</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
