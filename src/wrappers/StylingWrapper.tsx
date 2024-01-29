import { api } from "~/utils/api";
import useTestContext from "~/hooks/useTestContext";

export default function StylingWrapper({
  domId,
  render,
}: {
  domId: string;
  render: (props: { className: string | undefined }) => React.ReactElement;
}) {
  // For rendering the version.
  const versionId = useTestContext((state) => state.versionId);

  const { data } = api.test.getComponentStyles.useQuery(
    {
      componentDomId: domId,
      versionId: versionId,
    },
    {
      enabled: !!versionId,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  );
  const className = data?.className;

  return render({
    className,
  });
}
