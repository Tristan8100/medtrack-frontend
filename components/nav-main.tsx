"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, type LucideIcon } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const pathname = usePathname()

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70 mb-2">
        Platform
      </SidebarGroupLabel>
      <SidebarMenu className="gap-1">
        {items.map((item) => {
          const hasSubItems = item.items && item.items.length > 0
          
          // Check if current path matches this item or any of its sub-items
          const isItemActive = pathname === item.url || 
            (hasSubItems && item.items?.some(subItem => pathname === subItem.url))

          //If no sub-items, direct link
          if (!hasSubItems) {
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton 
                  asChild 
                  tooltip={item.title}
                  className={cn(
                    "h-11 text-[15px] font-medium transition-all duration-200",
                    "hover:bg-accent hover:text-accent-foreground",
                    "hover:scale-[1.02] hover:shadow-sm",
                    "active:scale-[0.98]",
                    isItemActive && "bg-accent text-accent-foreground shadow-sm"
                  )}
                >
                  <Link href={item.url} className="flex items-center gap-3">
                    {item.icon && <item.icon className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />}
                    <span className="transition-all duration-200">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          }

          // If has sub-items, collapsible
          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={isItemActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton 
                    tooltip={item.title}
                    className={cn(
                      "h-11 text-[15px] font-medium transition-all duration-200",
                      "hover:bg-accent hover:text-accent-foreground",
                      "hover:scale-[1.02] hover:shadow-sm",
                      "active:scale-[0.98]",
                      isItemActive && "bg-accent text-accent-foreground shadow-sm"
                    )}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      {item.icon && <item.icon className="h-5 w-5 transition-transform duration-200 group-hover/collapsible:scale-110" />}
                      <span className="transition-all duration-200">{item.title}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 ml-auto transition-all duration-300 group-data-[state=open]/collapsible:rotate-90 group-hover/collapsible:scale-110" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent className="transition-all duration-300 data-[state=closed]:animate-out data-[state=open]:animate-in">
                  <SidebarMenuSub className="ml-5 border-l-2 border-border/40 pl-3 mt-1 space-y-0.5">
                    {item.items?.map((subItem) => {
                      const isSubItemActive = pathname === subItem.url
                      
                      return (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton 
                            asChild
                            className={cn(
                              "h-9 text-[14px] font-normal transition-all duration-200",
                              "hover:bg-accent/50 hover:text-accent-foreground",
                              "hover:translate-x-1 hover:font-medium",
                              "active:scale-[0.98]",
                              isSubItemActive && "bg-accent/70 text-accent-foreground font-medium"
                            )}
                          >
                            <Link href={subItem.url} className="flex items-center">
                              <span className="transition-all duration-200">{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      )
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}