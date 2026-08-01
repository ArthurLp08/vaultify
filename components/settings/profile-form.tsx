"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/button/button";
import { Input } from "@/components/input/input";
import { SettingsSection } from "./settings-section";
import { getErrorMessage } from "@/lib/errors";
import { updateProfileName, useProfile } from "@/lib/profile";

export function ProfileForm() {
  const { profile, loading, refresh } = useProfile();
  const [name, setName] = useState("");
  const [lastProfileName, setLastProfileName] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (profile && profile.name !== lastProfileName) {
    setLastProfileName(profile.name);
    setName(profile.name);
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!profile) return;

    setSubmitting(true);
    setSaved(false);
    setError(null);

    try {
      await updateProfileName(name);
      refresh();
      setSaved(true);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SettingsSection
      title="Perfil"
      description="Atualize suas informações pessoais."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Nome"
          variant="card"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            setSaved(false);
          }}
          placeholder="Seu nome"
          disabled={loading}
        />
        <Input
          label="E-mail"
          variant="card"
          value={profile?.email ?? ""}
          readOnly
        />

        {error && <p className="text-sm text-red-400">{error}</p>}

        <div className="flex items-center gap-3">
          <Button
            type="submit"
            disabled={submitting || loading || !profile}
          >
            {submitting ? "Salvando..." : "Salvar alterações"}
          </Button>
          {saved && (
            <span className="flex items-center gap-1.5 text-sm text-muted">
              <Check className="size-4 text-primary" />
              Alterações salvas
            </span>
          )}
        </div>
      </form>
    </SettingsSection>
  );
}
