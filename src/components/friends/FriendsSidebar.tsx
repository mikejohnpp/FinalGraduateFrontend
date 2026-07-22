import { LayoutGridIcon, UserCheckIcon, UserPlusIcon, UsersIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { useFriendRequestCount } from "@/hooks/useFriend";

export default function FriendsSidebar() {
  const location = useLocation();
  const { count } = useFriendRequestCount();

  const menuItems = [
    {
      id: "home",
      label: "Trang chủ",
      to: "/friends",
      icon: LayoutGridIcon,
      badge: null,
      color: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
    },
    {
      id: "requests",
      label: "Lời mời kết bạn",
      to: "/friends/request",
      icon: UserPlusIcon,
      badge: count > 0 ? count : null,
      color: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
    },
    {
      id: "suggest",
      label: "Gợi ý",
      to: "/friends/suggest",
      icon: UserCheckIcon,
      badge: null,
      color: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
    },
    {
      id: "all",
      label: "Tất cả bạn bè",
      to: "/friends/all",
      icon: UsersIcon,
      badge: null,
      color: "bg-violet-500/15 text-violet-600 dark:text-violet-400",
    },
  ];

  return (
    <SidebarProvider
      defaultOpen
      style={
        {
          "--sidebar-width": "50rem",
        } as React.CSSProperties
      }
      className="h-full"
    >
      <Sidebar collapsible="none" className="min-h-4 bg-sidebar text-sidebar-foreground">
        <SidebarHeader className="mt-10 gap-0 px-4 pt-4 pb-2 md:mt-0">
          <h2 className="text-lg font-semibold">Bạn bè</h2>
        </SidebarHeader>
        <SidebarContent className="px-3 pb-4">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1.5">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.to;
                  return (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        className="h-11 gap-3"
                        render={
                          <Link to={item.to}>
                            <span
                              className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${item.color}`}
                            >
                              <Icon className="size-4" />
                            </span>
                            <span className="flex-1">{item.label}</span>

                            {item.badge !== null && (
                              <span className="text-destructive-foreground ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold">
                                {item.badge > 99 ? "99+" : item.badge}
                              </span>
                            )}
                          </Link>
                        }
                        isActive={isActive}
                      />
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
}
