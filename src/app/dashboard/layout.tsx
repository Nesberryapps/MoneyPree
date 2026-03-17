
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import { NAV_LINKS } from '@/lib/constants';
import { MoneyPreeIcon } from '@/components/icons';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2">
            <MoneyPreeIcon className="h-8 w-8 text-primary" />
            <span className="text-xl font-semibold group-data-[collapsible=icon]:hidden">
              MoneyPree
            </span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {NAV_LINKS.map((link) => (
              <SidebarMenuItem key={link.href}>
                <Link href={link.href} passHref>
                  <SidebarMenuButton
                    isActive={pathname === link.href}
                    tooltip={link.label}
                  >
                    <link.icon />
                    <span>{link.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 items-center gap-4 border-b bg-card px-4 md:px-6">
          <SidebarTrigger className="md:hidden" />
          <div className="flex-1 text-center text-lg font-semibold">
            {NAV_LINKS.find(link => link.href === pathname)?.label}
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
