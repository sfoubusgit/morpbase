import { useEffect, useMemo, useState } from 'react';
import type { PublicProfile } from '../../types';
import type { WallPost, EarnedBadge } from '../../types/community';
import { getMyPublicProfile, upsertMyPublicProfile, uploadAvatar, deleteAvatarFile, uploadCover, deleteCoverFile } from '../../engine/profileStore';
import { listWallPosts } from '../../engine/wallStore';
import { getUserXP } from '../../engine/xpStore';
import { getEarnedBadges } from '../../engine/badgeStore';
import { getFollowerCount } from '../../engine/followStore';
import { getRemixesReceivedCount } from '../../engine/communityStore';
import { getTitleForXp } from '../../data/communityTitles';
import { BADGE_REGISTRY } from '../../data/communityBadges';
import './MyProfilePage.css';

type MyProfilePageProps = {
  isLoggedIn?: boolean;
  authUid?: string | null;
  userName?: string | null;
  onRequestLogin?: () => void;
};

const profileLinksToText = (links?: Record<string, string> | null) => {
  if (!links) return '';
  return Object.entries(links)
    .map(([label, url]) => `${label}: ${url}`)
    .join('\n');
};

const parseProfileLinks = (raw: string) => {
  const lines = raw.split('\n').map(line => line.trim()).filter(Boolean);
  if (lines.length === 0) return null;
  const links: Record<string, string> = {};
  lines.forEach((line, index) => {
    const parts = line.split(':');
    if (parts.length < 2) return;
    const label = parts.shift()?.trim();
    const url = parts.join(':').trim();
    if (!label || !url) return;
    links[label || `Link ${index + 1}`] = url;
  });
  return Object.keys(links).length > 0 ? links : null;
};

const TOGGLE_FIELDS = [
  { key: 'showPublicPrompts'   as const, title: 'Show public prompts',      desc: 'Allow visitors to browse your saved public prompts on your creator page.' },
  { key: 'discoverableInSearch'as const, title: 'Appear in creator search', desc: 'Let MorpBase include you in creator discovery results.' },
  { key: 'showLinksPublicly'   as const, title: 'Show links publicly',      desc: 'Display your external links on your public creator page.' },
];

const MAX_FEATURED_BADGES = 3;

