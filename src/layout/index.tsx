import Head from "next/head";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { env } from "~/env";

const AppNavbar = dynamic(() => import("~/components/AppNavbar"), {
  ssr: false,
});

interface Props {
  title: string;
  children?: React.ReactNode;
}

export default function Layout({ title, children }: Props) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={title} />
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AppNavbar />
      <main>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.div>
      </main>
      {env.NEXT_PUBLIC_NODE_ENV !== "production" && (
        <footer className="hidden md:block">
          <ReactQueryDevtools initialIsOpen={false} />
        </footer>
      )}
    </>
  );
}
