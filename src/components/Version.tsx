import { Card, CardBody, CardHeader, Divider } from "@nextui-org/react";

import useTestContext from "~/hooks/useTestContext";

export default function Version() {
  const versionId = useTestContext((state) => state.versionId);

  if (!versionId) return null;

  return (
    <Card>
      <CardHeader>
        <p className="text-md">Version ID</p>
      </CardHeader>
      <Divider />
      <CardBody>
        <p>{versionId}</p>
      </CardBody>
    </Card>
  );
}
