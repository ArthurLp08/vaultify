"use client";

import { useEffect, useState } from "react";
import { restoreVaultKey } from "@/lib/vault-key";

export function VaultProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    restoreVaultKey().finally(() => setReady(true));
  }, []);

  if (!ready) return null;

  return <>{children}</>;
}
