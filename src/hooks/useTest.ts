import { useContext } from "react";

import TestContext from "~/context/test";

const useTest = () => useContext(TestContext);

export default useTest;
