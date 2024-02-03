import { useEffect } from "react";

import { api } from "~/utils/api";
import useTestContext from "~/hooks/useTestContext";

export default function ExperimentWrapper({
  children,
}: React.PropsWithChildren) {
  // Get the function for setting the version ID from the context.
  const setVersionId = useTestContext((state) => state.setVersionId);

  // Get impression status from the context.
  const hasImpressionRecorded = useTestContext(
    (state) => state.hasImpressionRecorded,
  );
  const confirmImpression = useTestContext((state) => state.confirmImpression);

  // Get the version ID from query.
  const { data } = api.test.getVersion.useQuery(undefined, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  const versionId = data?.id;

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

  useEffect(() => {
    // If the version ID has been fetched, then set the version ID.
    if (versionId !== undefined) setVersionId(versionId);
  }, [versionId, setVersionId]);

  // Increment the impression count after the version ID has been set.
  useEffect(() => {
    // If the version ID has been set, there is an active test, and the impression has not been recorded,
    // then increment the impression count.
    if (versionId !== undefined && versionId !== null && !hasImpressionRecorded)
      incrementImpression({ versionId });
  }, [versionId, hasImpressionRecorded, incrementImpression]);

  return <>{children}</>;
}
