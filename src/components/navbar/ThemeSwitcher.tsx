import { Switch } from "@nextui-org/react";
import { useTheme } from "next-themes";

import SunIcon from "~/svg/SunIcon";
import MoonIcon from "~/svg/MoonIcon";

export default function ThemeSwitcher() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Switch
      isSelected={resolvedTheme === "light"}
      onValueChange={() =>
        setTheme(resolvedTheme === "light" ? "dark" : "light")
      }
      color="default"
      size="lg"
      startContent={<SunIcon />}
      endContent={<MoonIcon />}
    />
  );
}
