import { createContext } from "react";

const TestContext = createContext<{
  versionId: string | null | undefined;
  styles: Record<string, string> | undefined;
}>({
  versionId: undefined,
  styles: undefined,
});

export default TestContext;
