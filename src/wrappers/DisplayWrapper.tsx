import { useEffect } from "react";

import { api } from "~/utils/api";
import useTestContext from "~/hooks/useTestContext";

export default function DisplayWrapper({ children }: React.PropsWithChildren) {
  // Get the version ID and impression status from the context.
  const versionId = useTestContext((state) => state.versionId);
  const hasImpressionRecorded = useTestContext(
    (state) => state.hasImpressionRecorded,
  );
  const confirmImpression = useTestContext((state) => state.confirmImpression);

  // Get the mutation for incrementing the impression count.
  const incrementImpressionMutation = api.test.incrementImpressions.useMutation(
    {
      onSuccess: () => {
        // Confirm that the impression has been recorded.
        confirmImpression();
      },
    },
  );
  const incrementImpression = incrementImpressionMutation.mutate;

  // Increment the impression count after the version ID has been set.
  useEffect(() => {
    if (!versionId || hasImpressionRecorded) return;

    // Increment the impression count for this version.
    incrementImpression({ versionId });
  }, [versionId, hasImpressionRecorded, incrementImpression]);

  return <>{children}</>;
}
