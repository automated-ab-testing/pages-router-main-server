import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { Select, SelectItem } from "@nextui-org/react";

import { api } from "~/utils/api";

export default function SelectVersion() {
  // Get the search params and pathname from the URL.
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  // Get the query from the search params.
  const testQuery = searchParams.get("test");
  const versionQuery = searchParams.get("version");

  // Fetch the version labels.
  const { data: versionData } = api.analytics.getVersionLabels.useQuery(
    {
      testId: testQuery,
    },
    {
      enabled: !!testQuery,
    },
  );

  return (
    <Select
      label="Version"
      placeholder="Select a version"
      items={versionData ?? []}
      selectedKeys={versionData && versionQuery ? [versionQuery] : []}
      onChange={(e) => {
        // Get the selected value from the event.
        const selectedValue = e.target.value;

        // Create a new search params object.
        const newSearchParams = new URLSearchParams(searchParams);

        // Update the URL with the new version ID.
        if (selectedValue) {
          newSearchParams.set("version", selectedValue);
        } else {
          newSearchParams.delete("version");
        }

        // Replace the URL with the new search params.
        const rawSearchParam = newSearchParams.toString();
        router.replace(
          rawSearchParam ? `${pathname}?${rawSearchParam}` : pathname,
        );
      }}
    >
      {(item) => (
        <SelectItem key={item.id} value={item.id}>
          {item.label}
        </SelectItem>
      )}
    </Select>
  );
}
