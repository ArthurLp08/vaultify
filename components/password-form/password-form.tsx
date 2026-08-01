"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff, X } from "lucide-react";
import { savePasswords, usePasswords, type PasswordItem } from "@/lib/passwords";

type PasswordFormDialogProps = {
  initialData: PasswordItem | null;
  onClose: () => void;
};

const inputClassName =
  "h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted transition-colors duration-200 focus:border-primary focus:outline-none";

export function PasswordFormDialog({
  initialData,
  onClose,
}: PasswordFormDialogProps) {
  const passwords = usePasswords();
  const isEditing = initialData !== null;

  const [site, setSite] = useState(initialData?.site ?? "");
  const [username, setUsername] = useState(initialData?.username ?? "");
  const [password, setPassword] = useState(initialData?.password ?? "");
  const [showPassword, setShowPassword] = useState(false);

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
              <div className="flex flex-col gap-2">
                <label htmlFor="site" className="text-sm font-medium text-foreground">
                  Site
                </label>
                <input
                  id="site"
                  type="text"
                  autoFocus
                  value={site}
                  onChange={(event) => setSite(event.target.value)}
                  placeholder="ex.: github.com"
                  required
                  className={inputClassName}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="username"
                  className="text-sm font-medium text-foreground"
                >
                  Usuário
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="ex.: usuario@email.com"
                  required
                  className={inputClassName}
                />
              </div>
            </>
          )}

          <div className="flex flex-col gap-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-foreground"
            >
              Senha
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                required
                autoFocus={isEditing}
                className={`${inputClassName} pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                className="absolute right-1 top-1 grid size-8 place-items-center rounded-lg text-muted transition-colors duration-200 hover:bg-hover hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
          </div>

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
