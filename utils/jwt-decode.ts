// Função simples para decodificar um token JWT
export function jwtDecode(token: string): any {
  try {
    // O token JWT tem três partes separadas por pontos: header.payload.signature
    // Precisamos da segunda parte (payload)
    const base64Url = token.split(".")[1]
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    )

    return JSON.parse(jsonPayload)
  } catch (error) {
    return null
  }
}

// Mantendo a função original para compatibilidade com código existente
export function decodeJwt(token: string): any {
  return jwtDecode(token)
}
