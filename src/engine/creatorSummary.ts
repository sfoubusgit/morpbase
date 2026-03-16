import type { CreatorSummary, PoolHubEntry } from '../types';

const EMPTY_SUMMARY: CreatorSummary = {
  uploads: 0,
  totalDownloads: 0,
  avgRating: 0,
  promptCount: 0,
  topTags: [],
};

export const getCreatorSummaryFromPoolEntries = (
  entries: PoolHubEntry[],
  promptCount = 0
): CreatorSummary => {
  if (!entries.length) {
    return {
      ...EMPTY_SUMMARY,
      promptCount,
    };
  }

  const tagCounts = new Map<string, number>();
  let totalDownloads = 0;
  let totalRating = 0;

  entries.forEach(entry => {
    totalDownloads += entry.downloads;
    totalRating += entry.ratingAvg;
    entry.tags.forEach(tag => {
      tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
    });
  });

  const topTags = [...tagCounts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 5)
    .map(([tag]) => tag);

  return {
    uploads: entries.length,
    totalDownloads,
    avgRating: totalRating / entries.length,
    promptCount,
    topTags,
  };
};
