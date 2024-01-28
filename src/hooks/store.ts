import { create } from "zustand";

interface TestState {
  versionId: string | null;
}

interface TestAction {
  setVersionId: (versionId: string | null) => void;
}

const useStore = create<TestState & TestAction>()((set) => ({
  versionId: null,
  setVersionId: (versionId: string | null) => set({ versionId }),
}));

export default useStore;
