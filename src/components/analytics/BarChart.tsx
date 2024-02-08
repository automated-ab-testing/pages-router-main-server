import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { type AxisOptions, type UserSerie, Chart } from "react-charts";
import { useTheme } from "next-themes";

import { api } from "~/utils/api";

type MyDatum = { version: string; amount: number };

export default function BarChart() {
  // Get the search params from the URL.
  const searchParams = useSearchParams();

  // Get the query from the search params.
  const testQuery = searchParams.get("test");

  // Get the theme
  const { resolvedTheme } = useTheme();

  // Fetch the data.
  const { data: analyticsData } = api.analytics.getAnalytics.useQuery(
    {
      testId: testQuery,
    },
    {
      enabled: !!testQuery,
    },
  );

  // Define the data
  const data = useMemo(
    (): UserSerie<MyDatum>[] =>
      analyticsData
        ? Object.entries(analyticsData).map(([label, rawData]) => ({
            label,
            data: Object.entries(rawData).map(([version, amount]) => ({
              version,
              amount,
            })),
          }))
        : [],
    [analyticsData],
  );

  // Define the primary axis
  const primaryAxis = useMemo(
    (): AxisOptions<MyDatum> => ({
      getValue: (datum) => datum.version,
    }),
    [],
  );

  // Define the secondary axes
  const secondaryAxes = useMemo(
    (): AxisOptions<MyDatum>[] => [
      {
        getValue: (datum) => datum.amount,
        elementType: "bar",
      },
    ],
    [],
  );

  // If there's no data, return null.
  if (!analyticsData) return null;

  // Render the chart.
  return (
    <Chart
      options={{
        data,
        primaryAxis,
        secondaryAxes,
        dark: resolvedTheme === "dark",
      }}
    />
  );
}
