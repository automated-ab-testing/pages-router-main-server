import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";

import ThemeSwitcher from "~/components/navbar/ThemeSwitcher";
import AccountDropdown from "~/components/navbar/AccountDropdown";

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
