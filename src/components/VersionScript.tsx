import { useEffect } from "react";

import { api } from "~/utils/api";
import useTestContext from "~/hooks/useTestContext";

export default function VersionScript() {
  // For setting the version ID.
  const setVersionId = useTestContext((state) => state.setVersionId);

  const { data } = api.test.getVersion.useQuery(undefined, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  const versionId = data?.id;

  // Set the version ID after the API call has been made.
  useEffect(() => {
    if (!versionId) return;

    setVersionId(versionId);
  }, [versionId, setVersionId]);

  return null;
}
