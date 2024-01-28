import Layout from "~/layout";
import Version from "~/components/Version";
import FirstButton from "~/components/FirstButton";
import SecondButton from "~/components/SecondButton";
import PageWrapper from "~/wrappers/PageWrapper";

export default function Home() {
  return (
    <Layout title="Automated A/B Testing">
      <PageWrapper>
        <div className="flex min-h-screen flex-col items-center justify-center gap-8 py-2">
          <Version />
          <FirstButton />
          <SecondButton />
        </div>
      </PageWrapper>
    </Layout>
  );
}
