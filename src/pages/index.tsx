import { Button } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { UserRole } from "@prisma/client";

import Layout from "~/layout";
import ExperimentWrapper from "~/wrappers/ExperimentWrapper";
import ComponentWrapper from "~/wrappers/ComponentWrapper";
import DisplayVersion from "~/components/main/DisplayVersion";
import DataCard from "~/components/analytics/DataCard";

export default function Home() {
  const { data: sessionData } = useSession();

  return (
    <Layout title="Automated A/B Testing">
      <main className="flex min-h-screen flex-col items-center justify-center gap-8 py-2">
        {!sessionData || !sessionData.user ? (
          <p className="text-xl">Login to continue!</p>
        ) : sessionData.user.role === UserRole.ADMIN ? (
          <DataCard />
        ) : (
          <ExperimentWrapper>
            <DisplayVersion />
            <ComponentWrapper
              renderDefault={() => (
                <Button className="bg-green-500">Default Button</Button>
              )}
              renderTest={({ getDisplayStatus, emitWin }) => (
                <>
                  {getDisplayStatus("first-button") && (
                    <Button className="bg-red-500" onClick={emitWin}>
                      First Button
                    </Button>
                  )}
                  {getDisplayStatus("second-button") && (
                    <Button className="bg-purple-500" onClick={emitWin}>
                      Second Button
                    </Button>
                  )}
                </>
              )}
            />
          </ExperimentWrapper>
        )}
      </main>
    </Layout>
  );
}
