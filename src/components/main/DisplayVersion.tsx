import { Card, CardBody, CardHeader, Divider } from "@nextui-org/react";

import useTestContext from "~/hooks/useTestContext";

export default function DisplayVersion() {
  const versionId = useTestContext((state) => state.versionId);

  return (
    <Card>
      <CardHeader>
        <p className="text-md">Version ID</p>
      </CardHeader>
      <Divider />
      <CardBody>
        {versionId !== undefined ? (
          versionId !== null ? (
            <p>{versionId}</p>
          ) : (
            <p>There is no active tests at the moment!</p>
          )
        ) : (
          <p>Loading . . .</p>
        )}
      </CardBody>
    </Card>
  );
}
