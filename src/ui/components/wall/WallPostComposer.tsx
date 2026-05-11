import { useState } from 'react';
import type { WallPostIdentityTag } from '../../../types/community';
import { createWallPost } from '../../../engine/wallStore';
import './WallPostComposer.css';

type WallPostComposerProps = {
  authUid: string;
  userId: string;
  userName: string;
  availableIdentityTags: WallPostIdentityTag[];
  promptText: string;
  onPosted: () => void;
  onCancel?: () => void;
  compact?: boolean;
};

export function WallPostComposer({
  authUid,
  userId,
  userName,
  availableIdentityTags,
  promptText,
  onPosted,
  onCancel,
  compact = false,
}: WallPostComposerProps) {
  const [caption, setCaption] = useState('');
  const [selectedTags, setSelectedTags] = useState<Set<string>>(
    () => new Set(availableIdentityTags.map(t => `${t.type}:${t.name}`)),
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleTag = (key: string) => {
    setSelectedTags(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const handleSubmit = async () => {
    if (!promptText.trim()) {
      setError('Nothing to post — generate a prompt first.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const tags = availableIdentityTags.filter(t => selectedTags.has(`${t.type}:${t.name}`));
      await createWallPost(
        { caption: caption.trim() || null, promptText, identityTags: tags },
        authUid,
        userId,
        userName,
      );
      onPosted();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to post. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`wall-composer${compact ? ' wall-composer--compact' : ''}`}>
      <textarea
        className="wall-composer-caption"
        placeholder="Add a caption… or post without one"
        value={caption}
        onChange={e => setCaption(e.target.value)}
        maxLength={200}
        rows={compact ? 2 : 3}
      />

      {availableIdentityTags.length > 0 && (
        <div className="wall-composer-tags">
          <span className="wall-composer-tags-label">Tag identities</span>
          <div className="wall-composer-tags-list">
            {availableIdentityTags.map(tag => {
              const key = `${tag.type}:${tag.name}`;
              const active = selectedTags.has(key);
              return (
                <button
                  key={key}
                  type="button"
                  className={`wall-composer-tag${active ? ' wall-composer-tag--active' : ''}`}
                  onClick={() => toggleTag(key)}
                >
                  {tag.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {error && <div className="wall-composer-error">{error}</div>}

      <div className="wall-composer-actions">
        {onCancel && (
          <button type="button" className="wall-composer-cancel" onClick={onCancel}>
            Cancel
          </button>
        )}
        <button
          type="button"
          className="wall-composer-submit"
          disabled={submitting || !promptText.trim()}
          onClick={() => void handleSubmit()}
        >
          {submitting ? 'Posting…' : 'Post to Wall'}
        </button>
      </div>
    </div>
  );
}
