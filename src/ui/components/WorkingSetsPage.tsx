import { useEffect, useMemo, useState } from 'react';
import type { Pool, PoolItem, WorkingSet, PublicProfile } from '../../types';
import { listPools } from '../../engine/poolStore';
import {
  addWorkingSetHubEntry,
  listWorkingSetHubEntries,
} from '../../engine/workingSetHubStore';
import { exportWorkingSetPayload } from '../../engine/workingSetStore';
import { getMyPublicProfile } from '../../engine/profileStore';
import { Modal } from './Modal';
import './WorkingSetsPage.css';

type WorkingSetsPageProps = {
  workingSets: WorkingSet[];
  baseSetTemplate: WorkingSet;
  activeWorkingSetId: string | null;
  categoryOrder: string[];
  onCreateWorkingSet: (
    name: string,
    payload?: Partial<Omit<WorkingSet, 'id' | 'name' | 'createdAt' | 'updatedAt'>>
  ) => Promise<WorkingSet | null>;
  onRenameWorkingSet: (id: string, name: string) => Promise<void>;
  onDeleteWorkingSet: (id: string) => Promise<void>;
  onSetActiveWorkingSet: (id: string | null) => void;
  onAddWorkingSetItem: (setId: string, categoryId: string, poolId: string, item: PoolItem) => Promise<void>;
  onRemoveWorkingSetItem: (setId: string, categoryId: string, itemId: string) => Promise<void>;
  onClearWorkingSetCategory: (setId: string, categoryId: string) => Promise<void>;
  authReady?: boolean;
  authUser?: { id: string; name?: string } | null;
  isPro?: boolean;
  workingSetsLoading?: boolean;
  manualUrl?: string;
};

const formatCategoryLabel = (categoryId: string) =>
  categoryId
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

