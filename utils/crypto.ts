// Simple encryption/decryption for client-side
// Note: This is not as secure as server-side httpOnly cookies,
// but it's better than plain localStorage

const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || "default-encryption-key-change-in-production"

export function encrypt(text: string): string {
  // Simple XOR encryption with the key
  let result = ""
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length)
    result += String.fromCharCode(charCode)
  }
  return btoa(result) // Base64 encode
}

export function decrypt(encryptedText: string): string {
  try {
    const text = atob(encryptedText) // Base64 decode
    let result = ""
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length)
      result += String.fromCharCode(charCode)
    }
    return result
  } catch (error) {
    throw error
  }
}
