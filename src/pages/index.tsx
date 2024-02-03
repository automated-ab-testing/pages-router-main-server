import { Button } from "@nextui-org/react";

import Layout from "~/layout";
import ExperimentWrapper from "~/wrappers/ExperimentWrapper";
import ComponentWrapper from "~/wrappers/ComponentWrapper";
import DisplayVersion from "~/components/main/DisplayVersion";

export default function Home() {
  return (
    <Layout title="Automated A/B Testing">
      <main className="flex min-h-screen flex-col items-center justify-center gap-8 py-2">
        {/* Display Version ID */}
        <DisplayVersion />

        {/* A/B Testing */}
        <ExperimentWrapper>
          <ComponentWrapper
            renderDefault={() => (
              <Button className="bg-green-500">Default Button</Button>
            )}
            renderTest={({ getStyles, emitWin }) => (
              <>
                <Button className={getStyles("first-button")} onClick={emitWin}>
                  First Button
                </Button>
                <Button
                  className={getStyles("second-button")}
                  onClick={emitWin}
                >
                  Second Button
                </Button>
              </>
            )}
          />
        </ExperimentWrapper>
      </main>
    </Layout>
  );
}
