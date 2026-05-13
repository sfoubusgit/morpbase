import { useEffect, useState } from 'react';
import { subscribeToOnlineAuthUids } from '../../engine/presenceStore';

export function useOnlineAuthUids(): Set<string> {
  const [onlineUids, setOnlineUids] = useState<Set<string>>(new Set());
  useEffect(() => subscribeToOnlineAuthUids(setOnlineUids), []);
  return onlineUids;
}
