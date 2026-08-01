import { useSyncExternalStore } from "react";
import { exportVaultKey, importVaultKey } from "@/lib/crypto";

const STORAGE_KEY = "vaultify-dek";

let dek: CryptoKey | null = null;

const listeners = new Set<() => void>();

function emitChange() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getVaultKey(): CryptoKey | null {
  return dek;
}

export function useVaultKey(): CryptoKey | null {
  return useSyncExternalStore(subscribe, getVaultKey, () => null);
}

export async function storeVaultKey(key: CryptoKey): Promise<void> {
  dek = key;
  if (typeof window !== "undefined") {
    sessionStorage.setItem(STORAGE_KEY, await exportVaultKey(key));
  }
  emitChange();
}

export async function restoreVaultKey(): Promise<CryptoKey | null> {
  if (dek) return dek;
  if (typeof window === "undefined") return null;

  const encoded = sessionStorage.getItem(STORAGE_KEY);
  if (!encoded) return null;

  try {
    dek = await importVaultKey(encoded);
    emitChange();
    return dek;
  } catch {
    sessionStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function clearVaultKey(): void {
  dek = null;
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(STORAGE_KEY);
  }
  emitChange();
}
