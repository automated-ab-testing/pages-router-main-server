import { Button } from "@nextui-org/react";

import { api } from "~/utils/api";
import useStore from "~/hooks/store";

export default function FirstButton() {
  const versionId = useStore((state) => state.versionId);

  const { data } = api.test.getComponentStyles.useQuery(
    {
      componentDomId: "first-button",
      versionId: versionId,
    },
    {
      enabled: !!versionId,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  );
  const className = data?.className;

  return (
    <Button id="first-button" className={className}>
      First Button
    </Button>
  );
}
