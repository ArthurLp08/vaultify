"use client";

import { Menu, Plus } from "lucide-react";
import { Button } from "@/components/button/button";
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
        <Button
          variant="secondary"
          size="icon"
          onClick={openSidebar}
          aria-label="Abrir menu"
          className="lg:hidden"
        >
          <Menu className="size-5" />
        </Button>
        <h1 className="text-lg font-semibold tracking-tight text-foreground">
          {title}
        </h1>
      </div>

      {onNewPassword && (
        <Button onClick={onNewPassword}>
          <Plus className="size-4" />
          Nova Senha
        </Button>
      )}
    </header>
  );
}
