import { useEffect } from "react";

import { api } from "~/utils/api";
import useTestContext from "~/hooks/useTestContext";

export default function VersionScript() {
  // Get the function for setting the version ID from the context.
  const setVersionId = useTestContext((state) => state.setVersionId);

  // Get the version ID from query.
  const { data } = api.test.getVersion.useQuery(undefined, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  const versionId = data?.id;

  useEffect(() => {
    // If the version ID has been fetched, then set the version ID.
    if (versionId !== undefined) setVersionId(versionId);
  }, [versionId, setVersionId]);

  return null;
}
