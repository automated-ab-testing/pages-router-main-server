import { useSearchParams } from "next/navigation";

import { api } from "~/utils/api";

export default function BarChart() {
  // Get the search params from the URL.
  const searchParams = useSearchParams();

  // Get the query from the search params.
  const versionQuery = searchParams.get("version");

  // Fetch the data.
  const { data: analyticsData } = api.analytics.getAnalytics.useQuery(
    {
      versionId: versionQuery,
    },
    {
      enabled: !!versionQuery,
    },
  );

  // TODO: Render the bar chart.
  return (
    <>
      {analyticsData &&
        Object.entries(analyticsData).map(([key, value]) => (
          <p key={key} className="text-base">
            {key}: {value}
          </p>
        ))}
    </>
  );
}
