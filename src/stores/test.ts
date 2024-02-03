import { createStore } from "zustand";

export interface TestState {
  versionId: string | null | undefined;
  hasImpressionRecorded: boolean;
  hasClickRecorded: boolean;
}

export interface TestAction {
  setVersionId: (versionId: string | null) => void;
  confirmImpression: () => void;
  confirmClick: () => void;
}

export function createTestStore() {
  return createStore<TestState & TestAction>()((set) => ({
    versionId: undefined,
    hasImpressionRecorded: false,
    hasClickRecorded: false,
    setVersionId: (versionId: string | null) => set({ versionId }),
    confirmImpression: () => set({ hasImpressionRecorded: true }),
    confirmClick: () => set({ hasClickRecorded: true }),
  }));
}

export type TestStore = ReturnType<typeof createTestStore>;
