import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Link,
} from "@nextui-org/react";

import Layout from "~/layout";
import PageWrapper from "~/wrappers/PageWrapper";
import ClickableWrapper from "~/wrappers/ClickableWrapper";
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
          <ClickableWrapper
            domId="first-button"
            render={(props) => <Button {...props}>First Button</Button>}
          />
          <ClickableWrapper
            domId="second-button"
            render={(props) => <Button {...props}>Second Button</Button>}
          />
          <ClickableWrapper
            domId="first-link"
            render={(props) => (
              <Link
                isExternal
                href="https://github.com/rayhankinan"
                showAnchorIcon
                {...props}
              >
                First Link
              </Link>
            )}
          />
          <ClickableWrapper
            domId="second-link"
            render={(props) => (
              <Link
                isExternal
                href="https://github.com/andreanaa"
                showAnchorIcon
                {...props}
              >
                Second Link
              </Link>
            )}
          />
        </PageWrapper>
      </div>
    </Layout>
  );
}
