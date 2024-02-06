import { createContext } from "react";

const TestContext = createContext<
  | {
      versionId: null;
      featureFlags: Record<string, boolean>;
    }
  | {
      versionId: string;
      featureFlags: Record<string, boolean>;
    }
  | undefined
>(undefined);

export default TestContext;
