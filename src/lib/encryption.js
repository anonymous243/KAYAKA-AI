/**
 * Client-side E2E Encryption Layer
 * Uses Web Crypto API for AES-256-GCM encryption
 * Sensitive data is encrypted before being sent to the server
 */

const ENCRYPTION_KEY_STORAGE = 'kayaka_encryption_key';

// Generate a secure encryption key
export function generateEncryptionKey() {
  const key = crypto.getRandomValues(new Uint8Array(32));
  return btoa(String.fromCharCode(...key));
}

// Get or create encryption key from localStorage
export function getOrCreateEncryptionKey() {
  let key = localStorage.getItem(ENCRYPTION_KEY_STORAGE);
  if (!key) {
    key = generateEncryptionKey();
    localStorage.setItem(ENCRYPTION_KEY_STORAGE, key);
  }
  return key;
}

// Convert base64 key to CryptoKey
async function getCryptoKey(key) {
  const keyData = Uint8Array.from(atob(key), c => c.charCodeAt(0));
  return await crypto.subtle.importKey(
    'raw',
    keyData,
    'AES-GCM',
    false,
    ['encrypt', 'decrypt']
  );
}

// Encrypt data
export async function encryptData(data) {
  const key = getOrCreateEncryptionKey();
  const cryptoKey = await getCryptoKey(key);
  
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(JSON.stringify(data));
  
  const iv = crypto.getRandomValues(new Uint8Array(12));
  
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    cryptoKey,
    dataBuffer
  );
  
  const result = new Uint8Array(iv.length + encrypted.byteLength);
  result.set(iv);
  result.set(new Uint8Array(encrypted), iv.length);
  
  return btoa(String.fromCharCode(...result));
}

// Decrypt data
export async function decryptData(encryptedBase64) {
  const key = getOrCreateEncryptionKey();
  const cryptoKey = await getCryptoKey(key);
  
  const data = Uint8Array.from(atob(encryptedBase64), c => c.charCodeAt(0));
  const iv = data.slice(0, 12);
  const ciphertext = data.slice(12);
  
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    cryptoKey,
    ciphertext
  );
  
  const decoder = new TextDecoder();
  return JSON.parse(decoder.decode(decrypted));
}

// Encrypt sensitive string data
export async function encryptString(text) {
  const key = getOrCreateEncryptionKey();
  const cryptoKey = await getCryptoKey(key);
  
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(text);
  
  const iv = crypto.getRandomValues(new Uint8Array(12));
  
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    cryptoKey,
    dataBuffer
  );
  
  const result = new Uint8Array(iv.length + encrypted.byteLength);
  result.set(iv);
  result.set(new Uint8Array(encrypted), iv.length);
  
  return btoa(String.fromCharCode(...result));
}

// Decrypt sensitive string data
export async function decryptString(encryptedBase64) {
  const key = getOrCreateEncryptionKey();
  const cryptoKey = await getCryptoKey(key);
  
  const data = Uint8Array.from(atob(encryptedBase64), c => c.charCodeAt(0));
  const iv = data.slice(0, 12);
  const ciphertext = data.slice(12);
  
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    cryptoKey,
    ciphertext
  );
  
  const decoder = new TextDecoder();
  return decoder.decode(decrypted);
}
