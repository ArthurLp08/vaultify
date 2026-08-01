"use client";

import { LogOut } from "lucide-react";
import { SettingsSection } from "./settings-section";

export function SessionSection() {
  return (
    <SettingsSection
      title="Sessão"
      description="Gerencie o acesso à sua conta."
    >
      <button
        type="button"
        className="flex items-center gap-2 rounded-lg border border-red-500/40 px-4 py-2 text-sm font-medium text-red-400 transition-colors duration-200 hover:bg-red-500/10"
      >
        <LogOut className="size-4" />
        Sair da conta
      </button>
    </SettingsSection>
  );
}
