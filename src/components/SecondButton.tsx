import { Button } from "@nextui-org/react";

import { api } from "~/utils/api";
import useStore from "~/hooks/store";

export default function SecondButton() {
  const versionId = useStore((state) => state.versionId);

  const { data } = api.test.getComponentStyles.useQuery(
    {
      componentDomId: "second-button",
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
    <Button id="second-button" className={className}>
      Second Button
    </Button>
  );
}
