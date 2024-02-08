import Head from "next/head";
import { motion } from "framer-motion";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import AppNavbar from "~/components/navbar/AppNavbar";

interface LayoutProps {
  title: string;
}

export default function Layout({
  title,
  children,
}: React.PropsWithChildren<LayoutProps>) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={title} />
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AppNavbar />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.div>
      {process.env.NODE_ENV !== "production" && (
        <footer className="hidden md:block">
          <ReactQueryDevtools initialIsOpen={false} />
        </footer>
      )}
    </>
  );
}
