import { useState } from "react";

import useTest from "~/hooks/useTest";
import { api } from "~/utils/api";

export default function ComponentWrapper({
  renderDefault,
  renderTest,
}: {
  renderDefault: () => React.ReactElement;
  renderTest: (props: {
    getStyles: (domId: string) => string;
    emitWin: React.MouseEventHandler | undefined;
  }) => React.ReactElement;
}) {
  // Get the version ID and styles from context.
  const { versionId, styles } = useTest();

  // Define the component state.
  const [hasClickRecorded, setClickRecorded] = useState(false);

  // Get the mutation for incrementing the click count.
  const incrementClicksMutation = api.test.incrementClicks.useMutation({
    onSuccess: () => {
      // Confirm that the click has been recorded.
      setClickRecorded(true);
    },
  });
  const incrementClicks = incrementClicksMutation.mutate;

  // If version ID has not been fetched
  // or the component style has not been fetched,
  // then render hidden component.
  if (versionId === undefined || styles === undefined)
    return renderTest({
      getStyles: () => "hidden",
      emitWin: undefined,
    });

  // If there is no active test,
  // then render the default component.
  if (versionId === null || styles === null) return renderDefault();

  // Else, render the component with the styles.
  return renderTest({
    getStyles: (domId) => styles[domId] ?? "hidden",
    emitWin: () => {
      // If the click has not been recorded, then increment the click count.
      if (!hasClickRecorded)
        incrementClicks({
          versionId,
        });
    },
  });
}
