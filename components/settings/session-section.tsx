"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, LogOut } from "lucide-react";
import { Button } from "@/components/button/button";
import { createClient } from "@/lib/supabase/client";
import { clearVaultKey } from "@/lib/vault-key";
import { SettingsSection } from "./settings-section";

export function SessionSection() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const handleSignOut = async () => {
    setSubmitting(true);

    const supabase = createClient();
    await supabase.auth.signOut();
    clearVaultKey();

    router.push("/login");
    router.refresh();
  };

  return (
    <SettingsSection
      title="Sessão"
      description="Gerencie o acesso à sua conta."
    >
      <Button
        variant="danger"
        onClick={handleSignOut}
        disabled={submitting}
      >
        {submitting ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <LogOut className="size-4" />
        )}
        Sair da conta
      </Button>
    </SettingsSection>
  );
}
