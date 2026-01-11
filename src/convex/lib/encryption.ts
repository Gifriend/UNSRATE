const ENCRYPTION_KEY = "unsrate-default-key-2026";

function getKeyBytes(key: string): number[] {
  const bytes: number[] = [];
  for (let i = 0; i < key.length; i++) {
    bytes.push(key.charCodeAt(i));
  }
  return bytes;
}

function uint8ArrayToBase64(bytes: number[]): string {
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
}

function base64ToUint8Array(base64: string): number[] {
  const binary = atob(base64);
  const bytes: number[] = [];
  for (let i = 0; i < binary.length; i++) {
    bytes.push(binary.charCodeAt(i));
  }
  return bytes;
}

export function encrypt(text: string): string {
  if (!text) return "";
  
  const keyBytes = getKeyBytes(ENCRYPTION_KEY);
  const textBytes: number[] = [];
  
  for (let i = 0; i < text.length; i++) {
    textBytes.push(text.charCodeAt(i));
  }
  
  const encrypted: number[] = [];
  for (let i = 0; i < textBytes.length; i++) {
    encrypted.push(textBytes[i] ^ keyBytes[i % keyBytes.length]);
  }
  
  return uint8ArrayToBase64(encrypted);
}

export function decrypt(encryptedText: string): string {
  if (!encryptedText) return "";
  
  try {
    const keyBytes = getKeyBytes(ENCRYPTION_KEY);
    const encryptedBytes = base64ToUint8Array(encryptedText);
    
    const decrypted: number[] = [];
    for (let i = 0; i < encryptedBytes.length; i++) {
      decrypted.push(encryptedBytes[i] ^ keyBytes[i % keyBytes.length]);
    }
    
    return String.fromCharCode(...decrypted);
  } catch {
    return "[Pesan tidak dapat dibaca]";
  }
}

export function encryptPreview(text: string, maxLength: number = 50): string {
  const preview = text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  return encrypt(preview);
}
