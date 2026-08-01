"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { KeyRound, Settings, ShieldCheck, X } from "lucide-react";

const NAV_ITEMS = [
  { label: "Minhas Senhas", icon: KeyRound, href: "/passwords" },
  { label: "Configurações", icon: Settings },
];

const itemClassName =
  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors duration-200 hover:bg-hover hover:text-foreground";

const activeItemClassName =
  "flex items-center gap-3 rounded-lg bg-primary/10 px-3 py-2 text-sm font-medium text-primary transition-colors duration-200";

type SidebarContentProps = {
  onClose: () => void;
};

export function SidebarContent({ onClose }: SidebarContentProps) {
  const pathname = usePathname();

  return (
    <div className="flex flex-1 flex-col gap-8 overflow-y-auto p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="grid size-9 place-items-center rounded-lg bg-primary text-background">
            <ShieldCheck className="size-4" />
          </span>
          <span className="text-base font-semibold tracking-tight text-foreground">
            Vaultify
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="grid size-8 place-items-center rounded-lg text-muted transition-colors duration-200 hover:bg-hover hover:text-foreground lg:hidden"
        >
          <X className="size-5" />
        </button>
      </div>

      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map(({ label, icon: Icon, href }) => {
          const isActive = href === pathname;
          const className = isActive ? activeItemClassName : itemClassName;

          return href ? (
            <Link
              key={label}
              href={href}
              onClick={onClose}
              aria-current={isActive ? "page" : undefined}
              className={className}
            >
              <Icon className="size-4" />
              {label}
            </Link>
          ) : (
            <button
              key={label}
              type="button"
              onClick={onClose}
              className={className}
            >
              <Icon className="size-4" />
              {label}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto flex items-center gap-3 rounded-lg border border-border bg-card p-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-sm font-semibold text-primary">
          V
        </span>
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-sm font-medium text-foreground">
            Guest User
          </span>
          <span className="truncate text-xs text-muted">guest@vaultify.dev</span>
        </div>
      </div>
    </div>
  );
}
