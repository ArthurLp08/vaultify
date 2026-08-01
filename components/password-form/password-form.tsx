"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/button/button";
import { Input } from "@/components/input/input";
import { PasswordInput } from "@/components/password-input/password-input";
import { savePasswords, usePasswords, type PasswordItem } from "@/lib/passwords";

type PasswordFormDialogProps = {
  initialData: PasswordItem | null;
  onClose: () => void;
};

export function PasswordFormDialog({
  initialData,
  onClose,
}: PasswordFormDialogProps) {
  const passwords = usePasswords();
  const isEditing = initialData !== null;

  const [site, setSite] = useState(initialData?.site ?? "");
  const [username, setUsername] = useState(initialData?.username ?? "");
  const [password, setPassword] = useState(initialData?.password ?? "");

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const next: PasswordItem[] = isEditing
      ? passwords.map((item) =>
          item.id === initialData.id ? { ...item, password } : item
        )
      : [
          ...passwords,
          {
            id: crypto.randomUUID(),
            site,
            username,
            password,
          },
        ];

    savePasswords(next);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60"
      />

      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="password-form-title"
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 8 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="relative w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-modal"
      >
        <div className="flex items-center justify-between">
          <h2
            id="password-form-title"
            className="text-base font-semibold text-foreground"
          >
            {isEditing ? "Editar senha" : "Nova senha"}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Fechar"
          >
            <X className="size-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          {!isEditing && (
            <>
              <Input
                label="Site"
                variant="card"
                value={site}
                onChange={(event) => setSite(event.target.value)}
                placeholder="ex.: github.com"
                autoFocus
                required
              />

              <Input
                label="Usuário"
                variant="card"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="ex.: usuario@email.com"
                required
              />
            </>
          )}

          <PasswordInput
            label="Senha"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
            autoFocus={isEditing}
            required
          />

          <div className="mt-2 flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {isEditing ? "Salvar alterações" : "Adicionar"}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
