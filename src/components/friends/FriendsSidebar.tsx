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

const menuItems = [
  { id: "home", label: "Trang chu", to: "/friends", icon: LayoutGridIcon },
  {
    id: "requests",
    label: "Loi moi ket ban",
    to: "/friends/request",
    icon: UserPlusIcon,
  },
  {
    id: "suggest",
    label: "Goi y",
    to: "/friends/suggest",
    icon: UserCheckIcon,
  },
  { id: "all", label: "Tat ca ban be", to: "/friends/all", icon: UsersIcon },
];

export default function FriendsSidebar() {
  const location = useLocation();

  return (
    <SidebarProvider
      defaultOpen
      className="h-full"
      style={
        {
          "--sidebar-width": "50rem",
        } as React.CSSProperties
      }
    >
      <Sidebar
        collapsible="none"
        className="bg-sidebar text-sidebar-foreground"
      >
        <SidebarHeader className="gap-0 px-4 pb-2 pt-4">
          <h2 className="text-lg font-semibold">Ban be</h2>
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
                            <span>{item.label}</span>
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
