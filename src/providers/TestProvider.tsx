import { useRef } from "react";

import { type TestStore, createTestStore } from "~/stores/test";
import TestContext from "~/contexts/test";

export default function TestProvider({ children }: React.PropsWithChildren) {
  const storeRef = useRef<TestStore>();

  if (!storeRef.current) storeRef.current = createTestStore();

  return (
    <TestContext.Provider value={storeRef.current}>
      {children}
    </TestContext.Provider>
  );
}
