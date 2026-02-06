import { useState } from 'react';

export function useDraftState<T>(initial: T | null = null) {
  const [baseline, setBaseline] = useState<T | null>(initial);
  const [draft, setDraft] = useState<T | null>(initial);

  const reset = () => {
    if (baseline === null) return;
    setDraft(baseline);
  };

  const commit = (value?: T) => {
    const next = value ?? draft;
    if (next === null) return;
    setBaseline(next);
    setDraft(next);
  };

  return {
    baseline,
    draft,
    setDraft,
    reset,
    commit,
    isDirty:
      baseline !== null &&
      draft !== null &&
      JSON.stringify(baseline) !== JSON.stringify(draft),
  };
}