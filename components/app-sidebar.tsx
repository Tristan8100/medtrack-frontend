"use client"

import type * as React from "react"
import { Calendar, Users, FileText, BarChart3, Settings, Home, Stethoscope } from "lucide-react"

import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar"

import type { LucideIcon } from "lucide-react"
import { AppData } from "./objects/admin-sidebar-object"

export type User = {
  id: string;
  name: string;
  email: string;
};

export type SidebarProps = React.ComponentProps<typeof Sidebar> & {
  data: AppData;
  user: User
};





export function AppSidebar({ data, user, ...props }: SidebarProps) {
  return (
    <Sidebar variant="floating" collapsible="icon" {...props}>
      <SidebarHeader className="py-4">
        <div className="flex items-center gap-3">
          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg flex-shrink-0">
            <Stethoscope className="size-5" />
          </div>
          <div className="grid text-left leading-tight">
            <span className="truncate font-bold text-base">MedTrack</span>
            <span className="truncate text-sm text-muted-foreground">Brgy. Tibag RHU4</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
