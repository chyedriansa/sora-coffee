"use client"

import type * as React from "react"
import {
  BarChart3,
  Package,
  ShoppingCart,
  Users,
  Calendar,
  AlertTriangle,
  Clock,
  Settings,
  Coffee,
  LogOut,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

// Menu items data
const data = {
  mainMenu: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: BarChart3,
    },
    {
      title: "Inventory",
      url: "/inventory",
      icon: Package,
    },
    {
      title: "Sales",
      url: "#",
      icon: ShoppingCart,
    },
    {
      title: "Orders",
      url: "#",
      icon: ShoppingCart,
    },
    {
      title: "Suppliers",
      url: "#",
      icon: Users,
    },
    {
      title: "Reports",
      url: "#",
      icon: Calendar,
    },
  ],
  quickActions: [
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
    },
    {
      title: "Activity Log",
      url: "/activity-log",
      icon: Clock,
    },
    {
      title: "Alerts",
      url: "/alerts",
      icon: AlertTriangle,
    },
    {
      title: "Manage Account",
      url: "/account",
      icon: Users,
      isActive: false,
    },
    {
      title: "Logout",
      url: "#",
      icon: LogOut,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="w-8 h-8 bg-accent-foreground rounded-lg flex items-center justify-center">
            <Coffee className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Sora Coffee</h2>
            <p className="text-sm text-muted-foreground">Stock Opname</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.mainMenu.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.quickActions.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.title === "Logout" ? (
                    <SidebarMenuButton
                      asChild
                      onClick={() => {
                        if (typeof window !== "undefined") {
                          localStorage.removeItem("token")
                          localStorage.removeItem("user")
                          window.location.href = "/"
                        }
                      }}
                    >
                      <button type="button" className="flex items-center w-full text-red-600 hover:text-red-800">
                        <item.icon />
                        <span>{item.title}</span>
                      </button>
                    </SidebarMenuButton>
                  ) : (
                    <SidebarMenuButton asChild isActive={item.isActive}>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
