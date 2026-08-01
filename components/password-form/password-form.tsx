"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
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
      <div
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 bg-black/60"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="password-form-title"
        className="relative w-full max-w-md rounded-lg border border-border bg-card p-6"
      >
        <div className="flex items-center justify-between">
          <h2
            id="password-form-title"
            className="text-base font-semibold text-foreground"
          >
            {isEditing ? "Editar senha" : "Nova senha"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="grid size-8 place-items-center rounded-lg text-muted transition-colors duration-200 hover:bg-hover hover:text-foreground"
          >
            <X className="size-4" />
          </button>
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
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors duration-200 hover:bg-hover"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-background transition-colors duration-200 hover:bg-primary/90"
            >
              {isEditing ? "Salvar alterações" : "Adicionar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
