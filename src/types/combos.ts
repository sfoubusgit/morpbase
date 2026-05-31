// ComboNote — a tiny annotation on a (Universe, Style) pair.
//
// Identity is the pair, not a separate id; the store upserts on
// (universeId, styleId) rather than allowing duplicates.

export type ComboStatus = 'untried' | 'sampled' | 'won' | 'failed';

export type ComboNote = {
  id: string;
  universeId: string;
  styleId: string;
  status: ComboStatus;
  notes: string;
  createdAt: number;
  updatedAt: number;
};

export type ComboNoteInput = {
  universeId: string;
  styleId: string;
  status?: ComboStatus;
  notes?: string;
};

export type ComboNoteStore = {
  version: 1;
  items: ComboNote[];
};
