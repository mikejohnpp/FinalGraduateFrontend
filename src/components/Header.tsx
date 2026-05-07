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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { cn } from "@/lib/utils";
import ButtonPopover from "./ButtonPopover";
import MessagesInnerPopover from "./MessagesInnerPopover";
import AutoComplete from "./AutoComplete";

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

  return (
    <header className="sticky top-0 z-20 shrink-0 h-[62px] border-b border-border bg-card/95 backdrop-blur">
      <div className="grid grid-cols-[1fr_auto_1fr] w-full items-center h-full px-4">
        <div className="flex items-center gap-3 justify-self-start">
          <div className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground text-lg font-semibold">
            f
          </div>
          <div className="hidden w-[260px] sm:block">
            <div className="rounded-full bg-secondary">
              <AutoComplete />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 justify-self-center h-full">
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
              onViewAll={() => { }}
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
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="@shadcn"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <Avatar className="hidden sm:flex">
                    <AvatarImage
                      src="https://github.com/maxleiter.png"
                      alt="@maxleiter"
                    />
                    <AvatarFallback>LR</AvatarFallback>
                  </Avatar>
                  <Avatar>
                    <AvatarImage
                      src="https://github.com/evilrabbit.png"
                      alt="@evilrabbit"
                    />
                    <AvatarFallback>ER</AvatarFallback>
                  </Avatar>
                </div>
              </ItemMedia>
              <ItemContent>
                <ItemTitle>No Team Members</ItemTitle>
                <ItemDescription>
                  Invite your team to collaborate on this project.
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <Button size="sm" variant="outline">
                  Invite
                </Button>
              </ItemActions>
            </Item>
          </ButtonPopover>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative size-10 rounded-full hover:bg-secondary p-0 ml-1"
                aria-label="Tài khoản"
              >
                <Avatar className="size-10">
                  <AvatarImage src="https://images.unsplash.com/photo-1506744626753-1fa44f4a311b?w=100&h=100&fit=crop" />
                  <AvatarFallback>HP</AvatarFallback>
                </Avatar>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" sideOffset={8} className="w-[360px] p-4 shadow-lg rounded-xl">
              <div className="flex flex-col gap-2">
                {/* Card đầu tiên (Thông tin user) */}
                <div className="p-3 bg-secondary/50 rounded-lg shadow-sm border">
                  <Item size="default" className="p-0 bg-transparent border-none shadow-none mb-3 pointer-events-none gap-3">
                    <ItemMedia>
                      <Avatar className="size-10">
                        <AvatarImage src="https://images.unsplash.com/photo-1506744626753-1fa44f4a311b?w=100&h=100&fit=crop" />
                        <AvatarFallback>HP</AvatarFallback>
                      </Avatar>
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle className="text-lg font-bold">Hoàng Phúc Tạ</ItemTitle>
                    </ItemContent>
                  </Item>
                  <Button variant="secondary" className="w-full h-9 font-semibold text-[15px]" onClick={() => navigate('/profile/user_1')}>
                    Xem tất cả trang cá nhân
                  </Button>
                </div>

                {/* Nút đăng xuất */}
                <Item
                  className="px-2 py-2 rounded-lg cursor-pointer hover:bg-secondary border-none shadow-none mt-2"
                  onClick={() => console.log('Đăng xuất')}
                >
                  <ItemMedia>
                    <div className="size-9 flex items-center justify-center rounded-full bg-secondary">
                      <LogOutIcon className="size-5" />
                    </div>
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle className="font-semibold text-[15px]">Đăng xuất</ItemTitle>
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
