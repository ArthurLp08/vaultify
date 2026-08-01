"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/button/button";
import { Input } from "@/components/input/input";
import { SettingsSection } from "./settings-section";
import { updateProfile, useProfile } from "@/lib/profile";

export function ProfileForm() {
  const profile = useProfile();
  const [name, setName] = useState(profile.name);
  const [lastProfileName, setLastProfileName] = useState(profile.name);
  const [saved, setSaved] = useState(false);

  if (profile.name !== lastProfileName) {
    setLastProfileName(profile.name);
    setName(profile.name);
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateProfile({ ...profile, name });
    setSaved(true);
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
        />
        <Input label="E-mail" variant="card" value={profile.email} readOnly />

        <div className="flex items-center gap-3">
          <Button type="submit">Salvar alterações</Button>
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
