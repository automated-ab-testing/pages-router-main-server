import { create } from "zustand";

interface TestState {
  versionId: string | null;
  hasImpressionRecorded: boolean;
  hasClickRecorded: boolean;
}

interface TestAction {
  setVersionId: (versionId: string | null) => void;
  confirmImpression: () => void;
  confirmClick: () => void;
}

const useStore = create<TestState & TestAction>()((set) => ({
  versionId: null,
  hasImpressionRecorded: false,
  hasClickRecorded: false,
  setVersionId: (versionId: string | null) => set({ versionId }),
  confirmImpression: () => set({ hasImpressionRecorded: true }),
  confirmClick: () => set({ hasClickRecorded: true }),
}));

export default useStore;
