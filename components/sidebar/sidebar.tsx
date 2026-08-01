"use client";

import { useEffect } from "react";
import { SidebarContent } from "./sidebar-content";
import { useSidebar } from "./sidebar-provider";

export function Sidebar() {
  const { open, closeSidebar } = useSidebar();

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeSidebar();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, closeSidebar]);

  return (
    <>
      {open && (
        <div
          aria-hidden="true"
          onClick={closeSidebar}
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
        />
      )}

      <aside
        aria-label="Sidebar"
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-sidebar transition-transform duration-200 ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <SidebarContent onClose={closeSidebar} />
      </aside>
    </>
  );
}
