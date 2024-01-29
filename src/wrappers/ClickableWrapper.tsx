import { api } from "~/utils/api";
import useTestContext from "~/hooks/useTestContext";

export default function ClickableWrapper({
  domId,
  render,
}: {
  domId: string;
  render: (props: {
    className: string | undefined;
    onClick: () => void;
  }) => React.ReactElement;
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

  return render({
    className,
    onClick: () => {
      if (!versionId || !className || hasClickRecorded) return;

      incrementClicks.mutate({
        versionId,
      });
    },
  });
}
