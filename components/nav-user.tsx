"use client"

import {
  ChevronsUpDown,
  LogOut,
  User as UserIcon,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useAuth } from "@/contexts/AuthContext"

export type User = {
  id: string;
  name: string;
  email: string;
};

export function NavUser({
  user,
}: {
  user: User;
}) {
  const { isMobile } = useSidebar()
  const { logout } = useAuth();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-sidebar-accent/50 transition-all duration-200"
            >
              <div className="grid flex-1 text-left leading-tight">
                <span className="truncate font-semibold text-[15px]">{user.name}</span>
                <span className="truncate text-xs text-muted-foreground">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto h-4 w-4 opacity-50 transition-transform duration-200 group-data-[state=open]:rotate-180" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-64 rounded-xl shadow-lg border-2"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={8}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-3 px-3 py-3 bg-accent/30">
                <div className="grid flex-1 text-left leading-tight">
                  <span className="font-semibold text-[15px]">{user.name}</span>
                  <span className="text-sm text-muted-foreground">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="my-1" />
            <div className="p-1">
              <DropdownMenuItem className="cursor-pointer rounded-lg px-3 py-2.5 text-[14px] font-medium transition-all duration-200 hover:bg-accent hover:scale-[1.02] active:scale-[0.98]">
                <UserIcon className="h-4 w-4 mr-2" />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem onClick={logout} className="cursor-pointer rounded-lg px-3 py-2.5 text-[14px] font-medium transition-all duration-200 hover:bg-destructive/10 hover:text-destructive hover:scale-[1.02] active:scale-[0.98]">
                <LogOut className="h-4 w-4 mr-2" />
                Log out
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}