import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@nextui-org/react";

export default function SignInButton() {
  const { data: sessionData } = useSession();

  return (
    <Button onClick={sessionData ? () => void signOut() : () => void signIn()}>
      {sessionData ? "Sign Out" : "Sign In"}
    </Button>
  );
}
