import { createContext } from "react";

import type { TestStore } from "~/stores/test";

const TestContext = createContext<TestStore | null>(null);

export default TestContext;
