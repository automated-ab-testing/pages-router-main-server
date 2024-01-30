import { api } from "~/utils/api";
import useTestContext from "~/hooks/useTestContext";

export default function ClickableWrapper({
  render,
}: {
  render: (props: { onClick: () => void }) => React.ReactElement;
}) {
  // For rendering the version.
  const versionId = useTestContext((state) => state.versionId);

  // For incrementing the click count.
  const hasClickRecorded = useTestContext((state) => state.hasClickRecorded);
  const confirmClick = useTestContext((state) => state.confirmClick);

  const incrementClicksMutation = api.test.incrementClicks.useMutation({
    onSuccess: () => {
      // Confirm that the click has been recorded.
      confirmClick();
    },
  });
  const incrementClicks = incrementClicksMutation.mutate;

  return render({
    onClick: () => {
      if (!versionId || hasClickRecorded) return;

      incrementClicks({
        versionId,
      });
    },
  });
}
