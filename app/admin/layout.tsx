'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { usePathname } from "next/navigation";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { data } from "@/components/objects/admin-sidebar-object";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { user, setUser } = useAuth();
    const pathname = usePathname();

    // Get current page name from pathname
    const getPageName = () => {
      const segments = pathname.split('/').filter(Boolean);
      const lastSegment = segments[segments.length - 1] || 'dashboard';
      return lastSegment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    };

    useEffect(() => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      router.push("/login");
      return;
    }

    const verifyUser = async () => {
      try {
        const res = await api.get("/api/verify-admin", { //RETURN THE IMAGE PATH IF EXIST AH
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setUser(res.data.user_info);
        console.log("User set:", res.data.user_info); // por debugging again
      } catch (error) {
        console.error("Verification failed:", error);
        localStorage.removeItem("token");
        setUser(null);
        router.push("/auth/login");
      }
    };

    verifyUser();
  }, [router, setUser]);

  // Por debugging
  useEffect(() => {
    console.log("User state updated:", user);
  }, [user]);

  if (!user) {
    // This will trigger if verification fails
    return null;
  }

    return (
      <SidebarProvider
        style={
          {
            "--sidebar-width": "19rem",
          } as React.CSSProperties
        }
      >
        <AppSidebar data={data} user={user} />
        <SidebarInset>
          {/*Header */}
          <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6 transition-all duration-200">
            <SidebarTrigger className="-ml-1 h-9 w-9 rounded-xl hover:bg-accent hover:scale-105 active:scale-95 transition-all duration-200 hidden md:flex"/>
            
            {/* Page Title */}
            <div className="flex items-center gap-3 flex-1">
              <div className="h-8 w-1 bg-gradient-to-b from-primary to-primary/50 rounded-full" />
              <div className="flex flex-col">
                <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  {getPageName()}
                </h1>
                <p className="text-xs text-muted-foreground">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                </p>
              </div>
            </div>

            {/* User Welcome card */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent/50">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm font-medium">
                Welcome, <span className="text-primary">{user.name.split(' ')[0]}</span>
              </span>
            </div>
          </header>

          {/* Children Area */}
          <div className="flex flex-1 flex-col">
            {children}
            <div>
              <SidebarTrigger className="md:hidden fixed bottom-6 right-6 h-12 w-12 rounded-full bg-accent hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg flex items-center justify-center z-50" />
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
}