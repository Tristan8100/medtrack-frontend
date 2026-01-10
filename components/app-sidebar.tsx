"use client"

import type * as React from "react"
import { Calendar, Users, FileText, BarChart3, Settings, Home, Stethoscope } from "lucide-react"

import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar"

import type { LucideIcon } from "lucide-react"


export interface SubNavItem {
  title: string
  url: string
}

export interface NavItem {
  title: string
  url: string
  icon?: LucideIcon
  isActive?: boolean
  items?: SubNavItem[]
}

export interface User {
  name: string
  email: string
  avatar: string
}

export interface AppData {
  user: User
  navMain: NavItem[]
}

export const data: AppData = {
  user: {
    name: "Nurse Maria Santos",
    email: "maria@rhu4.gov.ph",
    avatar: "/avatars/staff.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
      isActive: true,
    },
    {
      title: "Appointments",
      url: "/appointments",
      icon: Calendar,
      items: [
        {
          title: "All Appointments",
          url: "/appointments",
        },
        {
          title: "Today's Schedule",
          url: "/appointments/today",
        },
        {
          title: "Pending",
          url: "/appointments/pending",
        },
        {
          title: "Completed",
          url: "/appointments/completed",
        },
      ],
    },
    {
      title: "Patients",
      url: "/patients",
      icon: Users,
      items: [
        {
          title: "All Patients",
          url: "/patients",
        },
        {
          title: "Register Patient",
          url: "/patients/register",
        },
        {
          title: "Search Records",
          url: "/patients/search",
        },
      ],
    },
    {
      title: "Medical Records",
      url: "/medical-records",
      icon: FileText,
      items: [
        {
          title: "All Records",
          url: "/medical-records",
        },
        {
          title: "Create Record",
          url: "/medical-records/create",
        },
        {
          title: "Recent Visits",
          url: "/medical-records/recent",
        },
      ],
    },
    {
      title: "Analytics",
      url: "/analytics",
      icon: BarChart3,
      items: [
        {
          title: "Overview",
          url: "/analytics",
        },
        {
          title: "Patient Demographics",
          url: "/analytics/demographics",
        },
        {
          title: "Top Diagnoses",
          url: "/analytics/diagnoses",
        },
        {
          title: "Reports",
          url: "/analytics/reports",
        },
      ],
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
      items: [
        {
          title: "Profile",
          url: "/settings/profile",
        },
        {
          title: "Staff Management",
          url: "/settings/staff",
        },
        {
          title: "System Settings",
          url: "/settings/system",
        },
      ],
    },
  ],
}


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
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
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
