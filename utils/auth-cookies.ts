import Cookies from "js-cookie"
import { encrypt, decrypt } from "./crypto"

// Constants for cookie names and options
const ACCESS_TOKEN_COOKIE_NAME = "auth_access_token"
const REFRESH_TOKEN_COOKIE_NAME = "auth_refresh_token"
const COOKIE_OPTIONS = {
  expires: 7, // 7 days
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
}

// Store access token in an encrypted cookie
export const setAccessToken = (token: string): void => {
  // Encrypt the token before storing it
  const encryptedToken = encrypt(token)
  Cookies.set(ACCESS_TOKEN_COOKIE_NAME, encryptedToken, COOKIE_OPTIONS)
}

// Store refresh token in an encrypted cookie
export const setRefreshToken = (token: string): void => {
  // Encrypt the token before storing it
  const encryptedToken = encrypt(token)
  Cookies.set(REFRESH_TOKEN_COOKIE_NAME, encryptedToken, COOKIE_OPTIONS)
}

// Set both tokens at once
export const setAuthTokens = (accessToken: string, refreshToken: string): void => {
  setAccessToken(accessToken)
  setRefreshToken(refreshToken)
}

// Get access token from cookie and decrypt it
export const getAccessToken = (): string | null => {
  const encryptedToken = Cookies.get(ACCESS_TOKEN_COOKIE_NAME)
  if (!encryptedToken) return null

  try {
    return decrypt(encryptedToken)
  } catch (error) {
    // If decryption fails, clear the cookie
    removeAccessToken()
    return null
  }
}

// Get refresh token from cookie and decrypt it
export const getRefreshToken = (): string | null => {
  const encryptedToken = Cookies.get(REFRESH_TOKEN_COOKIE_NAME)
  if (!encryptedToken) return null

  try {
    return decrypt(encryptedToken)
  } catch (error) {
    // If decryption fails, clear the cookie
    removeRefreshToken()
    return null
  }
}

// Get both tokens
export const getAuthCookies = (): { accessToken: string | null; refreshToken: string | null } => {
  return {
    accessToken: getAccessToken(),
    refreshToken: getRefreshToken(),
  }
}

// Remove access token cookie
export const removeAccessToken = (): void => {
  Cookies.remove(ACCESS_TOKEN_COOKIE_NAME, { path: "/" })
}

// Remove refresh token cookie
export const removeRefreshToken = (): void => {
  Cookies.remove(REFRESH_TOKEN_COOKIE_NAME, { path: "/" })
}

// Remove all auth cookies
export const clearAuthCookies = (): void => {
  removeAccessToken()
  removeRefreshToken()
}

// For backward compatibility
export const setAuthToken = setAccessToken
export const getAuthToken = getAccessToken
export const removeAuthToken = removeAccessToken
