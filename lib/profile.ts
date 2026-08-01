"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export type Profile = {
  name: string;
  email: string;
};

export type ProfileState = {
  profile: Profile | null;
  loading: boolean;
  refresh: () => void;
};

export type VaultConfig = {
  salt: string;
  wrapped: string;
};

async function currentUserId(): Promise<string | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}

export async function fetchProfile(): Promise<Profile | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("name")
    .eq("id", user.id)
    .single();

  return {
    name: data?.name ?? user.user_metadata?.name ?? "",
    email: user.email ?? "",
  };
}

export async function fetchVaultConfig(): Promise<VaultConfig | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("salt, wrapped_key")
    .eq("id", user.id)
    .single();

  if (!data?.salt || !data.wrapped_key) return null;

  return { salt: data.salt, wrapped: data.wrapped_key };
}

export function useProfile(): ProfileState {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [version, setVersion] = useState(0);

  const refresh = useCallback(() => setVersion((v) => v + 1), []);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const next = await fetchProfile();
      if (!cancelled) {
        setProfile(next);
        setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [version]);

  return { profile, loading, refresh };
}

export async function updateProfileName(name: string): Promise<void> {
  const id = await currentUserId();
  if (!id) throw new Error("Sessão expirada. Entre novamente.");

  const supabase = createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ name })
    .eq("id", id);

  if (error) throw new Error(error.message);
}

export async function updateVaultWrappedKey(wrapped: string): Promise<void> {
  const id = await currentUserId();
  if (!id) throw new Error("Sessão expirada. Entre novamente.");

  const supabase = createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ wrapped_key: wrapped })
    .eq("id", id);

  if (error) throw new Error(error.message);
}

export async function saveVaultConfig(config: VaultConfig): Promise<void> {
  const id = await currentUserId();
  if (!id) throw new Error("Sessão expirada. Entre novamente.");

  const supabase = createClient();
  const { error } = await supabase
    .from("profiles")
    .upsert({ id, salt: config.salt, wrapped_key: config.wrapped });

  if (error) throw new Error(error.message);
}
