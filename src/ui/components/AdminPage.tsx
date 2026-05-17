import { useEffect, useMemo, useState } from 'react';
import type { AdminUserRecord } from '../../types';
import type { Challenge } from '../../types/community';
import {
  backfillMissingPublicProfiles,
  createMissingPublicProfile,
  listAdminUsers,
} from '../../engine/adminStore';
import { listAllChallenges, createChallenge } from '../../engine/challengeStore';
import {
  getAdminAnalyticsSummary,
  listAdminAnalyticsPageBreakdown,
  listAdminRecentAnalyticsEvents,
} from '../../engine/adminAnalyticsStore';
import type {
  AdminAnalyticsPageStat,
  AdminAnalyticsRecentEvent,
  AdminAnalyticsSummary,
} from '../../types';
import './AdminPage.css';

type AdminPageProps = {
  userName?: string | null;
};

const formatDate = (timestamp: number) =>
  new Date(timestamp).toLocaleDateString();

const formatDateTime = (timestamp: number) =>
  new Date(timestamp).toLocaleString();

export function AdminPage({ userName }: AdminPageProps) {
  const [users, setUsers] = useState<AdminUserRecord[]>([]);
  const [analyticsSummary, setAnalyticsSummary] = useState<AdminAnalyticsSummary | null>(null);
  const [analyticsPageBreakdown, setAnalyticsPageBreakdown] = useState<AdminAnalyticsPageStat[]>([]);
  const [recentEvents, setRecentEvents] = useState<AdminAnalyticsRecentEvent[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'users' | 'analytics' | 'challenges' | 'system'>('users');

  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [challengesLoading, setChallengesLoading] = useState(true);
  const [challengeForm, setChallengeForm] = useState({
    title: '',
    constraintText: '',
    description: '',
    type: 'weekly' as 'weekly' | 'monthly' | 'flash',
    startDate: new Date().toISOString().slice(0, 16),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
  });
  const [challengeSaving, setChallengeSaving] = useState(false);

  const refreshChallenges = async () => {
    setChallengesLoading(true);
    try {
      setChallenges(await listAllChallenges());
    } finally {
      setChallengesLoading(false);
    }
  };

  const handleCreateChallenge = async () => {
    if (!challengeForm.title.trim() || !challengeForm.constraintText.trim()) {
      setError('Title and constraint are required.');
      return;
    }
    setChallengeSaving(true);
    setError(null);
    try {
      await createChallenge({
        title: challengeForm.title,
        constraintText: challengeForm.constraintText,
        description: challengeForm.description || null,
        type: challengeForm.type,
        startsAt: new Date(challengeForm.startDate),
        endsAt: new Date(challengeForm.endDate),
      });
      setMessage('Challenge created.');
      setChallengeForm(prev => ({ ...prev, title: '', constraintText: '', description: '' }));
      await refreshChallenges();
    } catch (err: any) {
      setError(err?.message ?? 'Failed to create challenge.');
    } finally {
      setChallengeSaving(false);
    }
  };

  const refreshUsers = async () => {
    setLoading(true);
    try {
      const next = await listAdminUsers();
      setUsers(next);
      setError(null);
      setSelectedUserId(prev => (prev && next.some(user => user.userId === prev)) ? prev : next[0]?.userId ?? null);
    } catch (err: any) {
      setError(err?.message ?? 'Failed to load admin users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUsers();
    void refreshChallenges();
  }, []);

  const refreshAnalytics = async () => {
    setAnalyticsLoading(true);
    try {
      const [summary, pageBreakdown, events] = await Promise.all([
        getAdminAnalyticsSummary(),
        listAdminAnalyticsPageBreakdown(),
        listAdminRecentAnalyticsEvents(),
      ]);
      setAnalyticsSummary(summary);
      setAnalyticsPageBreakdown(pageBreakdown);
      setRecentEvents(events);
      setError(null);
    } catch (err: any) {
      setError(err?.message ?? 'Failed to load analytics.');
    } finally {
      setAnalyticsLoading(false);
    }
  };

  useEffect(() => {
    refreshAnalytics();
  }, []);

  const filteredUsers = useMemo(() => {
    const trimmed = searchTerm.trim().toLowerCase();
    if (!trimmed) return users;
    return users.filter(user =>
      user.displayName.toLowerCase().includes(trimmed)
      || user.email.toLowerCase().includes(trimmed)
    );
  }, [users, searchTerm]);

  const selectedUser = useMemo(() => (
    filteredUsers.find(user => user.userId === selectedUserId)
    ?? users.find(user => user.userId === selectedUserId)
    ?? null
  ), [filteredUsers, users, selectedUserId]);

  const summary = useMemo(() => ({
    totalUsers: users.length,
    missingProfiles: users.filter(user => !user.hasPublicProfile).length,
    hubVisible: users.filter(user => user.poolHubVisible).length,
    usersWithUploads: users.filter(user => user.uploadCount > 0).length,
  }), [users]);

  const handleCreateProfile = async (user: AdminUserRecord) => {
    setActionLoading(true);
    try {
      const created = await createMissingPublicProfile(user.userId);
      setMessage(created
        ? `Created a public profile for ${user.displayName}.`
        : `${user.displayName} already has a public profile.`);
      setError(null);
      await refreshUsers();
    } catch (err: any) {
      setError(err?.message ?? 'Failed to create public profile.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleBackfill = async () => {
    if (!window.confirm('Create public profiles for every user who is missing one?')) {
      return;
    }

    setActionLoading(true);
    try {
      const result = await backfillMissingPublicProfiles();
      setMessage(`Created ${result.createdCount} missing public profile${result.createdCount === 1 ? '' : 's'}.`);
      setError(null);
      await refreshUsers();
    } catch (err: any) {
      setError(err?.message ?? 'Failed to backfill public profiles.');
    } finally {
      setActionLoading(false);
    }
  };

  const maxPageCount = analyticsPageBreakdown.reduce((m, e) => Math.max(m, e.eventCount), 1);

  return (
    <div className="admin-page">
      <div className="admin-inner">

        {/* ── Header ── */}
        <header className="admin-header">
          <div className="admin-header-left">
            <h1 className="admin-title">Admin</h1>
            <span className="admin-internal-badge">INTERNAL</span>
          </div>
          <span className="admin-signed-in">Signed in as {userName ?? 'Admin'}</span>
        </header>

        {/* ── Tab nav ── */}
        <div className="admin-tabs">
          {(['users', 'analytics', 'challenges', 'system'] as const).map(tab => (
            <button
              key={tab}
              type="button"
              className={`admin-tab${activeTab === tab ? ' admin-tab--active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {message && <div className="admin-message">{message}</div>}
        {error && <div className="admin-error">{error}</div>}

        {/* ══ USERS TAB ══ */}
        {activeTab === 'users' && (
          <div className="admin-tab-content">
            <div className="admin-stat-grid">
              <div className="admin-stat-card">
                <span className="admin-stat-label">Total users</span>
                <strong className="admin-stat-value">{summary.totalUsers}</strong>
              </div>
              <div className={`admin-stat-card${summary.missingProfiles > 0 ? ' admin-stat-card--warn' : ''}`}>
                <span className="admin-stat-label">Missing profiles</span>
                <strong className="admin-stat-value">{summary.missingProfiles}</strong>
              </div>
              <div className="admin-stat-card">
                <span className="admin-stat-label">Pool Hub visible</span>
                <strong className="admin-stat-value">{summary.hubVisible}</strong>
              </div>
              <div className="admin-stat-card">
                <span className="admin-stat-label">Users with uploads</span>
                <strong className="admin-stat-value">{summary.usersWithUploads}</strong>
              </div>
            </div>

            <div className="admin-users-layout">
              <section className="admin-panel admin-users-list-panel">
                <div className="admin-panel-head">
                  <span className="admin-panel-title">Users</span>
                  <button type="button" className="admin-ghost-btn" onClick={refreshUsers} disabled={loading}>
                    {loading ? '…' : 'Refresh'}
                  </button>
                </div>
                <input
                  type="text"
                  className="admin-search"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Search name or email…"
                />
                {loading ? (
                  <div className="admin-empty">Loading users…</div>
                ) : filteredUsers.length === 0 ? (
                  <div className="admin-empty">No users match that search.</div>
                ) : (
                  <div className="admin-user-list">
                    {filteredUsers.map(user => (
                      <button
                        type="button"
                        key={user.userId}
                        className={`admin-user-row${selectedUser?.userId === user.userId ? ' admin-user-row--active' : ''}`}
                        onClick={() => setSelectedUserId(user.userId)}
                      >
                        <div className="admin-user-avatar">
                          {user.displayName.charAt(0).toUpperCase()}
                        </div>
                        <div className="admin-user-body">
                          <div className="admin-user-name">{user.displayName}</div>
                          <div className="admin-user-email">{user.email}</div>
                        </div>
                        <div className="admin-user-flags">
                          {!user.hasPublicProfile && <span className="admin-flag admin-flag--warn">No profile</span>}
                          {user.uploadCount > 0 && <span className="admin-flag">{user.uploadCount} uploads</span>}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </section>

              <section className="admin-panel admin-users-detail-panel">
                <div className="admin-panel-head">
                  <span className="admin-panel-title">User Details</span>
                </div>
                {!selectedUser ? (
                  <div className="admin-empty">Select a user to inspect.</div>
                ) : (
                  <div className="admin-detail">
                    <div className="admin-detail-grid">
                      <div className="admin-detail-field">
                        <span className="admin-detail-label">Name</span>
                        <strong className="admin-detail-value">{selectedUser.displayName}</strong>
                      </div>
                      <div className="admin-detail-field">
                        <span className="admin-detail-label">Email</span>
                        <strong className="admin-detail-value">{selectedUser.email}</strong>
                      </div>
                      <div className="admin-detail-field">
                        <span className="admin-detail-label">Joined</span>
                        <strong className="admin-detail-value">{formatDate(selectedUser.createdAt)}</strong>
                      </div>
                      <div className="admin-detail-field">
                        <span className="admin-detail-label">Public profile</span>
                        <strong className={`admin-detail-value${selectedUser.hasPublicProfile ? '' : ' admin-detail-value--warn'}`}>
                          {selectedUser.hasPublicProfile ? 'Yes' : 'No'}
                        </strong>
                      </div>
                      <div className="admin-detail-field">
                        <span className="admin-detail-label">Pool Hub visible</span>
                        <strong className="admin-detail-value">{selectedUser.poolHubVisible ? 'Yes' : 'No'}</strong>
                      </div>
                      <div className="admin-detail-field">
                        <span className="admin-detail-label">Hub uploads</span>
                        <strong className="admin-detail-value">{selectedUser.uploadCount}</strong>
                      </div>
                      <div className="admin-detail-field admin-detail-field--full">
                        <span className="admin-detail-label">User ID</span>
                        <strong className="admin-detail-value admin-mono">{selectedUser.userId}</strong>
                      </div>
                    </div>
                    <div className="admin-detail-actions">
                      <button
                        type="button"
                        className="admin-action-btn"
                        disabled={selectedUser.hasPublicProfile || actionLoading}
                        onClick={() => handleCreateProfile(selectedUser)}
                      >
                        Create Public Profile
                      </button>
                    </div>
                  </div>
                )}
              </section>
            </div>
          </div>
        )}

        {/* ══ ANALYTICS TAB ══ */}
        {activeTab === 'analytics' && (
          <div className="admin-tab-content">
            <div className="admin-panel-head admin-section-head">
              <span className="admin-panel-title">Analytics</span>
              <button type="button" className="admin-ghost-btn" onClick={refreshAnalytics} disabled={analyticsLoading}>
                {analyticsLoading ? '…' : 'Refresh'}
              </button>
            </div>

            {analyticsLoading || !analyticsSummary ? (
              <div className="admin-empty">Loading analytics…</div>
            ) : (
              <>
                <div className="admin-stat-grid admin-stat-grid--8">
                  {([
                    ['Total events',          analyticsSummary.totalEvents],
                    ['Unique sessions',        analyticsSummary.uniqueSessions],
                    ['Identified users',       analyticsSummary.identifiedUsers],
                    ['Last 24h',               analyticsSummary.last24hEvents],
                    ['Page views',             analyticsSummary.pageViews],
                    ['Prompt saves',           analyticsSummary.promptSaves],
                    ['Territory activations',  analyticsSummary.territoryActivations],
                    ['Pool opens',             analyticsSummary.poolOpens],
                  ] as [string, number][]).map(([label, value]) => (
                    <div key={label} className="admin-stat-card admin-stat-card--sm">
                      <span className="admin-stat-label">{label}</span>
                      <strong className="admin-stat-value">{value}</strong>
                    </div>
                  ))}
                </div>

                <div className="admin-analytics-columns">
                  <div className="admin-panel">
                    <div className="admin-panel-head">
                      <span className="admin-panel-title">Top Pages</span>
                    </div>
                    {analyticsPageBreakdown.length === 0 ? (
                      <div className="admin-empty">No page data yet.</div>
                    ) : (
                      <div className="admin-page-list">
                        {analyticsPageBreakdown.map(entry => (
                          <div key={entry.pageKey} className="admin-page-row">
                            <span className="admin-page-key">{entry.pageKey}</span>
                            <div className="admin-page-bar-wrap">
                              <div
                                className="admin-page-bar"
                                style={{ width: `${(entry.eventCount / maxPageCount) * 100}%` }}
                              />
                            </div>
                            <strong className="admin-page-count">{entry.eventCount}</strong>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="admin-panel">
                    <div className="admin-panel-head">
                      <span className="admin-panel-title">Recent Events</span>
                    </div>
                    {recentEvents.length === 0 ? (
                      <div className="admin-empty">No events yet.</div>
                    ) : (
                      <div className="admin-event-list">
                        {recentEvents.map(event => (
                          <div key={event.id} className="admin-event-row">
                            <span className={`admin-event-type-pill admin-event-type-pill--${event.eventType.split('_')[0]}`}>
                              {event.eventType}
                            </span>
                            <div className="admin-event-meta">
                              <span>{event.pageKey ?? 'unknown'}{event.path ? ` · ${event.path}` : ''}</span>
                              <span>{event.userId ?? 'anon'} · {event.sessionId.slice(0, 8)}</span>
                            </div>
                            <span className="admin-event-time">{formatDateTime(event.createdAt)}</span>
                            {event.metadata && Object.keys(event.metadata).length > 0 && (
                              <pre className="admin-analytics-event-payload">
                                {JSON.stringify(event.metadata, null, 2)}
                              </pre>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* ══ CHALLENGES TAB ══ */}
        {activeTab === 'challenges' && (
          <div className="admin-tab-content">
            <div className="admin-challenges-layout">
              <div className="admin-panel">
                <div className="admin-panel-head">
                  <span className="admin-panel-title">New Challenge</span>
                </div>
                <div className="admin-challenge-form">
                  <label className="admin-form-label">
                    Type
                    <div className="admin-challenge-type-row">
                      {(['weekly', 'monthly', 'flash'] as const).map(t => (
                        <button
                          key={t}
                          type="button"
                          className={`admin-challenge-type-btn${challengeForm.type === t ? ' active' : ''}`}
                          onClick={() => {
                            const days = t === 'weekly' ? 7 : t === 'monthly' ? 30 : 3;
                            const end = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString().slice(0, 16);
                            setChallengeForm(prev => ({ ...prev, type: t, endDate: end }));
                          }}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </label>
                  <label className="admin-form-label">
                    Title
                    <input
                      type="text"
                      className="admin-form-input"
                      placeholder="e.g. The Stranger in the City"
                      value={challengeForm.title}
                      onChange={e => setChallengeForm(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </label>
                  <label className="admin-form-label">
                    Constraint
                    <textarea
                      className="admin-form-input"
                      rows={3}
                      placeholder="The rule builders must follow…"
                      value={challengeForm.constraintText}
                      onChange={e => setChallengeForm(prev => ({ ...prev, constraintText: e.target.value }))}
                    />
                  </label>
                  <label className="admin-form-label">
                    Description (optional)
                    <textarea
                      className="admin-form-input"
                      rows={2}
                      placeholder="Extra context or thematic framing"
                      value={challengeForm.description}
                      onChange={e => setChallengeForm(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </label>
                  <div className="admin-challenge-dates">
                    <label className="admin-form-label">
                      Starts
                      <input
                        type="datetime-local"
                        className="admin-form-input"
                        value={challengeForm.startDate}
                        onChange={e => setChallengeForm(prev => ({ ...prev, startDate: e.target.value }))}
                      />
                    </label>
                    <label className="admin-form-label">
                      Ends
                      <input
                        type="datetime-local"
                        className="admin-form-input"
                        value={challengeForm.endDate}
                        onChange={e => setChallengeForm(prev => ({ ...prev, endDate: e.target.value }))}
                      />
                    </label>
                  </div>
                  <button
                    type="button"
                    className="admin-challenge-create-btn"
                    disabled={challengeSaving || !challengeForm.title.trim() || !challengeForm.constraintText.trim()}
                    onClick={() => void handleCreateChallenge()}
                  >
                    {challengeSaving ? 'Creating…' : 'Create Challenge'}
                  </button>
                </div>
              </div>

              <div className="admin-panel">
                <div className="admin-panel-head">
                  <span className="admin-panel-title">All Challenges</span>
                </div>
                {challengesLoading ? (
                  <div className="admin-empty">Loading…</div>
                ) : challenges.length === 0 ? (
                  <div className="admin-empty">No challenges yet.</div>
                ) : (
                  <div className="admin-challenge-list">
                    {challenges.map(c => {
                      const now = Date.now();
                      const status = now < c.startsAt ? 'upcoming' : now > c.endsAt ? 'ended' : 'active';
                      return (
                        <div key={c.id} className={`admin-challenge-row admin-challenge-row--${status}`}>
                          <div className="admin-challenge-row-top">
                            <span className="admin-challenge-num">#{c.number}</span>
                            <span className={`admin-challenge-type-badge admin-challenge-type-badge--${c.type}`}>{c.type}</span>
                            <span className={`admin-challenge-status admin-challenge-status--${status}`}>{status}</span>
                          </div>
                          <div className="admin-challenge-title">{c.title}</div>
                          <div className="admin-challenge-constraint">{c.constraintText}</div>
                          <div className="admin-challenge-dates-info">
                            {new Date(c.startsAt).toLocaleDateString()} → {new Date(c.endsAt).toLocaleDateString()}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ══ SYSTEM TAB ══ */}
        {activeTab === 'system' && (
          <div className="admin-tab-content">
            <div className="admin-panel admin-system-panel">
              <div className="admin-panel-head">
                <span className="admin-panel-title">Maintenance</span>
              </div>
              <p className="admin-system-desc">
                These operations affect all users. Confirm before running.
              </p>
              <div className="admin-system-actions">
                <div className="admin-system-action">
                  <div className="admin-system-action-info">
                    <strong>Backfill Missing Public Profiles</strong>
                    <span>Creates a public profile for every user who is missing one. Safe to run multiple times.</span>
                  </div>
                  <button
                    type="button"
                    className="admin-action-btn"
                    onClick={handleBackfill}
                    disabled={actionLoading}
                  >
                    {actionLoading ? 'Running…' : 'Run Backfill'}
                  </button>
                </div>
                <div className="admin-system-action">
                  <div className="admin-system-action-info">
                    <strong>Refresh User List</strong>
                    <span>Re-fetches the full user list from the database.</span>
                  </div>
                  <button
                    type="button"
                    className="admin-ghost-btn admin-ghost-btn--lg"
                    onClick={refreshUsers}
                    disabled={loading}
                  >
                    {loading ? 'Refreshing…' : 'Refresh Users'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
