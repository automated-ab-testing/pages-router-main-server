"use client";

import {
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { signIn, signOut, useSession } from "next-auth/react";

export default function AccountDropdown() {
  const { data: sessionData } = useSession();

  return (
    <Dropdown>
      <DropdownTrigger>
        {sessionData ? (
          <Avatar
            showFallback
            src={
              sessionData.user.image !== null
                ? sessionData.user.image
                : undefined
            }
            name={
              sessionData.user.name !== null ? sessionData.user.name : undefined
            }
          />
        ) : (
          <Avatar />
        )}
      </DropdownTrigger>
      <DropdownMenu aria-label="User Event">
        {sessionData ? (
          <DropdownItem
            key="sign-out"
            className="text-danger"
            color="danger"
            onPress={() => void signOut()}
          >
            Sign Out
          </DropdownItem>
        ) : (
          <DropdownItem key="sign-in" onPress={() => void signIn()}>
            Sign In
          </DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
  );
}
