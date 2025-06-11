const getApiHost = (): string => {
  const link = process.env.NEXT_PUBLIC_API_HOST
  return link || "https://doctorgrace-backend.gd7bpp95693yp.us-east-1.cs.amazonlightsail.com"
}

export const HostService = {
  getApiHost,
}
