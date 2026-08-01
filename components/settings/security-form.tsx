"use client";

import { useState } from "react";
import { Button } from "@/components/button/button";
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
          variant="card"
          value={currentPassword}
          onChange={(event) => setCurrentPassword(event.target.value)}
          required
        />
        <Input
          label="Nova senha"
          type="password"
          variant="card"
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
          required
        />
        <Input
          label="Confirmar nova senha"
          type="password"
          variant="card"
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
          <Button type="submit">Alterar senha</Button>
        </div>
      </form>
    </SettingsSection>
  );
}
