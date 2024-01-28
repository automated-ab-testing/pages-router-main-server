import { Button, Card, CardBody, CardHeader, Divider } from "@nextui-org/react";

import Layout from "~/layout";
import PageWrapper from "~/wrappers/PageWrapper";
import ButtonWrapper from "~/wrappers/ButtonWrapper";
import useTestContext from "~/hooks/useTestContext";

export default function Home() {
  const versionId = useTestContext((state) => state.versionId);

  return (
    <Layout title="Automated A/B Testing">
      <div className="flex min-h-screen flex-col items-center justify-center gap-8 py-2">
        {/* Display Version ID */}
        <Card>
          <CardHeader>
            <p className="text-md">Version ID</p>
          </CardHeader>
          <Divider />
          <CardBody>
            <p>{versionId}</p>
          </CardBody>
        </Card>

        {/* A/B Testing Component */}
        <PageWrapper>
          <ButtonWrapper
            domId="first-button"
            render={(props) => <Button {...props}>First Button</Button>}
          />
          <ButtonWrapper
            domId="second-button"
            render={(props) => <Button {...props}>Second Button</Button>}
          />
        </PageWrapper>
      </div>
    </Layout>
  );
}
