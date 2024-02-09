import dynamic from "next/dynamic";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";

import AccountDropdown from "~/components/navbar/AccountDropdown";

const ThemeSwitcher = dynamic(
  () => import("~/components/navbar/ThemeSwitcher"),
  {
    ssr: false,
  },
);

export default function AppNavbar() {
  return (
    <Navbar isBordered>
      <NavbarBrand>
        <p className="font-bold text-inherit">Automated A/B Testing</p>
      </NavbarBrand>
      <NavbarContent justify="end">
        <NavbarItem>
          <ThemeSwitcher />
        </NavbarItem>
        <NavbarItem>
          <AccountDropdown />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
