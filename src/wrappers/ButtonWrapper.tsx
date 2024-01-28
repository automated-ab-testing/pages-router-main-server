import { type Button } from "@nextui-org/react";

import { api } from "~/utils/api";
import useTestContext from "~/hooks/useTestContext";

// TODO: Generalize the wrapper for button component into all components.
export default function ButtonWrapper({
  domId,
  render,
}: {
  domId: string;
  render: (props: {
    className: string | undefined;
    onClick: () => void;
  }) => React.ReactElement<typeof Button>;
}) {
  // For rendering the version.
  const versionId = useTestContext((state) => state.versionId);

  const { data } = api.test.getComponentStyles.useQuery(
    {
      componentDomId: domId,
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

  return render({
    className,
    onClick: () => {
      if (!className || hasClickRecorded) return;

      incrementClicks.mutate({
        versionId,
      });
    },
  });
}
