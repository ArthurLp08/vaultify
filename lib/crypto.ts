const PBKDF2_ITERATIONS = 310_000;
const SALT_BYTES = 16;
const IV_BYTES = 12;
const DEK_BYTES = 32;

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export function toBase64(bytes: Uint8Array<ArrayBuffer>): string {
  let binary = "";
  bytes.forEach((byte) => (binary += String.fromCharCode(byte)));
  return btoa(binary);
}

export function fromBase64(value: string): Uint8Array<ArrayBuffer> {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function randomBytes(length: number): Uint8Array<ArrayBuffer> {
  return crypto.getRandomValues(new Uint8Array(length));
}

async function deriveKek(
  password: string,
  salt: Uint8Array<ArrayBuffer>
): Promise<CryptoKey> {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveKey"]
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: PBKDF2_ITERATIONS,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

function importDek(raw: Uint8Array<ArrayBuffer>): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    raw,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
}

async function encryptBytes(
  key: CryptoKey,
  data: Uint8Array<ArrayBuffer>
): Promise<Uint8Array<ArrayBuffer>> {
  const iv = randomBytes(IV_BYTES);
  const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, data);
  const combined = new Uint8Array(iv.length + ciphertext.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(ciphertext), iv.length);
  return combined;
}

async function decryptBytes(
  key: CryptoKey,
  combined: Uint8Array<ArrayBuffer>
): Promise<Uint8Array<ArrayBuffer>> {
  const iv = combined.slice(0, IV_BYTES);
  const data = combined.slice(IV_BYTES);
  const plaintext = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, data);
  return new Uint8Array(plaintext);
}

export type VaultKey = {
  dek: CryptoKey;
  salt: string;
  wrapped: string;
};

export async function createVaultKey(password: string): Promise<VaultKey> {
  const salt = randomBytes(SALT_BYTES);
  const kek = await deriveKek(password, salt);
  const rawDek = randomBytes(DEK_BYTES);
  const dek = await importDek(rawDek);
  const wrapped = await encryptBytes(kek, rawDek);
  return { dek, salt: toBase64(salt), wrapped: toBase64(wrapped) };
}

export async function unlockVaultKey(
  password: string,
  salt: string,
  wrapped: string
): Promise<CryptoKey> {
  const kek = await deriveKek(password, fromBase64(salt));
  const rawDek = await decryptBytes(kek, fromBase64(wrapped));
  return importDek(rawDek);
}

export function exportVaultKey(key: CryptoKey): Promise<string> {
  return crypto.subtle.exportKey("raw", key).then((raw) => toBase64(new Uint8Array(raw)));
}

export function importVaultKey(encoded: string): Promise<CryptoKey> {
  return importDek(fromBase64(encoded));
}

export async function encryptSecret(dek: CryptoKey, plaintext: string): Promise<string> {
  const combined = await encryptBytes(dek, encoder.encode(plaintext));
  return toBase64(combined);
}

export async function decryptSecret(dek: CryptoKey, value: string): Promise<string> {
  const plaintext = await decryptBytes(dek, fromBase64(value));
  return decoder.decode(plaintext);
}

function bytesEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.byteLength !== b.byteLength) return false;
  for (let i = 0; i < a.byteLength; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

export async function verifyVaultPassword(
  password: string,
  salt: string,
  wrapped: string,
  currentKey: CryptoKey
): Promise<boolean> {
  try {
    const kek = await deriveKek(password, fromBase64(salt));
    const raw = await decryptBytes(kek, fromBase64(wrapped));
    const currentRaw = new Uint8Array(
      await crypto.subtle.exportKey("raw", currentKey)
    );
    return bytesEqual(raw, currentRaw);
  } catch {
    return false;
  }
}

export async function rewrapVaultKey(
  key: CryptoKey,
  newPassword: string,
  salt: string
): Promise<string> {
  const kek = await deriveKek(newPassword, fromBase64(salt));
  const raw = new Uint8Array(await crypto.subtle.exportKey("raw", key));
  const wrapped = await encryptBytes(kek, raw);
  return toBase64(wrapped);
}
