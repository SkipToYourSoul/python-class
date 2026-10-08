'use client';
import { createContext, useContext } from 'react';
export type PageStates = Record<string, object>;
export const LessonState = createContext<{
  value: object;
  update: (value: object) => void;
  navigate: (id: string) => void;
}>({ value: {}, update: () => {}, navigate: () => {} });
export function usePageState<T extends object>(
  initial: T,
): [T, (patch: Partial<T>) => void] {
  const { value, update } = useContext(LessonState);
  const state = { ...initial, ...value } as T;
  return [state, (patch) => update(patch)];
}
