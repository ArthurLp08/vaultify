"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { KeyRound, Settings, ShieldCheck, X } from "lucide-react";
import { Button } from "@/components/button/button";
import { useProfile } from "@/lib/profile";

const NAV_ITEMS = [
  { label: "Minhas Senhas", icon: KeyRound, href: "/passwords" },
  { label: "Configurações", icon: Settings, href: "/settings" },
];

const itemClassName =
  "relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors duration-200 hover:bg-hover hover:text-foreground";

const activeItemClassName =
  "relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-primary transition-colors duration-200";

type SidebarContentProps = {
  onClose: () => void;
};

export function SidebarContent({ onClose }: SidebarContentProps) {
  const pathname = usePathname();
  const profile = useProfile();

  return (
    <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-4">
      <div className="flex items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-lg bg-primary text-background shadow-sm shadow-primary/30">
            <ShieldCheck className="size-4" />
          </span>
          <span className="text-base font-semibold tracking-tight text-foreground">
            Vaultify
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          aria-label="Close menu"
          className="lg:hidden"
        >
          <X className="size-4" />
        </Button>
      </div>

      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map(({ label, icon: Icon, href }) => {
          const isActive = href === pathname;

          return (
            <Link
              key={label}
              href={href}
              onClick={onClose}
              aria-current={isActive ? "page" : undefined}
              className={isActive ? activeItemClassName : itemClassName}
            >
              {isActive && (
                <motion.span
                  layoutId="sidebar-active"
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute inset-0 rounded-lg bg-primary/10"
                />
              )}
              <Icon className="relative size-4" />
              <span className="relative">{label}</span>
            </Link>
          );
        })}
      </nav>

      <Link
        href="/settings"
        onClick={onClose}
        className="mt-auto flex items-center gap-3 rounded-lg border border-border bg-card p-3 shadow-card transition-colors duration-200 hover:border-border/70 hover:bg-hover"
      >
        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-sm font-semibold text-primary">
          {profile.name.charAt(0).toUpperCase()}
        </span>
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-sm font-medium text-foreground">
            {profile.name}
          </span>
          <span className="truncate text-xs text-muted">{profile.email}</span>
        </div>
      </Link>
    </div>
  );
}