export function MyProfilePage({ isLoggedIn = false, authUid, userName, onRequestLogin }: MyProfilePageProps) {
  const [profile, setProfile]           = useState<PublicProfile | null>(null);
  const [loading, setLoading]           = useState(true);
  const [saving, setSaving]             = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [message, setMessage]           = useState<string | null>(null);
  const [error, setError]               = useState<string | null>(null);
  const [form, setForm] = useState({
    displayName: '',
    bio: '',
    avatarUrl: '',
    avatarStoragePath: '',
    coverImageUrl: '',
    coverStoragePath: '',
    tags: '',
    links: '',
    showPublicPrompts: false,
    showPublicPools: false,
    discoverableInSearch: true,
    showLinksPublicly: true,
    featuredBadgeIds: [] as string[],
  });

  const [myWallPosts, setMyWallPosts] = useState<WallPost[]>([]);
  const [myXp, setMyXp] = useState<number | null>(null);
  const [myBadges, setMyBadges] = useState<EarnedBadge[]>([]);
  const [followerCount, setFollowerCount] = useState(0);
  const [remixesReceived, setRemixesReceived] = useState(0);

  useEffect(() => {
    if (!authUid) {
      setMyWallPosts([]); setMyXp(null); setMyBadges([]);
      setFollowerCount(0); setRemixesReceived(0);
      return;
    }
    void listWallPosts({ authorAuthUid: authUid, limit: 50 }).then(setMyWallPosts);
    void getUserXP(authUid).then(setMyXp);
    void getEarnedBadges(authUid).then(setMyBadges);
    void getFollowerCount(authUid).then(setFollowerCount);
    void getRemixesReceivedCount(authUid).then(setRemixesReceived);
  }, [authUid]);

  const myDna = useMemo(() => {
    const now = Date.now();
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;
    const tagCounts = new Map<string, { type: string; name: string; count: number }>();
    for (const post of myWallPosts) {
      for (const tag of post.identityTags) {
        const key = `${tag.type}\x00${tag.name}`;
        const entry = tagCounts.get(key);
        if (entry) entry.count++;
        else tagCounts.set(key, { type: tag.type, name: tag.name, count: 1 });
      }
    }
    const topTags = [...tagCounts.values()]
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);
    const recentPosts = myWallPosts.filter(p => now - p.createdAt < thirtyDays).length;
    const previousPosts = myWallPosts.filter(p => {
      const age = now - p.createdAt;
      return age >= thirtyDays && age < 2 * thirtyDays;
    }).length;
    return { topTags, recentPosts, previousPosts, totalPosts: myWallPosts.length };
  }, [myWallPosts]);

  useEffect(() => {
    let isActive = true;
    if (!isLoggedIn) {
      setProfile(null);
      setLoading(false);
      return () => { isActive = false; };
    }
    const loadProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const nextProfile = await getMyPublicProfile();
        if (!isActive) return;
        setProfile(nextProfile);
        setForm({
          displayName:          nextProfile?.displayName ?? userName ?? '',
          bio:                  nextProfile?.bio ?? '',
          avatarUrl:            nextProfile?.avatarUrl ?? '',
          avatarStoragePath:    nextProfile?.avatarStoragePath ?? '',
          coverImageUrl:        nextProfile?.coverImageUrl ?? '',
          coverStoragePath:     nextProfile?.coverStoragePath ?? '',
          tags:                 nextProfile?.tags?.join(', ') ?? '',
          links:                profileLinksToText(nextProfile?.links),
          showPublicPrompts:    Boolean(nextProfile?.showPublicPrompts),
          showPublicPools:      Boolean(nextProfile?.showPublicPools),
          discoverableInSearch: nextProfile?.discoverableInSearch ?? true,
          showLinksPublicly:    nextProfile?.showLinksPublicly ?? true,
          featuredBadgeIds:     nextProfile?.featuredBadgeIds ?? [],
        });
      } catch (err: any) {
        if (isActive) setError(err?.message ?? 'Failed to load your public profile.');
      } finally {
        if (isActive) setLoading(false);
      }
    };
    void loadProfile();
    return () => { isActive = false; };
  }, [isLoggedIn, userName]);

  const previewTags = useMemo(
    () => form.tags.split(',').map(t => t.trim()).filter(Boolean),
    [form.tags]
  );

  const previewLinks = useMemo(() => {
    if (!form.showLinksPublicly) return [];
    const links = parseProfileLinks(form.links);
    return links ? Object.entries(links) : [];
  }, [form.links, form.showLinksPublicly]);

  const completionItems = useMemo(() => ([
    { label: 'Display name', done: form.displayName.trim().length > 0 },
    { label: 'Bio',          done: form.bio.trim().length > 0 },
    { label: 'Avatar',       done: form.avatarUrl.trim().length > 0 },
    { label: 'Tags',         done: previewTags.length > 0 },
    { label: 'Visibility',   done: form.discoverableInSearch || form.showPublicPrompts },
  ]), [form, previewTags.length]);

  const completionCount = completionItems.filter(i => i.done).length;
  const completionPct   = (completionCount / completionItems.length) * 100;
  const displayName     = form.displayName.trim() || userName || 'Unnamed Creator';
  const avatarInitial   = displayName.charAt(0).toUpperCase();

  const handleSave = async () => {
    if (!isLoggedIn) { setError('Log in to manage your public profile.'); onRequestLogin?.(); return; }
    const dn = form.displayName.trim();
    if (!dn) { setError('Display name is required.'); return; }
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const tags  = form.tags.split(',').map(t => t.trim()).filter(Boolean);
      const links = parseProfileLinks(form.links);
      const saved = await upsertMyPublicProfile({
        displayName: dn,
        bio:         form.bio.trim() || null,
        avatarUrl:   form.avatarUrl.trim() || null,
        avatarStoragePath: form.avatarStoragePath.trim() || null,
        coverImageUrl: form.coverImageUrl.trim() || null,
        coverStoragePath: form.coverStoragePath.trim() || null,
        tags:        tags.length > 0 ? tags : null,
        links,
        showPublicPrompts:    form.showPublicPrompts,
        showPublicPools:      form.showPublicPools,
        discoverableInSearch: form.discoverableInSearch,
        showLinksPublicly:    form.showLinksPublicly,
        featuredBadgeIds:     form.featuredBadgeIds,
      });
      setProfile(saved);
      setMessage('Profile saved.');
    } catch (err: any) {
      setError(err?.message ?? 'Failed to save profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarFile = async (file: File | null) => {
    if (!file) return;
    if (!authUid) { setError('Log in to upload an avatar.'); return; }
    if (!file.type.startsWith('image/')) { setError('Avatar must be an image file.'); return; }
    if (file.size > 5 * 1024 * 1024)     { setError('Avatar must be 5 MB or smaller.'); return; }
    setUploadingAvatar(true);
    setError(null);
    const previousStoragePath = form.avatarStoragePath;
    try {
      const { storagePath, publicUrl } = await uploadAvatar(authUid, file);
      setForm(prev => ({ ...prev, avatarUrl: publicUrl, avatarStoragePath: storagePath }));
      setMessage('Avatar uploaded — save to apply.');
      if (previousStoragePath && previousStoragePath !== storagePath) {
        void deleteAvatarFile(previousStoragePath);
      }
    } catch (err: any) {
      setError(err?.message ?? 'Failed to upload avatar.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleCoverFile = async (file: File | null) => {
    if (!file) return;
    if (!authUid) { setError('Log in to upload a cover image.'); return; }
    if (!file.type.startsWith('image/')) { setError('Cover must be an image file.'); return; }
    if (file.size > 8 * 1024 * 1024)     { setError('Cover must be 8 MB or smaller.'); return; }
    setUploadingCover(true);
    setError(null);
    const previousStoragePath = form.coverStoragePath;
    try {
      const { storagePath, publicUrl } = await uploadCover(authUid, file);
      setForm(prev => ({ ...prev, coverImageUrl: publicUrl, coverStoragePath: storagePath }));
      setMessage('Cover uploaded — save to apply.');
      if (previousStoragePath && previousStoragePath !== storagePath) {
        void deleteCoverFile(previousStoragePath);
      }
    } catch (err: any) {
      setError(err?.message ?? 'Failed to upload cover.');
    } finally {
      setUploadingCover(false);
    }
  };

  // ── Logged-out ─────────────────────────────────────────────────────────────
  if (!isLoggedIn) {
    return (
      <div className="profile-page">
        <div className="profile-gate">
          <div className="profile-eyebrow">Creator Identity</div>
          <h1 className="profile-gate-title">Your creator space.</h1>
          <p className="profile-gate-sub">
            Build the public identity that appears on your creator page, with your shared prompts, and across the Community.
          </p>
          <button type="button" className="profile-primary-btn" onClick={onRequestLogin}>
            Log in to get started
          </button>
        </div>
      </div>
    );
  }

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-loading">Loading your profile…</div>
      </div>
    );
  }

  // ── Main ───────────────────────────────────────────────────────────────────
  return (
    <div className="profile-page">

      {/* Hero */}
      <div className="profile-hero">
        <div className="profile-hero-identity">
          {form.avatarUrl.trim() ? (
            <img src={form.avatarUrl.trim()} alt={displayName} className="profile-hero-avatar" />
          ) : (
            <div className="profile-hero-avatar profile-hero-avatar-fallback">{avatarInitial}</div>
          )}
          <div className="profile-hero-text">
            <div className="profile-eyebrow">Creator Identity</div>
            <h1 className="profile-hero-name">{displayName}</h1>
            {form.bio.trim() && <p className="profile-hero-bio">{form.bio.trim()}</p>}
          </div>
        </div>
        <div className="profile-hero-strength">
          <div className="profile-strength-label">{completionCount} of {completionItems.length} complete</div>
          <div className="profile-strength-bar">
            <div className="profile-strength-fill" style={{ width: `${completionPct}%` }} />
          </div>
          <div className="profile-strength-dots">
            {completionItems.map(item => (
              <span key={item.label} className={`profile-strength-dot${item.done ? ' done' : ''}`} title={item.label} />
            ))}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="profile-layout">

        {/* ── Left: editor ── */}
        <div className="profile-editor">

          {/* Identity */}
          <div className="profile-panel">
            <div className="profile-panel-head">
              <span className="profile-panel-kicker">Identity</span>
              <p>How you appear on your creator page and across Community.</p>
            </div>

            <div className="profile-avatar-row">
              <label className="profile-avatar-tile" htmlFor="profile-avatar-file">
                {form.avatarUrl.trim() ? (
                  <img src={form.avatarUrl.trim()} alt={displayName} className="profile-avatar-img" />
                ) : (
                  <div className="profile-avatar-fallback">{avatarInitial}</div>
                )}
                <div className="profile-avatar-overlay">
                  <span>{uploadingAvatar ? '…' : '↑'}</span>
                </div>
              </label>
              <input
                id="profile-avatar-file"
                type="file"
                accept="image/*"
                className="profile-avatar-input"
                onChange={e => void handleAvatarFile(e.target.files?.[0] ?? null)}
              />
              <div className="profile-avatar-meta">
                <div className="profile-field">
                  <label className="profile-field-label" htmlFor="profile-avatar-url">Avatar link</label>
                  <input
                    id="profile-avatar-url"
                    type="text"
                    className="profile-field-input"
                    placeholder="https://…"
                    value={form.avatarUrl}
                    onChange={e => setForm(prev => ({ ...prev, avatarUrl: e.target.value, avatarStoragePath: '' }))}
                  />
                </div>
                {form.avatarUrl && (
                  <button
                    type="button"
                    className="profile-link-btn"
                    onClick={() => {
                      const orphan = form.avatarStoragePath;
                      setForm(prev => ({ ...prev, avatarUrl: '', avatarStoragePath: '' }));
                      if (orphan) void deleteAvatarFile(orphan);
                    }}
                  >
                    Remove avatar
                  </button>
                )}
              </div>
            </div>

            <div className="profile-field">
              <label className="profile-field-label" htmlFor="profile-cover-url">Cover image</label>
              <div className="profile-cover-actions">
                <label className="profile-cover-upload-btn">
                  {uploadingCover ? 'Uploading…' : (form.coverImageUrl ? 'Replace cover' : 'Upload cover')}
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    disabled={uploadingCover}
                    onChange={e => { void handleCoverFile(e.target.files?.[0] ?? null); e.target.value = ''; }}
                  />
                </label>
                {form.coverImageUrl && (
                  <button
                    type="button"
                    className="profile-link-btn"
                    onClick={() => {
                      const orphan = form.coverStoragePath;
                      setForm(prev => ({ ...prev, coverImageUrl: '', coverStoragePath: '' }));
                      if (orphan) void deleteCoverFile(orphan);
                    }}
                  >
                    Remove cover
                  </button>
                )}
              </div>
              <input
                id="profile-cover-url"
                type="text"
                className="profile-field-input"
                placeholder="…or paste an image URL"
                value={form.coverImageUrl}
                onChange={e => setForm(prev => ({ ...prev, coverImageUrl: e.target.value, coverStoragePath: '' }))}
              />
              {form.coverImageUrl.trim() && (
                <div className="profile-cover-preview">
                  <img src={form.coverImageUrl.trim()} alt="Cover preview" className="profile-cover-img" />
                </div>
              )}
            </div>

            <div className="profile-field">
              <label className="profile-field-label" htmlFor="profile-display-name">Display Name</label>
              <input
                id="profile-display-name"
                type="text"
                className="profile-field-input"
                placeholder="Studio or creator name"
                value={form.displayName}
                onChange={e => setForm(prev => ({ ...prev, displayName: e.target.value }))}
              />
            </div>

            <div className="profile-field">
              <label className="profile-field-label" htmlFor="profile-bio">Bio</label>
              <textarea
                id="profile-bio"
                className="profile-field-input"
                rows={4}
                placeholder="What kind of prompts, identities, or creative styles do you build?"
                value={form.bio}
                onChange={e => setForm(prev => ({ ...prev, bio: e.target.value }))}
              />
            </div>
          </div>

          {/* Discovery */}
          <div className="profile-panel">
            <div className="profile-panel-head">
              <span className="profile-panel-kicker">Discovery</span>
              <p>Help people understand your style and find your work.</p>
            </div>

            <div className="profile-field">
              <label className="profile-field-label" htmlFor="profile-tags">Tags</label>
              <input
                id="profile-tags"
                type="text"
                className="profile-field-input"
                placeholder="cinematic, portrait, fantasy"
                value={form.tags}
                onChange={e => setForm(prev => ({ ...prev, tags: e.target.value }))}
              />
              {previewTags.length > 0 && (
                <div className="profile-tag-chips">
                  {previewTags.map(tag => <span key={tag} className="profile-tag-chip">{tag}</span>)}
                </div>
              )}
            </div>

            <div className="profile-field">
              <label className="profile-field-label" htmlFor="profile-links">Links</label>
              <textarea
                id="profile-links"
                className="profile-field-input"
                rows={4}
                placeholder={'Portfolio: https://...\nTwitter: https://...'}
                value={form.links}
                onChange={e => setForm(prev => ({ ...prev, links: e.target.value }))}
              />
              <span className="profile-field-hint">One per line — Label: URL</span>
            </div>
          </div>

          {/* Visibility */}
          <div className="profile-panel">
            <div className="profile-panel-head">
              <span className="profile-panel-kicker">Visibility</span>
              <p>Control what visitors can see on your public creator page.</p>
            </div>
            <div className="profile-toggle-list">
              {TOGGLE_FIELDS.map(({ key, title, desc }) => (
                <label key={key} className="profile-toggle-row">
                  <input
                    type="checkbox"
                    className="profile-toggle-input"
                    checked={form[key]}
                    onChange={e => setForm(prev => ({ ...prev, [key]: e.target.checked }))}
                  />
                  <div className="profile-toggle-text">
                    <strong>{title}</strong>
                    <span>{desc}</span>
                  </div>
                  <div className={`profile-toggle-track${form[key] ? ' on' : ''}`}>
                    <div className="profile-toggle-thumb" />
                  </div>
                </label>
              ))}
            </div>
          </div>

          {(error || message) && (
            <div className="profile-feedback">
              {error   && <div className="profile-error">{error}</div>}
              {message && <div className="profile-message">{message}</div>}
            </div>
          )}

          <div className="profile-actions">
            <button
              type="button"
              className="profile-primary-btn"
              onClick={() => void handleSave()}
              disabled={saving}
            >
              {saving ? 'Saving…' : 'Save Profile'}
            </button>
          </div>
        </div>

        {/* ── Right: sidebar ── */}
        <aside className="profile-sidebar">

          {/* Preview card */}
          <div className="profile-panel profile-preview-panel">
            <span className="profile-panel-kicker">Public Preview</span>
            <div className="profile-preview-card">
              <div className="profile-preview-header">
                {form.avatarUrl.trim() ? (
                  <img src={form.avatarUrl.trim()} alt={displayName} className="profile-preview-avatar" />
                ) : (
                  <div className="profile-preview-avatar profile-preview-avatar-fallback">{avatarInitial}</div>
                )}
                <div className="profile-preview-identity">
                  <div className="profile-preview-name">{displayName}</div>
                  {form.discoverableInSearch && <span className="profile-preview-badge">Discoverable</span>}
                </div>
              </div>

              {form.bio.trim() ? (
                <p className="profile-preview-bio">{form.bio.trim()}</p>
              ) : (
                <p className="profile-preview-bio profile-preview-bio-empty">No bio added yet.</p>
              )}

              {previewTags.length > 0 && (
                <div className="profile-preview-chips">
                  {previewTags.slice(0, 6).map(tag => (
                    <span key={tag} className="profile-preview-chip">{tag}</span>
                  ))}
                </div>
              )}

              {previewLinks.length > 0 && (
                <div className="profile-preview-chips">
                  {previewLinks.map(([label]) => (
                    <span key={label} className="profile-preview-chip profile-preview-chip-link">{label}</span>
                  ))}
                </div>
              )}

              <div className="profile-preview-footer">
                <span className={`profile-preview-status${form.showPublicPrompts ? ' on' : ''}`}>
                  {form.showPublicPrompts ? 'Prompts visible' : 'Prompts hidden'}
                </span>
                <span className={`profile-preview-status${form.discoverableInSearch ? ' on' : ''}`}>
                  {form.discoverableInSearch ? 'Discoverable' : 'Not discoverable'}
                </span>
              </div>
            </div>
          </div>

          {/* Profile strength */}
          <div className="profile-panel profile-checklist-panel">
            <span className="profile-panel-kicker">Profile Strength</span>
            <div className="profile-checklist-bar">
              <div className="profile-checklist-fill" style={{ width: `${completionPct}%` }} />
            </div>
            <div className="profile-checklist">
              {completionItems.map(item => (
                <div key={item.label} className={`profile-check-item${item.done ? ' done' : ''}`}>
                  <span className="profile-check-icon">{item.done ? '✓' : '○'}</span>
                  <span className="profile-check-label">{item.label}</span>
                </div>
              ))}
            </div>
            {profile?.updatedAt && (
              <div className="profile-last-saved">
                Saved {new Date(profile.updatedAt).toLocaleString(undefined, {
                  month: 'short', day: 'numeric',
                  hour: '2-digit', minute: '2-digit',
                })}
              </div>
            )}
          </div>

          {/* Your Signal */}
          <div className="profile-panel">
            <span className="profile-panel-kicker">Your Signal</span>
            {myDna.totalPosts === 0 ? (
              <p className="profile-signal-empty">Share prompts on the Wall to build your Creative DNA.</p>
            ) : (
              <>
                <div className="profile-signal-stats">
                  <div className="profile-signal-stat">
                    <strong>{myDna.totalPosts}</strong>
                    <span>Wall posts</span>
                  </div>
                  <div className="profile-signal-stat">
                    <strong>
                      {myDna.recentPosts}
                      {myDna.recentPosts > myDna.previousPosts && (
                        <span className="profile-signal-up"> ↑</span>
                      )}
                    </strong>
                    <span>This month</span>
                  </div>
                </div>
                {myDna.topTags.length > 0 && (
                  <div className="profile-signal-tags">
                    {myDna.topTags.map(tag => (
                      <span
                        key={`${tag.type}_${tag.name}`}
                        className={`profile-signal-tag profile-signal-tag--${tag.type}`}
                        title={`${tag.type} · ${tag.count}×`}
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* XP & Badges */}
          <div className="profile-panel">
            <span className="profile-panel-kicker">Reputation</span>
            <div className="profile-stats-row">
              <div className="profile-stat">
                <strong>{followerCount}</strong>
                <span>Followers</span>
              </div>
              <div className="profile-stat">
                <strong>{myWallPosts.length}</strong>
                <span>Wall posts</span>
              </div>
              <div className="profile-stat">
                <strong>{remixesReceived}</strong>
                <span>Remixes</span>
              </div>
              <div className="profile-stat">
                <strong>{myBadges.length}</strong>
                <span>Badges</span>
              </div>
            </div>
            {myXp !== null && (
              <div className="profile-xp-row">
                <span className="profile-xp-amount">{myXp.toLocaleString()} XP</span>
                <span className="profile-xp-title">{getTitleForXp(myXp).label}</span>
              </div>
            )}
            {myBadges.length === 0 ? (
              <p className="profile-signal-empty">No badges yet — post to the Wall, share identities, and enter challenges to earn them.</p>
            ) : (
              <>
                <div className="profile-badge-pinhint">
                  Pin up to {MAX_FEATURED_BADGES} to showcase on your public page ({form.featuredBadgeIds.length}/{MAX_FEATURED_BADGES}).
                </div>
                <div className="profile-badges">
                  {[...myBadges].sort((a, b) => b.earnedAt - a.earnedAt).map((b, i) => {
                    const def = BADGE_REGISTRY[b.badgeId];
                    if (!def) return null;
                    const isPinned = form.featuredBadgeIds.includes(b.badgeId);
                    const pinDisabled = !isPinned && form.featuredBadgeIds.length >= MAX_FEATURED_BADGES;
                    const isNewest = i === 0 && Date.now() - b.earnedAt < 7 * 24 * 60 * 60 * 1000;
                    const togglePin = () => {
                      setForm(prev => ({
                        ...prev,
                        featuredBadgeIds: isPinned
                          ? prev.featuredBadgeIds.filter(id => id !== b.badgeId)
                          : [...prev.featuredBadgeIds, b.badgeId].slice(0, MAX_FEATURED_BADGES),
                      }));
                    };
                    return (
                      <div
                        key={b.badgeId}
                        className={`profile-badge profile-badge--${def.rarity}${isPinned ? ' profile-badge--pinned' : ''}${isNewest ? ' profile-badge--new' : ''}`}
                        title={def.description}
                      >
                        <span className="profile-badge-icon">{def.icon}</span>
                        <span className="profile-badge-label">{def.label}</span>
                        {isNewest && <span className="profile-badge-new-tag">NEW</span>}
                        <button
                          type="button"
                          className="profile-badge-pin"
                          onClick={togglePin}
                          disabled={pinDisabled}
                          title={isPinned ? 'Unpin' : pinDisabled ? `Already pinned ${MAX_FEATURED_BADGES}` : 'Pin to public page'}
                        >
                          {isPinned ? '★' : '☆'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>

        </aside>
      </div>
    </div>
  );
}
