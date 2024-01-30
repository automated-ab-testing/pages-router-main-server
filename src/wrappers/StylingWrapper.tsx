import { api } from "~/utils/api";
import useTestContext from "~/hooks/useTestContext";

export default function StylingWrapper({
  componentDomId,
  fallbackClassName,
  render,
}: {
  componentDomId: string;
  fallbackClassName?: string;
  render: (props: { className: string | undefined }) => React.ReactElement;
}) {
  // Get the version ID from the context.
  const versionId = useTestContext((state) => state.versionId);

  // Get the component styles from query.
  const { data } = api.test.getComponentStyles.useQuery(
    {
      componentDomId,
      versionId,
    },
    {
      enabled: versionId !== null,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  );
  const className = data?.className;

  // If there is no active test, then render the fallback class name.
  if (!versionId)
    return render({
      className: fallbackClassName,
    });

  // If there is no active style in the test, then hide the component.
  if (className === null)
    return render({
      className: "hidden",
    });

  // Render the component with the class name.
  // If the component style has not been fetched, then render the component without the class name.
  return render({
    className,
  });
}
