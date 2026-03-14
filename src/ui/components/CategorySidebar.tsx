/**
 * Category Sidebar Component
 * 
 * Responsibilities:
 * - Display category structure (tree view)
 * - Show expand/collapse controls
 * - Indicate which categories have selections
 * - Highlight current category
 * - Handle category navigation
 * - Display logo
 * 
 * Must NOT:
 * - Determine which categories are available
 * - Compute which categories have selections
 * - Store category structure internally
 * - Validate navigation targets
 */

import { useState } from 'react';
import './CategorySidebar.css';

/**
 * Category item structure for display
 */
interface CategoryItem {
  label: string;
  nodeId?: string;
  subcategories?: CategoryItem[];
}

/**
 * Category map structure
 */
interface CategoryMap {
  [categoryId: string]: CategoryItem[];
}

interface CategorySidebarProps {
  /** Category structure to display */
  categoryMap: CategoryMap;
  
  /** Current node ID for highlighting */
  currentNodeId: string;
  
  /** Map of selections to determine which categories have selections */
  selections: Map<string, { isEnabled: boolean; customExtension: string | null }>;
  
  /** Handler for category navigation */
  onJumpToCategory: (nodeId: string) => void;

  /** Open Random Prompt Generator */
  onOpenRandom?: () => void;

  /** Open Tutorial */
  onOpenTutorial?: () => void;

  /** Active Working Set name when the Builder is filtered */
  activeWorkingSetName?: string | null;
}

interface StageDefinition {
  id: string;
  label: string;
  hint: string;
  categories: string[];
}

const CATEGORY_STAGES: StageDefinition[] = [
  {
    id: 'define',
    label: 'Define',
    hint: 'Start with the main idea of the image.',
    categories: ['subject', 'style', 'environment'],
  },
  {
    id: 'refine',
    label: 'Refine',
    hint: 'Shape mood, framing, and subject behavior.',
    categories: ['lighting', 'camera', 'actions'],
  },
  {
    id: 'finish',
    label: 'Finish',
    hint: 'Add polish and advanced detail only if needed.',
    categories: ['quality', 'effects', 'post-processing', 'anatomy-details'],
  },
];

const ADVANCED_CATEGORY_IDS = new Set(['post-processing', 'anatomy-details']);

/**
 * Helper to get display name for category
 */
const getCategoryDisplayName = (categoryId: string): string => {
  const names: Record<string, string> = {
    character: "Character",
    physical: "Physical",
    hair: "Hair",
    face: "Face",
    environment: "Environment",
    style: "Style",
    camera: "Camera",
    effects: "Effects",
    "anatomy-details": "Anatomy Details",
    subject: "Subject",
    lighting: "Lighting",
    quality: "Quality",
    "post-processing": "Post-Processing",
    actions: "Actions"
  };
  return names[categoryId] || categoryId.charAt(0).toUpperCase() + categoryId.slice(1);
};

/**
 * Collect all node IDs from a category item (including subcategories)
 */
const collectNodeIds = (items: CategoryItem[]): string[] => {
  const nodeIds: string[] = [];
  items.forEach(item => {
    if (item.nodeId) {
      nodeIds.push(item.nodeId);
    }
    if (item.subcategories) {
      nodeIds.push(...collectNodeIds(item.subcategories));
    }
  });
  return nodeIds;
};

/**
 * Category Sidebar Component
 * 
 * Displays category tree and allows navigation to categories.
 */
