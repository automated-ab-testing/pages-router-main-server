import React from "react";
import { useEffect, useState } from "react";

import TestContext from "~/context/test";
import { api } from "~/utils/api";

export default function ExperimentWrapper({
  children,
}: React.PropsWithChildren) {
  // Define the component state.
  const [hasImpressionRecorded, setImpressionRecorded] = useState(false);

  // Get the version ID from query.
  const { data } = api.test.getInitialData.useQuery(undefined, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  const versionId = data?.versionId;
  const styles = data?.styles;

  // Get the mutation for incrementing the impression count.
  const incrementImpressionMutation = api.test.incrementImpressions.useMutation(
    {
      onSuccess: () => {
        // Confirm that the impression has been recorded.
        setImpressionRecorded(true);
      },
    },
  );
  const incrementImpression = incrementImpressionMutation.mutate;

  // Increment the impression count after the version ID has been set.
  useEffect(() => {
    // If the version ID has been set, there is an active test, and the impression has not been recorded,
    // then increment the impression count.
    if (versionId !== undefined && versionId !== null && !hasImpressionRecorded)
      incrementImpression({ versionId });
  }, [versionId, hasImpressionRecorded, incrementImpression]);

  return (
    <TestContext.Provider value={{ versionId, styles }}>
      {children}
    </TestContext.Provider>
  );
}
