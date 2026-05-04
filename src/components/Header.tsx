import {
  BellIcon,
  HomeIcon,
  MenuIcon,
  MessageCircleIcon,
  SearchIcon,
  UsersIcon,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import { Plus } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";

import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { cn } from "@/lib/utils";
import ButtonPopover from "./ButtonPopOver";

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

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-20  border-b border-border bg-card/95 backdrop-blur">
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
                  variant="ghost"
                  size="lg"
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
          <ButtonPopover icon={MenuIcon} label={"Menu"} title="Điều khiển">
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

          <ButtonPopover
            icon={MessageCircleIcon}
            label={"Tin nhắn"}
            title="Tin Nhắn"
          >
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
        </div>
      </div>
    </header>
  );
}
