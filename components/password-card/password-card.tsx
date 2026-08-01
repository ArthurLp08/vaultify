"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Copy, Eye, EyeOff, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/button/button";

type PasswordCardProps = {
  site: string;
  username: string;
  password: string;
  onEdit?: () => void;
  onDelete?: () => void;
  delay?: number;
};

export function PasswordCard({
  site,
  username,
  password,
  onEdit,
  onDelete,
  delay = 0,
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
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3, scale: 1.01 }}
      transition={{ duration: 0.2, ease: "easeOut", delay }}
      className="rounded-lg border border-border bg-card p-4 shadow-card transition-[background-color,box-shadow] duration-200 hover:border-border/70 hover:bg-hover hover:shadow-card-hover"
    >
      <div className="flex items-center gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-sm font-semibold text-primary">
          {site.charAt(0).toUpperCase()}
        </span>

        <h2 className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
          {site}
        </h2>

        <Button
          type="button"
          variant="ghost"
          size="icon"
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
        >
          {showPassword ? (
            <EyeOff className="size-4" />
          ) : (
            <Eye className="size-4" />
          )}
        </Button>
      </div>

      <div className="mt-4 flex flex-col gap-1">
        <p className="truncate text-sm text-muted">{username}</p>
        <p className="truncate font-mono text-sm text-foreground">
          {showPassword ? password : "•".repeat(Math.min(password.length, 12))}
        </p>
      </div>

      <div className="mt-4 flex items-center gap-1 border-t border-border pt-3">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onEdit}
          aria-label="Editar"
        >
          <Pencil className="size-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleCopy}
          aria-label="Copiar senha"
        >
          {copied ? (
            <Check className="size-4 text-primary" />
          ) : (
            <Copy className="size-4" />
          )}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onDelete}
          aria-label="Deletar"
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    </motion.article>
  );
}
