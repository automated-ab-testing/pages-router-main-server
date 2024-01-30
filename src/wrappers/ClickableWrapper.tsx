import { api } from "~/utils/api";
import useTestContext from "~/hooks/useTestContext";

export default function ClickableWrapper({
  defaultOnClick,
  render,
}: {
  defaultOnClick?: React.MouseEventHandler;
  render: (props: {
    onClick: React.MouseEventHandler | undefined;
  }) => React.ReactElement;
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

  // If there is no active test, then render the default onClick.
  if (!versionId) return render({ onClick: defaultOnClick });

  // Render the component with the onClick.
  return render({
    onClick: (event) => {
      // Call the default onClick.
      if (defaultOnClick) defaultOnClick(event);

      // If the click has not been recorded, then increment the click count.
      if (!hasClickRecorded)
        incrementClicks({
          versionId,
        });
    },
  });
}
