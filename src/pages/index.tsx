import { Button, Card, CardBody, CardHeader, Divider } from "@nextui-org/react";

import Layout from "~/layout";
import DisplayWrapper from "~/wrappers/DisplayWrapper";
import ClickableWrapper from "~/wrappers/ClickableWrapper";
import StylingWrapper from "~/wrappers/StylingWrapper";
import VersionScript from "~/components/VersionScript";
import useTestContext from "~/hooks/useTestContext";

export default function Home() {
  const versionId = useTestContext((state) => state.versionId);

  return (
    <Layout title="Automated A/B Testing">
      <main className="flex min-h-screen flex-col items-center justify-center gap-8 py-2">
        {/* Display Version ID */}
        <Card>
          <CardHeader>
            <p className="text-md">Version ID</p>
          </CardHeader>
          <Divider />
          {versionId === null ? (
            <CardBody>
              <p>There is no active test!</p>
            </CardBody>
          ) : (
            <CardBody>
              <p>{versionId}</p>
            </CardBody>
          )}
        </Card>

        {/* A/B Testing Script */}
        <VersionScript />

        {/* A/B Testing Component */}
        <DisplayWrapper>
          {/* First Button Component */}
          <ClickableWrapper
            defaultOnClick={() => console.log("First Button Clicked!")}
            render={(propsClickable) => (
              <StylingWrapper
                componentDomId="first-button"
                defaultClassName="hidden"
                render={(propsStyling) => (
                  <Button {...propsClickable} {...propsStyling}>
                    First Button
                  </Button>
                )}
              />
            )}
          />

          {/* Second Button Component */}
          <ClickableWrapper
            defaultOnClick={() => console.log("Second Button Clicked!")}
            render={(propsClickable) => (
              <StylingWrapper
                componentDomId="second-button"
                defaultClassName="hidden"
                render={(propsStyling) => (
                  <Button {...propsClickable} {...propsStyling}>
                    Second Button
                  </Button>
                )}
              />
            )}
          />

          {/* Default Button Component */}
          <StylingWrapper
            componentDomId="default-button"
            defaultClassName="bg-green-500"
            render={(props) => (
              <Button
                onClick={() => console.log("Default Button Clicked!")}
                {...props}
              >
                Default Button
              </Button>
            )}
          />
        </DisplayWrapper>
      </main>
    </Layout>
  );
}
