'use client';
import { createContext, useContext } from 'react';
export type PageStates = Record<string, object>;
export const LessonState = createContext<{
  value: object;
  update: (value: object) => void;
  navigate: (id: string) => void;
  pages?: PageStates;
  updatePage?: (id: string, patch: object) => void;
}>({ value: {}, update: () => {}, navigate: () => {} });
export function usePageState<T extends object>(
  initial: T,
): [T, (patch: Partial<T>) => void] {
  const { value, update } = useContext(LessonState);
  const state = { ...initial, ...value } as T;
  return [state, (patch) => update(patch)];
}

export function useLessonPageState<T extends object>(
  id: string,
  initial: T,
): [T, (patch: Partial<T>) => void] {
  const { pages, updatePage } = useContext(LessonState);
  const state = { ...initial, ...pages?.[id] } as T;
  return [state, (patch) => updatePage?.(id, patch)];
}
