import { BookMarked, Calendar, Hourglass, Info } from "lucide-react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";
import { Link } from "@tanstack/react-router";

const menuItems = [
  {
    title: "Tasks",
    url: "/",
    icon: Calendar
  },
  // {
  //   title: "Task Categories",
  //   url: "/task-categories/",
  //   icon: BookMarked
  // },
  // {
  //   title: "Task Priorities",
  //   url: "/task-priorities/",
  //   icon: Hourglass
  // }
]

export function AppSidebar() {
  return (
    <div>
      <Sidebar variant="sidebar" >
        <SidebarHeader>
          <div className="text-lg font-bold">Todo App</div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            {/*<SidebarGroupLabel>Application</SidebarGroupLabel>*/}
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((menu) => (
                  <SidebarMenuItem key={menu.title}>
                    <SidebarMenuButton asChild>
                      <Link to={menu.url}>
                        <menu.icon />
                        {menu.title}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter />
      </Sidebar>
    </div>
  )
}
