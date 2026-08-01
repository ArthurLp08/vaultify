"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/button/button";
import { SettingsSection } from "./settings-section";

export function SessionSection() {
  const router = useRouter();

  return (
    <SettingsSection
      title="Sessão"
      description="Gerencie o acesso à sua conta."
    >
      <Button variant="danger" onClick={() => router.push("/login")}>
        <LogOut className="size-4" />
        Sair da conta
      </Button>
    </SettingsSection>
  );
}