export function WorkingSetsPage({
  workingSets,
  baseSetTemplate,
  activeWorkingSetId,
  categoryOrder,
  onCreateWorkingSet,
  onRenameWorkingSet,
  onDeleteWorkingSet,
  onSetActiveWorkingSet,
  onAddWorkingSetItem,
  onRemoveWorkingSetItem,
  onClearWorkingSetCategory,
  authReady = false,
  authUser,
  isPro = false,
  workingSetsLoading = false,
  manualUrl,
}: WorkingSetsPageProps) {
  const [pools, setPools] = useState<Pool[]>([]);
  const [poolsLoading, setPoolsLoading] = useState(false);
  const [selectedSetId, setSelectedSetId] = useState<string | null>(baseSetTemplate.id);
  const [newSetName, setNewSetName] = useState('');
  const [renameValue, setRenameValue] = useState('');
  const [poolId, setPoolId] = useState<string | null>(null);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [itemFilter, setItemFilter] = useState('');
  const [pageMessage, setPageMessage] = useState<string | null>(null);
  const [publishMessage, setPublishMessage] = useState<string | null>(null);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [isPublishOpen, setIsPublishOpen] = useState(false);
  const [publishForm, setPublishForm] = useState({
    title: '',
    summary: '',
    description: '',
    category: 'General',
    tags: '',
    language: 'en',
    license: 'CC-BY',
    heroImageUrl: '',
  });
  const [confirmRights, setConfirmRights] = useState(false);
  const [confirmPrivacy, setConfirmPrivacy] = useState(false);
  const [publicProfile, setPublicProfile] = useState<PublicProfile | null>(null);
  const gateMessage = !authReady
    ? 'Loading working sets...'
    : !authUser
      ? 'Log in to access your working sets.'
      : !isPro
        ? 'Upgrade to Pro to use Working Sets.'
        : null;

  useEffect(() => {
    if (selectedSetId === baseSetTemplate.id) return;
    if (selectedSetId && workingSets.some(set => set.id === selectedSetId)) return;
    setSelectedSetId(baseSetTemplate.id);
  }, [selectedSetId, workingSets, baseSetTemplate.id]);

  useEffect(() => {
    let isActive = true;
    if (!authUser) {
      setPublicProfile(null);
      return () => {
        isActive = false;
      };
    }
    const loadProfile = async () => {
      try {
        const profile = await getMyPublicProfile();
        if (isActive) {
          setPublicProfile(profile);
        }
      } catch {
        if (isActive) {
          setPublicProfile(null);
        }
      }
    };
    loadProfile();
    return () => {
      isActive = false;
    };
  }, [authUser?.id]);

  useEffect(() => {
    const target = selectedSetId === baseSetTemplate.id
      ? baseSetTemplate
      : workingSets.find(set => set.id === selectedSetId) ?? null;
    setRenameValue(target?.name ?? '');
  }, [selectedSetId, workingSets, baseSetTemplate]);

  useEffect(() => {
    setEditingCategoryId(null);
    setItemFilter('');
  }, [selectedSetId]);

  useEffect(() => {
    if (poolId && pools.some(pool => pool.id === poolId)) return;
    setPoolId(pools[0]?.id ?? null);
  }, [poolId, pools]);

  const availableSets = useMemo(() => [baseSetTemplate, ...workingSets], [baseSetTemplate, workingSets]);
  const selectedSet = availableSets.find(set => set.id === selectedSetId) ?? null;
  const selectedPool = pools.find(pool => pool.id === poolId) ?? null;
  const isBaseSetTemplate = selectedSet?.id === baseSetTemplate.id;
  const isActiveSet = isBaseSetTemplate ? activeWorkingSetId === null : selectedSet?.id === activeWorkingSetId;
  const selectedSetItemCount = selectedSet
    ? Object.values(selectedSet.categoryBuckets).reduce((sum, items) => sum + items.length, 0)
    : 0;
  const editingCategoryLabel = editingCategoryId ? formatCategoryLabel(editingCategoryId) : '';

  const filteredItems = useMemo(() => {
    if (!selectedPool) return [];
    const trimmed = itemFilter.trim().toLowerCase();
    if (!trimmed) return selectedPool.items;
    return selectedPool.items.filter(item => item.text.toLowerCase().includes(trimmed));
  }, [selectedPool, itemFilter]);

  const handleCreate = async () => {
    if (!authUser || !isPro) {
      setPageMessage('Upgrade to Pro to create Working Sets.');
      return;
    }
    const trimmed = newSetName.trim();
    if (!trimmed) {
      setPageMessage('Enter a name for the working set.');
      return;
    }
    const created = await onCreateWorkingSet(trimmed);
    if (created) {
      setSelectedSetId(created.id);
      setNewSetName('');
      setPageMessage(`Created "${created.name}".`);
    }
  };

  const handleDuplicateBaseSet = async () => {
    const defaultName = `Base Set Copy ${workingSets.length + 1}`;
    const name = window.prompt('Name your editable copy of Base Set.', defaultName)?.trim();
    if (!name) {
      return;
    }

    const created = await onCreateWorkingSet(name, {
      categoryBuckets: baseSetTemplate.categoryBuckets,
    });
    if (created) {
      setSelectedSetId(created.id);
      setPageMessage(`Created editable copy "${created.name}" from Base Set.`);
    }
  };

  const handleDuplicateSet = async () => {
    if (!selectedSet || isBaseSetTemplate) return;

    const defaultName = `${selectedSet.name} Copy`;
    const name = window.prompt('Name your duplicated Working Set.', defaultName)?.trim();
    if (!name) {
      return;
    }

    const created = await onCreateWorkingSet(name, {
      categoryBuckets: selectedSet.categoryBuckets,
    });

    if (created) {
      setSelectedSetId(created.id);
      setPageMessage(`Created duplicate "${created.name}".`);
    }
  };

  const handleRename = async () => {
    if (!authUser || !isPro) {
      setPageMessage('Upgrade to Pro to manage Working Sets.');
      return;
    }
    if (!selectedSet) return;
    const trimmed = renameValue.trim();
    if (!trimmed) return;
    await onRenameWorkingSet(selectedSet.id, trimmed);
    setPageMessage('Working set renamed.');
  };

  const handleDelete = async () => {
    if (!authUser || !isPro) {
      setPageMessage('Upgrade to Pro to manage Working Sets.');
      return;
    }
    if (!selectedSet) return;
    await onDeleteWorkingSet(selectedSet.id);
    setPageMessage('Working set deleted.');
  };

  const handlePublish = () => {
    if (!authUser || !isPro) {
      setPublishError('Upgrade to Pro to publish Working Sets.');
      return;
    }
    if (!selectedSet) return;
    setPublishError(null);
    setPublishMessage(null);
    setPublishForm({
      title: selectedSet.name,
      summary: '',
      description: '',
      category: 'General',
      tags: '',
      language: 'en',
      license: 'CC-BY',
      heroImageUrl: '',
    });
    setConfirmRights(false);
    setConfirmPrivacy(false);
    setIsPublishOpen(true);
  };

  const handleConfirmPublish = async () => {
    if (!authUser || !isPro) {
      setPublishError('Upgrade to Pro to publish Working Sets.');
      return;
    }
    if (!selectedSet) return;
    const title = publishForm.title.trim();
    const summary = publishForm.summary.trim();
    const description = publishForm.description.trim();
    const category = publishForm.category.trim();
    const tags = publishForm.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(Boolean);
    const language = publishForm.language.trim() || 'en';
    const license = publishForm.license.trim() || 'CC-BY';

    if (!title || !summary || !description || !category || tags.length === 0) {
      setPublishError('Please complete title, summary, description, category, and at least one tag.');
      return;
    }
    if (!confirmRights || !confirmPrivacy) {
      setPublishError('Please confirm the publishing checks.');
      return;
    }

    try {
      const payload = await exportWorkingSetPayload(selectedSet.id);
      const existing = listWorkingSetHubEntries().some(entry =>
        entry.title.toLowerCase() === title.toLowerCase()
      );
      if (existing) {
        setPublishError('A Working Set with this title already exists in the Hub.');
        return;
      }
      const now = Date.now();
      const creatorName = publicProfile?.displayName?.trim()
        || authUser?.name
        || 'You';
      addWorkingSetHubEntry({
        id: `hub_ws_${now}_${Math.random().toString(36).slice(2, 6)}`,
        creator: creatorName,
        creatorId: authUser?.id,
        title,
        summary,
        description,
        tags,
        category,
        languages: [language],
        license,
        heroImageUrl: publishForm.heroImageUrl.trim() || null,
        ratingAvg: 0,
        ratingCount: 0,
        downloads: 0,
        createdAt: now,
        updatedAt: now,
        payload: payload.workingSet,
      });
      setPublishMessage('Working Set published to Pool Hub.');
      setPublishError(null);
      setIsPublishOpen(false);
    } catch (err: any) {
      setPublishError(err?.message ?? 'Failed to publish Working Set.');
    }
  };

  const handleAddItem = async (item: PoolItem) => {
    if (!authUser || !isPro) {
      setPageMessage('Upgrade to Pro to add items.');
      return;
    }
    if (!selectedSet || !selectedPool || !editingCategoryId) {
      setPageMessage('Open a category editor and select a pool first.');
      return;
    }
    await onAddWorkingSetItem(selectedSet.id, editingCategoryId, selectedPool.id, item);
    setPageMessage(`Added to ${formatCategoryLabel(editingCategoryId)}.`);
  };

  const handleActivate = () => {
    if (!authUser || !isPro) {
      setPageMessage('Upgrade to Pro to activate Working Sets.');
      return;
    }
    if (!selectedSet) return;
    onSetActiveWorkingSet(selectedSet.id);
    setPageMessage(`"${selectedSet.name}" is now active.`);
  };

  const handleRefreshPools = async () => {
    setPoolsLoading(true);
    try {
      const next = await listPools();
      setPools(next);
      setPageMessage('Pools refreshed.');
    } catch (err: any) {
      setPageMessage(err?.message ?? 'Failed to refresh pools.');
    } finally {
      setPoolsLoading(false);
    }
  };

  useEffect(() => {
    if (authUser && isPro) {
      handleRefreshPools();
    } else {
      setPools([]);
      setPoolId(null);
      setPoolsLoading(false);
    }
  }, [authUser, isPro]);

  return (
    <div className="working-sets-page">
      {gateMessage ? (
        <div className="working-sets-empty">{gateMessage}</div>
      ) : (
        <>
      <header className="working-sets-header">
        <div>
          <h1>Working Sets</h1>
          <p>Working Sets let you build with a smaller, focused set of prompt elements by category for a specific style or project.</p>
        </div>
        {manualUrl && (
          <a
            className="working-sets-manual-link"
            href={`${manualUrl}#working-sets`}
            target="_blank"
            rel="noreferrer"
          >
            Open Working Sets manual
          </a>
        )}
        <div className="working-sets-create">
          <input
            type="text"
            value={newSetName}
            onChange={event => setNewSetName(event.target.value)}
            placeholder="New working set name"
          />
          <button type="button" onClick={handleCreate}>
            Create
          </button>
        </div>
      </header>

      <div className="working-sets-guidance">
        <span className="working-sets-guidance-label">How it works:</span>
        <span>1. Create or open a Working Set</span>
        <span>2. Add prompt elements from your User Pools into category buckets</span>
        <span>3. Build a smaller, focused prompt kit for a style or project</span>
        <span>4. Activate it in Builder or switch back to Base Set anytime</span>
      </div>

      {pageMessage && <div className="working-sets-message">{pageMessage}</div>}

      <div className="working-sets-layout">
        <section className="working-sets-panel working-sets-panel-list">
          <div className="working-sets-panel-title">
            <h2>Your Sets</h2>
            <button
              type="button"
              className="working-sets-refresh"
              onClick={handleRefreshPools}
              disabled={poolsLoading}
            >
              {poolsLoading ? 'Refreshing...' : 'Refresh Pools'}
            </button>
          </div>
          <div className="working-sets-list">
            {workingSetsLoading ? (
              <div className="working-sets-empty">Loading working sets...</div>
            ) : (
              availableSets.map(set => (
                <button
                  key={set.id}
                  type="button"
                  className={`working-sets-list-item ${set.id === selectedSetId ? 'active' : ''}`}
                  onClick={() => setSelectedSetId(set.id)}
                >
                  <div className="working-sets-list-name">{set.name}</div>
                  <div className="working-sets-list-meta">
                    {Object.values(set.categoryBuckets).reduce((sum, items) => sum + items.length, 0)} items
                  </div>
                  {set.id === baseSetTemplate.id && <span className="working-sets-template-pill">Template</span>}
                  {((set.id === activeWorkingSetId) || (set.id === baseSetTemplate.id && activeWorkingSetId === null)) && (
                    <span className="working-sets-active-pill">Active</span>
                  )}
                </button>
              ))
            )}
          </div>
        </section>

        <section className="working-sets-panel working-sets-panel-detail">
          {selectedSet ? (
            <>
              <div className="working-sets-detail-header">
                <div className="working-sets-detail-title">
                  {isBaseSetTemplate ? (
                    <div className="working-sets-readonly-title">
                      <strong>{selectedSet.name}</strong>
                      <span>Read-only template available for everyone. Duplicate it to make an editable Working Set.</span>
                    </div>
                  ) : (
                    <>
                      <input
                        type="text"
                        value={renameValue}
                        onChange={event => setRenameValue(event.target.value)}
                      />
                      <button type="button" onClick={handleRename}>
                        Rename
                      </button>
                    </>
                  )}
                </div>
                <div className="working-sets-detail-actions">
                  {isBaseSetTemplate ? (
                    <>
                      <button type="button" onClick={() => onSetActiveWorkingSet(null)} disabled={isActiveSet}>
                        {isActiveSet ? 'Using Base Set' : 'Use Base Set'}
                      </button>
                      <button type="button" onClick={handleDuplicateBaseSet}>
                        Duplicate to Edit
                      </button>
                    </>
                  ) : (
                    <>
                      <button type="button" onClick={handleActivate} disabled={isActiveSet}>
                        {isActiveSet ? 'Active' : 'Activate'}
                      </button>
                      <button type="button" onClick={handleDuplicateSet}>
                        Duplicate
                      </button>
                      <button type="button" onClick={handlePublish}>
                        Publish
                      </button>
                      {isActiveSet && (
                        <button type="button" onClick={() => onSetActiveWorkingSet(null)}>
                          Deactivate (Base Set)
                        </button>
                      )}
                      <button type="button" className="working-sets-danger" onClick={handleDelete}>
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
              {isBaseSetTemplate ? (
                <div className="working-sets-base-template">
                  <div className="working-sets-base-template-summary">
                    Base Set mirrors the full Builder catalog. You cannot edit it directly, but you can duplicate it into a personal Working Set and then rename, trim, and reorganize that copy.
                  </div>
                  <div className="working-sets-base-template-grid">
                    {categoryOrder.map(cat => {
                      const bucket = selectedSet.categoryBuckets[cat] ?? [];
                      return (
                        <div key={cat} className="working-sets-base-template-card">
                          <span>{formatCategoryLabel(cat)}</span>
                          <strong>{bucket.length}</strong>
                        </div>
                      );
                    })}
                  </div>
                  <div className="working-sets-base-template-total">
                    Total prompt elements in Base Set: {selectedSetItemCount}
                  </div>
                </div>
              ) : (
                <>
                  {publishMessage && <div className="working-sets-message">{publishMessage}</div>}
                  {publishError && <div className="working-sets-error">{publishError}</div>}

                  <div className="working-sets-overview-grid">
                    {categoryOrder.map(cat => {
                      const bucket = selectedSet.categoryBuckets[cat] ?? [];
                      const previewItems = bucket.slice(0, 3);
                      const remainingCount = Math.max(0, bucket.length - previewItems.length);
                      return (
                        <div key={cat} className="working-sets-overview-card">
                          <div className="working-sets-category-header">
                            <h3>{formatCategoryLabel(cat)}</h3>
                            <div className="working-sets-category-actions">
                              <span>{bucket.length} items</span>
                              <button type="button" onClick={() => setEditingCategoryId(cat)}>
                                Edit
                              </button>
                            </div>
                          </div>
                          {bucket.length === 0 ? (
                            <div className="working-sets-overview-empty">
                              <span>No elements yet</span>
                              <span>Edit to add elements</span>
                            </div>
                          ) : (
                            <div className="working-sets-overview-preview">
                              {previewItems.map(item => (
                                <span key={item.id} className="working-sets-overview-chip">
                                  {item.text}
                                </span>
                              ))}
                              {remainingCount > 0 && (
                                <span className="working-sets-overview-more">+{remainingCount} more</span>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {editingCategoryId && (
                    <div className="working-sets-category-editor">
                      <div className="working-sets-category-editor-header">
                        <div>
                          <h3>Edit {editingCategoryLabel}</h3>
                          <p>Manage prompt elements in this category only.</p>
                        </div>
                        <button type="button" className="working-sets-secondary" onClick={() => setEditingCategoryId(null)}>
                          Close
                        </button>
                      </div>

                      <div className="working-sets-add">
                        {poolsLoading ? (
                          <div className="working-sets-empty">Loading pools...</div>
                        ) : pools.length === 0 ? (
                          <div className="working-sets-empty">No pools available. Create a pool in User Pools first.</div>
                        ) : (
                          <>
                            <div className="working-sets-add-row">
                              <label>
                                Pool
                                <select
                                  value={poolId ?? ''}
                                  onChange={event => setPoolId(event.target.value || null)}
                                >
                                  {pools.map(pool => (
                                    <option key={pool.id} value={pool.id}>
                                      {pool.name} ({pool.items.length})
                                    </option>
                                  ))}
                                </select>
                              </label>
                              <label>
                                Search items
                                <input
                                  type="text"
                                  value={itemFilter}
                                  onChange={event => setItemFilter(event.target.value)}
                                  placeholder={`Filter ${editingCategoryLabel} items`}
                                />
                              </label>
                            </div>
                            <div className="working-sets-item-grid">
                              {filteredItems.length === 0 ? (
                                <div className="working-sets-empty">No items found.</div>
                              ) : (
                                filteredItems.map(item => (
                                  <div key={item.id} className="working-sets-item-row">
                                    <div>
                                      <div className="working-sets-item-text">{item.text}</div>
                                      {item.tags && item.tags.length > 0 && (
                                        <div className="working-sets-item-tags">{item.tags.join(', ')}</div>
                                      )}
                                    </div>
                                    <button type="button" onClick={() => handleAddItem(item)}>
                                      Add
                                    </button>
                                  </div>
                                ))
                              )}
                            </div>
                          </>
                        )}
                      </div>

                      <div className="working-sets-category-editor-list">
                        <div className="working-sets-category-header">
                          <h3>{editingCategoryLabel}</h3>
                          <div className="working-sets-category-actions">
                            <span>{selectedSet.categoryBuckets[editingCategoryId]?.length ?? 0} items</span>
                            <button
                              type="button"
                              className="working-sets-clear"
                              onClick={async () => {
                                if (!authUser || !isPro) {
                                  setPageMessage('Upgrade to Pro to manage Working Sets.');
                                  return;
                                }
                                await onClearWorkingSetCategory(selectedSet.id, editingCategoryId);
                              }}
                            >
                              Clear
                            </button>
                          </div>
                        </div>
                        {(selectedSet.categoryBuckets[editingCategoryId] ?? []).length === 0 ? (
                          <div className="working-sets-empty">No elements yet.</div>
                        ) : (
                          <div className="working-sets-category-list">
                            {(selectedSet.categoryBuckets[editingCategoryId] ?? []).map(item => (
                              <div key={item.id} className="working-sets-category-item">
                                <span>{item.text}</span>
                                <button
                                  type="button"
                                  onClick={async () => {
                                    if (!authUser || !isPro) {
                                      setPageMessage('Upgrade to Pro to manage Working Sets.');
                                      return;
                                    }
                                    await onRemoveWorkingSetItem(selectedSet.id, editingCategoryId, item.id);
                                  }}
                                >
                                  Remove
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          ) : (
            <div className="working-sets-empty">Select a working set to edit it.</div>
          )}
        </section>
      </div>
      <Modal
        isOpen={isPublishOpen}
        onClose={() => setIsPublishOpen(false)}
        title="Publish Working Set"
        className="working-sets-publish-modal"
      >
        <div className="working-sets-publish-form">
          <div className="working-sets-publish-grid">
            <label>
              Title
              <input
                type="text"
                value={publishForm.title}
                onChange={event => setPublishForm(prev => ({ ...prev, title: event.target.value }))}
                placeholder="Working Set title"
              />
            </label>
            <label>
              Summary
              <input
                type="text"
                value={publishForm.summary}
                onChange={event => setPublishForm(prev => ({ ...prev, summary: event.target.value }))}
                placeholder="Short one-liner"
              />
            </label>
            <label>
              Category
              <input
                type="text"
                value={publishForm.category}
                onChange={event => setPublishForm(prev => ({ ...prev, category: event.target.value }))}
                placeholder="General"
              />
            </label>
            <label>
              Language
              <input
                type="text"
                value={publishForm.language}
                onChange={event => setPublishForm(prev => ({ ...prev, language: event.target.value }))}
                placeholder="en"
              />
            </label>
            <label>
              License
              <input
                type="text"
                value={publishForm.license}
                onChange={event => setPublishForm(prev => ({ ...prev, license: event.target.value }))}
                placeholder="CC-BY"
              />
            </label>
            <label>
              Tags (comma)
              <input
                type="text"
                value={publishForm.tags}
                onChange={event => setPublishForm(prev => ({ ...prev, tags: event.target.value }))}
                placeholder="portrait, cinematic"
              />
            </label>
          </div>
          <label>
            Description
            <textarea
              rows={4}
              value={publishForm.description}
              onChange={event => setPublishForm(prev => ({ ...prev, description: event.target.value }))}
              placeholder="Describe the working set and best use cases"
            />
          </label>
          <label>
            Hero Image URL (optional)
            <input
              type="text"
              value={publishForm.heroImageUrl}
              onChange={event => setPublishForm(prev => ({ ...prev, heroImageUrl: event.target.value }))}
              placeholder="https://..."
            />
          </label>
          <label>
            Upload Hero Image
            <input
              type="file"
              accept="image/*"
              onChange={event => {
                const file = event.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => {
                  const result = typeof reader.result === 'string' ? reader.result : '';
                  setPublishForm(prev => ({ ...prev, heroImageUrl: result }));
                };
                reader.readAsDataURL(file);
              }}
            />
          </label>
          <div className="working-sets-publish-checks">
            <label>
              <input
                type="checkbox"
                checked={confirmRights}
                onChange={event => setConfirmRights(event.target.checked)}
              />
              I confirm I have rights to publish this Working Set.
            </label>
            <label>
              <input
                type="checkbox"
                checked={confirmPrivacy}
                onChange={event => setConfirmPrivacy(event.target.checked)}
              />
              This Working Set does not include personal or sensitive data.
            </label>
          </div>
          {publishError && <div className="working-sets-error">{publishError}</div>}
          <div className="working-sets-publish-actions">
            <button type="button" className="working-sets-secondary" onClick={() => setIsPublishOpen(false)}>
              Cancel
            </button>
            <button type="button" className="working-sets-publish" onClick={handleConfirmPublish}>
              Publish to Hub
            </button>
          </div>
        </div>
      </Modal>
        </>
      )}
    </div>
  );
}









