import { useEffect } from "react";

import { api } from "~/utils/api";
import useTestContext from "~/hooks/useTestContext";

export default function PageWrapper({ children }: React.PropsWithChildren) {
  // For rendering the version.
  const setVersionId = useTestContext((state) => state.setVersionId);

  const { data } = api.test.getVersion.useQuery(undefined, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  const versionId = data?.id;

  // For incrementing the impression count.
  const hasImpressionRecorded = useTestContext(
    (state) => state.hasImpressionRecorded,
  );
  const confirmImpression = useTestContext((state) => state.confirmImpression);

  const incrementImpressionMutation = api.test.incrementImpressions.useMutation(
    {
      onSuccess: (data) => {
        // Confirm that the impression has been recorded.
        confirmImpression();

        // Set the version ID in the store.
        setVersionId(data.id);
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
