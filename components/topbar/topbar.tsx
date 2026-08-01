"use client";

import { Menu, Plus } from "lucide-react";
import { useSidebar } from "@/components/sidebar/sidebar-provider";

type TopBarProps = {
  title: string;
  onNewPassword?: () => void;
};

export function TopBar({ title, onNewPassword }: TopBarProps) {
  const { openSidebar } = useSidebar();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-border bg-background/80 px-4 py-3 backdrop-blur lg:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={openSidebar}
          aria-label="Abrir menu"
          className="grid size-10 place-items-center rounded-lg border border-border bg-card text-muted transition-colors duration-200 hover:bg-hover hover:text-foreground lg:hidden"
        >
          <Menu className="size-5" />
        </button>
        <h1 className="text-lg font-semibold tracking-tight text-foreground">
          {title}
        </h1>
      </div>

      {onNewPassword && (
        <button
          type="button"
          onClick={onNewPassword}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-background transition-colors duration-200 hover:bg-primary/90"
        >
          <Plus className="size-4" />
          Nova Senha
        </button>
      )}
    </header>
  );
}
