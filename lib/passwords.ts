import { useSyncExternalStore } from "react";

export type PasswordItem = {
  id: string;
  site: string;
  username: string;
  password: string;
};

export const MOCK_PASSWORDS: PasswordItem[] = [
  {
    id: "1",
    site: "GitHub",
    username: "octocat",
    password: "ghp_8xK2a1QzT",
  },
  {
    id: "2",
    site: "Google",
    username: "ana.silva@gmail.com",
    password: "Gr4v4t4r!2026",
  },
  {
    id: "3",
    site: "Netflix",
    username: "ana.silva@gmail.com",
    password: "Sr1nhaNetfL1x#9",
  },
  {
    id: "4",
    site: "Spotify",
    username: "anasilva",
    password: "M1nhaMus1ca@7",
  },
  {
    id: "5",
    site: "Amazon",
    username: "ana.silva@gmail.com",
    password: "Compr4s!AmaZon$2",
  },
  {
    id: "6",
    site: "Discord",
    username: "ana_silva",
    password: "D1scord!2026",
  },
];

const STORAGE_KEY = "vaultify-passwords";

function readStoredPasswords(): PasswordItem[] {
  const stored = localStorage.getItem(STORAGE_KEY);

  if (stored === null) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_PASSWORDS));
    return MOCK_PASSWORDS;
  }

  try {
    return JSON.parse(stored) as PasswordItem[];
  } catch {
    return MOCK_PASSWORDS;
  }
}

let cache: PasswordItem[] =
  typeof window === "undefined" ? MOCK_PASSWORDS : readStoredPasswords();

const listeners = new Set<() => void>();

function emitChange() {
  listeners.forEach((listener) => listener());
}

export function subscribePasswords(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getPasswords(): PasswordItem[] {
  return cache;
}

export function usePasswords(): PasswordItem[] {
  return useSyncExternalStore(
    subscribePasswords,
    getPasswords,
    () => MOCK_PASSWORDS
  );
}

export function savePasswords(passwords: PasswordItem[]): void {
  cache = passwords;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(passwords));
  emitChange();
}
