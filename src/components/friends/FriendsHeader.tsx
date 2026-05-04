import {
  BellIcon,
  HomeIcon,
  MenuIcon,
  MessageCircleIcon,
  SearchIcon,
  UsersIcon,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { cn } from "@/lib/utils";

const navItems = [
  { id: "home", icon: HomeIcon, label: "Trang chu", to: "/" },
  { id: "friends", icon: UsersIcon, label: "Ban be", to: "/friends" },
  { id: "messages", icon: MessageCircleIcon, label: "Tin nhan", to: "/" },
];

const actionItems = [
  { id: "menu", icon: MenuIcon, label: "Menu" },
  { id: "messages", icon: MessageCircleIcon, label: "Tin nhan" },
  { id: "notifications", icon: BellIcon, label: "Thong bao" },
];

export default function FriendsHeader() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-20 h-[58px] border-b border-border bg-card/95 backdrop-blur">
      <div className="flex w-full items-center gap-4 px-4 py-2">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground text-lg font-semibold">
            f
          </div>
          <div className="hidden w-[260px] sm:block">
            <div className="rounded-full bg-secondary">
              <InputGroup>
                <InputGroupAddon className="pl-3">
                  <SearchIcon data-icon="inline-start" />
                </InputGroupAddon>
                <InputGroupInput placeholder="Tim kiem tren Facebook" />
              </InputGroup>
            </div>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center gap-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;
            return (
              <div
                key={item.id}
                className={cn(
                  "flex h-12 items-center justify-center px-4",
                  isActive && "border-b-2 border-primary",
                )}
              >
                <Button
                  variant={isActive ? "nav-active" : "nav"}
                  size="nav"
                  aria-label={item.label}
                  onClick={() => navigate(item.to)}
                >
                  <Icon data-icon="inline-start" />
                </Button>
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          {actionItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant="ghost"
                size="icon"
                aria-label={item.label}
              >
                <Icon data-icon="inline-start" />
              </Button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
