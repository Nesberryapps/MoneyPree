'use client';

import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { FinwiseCompassIcon } from '@/components/icons';
import { NAV_LINKS } from '@/lib/constants';
import { Button } from '../ui/button';
import { Settings, LifeBuoy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <FinwiseCompassIcon className="h-8 w-8 text-primary" />
          <span className="text-xl font-semibold">Finwise</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {NAV_LINKS.map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={{ children: item.label, side: 'right' }}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        <div className="px-2 mt-auto">
          <Card className="mt-4 bg-accent/50 dark:bg-accent/10 border-0">
             <CardHeader className="p-2 pt-0 md:p-4">
                <CardTitle className="text-sm font-semibold">Upgrade to Pro</CardTitle>
             </CardHeader>
             <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
               <p className="text-xs text-muted-foreground mb-4">Unlock all features and get unlimited access to our support team.</p>
                <Button size="sm" className="w-full">Upgrade</Button>
             </CardContent>
          </Card>
        </div>
      </SidebarContent>
      <SidebarFooter className="border-t">
        <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={{ children: 'Settings', side: 'right' }}>
                <Link href="#">
                  <Settings />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={{ children: 'Help', side: 'right' }}>
                <Link href="#">
                  <LifeBuoy />
                  <span>Help</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
