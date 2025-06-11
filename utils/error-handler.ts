/**
 * Utility function to handle error messages from the API
 * It will only translate known error keys that are part of our i18n system
 * Otherwise, it will display the error message directly from the API
 */
export function handleErrorMessage(
  errorMessage: string,
  translate: (key: string) => string,
  knownErrorKeys: string[] = [],
): string {
  // Default known error keys that should be translated
  const defaultKnownErrorKeys = [
    "invalid_credentials",
    "server_error",
    "user_not_found",
    "error_checking_application_access",
    "error_creating_user",
    "invalid_verification_code",
    "invalid_token",
    "invalid_current_password",
    "send_email_error",
    "send_sms_error",
    "change_email_error",
    "change_phone_error",
    "update_user_error",
  ]

  // Combine default and custom known error keys
  const allKnownErrorKeys = [...defaultKnownErrorKeys, ...knownErrorKeys]

  // If the error message is a known key, translate it
  // Otherwise, return the error message directly
  return allKnownErrorKeys.includes(errorMessage) ? translate(errorMessage) : errorMessage
}
