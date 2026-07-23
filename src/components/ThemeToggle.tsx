import { useTheme } from "next-themes";
import { MonitorIcon, MoonIcon, SunIcon, CheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const options = [
  { value: "light", label: "Sáng", icon: SunIcon },
  { value: "dark", label: "Tối", icon: MoonIcon },
  { value: "system", label: "Hệ thống", icon: MonitorIcon },
] as const;

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const ActiveIcon = resolvedTheme === "dark" ? MoonIcon : SunIcon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="size-10 rounded-full p-0 hover:bg-secondary"
            aria-label="Chuyển giao diện sáng/tối"
          >
            <ActiveIcon className="size-5" />
          </Button>
        }
      />
      <DropdownMenuContent align="end" sideOffset={8} className="min-w-40 rounded-xl p-1">
        {options.map(({ value, label, icon: Icon }) => (
          <DropdownMenuItem
            key={value}
            onClick={() => setTheme(value)}
            className="cursor-pointer gap-2"
          >
            <Icon className="size-4" />
            <span className="flex-1">{label}</span>
            <CheckIcon
              className={cn(
                "size-4 opacity-0",
                theme === value && "opacity-100",
              )}
            />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