export function CategorySidebar({
  categoryMap,
  currentNodeId,
  selections,
  onJumpToCategory,
  onOpenRandom,
  onOpenTutorial,
  activeWorkingSetName,
}: CategorySidebarProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [expandedSubcategories, setExpandedSubcategories] = useState<Set<string>>(new Set());
  const [expandedStages, setExpandedStages] = useState<Set<string>>(
    new Set(['define', 'refine'])
  );

  // Check if a category has selections
  const hasCommitted = (nodeIds: string[]): boolean => {
    return nodeIds.some(nodeId => {
      // Check if any selection attribute ID starts with or matches this node
      return Array.from(selections.keys()).some(selectionId => {
        // Match by checking if selection ID contains node ID or vice versa
        return selectionId.includes(nodeId) || nodeId.includes(selectionId);
      });
    });
  };

  // Check if current node belongs to a category
  const isCategoryActive = (items: CategoryItem[]): boolean => {
    if (!currentNodeId) return false;
    const nodeIds = collectNodeIds(items);
    return nodeIds.includes(currentNodeId);
  };

  // Check if a specific node is active
  const isNodeActive = (nodeId: string): boolean => {
    return currentNodeId === nodeId;
  };

  // Toggle category expansion
  const toggleCategory = (categoryId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  // Toggle subcategory expansion
  const toggleSubcategory = (subcategoryKey: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedSubcategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(subcategoryKey)) {
        newSet.delete(subcategoryKey);
      } else {
        newSet.add(subcategoryKey);
      }
      return newSet;
    });
  };

  const toggleStage = (stageId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedStages(prev => {
      const next = new Set(prev);
      if (next.has(stageId)) {
        next.delete(stageId);
      } else {
        next.add(stageId);
      }
      return next;
    });
  };

  // Check if a category item has committed selections
  const itemHasCommitted = (item: CategoryItem): boolean => {
    const nodeIds: string[] = [];
    if (item.nodeId) {
      nodeIds.push(item.nodeId);
    }
    if (item.subcategories) {
      item.subcategories.forEach(sub => {
        if (sub.nodeId) {
          nodeIds.push(sub.nodeId);
        }
        if (sub.subcategories) {
          sub.subcategories.forEach(nested => {
            if (nested.nodeId) {
              nodeIds.push(nested.nodeId);
            }
          });
        }
      });
    }
    return nodeIds.length > 0 && hasCommitted(nodeIds);
  };

  return (
    <div className="category-sidebar">
      <div className="category-sidebar-content">
        <div className="category-sidebar-list">
          <div className="category-sidebar-title-wrapper">
            <h3 className="category-sidebar-title">Builder Flow</h3>
          </div>
          {activeWorkingSetName && (
            <div className="category-sidebar-hint">
              <strong>{activeWorkingSetName}</strong> is filtering the Builder by category.
            </div>
          )}
          {CATEGORY_STAGES.map(stage => {
            const stageEntries = stage.categories
              .map(categoryId => [categoryId, categoryMap[categoryId]] as const)
              .filter(([, items]) => Array.isArray(items) && items.length > 0);

            if (stageEntries.length === 0) {
              return null;
            }

            const isStageExpanded = expandedStages.has(stage.id);

            return (
              <section key={stage.id} className="category-stage">
                <div className="category-stage-header">
                  <div className="category-stage-labels">
                    <h4 className="category-stage-title">{stage.label}</h4>
                    <p className="category-stage-hint">{stage.hint}</p>
                  </div>
                  <button
                    className={`category-expand-button category-stage-toggle ${isStageExpanded ? "expanded" : ""}`}
                    onClick={(e) => toggleStage(stage.id, e)}
                    title={isStageExpanded ? "Collapse section" : "Expand section"}
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
                {isStageExpanded && (
                  <div className="category-stage-list">
                    {stageEntries.map(([categoryId, items]) => {
                      const allNodeIds = collectNodeIds(items);
                      const visited = hasCommitted(allNodeIds);
                      const active = isCategoryActive(items);
                      const firstNode = items[0]?.nodeId || items[0]?.subcategories?.[0]?.nodeId;
                      const isExpanded = expandedCategories.has(categoryId);
                      const isAdvancedCategory = ADVANCED_CATEGORY_IDS.has(categoryId);

                      return (
                        <div key={categoryId} className="category-group">
                          <div
                            className={`category-item ${visited ? "visited" : ""} ${active ? "active" : ""} ${isAdvancedCategory ? "advanced" : ""}`}
                            onClick={() => firstNode && onJumpToCategory(firstNode)}
                            title={`Jump to ${getCategoryDisplayName(categoryId)}`}
                          >
                            <div className="category-item-main">
                              <span className="category-item-label">
                                {getCategoryDisplayName(categoryId)}
                              </span>
                              {isAdvancedCategory && (
                                <span className="category-item-badge">Advanced</span>
                              )}
                              {visited && <span className="dot-indicator" title="Has committed selections" />}
                            </div>
                            <button
                              className={`category-expand-button ${isExpanded ? "expanded" : ""}`}
                              onClick={(e) => toggleCategory(categoryId, e)}
                              title={isExpanded ? "Collapse" : "Expand"}
                            >
                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </button>
                          </div>
                          {isExpanded && (
                            <div className="category-dropdown">
                              {items.map((item, index) => {
                                const itemKey = `${categoryId}-${index}`;
                                const hasSubcategories = item.subcategories && item.subcategories.length > 0;
                                const isSubcategoryExpanded = expandedSubcategories.has(itemKey);
                                const itemNodeIds = item.nodeId ? [item.nodeId] : [];
                                if (item.subcategories) {
                                  item.subcategories.forEach(sub => {
                                    if (sub.nodeId) itemNodeIds.push(sub.nodeId);
                                    if (sub.subcategories) {
                                      sub.subcategories.forEach(nested => {
                                        if (nested.nodeId) itemNodeIds.push(nested.nodeId);
                                      });
                                    }
                                  });
                                }
                                const itemVisited = itemNodeIds.length > 0 && hasCommitted(itemNodeIds);
                                const itemActive = item.nodeId ? isNodeActive(item.nodeId) : false;

                                return (
                                  <div key={itemKey} className="category-subcategory-group">
                                    <div
                                      className={`category-dropdown-item ${itemActive ? "active" : ""} ${itemVisited ? "visited" : ""} ${hasSubcategories ? "has-subcategories" : ""}`}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (item.nodeId) {
                                          onJumpToCategory(item.nodeId);
                                        } else if (hasSubcategories) {
                                          toggleSubcategory(itemKey, e);
                                        }
                                      }}
                                      title={item.label}
                                    >
                                      <div className="category-dropdown-item-main">
                                        <span className="category-dropdown-label">
                                          {item.label}
                                        </span>
                                        {itemVisited && <span className="dot-indicator" title="Has committed selections" />}
                                      </div>
                                      {hasSubcategories && (
                                        <button
                                          className={`category-expand-button ${isSubcategoryExpanded ? "expanded" : ""}`}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            toggleSubcategory(itemKey, e);
                                          }}
                                          title={isSubcategoryExpanded ? "Collapse" : "Expand"}
                                        >
                                          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                                            <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                          </svg>
                                        </button>
                                      )}
                                    </div>
                                    {hasSubcategories && isSubcategoryExpanded && (
                                      <div className="category-subcategory-dropdown">
                                        {item.subcategories!.map((subItem, subIndex) => {
                                          const subItemKey = `${itemKey}-${subIndex}`;
                                          const subActive = subItem.nodeId ? isNodeActive(subItem.nodeId) : false;
                                          const subNodeIds: string[] = [];
                                          if (subItem.nodeId) subNodeIds.push(subItem.nodeId);
                                          if (subItem.subcategories) {
                                            subItem.subcategories.forEach(nested => {
                                              if (nested.nodeId) subNodeIds.push(nested.nodeId);
                                            });
                                          }
                                          const subVisited = subNodeIds.length > 0 && hasCommitted(subNodeIds);

                                          return (
                                            <div
                                              key={subItemKey}
                                              className={`category-subcategory-item ${subActive ? "active" : ""} ${subVisited ? "visited" : ""}`}
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                if (subItem.nodeId) {
                                                  onJumpToCategory(subItem.nodeId);
                                                }
                                              }}
                                              title={subItem.label}
                                            >
                                              <span className="category-subcategory-label">
                                                {subItem.label}
                                              </span>
                                              {subVisited && <span className="dot-indicator" title="Has committed selections" />}
                                            </div>
                                          );
                                        })}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                          {categoryId === 'anatomy-details' && (
                            <div className="category-sidebar-actions">
                              <button
                                type="button"
                                className="category-sidebar-action-btn"
                                onClick={onOpenRandom}
                              >
                                Random
                              </button>
                              <button
                                type="button"
                                className="category-sidebar-action-btn"
                                onClick={onOpenTutorial}
                              >
                                Tutorial
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}


