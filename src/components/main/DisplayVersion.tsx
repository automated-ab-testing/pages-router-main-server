import { Card, CardBody, CardHeader, Divider } from "@nextui-org/react";

import useTest from "~/hooks/useTest";

export default function DisplayVersion() {
  const data = useTest();

  return (
    <Card>
      <CardHeader>
        <p className="text-md">Version ID</p>
      </CardHeader>
      <Divider />
      <CardBody>
        {data !== undefined ? (
          data.versionId !== null ? (
            <p>{data.versionId}</p>
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
