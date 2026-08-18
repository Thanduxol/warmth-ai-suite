import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Mail, NotebookPen, ListChecks, Compass, MessageSquare } from "lucide-react";

import emberMark from "@/assets/ember-mark.png";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Email Generator", url: "/email", icon: Mail },
  { title: "Notes Summarizer", url: "/notes", icon: NotebookPen },
  { title: "Task Planner", url: "/tasks", icon: ListChecks },
  { title: "Research", url: "/research", icon: Compass },
  { title: "Ember Chat", url: "/chat", icon: MessageSquare },
] as const;

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const currentPath = useRouterState({ select: (router) => router.location.pathname });

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="px-3 py-4">
        <Link to="/" className="flex min-w-0 items-center gap-3">
          <img
            src={emberMark}
            alt="Ember"
            width={512}
            height={512}
            className="h-8 w-8 shrink-0 rounded-lg bg-sidebar-accent p-1"
          />
          {!collapsed && (
            <span className="min-w-0">
              <span className="block truncate font-display text-base leading-tight font-semibold">
                Ember
              </span>
              <span className="block truncate text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
                Work assistant
              </span>
            </span>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={currentPath === item.url} tooltip={item.title}>
                    <Link to={item.url} className="flex items-center gap-3">
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span className="truncate">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {!collapsed && (
        <SidebarFooter className="p-4">
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            Drafts stay in this session only. Nothing is saved or shared.
          </p>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
