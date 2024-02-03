import { api } from "~/utils/api";
import useTestContext from "~/hooks/useTestContext";

export default function ComponentWrapper({
  renderDefault,
  renderTest,
}: {
  renderDefault: () => React.ReactElement;
  renderTest: (props: {
    getStyles: (domId: string) => string | undefined;
    emitWin: React.MouseEventHandler | undefined;
  }) => React.ReactElement;
}) {
  // Get the version ID from the context.
  const versionId = useTestContext((state) => state.versionId);

  // Get click status from the context.
  const hasClickRecorded = useTestContext((state) => state.hasClickRecorded);
  const confirmClick = useTestContext((state) => state.confirmClick);

  // Get the component styles from query.
  const { data } = api.test.getComponentStyles.useQuery(
    { versionId },
    {
      enabled: versionId !== undefined && versionId !== null,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  );
  const styles = data?.styles;

  // Get the mutation for incrementing the click count.
  const incrementClicksMutation = api.test.incrementClicks.useMutation({
    onSuccess: () => {
      // Confirm that the click has been recorded.
      confirmClick();
    },
  });
  const incrementClicks = incrementClicksMutation.mutate;

  // If there is no active test,
  // then render the default component.
  if (versionId === null) return renderDefault();

  // If version ID has not been fetched
  // or the component style has not been fetched,
  // then render hidden component.
  if (versionId === undefined || styles === undefined)
    return renderTest({
      getStyles: () => "hidden",
      emitWin: undefined,
    });

  // Else, render the component with the styles.
  return renderTest({
    getStyles: (domId) => styles[domId],
    emitWin: () => {
      // If the click has not been recorded, then increment the click count.
      if (!hasClickRecorded)
        incrementClicks({
          versionId,
        });
    },
  });
}
