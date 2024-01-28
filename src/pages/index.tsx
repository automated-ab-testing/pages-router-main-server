import Layout from "~/layout";
import Version from "~/components/Version";
import FirstButton from "~/components/FirstButton";
import SecondButton from "~/components/SecondButton";

export default function Home() {
  return (
    <Layout title="Automated A/B Testing">
      <div className="flex min-h-screen flex-col items-center justify-center gap-8 py-2">
        <Version />
        <FirstButton />
        <SecondButton />
      </div>
    </Layout>
  );
}
