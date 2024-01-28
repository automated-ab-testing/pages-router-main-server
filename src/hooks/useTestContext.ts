import { useContext } from "react";
import { useStore } from "zustand";

import type { TestState, TestAction } from "~/stores/test";
import TestContext from "~/contexts/test";

export default function useTestContext<T>(
  selector: (state: TestState & TestAction) => T,
) {
  const store = useContext(TestContext);

  if (!store) throw new Error("Missing TestContext.Provider in the tree");

  return useStore(store, selector);
}
