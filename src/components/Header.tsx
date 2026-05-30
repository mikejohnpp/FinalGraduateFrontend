import {
  BellIcon,
  HomeIcon,
  MessageCircleIcon,
  SearchIcon,
  UsersIcon,
  LogOutIcon,
  Plus,
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
import AutoComplete from "./AutoComplete";
import userService from "@/services/userService";
import { useLogoutUser } from "@/hooks/useUser";
import { useSelector } from "react-redux";
import type { RootState } from "@/stores/store";

const navItems = [
  { id: "home", icon: HomeIcon, label: "Trang chu", to: "/" },
  { id: "friends", icon: UsersIcon, label: "Ban be", to: "friends" },
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
  const { logout, isLoading } = useLogoutUser();
  const { userId, username, profile } = useSelector((r: RootState) => r.user);

  const userAvatar = profile?.avatar || undefined;
  const displayName = profile?.nickName || profile?.userName || username || "Người dùng";
  const initial = displayName.charAt(0).toUpperCase();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="sticky top-0 z-20 h-[62px] shrink-0 border-b border-border bg-card/95 backdrop-blur">
      <div className="grid h-full w-full grid-cols-[1fr_auto_1fr] items-center px-4">
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

        <div className="flex h-full items-center justify-center gap-2 justify-self-center">
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
          <ButtonPopover
            icon={MessageCircleIcon}
            label={"Tin nhắn"}
            title="Tin Nhắn"
            badgeEnable={true}
            badgeContent={"3"}
          >
            <MessagesInnerPopover
              unreadCount={3}
              onViewAll={() => {}}
              onConversationClick={(conv) => console.log(conv)}
            />
          </ButtonPopover>
          <ButtonPopover icon={BellIcon} label={"Thông báo"} title="Thông báo">
            <Item variant="outline">
              <ItemMedia>
                <Avatar className="size-10">
                  <AvatarImage src="https://github.com/evilrabbit.png" />
                  <AvatarFallback>ER</AvatarFallback>
                </Avatar>
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Evil Rabbit</ItemTitle>
                <ItemDescription>Last seen 5 months ago</ItemDescription>
              </ItemContent>
              <ItemActions>
                <Button
                  size="icon-sm"
                  variant="outline"
                  className="rounded-full"
                  aria-label="Invite"
                >
                  <Plus />
                </Button>
              </ItemActions>
            </Item>
            <Item variant="outline">
              <ItemMedia>
                <div className="flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background *:data-[slot=avatar]:grayscale">
                  <Avatar className="hidden sm:flex">
                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <Avatar className="hidden sm:flex">
                    <AvatarImage src="https://github.com/maxleiter.png" alt="@maxleiter" />
                    <AvatarFallback>LR</AvatarFallback>
                  </Avatar>
                  <Avatar>
                    <AvatarImage src="https://github.com/evilrabbit.png" alt="@evilrabbit" />
                    <AvatarFallback>ER</AvatarFallback>
                  </Avatar>
                </div>
              </ItemMedia>
              <ItemContent>
                <ItemTitle>No Team Members</ItemTitle>
                <ItemDescription>Invite your team to collaborate on this project.</ItemDescription>
              </ItemContent>
              <ItemActions>
                <Button size="sm" variant="outline">
                  Invite
                </Button>
              </ItemActions>
            </Item>
          </ButtonPopover>

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
                    className="h-9 w-full text-[15px] font-semibold"
                    onClick={() => navigate(`/profile/${userId}`)}
                  >
                    Xem tất cả trang cá nhân
                  </Button>
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
    </header>
  );
}
