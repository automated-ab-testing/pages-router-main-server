import { Button } from "@nextui-org/react";

import { api } from "~/utils/api";
import useTestContext from "~/hooks/useTestContext";

export default function SecondButton() {
  // For rendering the version.
  const versionId = useTestContext((state) => state.versionId);

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

  // For incrementing the click count.
  const hasClickRecorded = useTestContext((state) => state.hasClickRecorded);
  const confirmClick = useTestContext((state) => state.confirmClick);

  const incrementClicks = api.test.incrementClicks.useMutation({
    onSuccess: () => {
      // Confirm that the click has been recorded.
      confirmClick();
    },
  });

  // Render the component.
  if (!versionId) return null;

  return (
    <Button
      id="second-button"
      className={className}
      onClick={() => {
        if (!className || hasClickRecorded) return;

        incrementClicks.mutate({
          versionId,
        });
      }}
    >
      Second Button
    </Button>
  );
}
