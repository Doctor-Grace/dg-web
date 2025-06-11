"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useLanguage } from "@/hooks/use-language"
import { Camera, Upload, X, ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileAttachmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAttach: (files: File[], examType: string, examReason: string) => void
}

export function FileAttachmentDialog({ open, onOpenChange, onAttach }: FileAttachmentDialogProps) {
  const { t } = useLanguage()
  const { toast } = useToast()
  const [examType, setExamType] = useState<string>("")
  const [examReason, setExamReason] = useState<string>("")
  const [files, setFiles] = useState<File[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [activeTab, setActiveTab] = useState<string>("upload")
  const [cameraError, setCameraError] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null)
  const [isCameraActive, setIsCameraActive] = useState(false)

  const handleExamTypeChange = (value: string) => {
    setExamType(value)
  }

  const handleExamReasonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setExamReason(e.target.value)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFiles = Array.from(e.dataTransfer.files)
    handleFiles(droppedFiles)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      handleFiles(selectedFiles)
    }
  }

  const handleFiles = (selectedFiles: File[]) => {
    // Filtrar apenas imagens
    const imageFiles = selectedFiles.filter((file) => file.type.startsWith("image/"))

    // Verificar se há mais de 10 imagens
    if (files.length + imageFiles.length > 10) {
      toast({
        title: "Muitas imagens",
        description: "Você pode anexar no máximo 10 imagens",
        variant: "destructive",
      })
      return
    }

    setFiles((prevFiles) => [...prevFiles, ...imageFiles])
  }

  const removeFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index))
  }

  const handleSubmit = () => {
    if (!examType) {
      toast({
        title: "Tipo de exame não selecionado",
        description: "Selecione o tipo de exame",
        variant: "destructive",
      })
      return
    }

    if (files.length === 0) {
      toast({
        title: "Nenhuma imagem selecionada",
        description: "Anexe pelo menos uma imagem",
        variant: "destructive",
      })
      return
    }

    onAttach(files, examType, examReason)
    handleClose()
  }

  const handleClose = () => {
    stopCamera()
    setFiles([])
    setExamType("")
    setExamReason("")
    setActiveTab("upload")
    onOpenChange(false)
  }

  const startCamera = async () => {
    try {
      // Limpar qualquer erro anterior
      setCameraError(null)

      // Verificar se o navegador suporta getUserMedia
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError("Seu navegador não suporta acesso à câmera")
        return
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }

      setCameraStream(stream)
      setIsCameraActive(true)
    } catch (error) {
      console.error("Error accessing camera:", error)

      // Tratamento específico para diferentes tipos de erro
      if (error instanceof DOMException) {
        if (error.name === "NotAllowedError") {
          setCameraError("Permissão para acessar a câmera foi negada. Verifique as configurações do seu navegador.")
        } else if (error.name === "NotFoundError") {
          setCameraError("Nenhuma câmera foi encontrada no dispositivo.")
        } else {
          setCameraError(`Erro ao acessar a câmera: ${error.message}`)
        }
      } else {
        setCameraError("Ocorreu um erro ao tentar acessar a câmera")
      }

      setIsCameraActive(false)
    }
  }

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop())
      setCameraStream(null)
      setIsCameraActive(false)
    }
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext("2d")

      if (context) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context.drawImage(video, 0, 0, canvas.width, canvas.height)

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const file = new File([blob], `camera-capture-${Date.now()}.jpg`, { type: "image/jpeg" })
              handleFiles([file])
            }
          },
          "image/jpeg",
          0.95,
        )
      }
    }
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    setCameraError(null)

    if (value === "camera") {
      startCamera()
    } else {
      stopCamera()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Anexar Imagens de Exame</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 my-4">
          <div className="space-y-2">
            <label htmlFor="exam-type" className="text-sm font-medium">
              Tipo de Exame
            </label>
            <Select value={examType} onValueChange={handleExamTypeChange}>
              <SelectTrigger id="exam-type" className="w-full">
                <SelectValue placeholder="Selecione o tipo de exame" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="xray">Raio-X</SelectItem>
                <SelectItem value="mri">Ressonância Magnética</SelectItem>
                <SelectItem value="ct">Tomografia</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="exam-reason" className="text-sm font-medium">
              Motivo do Exame
            </label>
            <Textarea
              id="exam-reason"
              placeholder="Descreva o motivo do exame"
              value={examReason}
              onChange={handleExamReasonChange}
              className="resize-none"
              rows={3}
            />
          </div>

          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">Upload</TabsTrigger>
              <TabsTrigger value="camera">Câmera</TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="mt-4">
              <div
                className={cn(
                  "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
                  isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/20 hover:border-primary/50",
                  "cursor-pointer relative",
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <div className="flex flex-col items-center justify-center gap-2">
                  <Upload className="h-10 w-10 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Arraste e solte ou <span className="text-primary font-medium">procure</span>
                  </p>
                  <p className="text-xs text-muted-foreground">Formatos suportados: JPG, PNG, GIF</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="camera" className="mt-4">
              <div className="flex flex-col items-center space-y-4">
                {cameraError ? (
                  <div className="w-full p-4 bg-red-50 border border-red-200 rounded-lg text-center">
                    <p className="text-red-600 mb-2">{cameraError}</p>
                    <Button variant="outline" onClick={() => startCamera()} className="mt-2">
                      Tentar novamente
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
                      <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                      <canvas ref={canvasRef} className="hidden" />
                    </div>
                    <Button onClick={capturePhoto} disabled={!isCameraActive} className="w-full">
                      <Camera className="mr-2 h-4 w-4" />
                      Tirar Foto
                    </Button>
                  </>
                )}
              </div>
            </TabsContent>
          </Tabs>

          {files.length > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Imagens Selecionadas</label>
                <span className="text-xs text-muted-foreground">{files.length}/10</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {files.map((file, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(file) || "/placeholder.svg"}
                      alt={`Uploaded ${index + 1}`}
                      className="h-20 w-full object-cover rounded-md"
                    />
                    <button
                      type="button"
                      className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeFile(index)}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>
            <ImageIcon className="mr-2 h-4 w-4" />
            Anexar Imagens
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
