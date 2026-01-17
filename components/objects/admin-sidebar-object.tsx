import { Calendar, Users, FileText, BarChart3, Settings, Home, LucideIcon } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { NavMain } from "../nav-main"

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

export interface AppData {
  navMain: NavItem[]
}

export const userData: AppData = {
  navMain: [
    {
      title: "Dashboard",
      url: "/user/dashboard",
      icon: Home,
      isActive: true,
    },
    {
      title: "Appointments",
      url: "/user/appointments",
      icon: Calendar,
      items: [
        {
          title: "All Appointments",
          url: "/user/appointments/all-appointments",
        },
        {
          title: "Today's Schedule",
          url: "/user/appointments/today",
        },
      ],
    },
    {
      title: "Settings",
      url: "/user/settings",
      icon: Settings,
    },
    
  ]
}

export const data: AppData = {
  navMain: [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: Home,
      isActive: true,
    },
    {
      title: "Appointments",
      url: "/admin/appointments",
      icon: Calendar,
      items: [
        {
          title: "All Appointments",
          url: "/admin/appointments/all-appointments",
        },
        {
          title: "Today's Schedule",
          url: "/admin/appointments/today",
        },
      ],
    },
    {
      title: "Users",
      url: "/admin/patients",
      icon: Users,
      items: [
        {
          title: "Patients",
          url: "/admin/patients",
        },
        {
          title: "Staffs",
          url: "/admin/staff",
        },
      ],
    },
    {
      title: "Medical Records",
      url: "/admin/medical-records",
      icon: FileText,
    },
    {
      title: "Analytics",
      url: "/admin/analytics",
      icon: BarChart3,
    },
    {
      title: "Settings",
      url: "/admin/settings",
      icon: Settings,
    },
  ],
}