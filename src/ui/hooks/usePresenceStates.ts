import { useEffect, useState } from 'react';
import { subscribeToPresenceStates, type StudioState } from '../../engine/presenceStore';

export function usePresenceStates(): Map<string, StudioState> {
  const [states, setStates] = useState<Map<string, StudioState>>(new Map());
  useEffect(() => subscribeToPresenceStates(setStates), []);
  return states;
}
