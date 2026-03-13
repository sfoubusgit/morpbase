import { useEffect, useMemo, useState } from 'react';
import type { AdminUserRecord } from '../../types';
import {
  backfillMissingPublicProfiles,
  createMissingPublicProfile,
  listAdminUsers,
} from '../../engine/adminStore';
import './AdminPage.css';

type AdminPageProps = {
  userName?: string | null;
};

const formatDate = (timestamp: number) =>
  new Date(timestamp).toLocaleDateString();

export function AdminPage({ userName }: AdminPageProps) {
  const [users, setUsers] = useState<AdminUserRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <div>
          <h1>Admin</h1>
          <p>Inspect users, public-profile status, and Pool Hub visibility without leaving MorpBase.</p>
        </div>
        <div className="admin-page-admin-name">
          Signed in as {userName ?? 'Admin'}
        </div>
      </header>

      <div className="admin-summary-grid">
        <div className="admin-summary-card">
          <span>Total users</span>
          <strong>{summary.totalUsers}</strong>
        </div>
        <div className="admin-summary-card">
          <span>Missing public profiles</span>
          <strong>{summary.missingProfiles}</strong>
        </div>
        <div className="admin-summary-card">
          <span>Pool Hub visible</span>
          <strong>{summary.hubVisible}</strong>
        </div>
        <div className="admin-summary-card">
          <span>Users with uploads</span>
          <strong>{summary.usersWithUploads}</strong>
        </div>
      </div>

      <div className="admin-actions">
        <button type="button" onClick={handleBackfill} disabled={actionLoading}>
          {actionLoading ? 'Running...' : 'Backfill Missing Public Profiles'}
        </button>
        <button type="button" className="admin-secondary" onClick={refreshUsers} disabled={loading}>
          {loading ? 'Refreshing...' : 'Refresh Users'}
        </button>
      </div>

      {message && <div className="admin-message">{message}</div>}
      {error && <div className="admin-error">{error}</div>}

      <div className="admin-layout">
        <section className="admin-panel admin-panel-list">
          <div className="admin-panel-header">
            <h2>Users</h2>
            <input
              type="text"
              value={searchTerm}
              onChange={event => setSearchTerm(event.target.value)}
              placeholder="Search name or email"
            />
          </div>
          {loading ? (
            <div className="admin-empty">Loading users...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="admin-empty">No users match that search.</div>
          ) : (
            <div className="admin-user-list">
              {filteredUsers.map(user => (
                <button
                  type="button"
                  key={user.userId}
                  className={`admin-user-row ${selectedUser?.userId === user.userId ? 'active' : ''}`}
                  onClick={() => setSelectedUserId(user.userId)}
                >
                  <div>
                    <div className="admin-user-name">{user.displayName}</div>
                    <div className="admin-user-email">{user.email}</div>
                  </div>
                  <div className="admin-user-meta">
                    <span>{user.hasPublicProfile ? 'Profile' : 'No profile'}</span>
                    <span>{user.uploadCount} uploads</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="admin-panel admin-panel-detail">
          <div className="admin-panel-header">
            <h2>User Details</h2>
          </div>
          {!selectedUser ? (
            <div className="admin-empty">Select a user to inspect their status.</div>
          ) : (
            <div className="admin-user-detail">
              <div className="admin-detail-grid">
                <div>
                  <span>Name</span>
                  <strong>{selectedUser.displayName}</strong>
                </div>
                <div>
                  <span>Email</span>
                  <strong>{selectedUser.email}</strong>
                </div>
                <div>
                  <span>Joined</span>
                  <strong>{formatDate(selectedUser.createdAt)}</strong>
                </div>
                <div>
                  <span>User ID</span>
                  <strong className="admin-mono">{selectedUser.userId}</strong>
                </div>
                <div>
                  <span>Public profile</span>
                  <strong>{selectedUser.hasPublicProfile ? 'Yes' : 'No'}</strong>
                </div>
                <div>
                  <span>Pool Hub visible</span>
                  <strong>{selectedUser.poolHubVisible ? 'Yes' : 'No'}</strong>
                </div>
                <div>
                  <span>Hub uploads</span>
                  <strong>{selectedUser.uploadCount}</strong>
                </div>
              </div>

              <div className="admin-detail-actions">
                <button
                  type="button"
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
  );
}
