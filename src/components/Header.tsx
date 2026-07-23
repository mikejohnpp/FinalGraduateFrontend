import {
  BellIcon,
  HomeIcon,
  MessageCircleIcon,
  SearchIcon,
  UsersIcon,
  LogOutIcon,
  Plus,
  Group,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { cn } from "@/lib/utils";
import ButtonPopover from "./ButtonPopover";
import MessagesInnerPopover from "./MessagesInnerPopover";
import NotificationsInnerPopover from "./NotificationsInnerPopover";
import AutoComplete from "./AutoComplete";
import ThemeToggle from "./ThemeToggle";
import userService from "@/services/userService";
import { useLogoutUser } from "@/hooks/useUser";
import { useUnreadCount } from "@/hooks/useNotification";
import { useSelector } from "react-redux";
import type { RootState } from "@/stores/store";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { PATH_CONSTRAINT } from "@/plugins/routers";

const navItems = [
  { id: "home", icon: HomeIcon, label: "Trang chu", to: "/" },
  { id: "friends", icon: UsersIcon, label: "Ban be", to: "friends" },
  { id: "groups", icon: Group, label: "Nhom", to: "groups" },
  {
    id: "messenger",
    icon: MessageCircleIcon,
    label: "Tin nhan",
    to: "messenger",
  },
];

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useLogoutUser();
  const { userId, username, profile } = useSelector((r: RootState) => r.user);
  const { unreadCount, refresh: refreshUnread } = useUnreadCount();
  const isMobile = useIsMobile();

  const userAvatar = profile?.avatar || undefined;
  const displayName = profile?.nickName || profile?.userName || username || "Người dùng";
  const initial = displayName.charAt(0).toUpperCase();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="sticky top-0 z-20 h-15.5 shrink-0 border-b border-border bg-card/95 backdrop-blur">
      <div className="flex h-full w-full flex-row items-center justify-between px-4 md:grid md:grid-cols-[1fr_auto_1fr]">
        <div className="flex items-center gap-3 justify-self-start">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex size-10 cursor-pointer items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-foreground transition-opacity hover:opacity-80"
            aria-label="Về trang chủ"
          >
            f
          </button>
          <div className="hidden w-[260px] sm:block">
            <div className="rounded-full bg-secondary">
              <AutoComplete />
            </div>
          </div>
        </div>

        <div className="hidden h-full items-center justify-center gap-2 justify-self-center md:flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            var isActive = false;
            if (item.to === "/") {
              isActive = location.pathname === "/";
            } else {
              const path = location.pathname.slice(1); // "friends/..."
              isActive = path.startsWith(item.to);
            }
            return (
              <div
                key={item.id}
                className={cn(
                  "flex h-12 items-center justify-center px-0",
                  isActive && "border-b-2 border-primary",
                )}
              >
                <Button
                  variant="ghost"
                  size="lg"
                  className="w-30"
                  aria-label={item.label}
                  onClick={() => navigate(item.to)}
                >
                  <Icon data-icon="inline-start" />
                </Button>
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-2 justify-self-end">
          {/* Chuyển giao diện sáng/tối */}
          <ThemeToggle />

          {/* Chuông thông báo */}
          <Popover onOpenChange={(open) => open && refreshUnread()}>
            <PopoverTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative size-10 rounded-full p-0 hover:bg-secondary"
                  aria-label="Thông báo"
                >
                  <BellIcon className="size-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-semibold text-white">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </Button>
              }
            />
            <PopoverContent
              align="end"
              sideOffset={8}
              className="w-[400px] rounded-xl p-0 shadow-lg"
            >
              <NotificationsInnerPopover />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative ml-1 size-10 rounded-full p-0 hover:bg-secondary"
                  aria-label="Tài khoản"
                >
                  <Avatar className="size-10">
                    <AvatarImage src={userAvatar} />
                    <AvatarFallback>{initial}</AvatarFallback>
                  </Avatar>
                </Button>
              }
            />
            <PopoverContent
              align="end"
              sideOffset={8}
              className="w-[360px] rounded-xl p-4 shadow-lg"
            >
              <div className="flex flex-col gap-2">
                {/* Card đầu tiên (Thông tin user) */}
                <div className="rounded-lg border bg-secondary/50 p-3 shadow-sm">
                  <Item
                    size="default"
                    className="pointer-events-none mb-3 gap-3 border-none bg-transparent p-0 shadow-none"
                  >
                    <ItemMedia>
                      <Avatar className="size-10">
                        <AvatarImage src={userAvatar} />
                        <AvatarFallback>{initial}</AvatarFallback>
                      </Avatar>
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle className="text-lg font-bold">{displayName}</ItemTitle>
                    </ItemContent>
                  </Item>
                  <Button
                    variant="secondary"
                    className="mb-2 h-9 w-full text-[15px] font-semibold"
                    onClick={() => navigate(`/profile/${userId}`)}
                  >
                    Xem tất cả trang cá nhân
                  </Button>
                  {isMobile && (
                    <div>
                      <Button
                        variant="secondary"
                        className="mb-2 h-9 w-full text-[15px] font-semibold"
                        onClick={() => navigate(PATH_CONSTRAINT.GROUPS_DISCOVER)}
                      >
                        Khám phá nhóm
                      </Button>
                      <Button
                        variant="secondary"
                        className="mb-2 h-9 w-full text-[15px] font-semibold"
                        onClick={() => navigate(PATH_CONSTRAINT.GROUPS_MINE)}
                      >
                        Nhóm của bạn
                      </Button>
                    </div>
                  )}
                </div>

                {/* Nút đăng xuất */}
                <Item
                  className="mt-2 cursor-pointer rounded-lg border-none px-2 py-2 shadow-none hover:bg-secondary"
                  onClick={() => handleLogout()}
                >
                  <ItemMedia>
                    <div className="flex size-9 items-center justify-center rounded-full bg-secondary">
                      <LogOutIcon className="size-5" />
                    </div>
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle className="text-[15px] font-semibold">Đăng xuất</ItemTitle>
                  </ItemContent>
                </Item>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="flex items-center justify-center justify-self-center overflow-hidden border-t border-border bg-card/95 px-2 py-1 md:hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          let isActive = false;
          if (item.to === "/") {
            isActive = location.pathname === "/";
          } else {
            const path = location.pathname.slice(1); // "friends/..."
            isActive = path.startsWith(item.to);
          }
          return (
            <div
              key={item.id}
              className={cn(
                "flex h-12 items-center justify-center rounded-lg px-0",
                isActive && "bg-primary/10",
              )}
            >
              <Button
                variant="ghost"
                size="lg"
                className={cn("w-27", isActive && "text-primary")}
                aria-label={item.label}
                onClick={() => navigate(item.to)}
              >
                <Icon data-icon="inline-start" />
              </Button>
            </div>
          );
        })}
      </div>
    </header>
  );
}
