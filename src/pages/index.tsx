import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { Button, Navbar, NavbarContent, NavbarItem } from "@nextui-org/react";

export default function Home() {
  const { data: sessionData } = useSession();

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Automated A/B Testing" />
        <title>Automated A/B Testing</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar>
        <NavbarContent justify="end">
          <NavbarItem>
            <Button
              onClick={sessionData ? () => void signOut() : () => void signIn()}
            >
              {sessionData ? "Sign Out" : "Sign In"}
            </Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
      <main className="flex min-h-screen flex-col items-center justify-center gap-8 py-2"></main>
    </>
  );
}
