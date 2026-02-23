"use client";

import { IconInnerShadowTop } from "@tabler/icons-react";
import type * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1.5">
          <IconInnerShadowTop className="!size-5" />
          <span className="text-base font-semibold">Wiki Graph</span>
        </div>
      </SidebarHeader>
      <SidebarContent />
    </Sidebar>
  );
}
