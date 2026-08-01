"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/button/button";
import { PasswordInput } from "@/components/password-input/password-input";
import { SettingsSection } from "./settings-section";
import { rewrapVaultKey, verifyVaultPassword } from "@/lib/crypto";
import { getErrorMessage } from "@/lib/errors";
import { fetchVaultConfig, updateVaultWrappedKey } from "@/lib/profile";
import { createClient } from "@/lib/supabase/client";
import { getVaultKey } from "@/lib/vault-key";

type Message = {
  type: "error" | "success";
  text: string;
} | null;

export function SecurityForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<Message>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "As senhas não coincidem." });
      setSubmitting(false);
      return;
    }

    const dek = getVaultKey();
    if (!dek) {
      setMessage({
        type: "error",
        text: "Cofre bloqueado. Entre novamente para continuar.",
      });
      setSubmitting(false);
      return;
    }

    const supabase = createClient();

    try {
      const config = await fetchVaultConfig();
      if (!config) {
        throw new Error("Cofre não configurado para esta conta.");
      }

      const currentPasswordValid = await verifyVaultPassword(
        currentPassword,
        config.salt,
        config.wrapped,
        dek
      );
      if (!currentPasswordValid) {
        throw new Error("Senha atual incorreta.");
      }

      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw new Error(error.message);

      const wrapped = await rewrapVaultKey(dek, newPassword, config.salt);
      await updateVaultWrappedKey(wrapped);

      setMessage({ type: "success", text: "Senha alterada com sucesso." });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Password change error:", error);
      setMessage({ type: "error", text: getErrorMessage(error) });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SettingsSection
      title="Segurança"
      description="Gerencie a senha da sua conta."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <PasswordInput
          label="Senha atual"
          value={currentPassword}
          onChange={(event) => setCurrentPassword(event.target.value)}
          required
        />
        <PasswordInput
          label="Nova senha"
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
          required
        />
        <PasswordInput
          label="Confirmar nova senha"
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
          <Button type="submit" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Alterando...
              </>
            ) : (
              "Alterar senha"
            )}
          </Button>
        </div>
      </form>
    </SettingsSection>
  );
}
