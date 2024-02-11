import useTest from "~/hooks/useTest";
import { api } from "~/utils/api";

export default function ComponentWrapper({
  renderDefault,
  renderTest,
}: {
  renderDefault: () => React.ReactElement;
  renderTest: (props: {
    getDisplayStatus: (domId: string) => boolean;
    emitWin: React.MouseEventHandler | undefined;
  }) => React.ReactElement;
}) {
  // Get the version ID and styles from context.
  const data = useTest();

  // Get the mutation for incrementing the click count.
  const incrementClicksMutation = api.test.incrementClicks.useMutation();
  const incrementClicks = incrementClicksMutation.mutate;

  // If version ID has not been fetched
  // or the component style has not been fetched,
  // then render hidden component.
  if (data === undefined)
    return renderTest({
      getDisplayStatus: () => false,
      emitWin: undefined,
    });

  // If there is no active test,
  // then render the default component.
  if (data.versionId === null) return renderDefault();

  // Else, render the component with the styles.
  return renderTest({
    getDisplayStatus: (domId) => data.featureFlags[domId] ?? false,
    emitWin: () => {
      incrementClicks();
    },
  });
}
