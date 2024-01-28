import { useEffect } from "react";
import { Card, CardBody, CardHeader, Divider } from "@nextui-org/react";

import { api } from "~/utils/api";
import useStore from "~/hooks/store";

export default function Version() {
  const { data } = api.test.getVersion.useQuery(undefined, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  const versionId = data?.id;

  const setVersionId = useStore((state) => state.setVersionId);

  useEffect(() => {
    if (!versionId) return;

    setVersionId(versionId);
  }, [versionId, setVersionId]);

  if (!versionId) return;

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
