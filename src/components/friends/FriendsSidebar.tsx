import {
  LayoutGridIcon,
  UserCheckIcon,
  UserPlusIcon,
  UsersIcon,
} from "lucide-react";
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
    { id: "home", label: "Trang chủ", to: "/friends", icon: LayoutGridIcon, badge: null },
    {
      id: "requests",
      label: "Lời mời kết bạn",
      to: "/friends/request",
      icon: UserPlusIcon,
      badge: count > 0 ? count : null,
    },
    {
      id: "suggest",
      label: "Gợi ý",
      to: "/friends/suggest",
      icon: UserCheckIcon,
      badge: null,
    },
    { id: "all", label: "Tất cả bạn bè", to: "/friends/all", icon: UsersIcon, badge: null },
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
      <Sidebar
        collapsible="none"
        className="bg-sidebar text-sidebar-foreground"
      >
        <SidebarHeader className="gap-0 px-4 pb-2 pt-4">
          <h2 className="text-lg font-semibold">Bạn bè</h2>
        </SidebarHeader>
        <SidebarContent className="px-3 pb-4">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.to;
                  return (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        render={
                          <Link to={item.to}>
                            <Icon data-icon="inline-start" />
                            <span className="flex-1">{item.label}</span>
                            {item.badge !== null && (
                              <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
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
