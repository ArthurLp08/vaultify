import { useSyncExternalStore } from "react";

export type Profile = {
  name: string;
  email: string;
};

const DEFAULT_PROFILE: Profile = {
  name: "Guest User",
  email: "guest@vaultify.dev",
};

const STORAGE_KEY = "vaultify-profile";

function readStoredProfile(): Profile {
  const stored = localStorage.getItem(STORAGE_KEY);

  if (stored === null) {
    return DEFAULT_PROFILE;
  }

  try {
    return { ...DEFAULT_PROFILE, ...JSON.parse(stored) };
  } catch {
    return DEFAULT_PROFILE;
  }
}

let cache: Profile =
  typeof window === "undefined" ? DEFAULT_PROFILE : readStoredProfile();

const listeners = new Set<() => void>();

function emitChange() {
  listeners.forEach((listener) => listener());
}

export function subscribeProfile(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getProfile(): Profile {
  return cache;
}

export function useProfile(): Profile {
  return useSyncExternalStore(
    subscribeProfile,
    getProfile,
    () => DEFAULT_PROFILE
  );
}

export function updateProfile(profile: Profile): void {
  cache = profile;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  emitChange();
}
