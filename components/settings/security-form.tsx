"use client";

import { useState } from "react";
import { Input } from "@/components/input/input";
import { SettingsSection } from "./settings-section";

type Message = {
  type: "error" | "success";
  text: string;
} | null;

export function SecurityForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<Message>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "As senhas não coincidem." });
      return;
    }

    setMessage({ type: "success", text: "Senha alterada com sucesso." });
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <SettingsSection
      title="Segurança"
      description="Gerencie a senha da sua conta."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Senha atual"
          type="password"
          value={currentPassword}
          onChange={(event) => setCurrentPassword(event.target.value)}
          required
        />
        <Input
          label="Nova senha"
          type="password"
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
          required
        />
        <Input
          label="Confirmar nova senha"
          type="password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          required
        />

        {message && (
          <p
            className={
              message.type === "error"
                ? "text-sm text-red-400"
                : "text-sm text-primary"
            }
          >
            {message.text}
          </p>
        )}

        <div>
          <button
            type="submit"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-background transition-colors duration-200 hover:bg-primary/90"
          >
            Alterar senha
          </button>
        </div>
      </form>
    </SettingsSection>
  );
}
