"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Upload } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"

interface ImageAnalysisProps {
  title: string
  description: string
  endpoint: string
  imageType: string
}

export function ImageAnalysis({ title, description, endpoint, imageType }: ImageAnalysisProps) {
  const [imageUrl, setImageUrl] = useState("")
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!imageUrl) return

    await analyzeImage(imageUrl)
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // In a real app, you would upload this to a storage service and get a URL
    // For demo purposes, we'll create a local object URL
    const objectUrl = URL.createObjectURL(file)
    setUploadedImage(objectUrl)

    // In a real app, you would use the URL from your storage service
    // For this demo, we'll just use the object URL (this wouldn't work in production)
    await analyzeImage(objectUrl)
  }

  const analyzeImage = async (url: string) => {
    setIsAnalyzing(true)
    setResult(null)
    setError(null)

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageUrl: url }),
      })

      const data = await response.json()

      if (data.hasError || !response.ok) {
        setError(data.error || "Falha ao analisar imagem")
      } else {
        setResult(data.data?.analysisResponse || "Análise concluída com sucesso")
      }
    } catch (err) {
      setError("Ocorreu um erro durante a análise da imagem")
      console.error(err)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>

      <Tabs defaultValue="url" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="url">URL da Imagem</TabsTrigger>
          <TabsTrigger value="upload">Carregar Imagem</TabsTrigger>
        </TabsList>

        <TabsContent value="url" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleUrlSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="image-url">URL da Imagem</Label>
                  <Input
                    id="image-url"
                    placeholder="https://exemplo.com/imagem.jpg"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" disabled={isAnalyzing || !imageUrl} className="bg-primary hover:bg-primary/90">
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analisando...
                    </>
                  ) : (
                    "Analisar Imagem"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="image-upload">Carregar Imagem</Label>
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="image-upload"
                      className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-muted/40 hover:bg-muted hover:border-primary/50 transition-colors"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-4 text-primary" />
                        <p className="mb-2 text-sm text-muted-foreground">
                          <span className="font-semibold">Clique para carregar</span> ou arraste e solte
                        </p>
                        <p className="text-xs text-muted-foreground">PNG, JPG ou DICOM (MAX. 10MB)</p>
                      </div>
                      <Input
                        id="image-upload"
                        type="file"
                        accept="image/*,.dcm"
                        className="hidden"
                        onChange={handleFileUpload}
                        disabled={isAnalyzing}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {uploadedImage && (
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="relative aspect-video w-full">
              <Image
                src={uploadedImage || "/placeholder.svg"}
                alt={`Imagem ${imageType} carregada`}
                fill
                className="object-contain"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-2 text-primary">Resultados da Análise</h3>
            <Textarea readOnly value={result} className="min-h-[200px] font-mono text-sm" />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
