"use client";

import { useCallback, useEffect, useState } from "react";
import { decryptSecret, encryptSecret } from "@/lib/crypto";
import { createClient } from "@/lib/supabase/client";
import { getVaultKey } from "@/lib/vault-key";

export type PasswordItem = {
  id: string;
  site: string;
  username: string;
  password: string;
};

export type PasswordState = {
  passwords: PasswordItem[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
};

type PasswordRow = {
  id: string;
  site: string;
  enc_username: string;
  enc_password: string;
};

function vaultLockedError(): Error {
  return new Error("Cofre bloqueado. Entre novamente para continuar.");
}

const changeListeners = new Set<() => void>();

function subscribePasswordsChange(listener: () => void): () => void {
  changeListeners.add(listener);
  return () => {
    changeListeners.delete(listener);
  };
}

function notifyPasswordsChange() {
  changeListeners.forEach((listener) => listener());
}

export function usePasswords(): PasswordState {
  const [passwords, setPasswords] = useState<PasswordItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  const refresh = useCallback(() => setVersion((v) => v + 1), []);

  useEffect(
    () => subscribePasswordsChange(() => setVersion((v) => v + 1)),
    []
  );

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const dek = getVaultKey();
      if (!dek) {
        if (!cancelled) {
          setPasswords([]);
          setError("Cofre bloqueado. Entre novamente para continuar.");
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      setError(null);

      const supabase = createClient();
      const { data, error: queryError } = await supabase
        .from("passwords")
        .select("id, site, enc_username, enc_password");

      if (cancelled) return;

      if (queryError) {
        setPasswords([]);
        setError(queryError.message);
        setLoading(false);
        return;
      }

      try {
        const rows = (data as PasswordRow[] | null) ?? [];
        const decrypted = await Promise.all(
          rows.map(async (row) => ({
            id: row.id,
            site: row.site,
            username: await decryptSecret(dek, row.enc_username),
            password: await decryptSecret(dek, row.enc_password),
          }))
        );

        if (!cancelled) {
          setPasswords(decrypted);
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setPasswords([]);
          setError("Falha ao descriptografar seus dados.");
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [version]);

  return { passwords, loading, error, refresh };
}

type PasswordInput = {
  site: string;
  username: string;
  password: string;
};

export async function createPassword(input: PasswordInput): Promise<void> {
  const dek = getVaultKey();
  if (!dek) throw vaultLockedError();

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Sessão expirada. Entre novamente.");

  const { error } = await supabase.from("passwords").insert({
    user_id: user.id,
    site: input.site,
    enc_username: await encryptSecret(dek, input.username),
    enc_password: await encryptSecret(dek, input.password),
  });

  if (error) throw new Error(error.message);

  notifyPasswordsChange();
}

export async function updatePassword(
  id: string,
  input: PasswordInput
): Promise<void> {
  const dek = getVaultKey();
  if (!dek) throw vaultLockedError();

  const supabase = createClient();
  const { error } = await supabase
    .from("passwords")
    .update({
      site: input.site,
      enc_username: await encryptSecret(dek, input.username),
      enc_password: await encryptSecret(dek, input.password),
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  notifyPasswordsChange();
}

export async function deletePassword(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("passwords").delete().eq("id", id);

  if (error) throw new Error(error.message);

  notifyPasswordsChange();
}
