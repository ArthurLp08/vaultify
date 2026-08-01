"use client";

import { useState } from "react";
import { Check, Copy, Eye, EyeOff, Pencil, Trash2 } from "lucide-react";

type PasswordCardProps = {
  site: string;
  username: string;
  password: string;
  onEdit?: () => void;
  onDelete?: () => void;
};

const iconButtonClassName =
  "grid size-8 place-items-center rounded-lg text-muted transition-colors duration-200 hover:bg-hover hover:text-foreground";

export function PasswordCard({
  site,
  username,
  password,
  onEdit,
  onDelete,
}: PasswordCardProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  const reveal = () => setShowPassword(true);
  const hide = () => setShowPassword(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <article className="rounded-lg border border-border bg-card p-4 transition-colors duration-200 hover:bg-hover">
      <div className="flex items-center gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-sm font-semibold text-primary">
          {site.charAt(0).toUpperCase()}
        </span>

        <h2 className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
          {site}
        </h2>

        <button
          type="button"
          onMouseDown={reveal}
          onMouseUp={hide}
          onMouseLeave={hide}
          onTouchStart={reveal}
          onTouchEnd={hide}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              reveal();
            }
          }}
          onKeyUp={(event) => {
            if (event.key === "Enter" || event.key === " ") hide();
          }}
          onContextMenu={(event) => event.preventDefault()}
          aria-label={showPassword ? "Ocultar senha" : "Ver senha"}
          className={iconButtonClassName}
        >
          {showPassword ? (
            <EyeOff className="size-4" />
          ) : (
            <Eye className="size-4" />
          )}
        </button>
      </div>

      <div className="mt-4 flex flex-col gap-1">
        <p className="truncate text-sm text-muted">{username}</p>
        <p className="truncate font-mono text-sm text-foreground">
          {showPassword ? password : "•".repeat(Math.min(password.length, 12))}
        </p>
      </div>

      <div className="mt-4 flex items-center gap-1 border-t border-border pt-3">
        <button
          type="button"
          onClick={onEdit}
          aria-label="Editar"
          className={iconButtonClassName}
        >
          <Pencil className="size-4" />
        </button>
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copiar senha"
          className={iconButtonClassName}
        >
          {copied ? (
            <Check className="size-4 text-primary" />
          ) : (
            <Copy className="size-4" />
          )}
        </button>
        <button
          type="button"
          onClick={onDelete}
          aria-label="Deletar"
          className={iconButtonClassName}
        >
          <Trash2 className="size-4" />
        </button>
      </div>
    </article>
  );
}
