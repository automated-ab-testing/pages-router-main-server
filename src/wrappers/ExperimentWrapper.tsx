import React from "react";
import { useEffect } from "react";

import TestContext from "~/context/test";
import { api } from "~/utils/api";

export default function ExperimentWrapper({
  children,
}: React.PropsWithChildren) {
  // Get the version ID from query.
  const { data } = api.test.getInitialData.useQuery(undefined, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  const versionId = data?.versionId;

  // Get the mutation for incrementing the impression count.
  const incrementImpressionMutation =
    api.test.incrementImpressions.useMutation();
  const incrementImpression = incrementImpressionMutation.mutate;

  // Increment the impression count after the version ID has been set.
  useEffect(() => {
    // If the version ID has been set, there is an active test, and the impression has not been recorded,
    // then increment the impression count.
    if (versionId !== undefined && versionId !== null)
      incrementImpression({ versionId });
  }, [versionId, incrementImpression]);

  return <TestContext.Provider value={data}>{children}</TestContext.Provider>;
}
