import Head from "next/head"

interface HeadMetatagsProps {
  title?: string
  description?: string
  image?: string
  url?: string
}

export default function HeadMetatags({
  title = "Doctor Grace - Análise de Imagens Médicas",
  description = "Plataforma avançada de análise de imagens médicas para profissionais de saúde",
  image = "/placeholder.svg?height=1200&width=630",
  url = "https://doctorgrace.example.com",
}: HeadMetatagsProps) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Head>
  )
}
