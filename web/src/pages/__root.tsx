import * as React from 'react'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-siderbar'
import { NavBar } from '@/components/nav-bar'
import {
  QueryClient,
  QueryClientProvider
} from "@tanstack/react-query"
import { Toaster } from "@/components/ui/sonner"

export const Route = createRootRoute({
  component: RootComponent,
})

const queryClient = new QueryClient();

function RootComponent() {
  React.useEffect(() => {
    const root = window.document.documentElement

    root.classList.add("dark")
  }, []);

  return (
    <React.Fragment>
      <QueryClientProvider client={queryClient}>
        <div className='flex min-h-screen'>
          <SidebarProvider>
            <AppSidebar />

            <div className='flex-1 p-4'>
              <div className='flex justify-between align-middle'>
                <div className='flex-1'>
                  <Outlet />
                </div>

                <NavBar className='absolute right-1' />
              </div>
            </div>
          </SidebarProvider>
        </div>
        <Toaster />
      </QueryClientProvider>
    </React.Fragment>
  )
}
