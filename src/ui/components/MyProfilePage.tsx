import { useEffect, useMemo, useState } from 'react';
import type { PublicProfile } from '../../types';
import { getMyPublicProfile, upsertMyPublicProfile } from '../../engine/profileStore';
import './MyProfilePage.css';

type MyProfilePageProps = {
  isLoggedIn?: boolean;
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

export function MyProfilePage({ isLoggedIn = false, userName, onRequestLogin }: MyProfilePageProps) {
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    displayName: '',
    bio: '',
    avatarUrl: '',
    tags: '',
    links: '',
    showPublicPrompts: false,
    showPublicPools: false,
    discoverableInSearch: true,
    showLinksPublicly: true,
  });

  useEffect(() => {
    let isActive = true;

    if (!isLoggedIn) {
      setProfile(null);
      setLoading(false);
      return () => {
        isActive = false;
      };
    }

    const loadProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const nextProfile = await getMyPublicProfile();
        if (!isActive) return;
        setProfile(nextProfile);
        setForm({
          displayName: nextProfile?.displayName ?? userName ?? '',
          bio: nextProfile?.bio ?? '',
          avatarUrl: nextProfile?.avatarUrl ?? '',
          tags: nextProfile?.tags?.join(', ') ?? '',
          links: profileLinksToText(nextProfile?.links),
          showPublicPrompts: Boolean(nextProfile?.showPublicPrompts),
          showPublicPools: Boolean(nextProfile?.showPublicPools),
          discoverableInSearch: nextProfile?.discoverableInSearch ?? true,
          showLinksPublicly: nextProfile?.showLinksPublicly ?? true,
        });
      } catch (err: any) {
        if (isActive) {
          setError(err?.message ?? 'Failed to load your public profile.');
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    void loadProfile();
    return () => {
      isActive = false;
    };
  }, [isLoggedIn, userName]);

  const previewTags = useMemo(
    () => form.tags.split(',').map(tag => tag.trim()).filter(Boolean),
    [form.tags]
  );

  const previewLinks = useMemo(() => {
    if (!form.showLinksPublicly) return [];
    const links = parseProfileLinks(form.links);
    return links ? Object.entries(links) : [];
  }, [form.links, form.showLinksPublicly]);

  const completionItems = useMemo(() => ([
    { label: 'Display name', done: form.displayName.trim().length > 0 },
    { label: 'Bio', done: form.bio.trim().length > 0 },
    { label: 'Avatar', done: form.avatarUrl.trim().length > 0 },
    { label: 'Tags', done: previewTags.length > 0 },
    { label: 'Public visibility', done: form.showPublicPrompts || form.showPublicPools },
  ]), [form, previewTags.length]);

  const completionCount = completionItems.filter(item => item.done).length;

  const handleSave = async () => {
    if (!isLoggedIn) {
      setError('Log in to manage your public profile.');
      onRequestLogin?.();
      return;
    }

    const displayName = form.displayName.trim();
    if (!displayName) {
      setError('Display name is required.');
      return;
    }

    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const tags = form.tags.split(',').map(tag => tag.trim()).filter(Boolean);
      const links = parseProfileLinks(form.links);
      const saved = await upsertMyPublicProfile({
        displayName,
        bio: form.bio.trim() || null,
        avatarUrl: form.avatarUrl.trim() || null,
        tags: tags.length > 0 ? tags : null,
        links,
        showPublicPrompts: form.showPublicPrompts,
        showPublicPools: form.showPublicPools,
        discoverableInSearch: form.discoverableInSearch,
        showLinksPublicly: form.showLinksPublicly,
      });
      setProfile(saved);
      setMessage('Profile saved.');
    } catch (err: any) {
      setError(err?.message ?? 'Failed to save profile.');
    } finally {
      setSaving(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="my-profile-page">
        <div className="my-profile-hero">
          <div>
            <div className="my-profile-eyebrow">Creator Identity</div>
            <h1>My Profile</h1>
            <p>Set up the public creator identity that appears with your shared prompts and pools.</p>
          </div>
        </div>
        <div className="my-profile-empty">
          <h2>Log in to create your profile</h2>
          <p>Your public profile powers creator attribution, discovery visibility, and public creator pages.</p>
          <button type="button" onClick={onRequestLogin}>Log In</button>
        </div>
      </div>
    );
  }

  return (
    <div className="my-profile-page">
      <div className="my-profile-hero">
        <div>
          <div className="my-profile-eyebrow">Creator Identity</div>
          <h1>My Profile</h1>
          <p>Manage the public identity MorpBase uses for your creator presence, discovery, and shared work.</p>
        </div>
        <div className="my-profile-completion">
          <span>{completionCount}/{completionItems.length} complete</span>
          <div className="my-profile-completion-bar">
            <span style={{ width: `${(completionCount / completionItems.length) * 100}%` }} />
          </div>
        </div>
      </div>

      <div className="my-profile-layout">
        <div className="my-profile-editor">
          <section className="my-profile-section">
            <div className="my-profile-section-head">
              <h2>Identity</h2>
              <p>This is what people will recognize when they view your public creator page.</p>
            </div>
            <label>
              Display name
              <input
                type="text"
                value={form.displayName}
                onChange={event => setForm(prev => ({ ...prev, displayName: event.target.value }))}
                placeholder="Studio or creator name"
              />
            </label>
            <label>
              Bio
              <textarea
                rows={4}
                value={form.bio}
                onChange={event => setForm(prev => ({ ...prev, bio: event.target.value }))}
                placeholder="What kind of prompts, pools, or creative worlds do you make?"
              />
            </label>
            <label>
              Avatar URL
              <input
                type="text"
                value={form.avatarUrl}
                onChange={event => setForm(prev => ({ ...prev, avatarUrl: event.target.value }))}
                placeholder="https://..."
              />
              <span className="my-profile-field-hint">This field can later be upgraded to real avatar upload without changing the page structure.</span>
            </label>
          </section>

          <section className="my-profile-section">
            <div className="my-profile-section-head">
              <h2>Links and Tags</h2>
              <p>Help people understand your style and connect to your external work.</p>
            </div>
            <label>
              Tags
              <input
                type="text"
                value={form.tags}
                onChange={event => setForm(prev => ({ ...prev, tags: event.target.value }))}
                placeholder="cinematic, portrait, fantasy"
              />
            </label>
            <label>
              Links
              <textarea
                rows={4}
                value={form.links}
                onChange={event => setForm(prev => ({ ...prev, links: event.target.value }))}
                placeholder={'Portfolio: https://...\nTwitter: https://...'}
              />
              <span className="my-profile-field-hint">Use one link per line as `Label: URL`.</span>
            </label>
          </section>

          <section className="my-profile-section">
            <div className="my-profile-section-head">
              <h2>Visibility</h2>
              <p>Choose what MorpBase exposes publicly through your creator identity.</p>
            </div>
            <label className="my-profile-toggle">
              <input
                type="checkbox"
                checked={form.showPublicPrompts}
                onChange={event => setForm(prev => ({ ...prev, showPublicPrompts: event.target.checked }))}
              />
              <span>
                <strong>Show public prompts</strong>
                <small>Allow visitors to view prompts you publish publicly.</small>
              </span>
            </label>
            <label className="my-profile-toggle">
              <input
                type="checkbox"
                checked={form.showPublicPools}
                onChange={event => setForm(prev => ({ ...prev, showPublicPools: event.target.checked }))}
              />
              <span>
                <strong>Show public pools</strong>
                <small>Display your shared pool uploads on your creator page.</small>
              </span>
            </label>
            <label className="my-profile-toggle">
              <input
                type="checkbox"
                checked={form.discoverableInSearch}
                onChange={event => setForm(prev => ({ ...prev, discoverableInSearch: event.target.checked }))}
              />
              <span>
                <strong>Appear in creator search</strong>
                <small>Let MorpBase include your public profile in creator discovery results.</small>
              </span>
            </label>
            <label className="my-profile-toggle">
              <input
                type="checkbox"
                checked={form.showLinksPublicly}
                onChange={event => setForm(prev => ({ ...prev, showLinksPublicly: event.target.checked }))}
              />
              <span>
                <strong>Show links publicly</strong>
                <small>Display your external links on your public profile.</small>
              </span>
            </label>
          </section>

          {(error || message) && (
            <div className="my-profile-feedback">
              {error && <div className="my-profile-error">{error}</div>}
              {message && <div className="my-profile-message">{message}</div>}
            </div>
          )}

          <div className="my-profile-actions">
            <button type="button" onClick={handleSave} disabled={saving || loading}>
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </div>

        <aside className="my-profile-preview">
          <div className="my-profile-preview-card">
            <div className="my-profile-preview-label">Public Preview</div>
            <div className="my-profile-preview-header">
              {form.avatarUrl.trim() ? (
                <img src={form.avatarUrl.trim()} alt={form.displayName || 'Profile avatar'} className="my-profile-preview-avatar" />
              ) : (
                <div className="my-profile-preview-avatar my-profile-preview-avatar-fallback">
                  {(form.displayName.trim() || userName || 'M').charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <div className="my-profile-preview-name">{form.displayName.trim() || userName || 'Unnamed creator'}</div>
                <div className="my-profile-preview-subtitle">
                  {form.discoverableInSearch ? 'Discoverable in creator search' : 'Hidden from creator search'}
                </div>
              </div>
            </div>
            {form.bio.trim() ? (
              <p className="my-profile-preview-bio">{form.bio.trim()}</p>
            ) : (
              <p className="my-profile-preview-bio my-profile-preview-bio-empty">Add a short bio so people understand what you create.</p>
            )}
            {previewTags.length > 0 && (
              <div className="my-profile-preview-tags">
                {previewTags.slice(0, 6).map(tag => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            )}
            {previewLinks.length > 0 && (
              <div className="my-profile-preview-links">
                {previewLinks.map(([label]) => (
                  <span key={label}>{label}</span>
                ))}
              </div>
            )}
            <div className="my-profile-preview-visibility">
              <span>{form.showPublicPrompts ? 'Public prompts on' : 'Prompts private'}</span>
              <span>{form.showPublicPools ? 'Public pools on' : 'Pools private'}</span>
            </div>
          </div>

          <div className="my-profile-checklist">
            <div className="my-profile-preview-label">Completion</div>
            {completionItems.map(item => (
              <div key={item.label} className={`my-profile-checklist-item ${item.done ? 'done' : ''}`}>
                <span>{item.done ? 'Done' : 'Open'}</span>
                <span>{item.label}</span>
              </div>
            ))}
            {profile?.updatedAt && (
              <div className="my-profile-last-saved">
                Last saved {new Date(profile.updatedAt).toLocaleString()}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
