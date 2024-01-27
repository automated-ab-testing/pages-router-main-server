import Head from "next/head";
import dynamic from "next/dynamic";

const AppNavbar = dynamic(() => import("~/components/AppNavbar"), {
  ssr: false,
});

export default function Home() {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Automated A/B Testing" />
        <title>Automated A/B Testing</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AppNavbar />
      <main className="flex min-h-screen flex-col items-center justify-center gap-8 py-2"></main>
    </>
  );
}
