"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Mic, Send, Paperclip, StopCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useLanguage } from "@/hooks/use-language"
import { useFeatureAccess } from "@/hooks/use-feature-access"
import { cn } from "@/lib/utils"
import { FileAttachmentDialog } from "@/components/file-attachment-dialog"

// Importações para formatação de data
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

// Interface para os dados do paciente
interface PatientData {
  name: string
  // outros campos de anamnese podem ser adicionados aqui
}

interface Attachment {
  id: string
  name: string
  url: string
  type: string
  examType?: string
}

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  attachments?: Attachment[]
  examType?: string
  examReason?: string
}

// Função auxiliar para obter o nome do tipo de exame
const getExamTypeName = (examType: string): string => {
  switch (examType) {
    case "xray":
      return "Raio-X"
    case "mri":
      return "Ressonância Magnética"
    case "ct":
      return "Tomografia"
    default:
      return examType
  }
}

// Componente ChatSessionPage
export default function ChatSessionPage() {
  const params = useParams()
  const chatId = params.guid as string

  const { t } = useLanguage()
  const { toast } = useToast()
  const { checkAccess, isVerified, isChecking } = useFeatureAccess()

  // Estado para os dados do paciente
  const [patientData, setPatientData] = useState<PatientData>({ name: "" })

  // Data formatada
  const formattedDate = format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: `Estudo de caso iniciado. ID da sessão: ${chatId}. Como posso ajudar com este caso?`,
      role: "assistant",
    },
  ])
  const [input, setInput] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [recordingPermission, setRecordingPermission] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isAttachmentDialogOpen, setIsAttachmentDialogOpen] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (isChecking || !isVerified) {
      checkAccess()
      return
    }

    if (!input.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
    }

    setMessages((prev) => [...prev, newMessage])
    setInput("")
    setIsLoading(true)

    // Simular resposta do assistente após um pequeno delay
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: t("ai_chat_response"),
        role: "assistant",
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1500)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleFileUpload = () => {
    if (isChecking || !isVerified) {
      checkAccess()
      return
    }
    setIsAttachmentDialogOpen(true)
  }

  const handleAttachFiles = (files: File[], examType: string, examReason: string) => {
    // Criar anexos a partir dos arquivos
    const attachments = files.map((file) => ({
      id: Date.now() + Math.random().toString(),
      name: file.name,
      url: URL.createObjectURL(file),
      type: file.type,
      examType,
    }))

    // Criar conteúdo da mensagem
    let content = `**${getExamTypeName(examType)}**`

    if (examReason.trim()) {
      content += `\n\nMotivo: ${examReason}`
    }

    // Criar e enviar a mensagem diretamente
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      role: "user",
      attachments,
      examType,
      examReason: examReason.trim() || undefined,
    }

    setMessages((prev) => [...prev, newMessage])
    setIsLoading(true)

    // Simular resposta do assistente após um pequeno delay
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `Recebi as imagens do exame de ${getExamTypeName(examType)}. Estou analisando os resultados...`,
        role: "assistant",
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1500)
  }

  const toggleRecording = async () => {
    if (isChecking || !isVerified) {
      checkAccess()
      return
    }

    if (isRecording) {
      setIsRecording(false)
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      setRecordingPermission(true)
      setIsRecording(true)

      // Simular gravação por 3 segundos
      setTimeout(() => {
        stream.getTracks().forEach((track) => track.stop())
        setIsRecording(false)
        setInput((prev) => prev + " [Transcrição de áudio]")
      }, 3000)
    } catch (error) {
      setRecordingPermission(false)
      toast({
        title: t("microphone_error"),
        description: t("microphone_permission_denied"),
        variant: "destructive",
      })
    }
  }

  return (
    <>
      <Card className="flex flex-col h-[calc(100vh-12rem)]">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center">
            <span>{patientData.name ? patientData.name : "Paciente Anônimo"}</span>
            <span className="ml-2 text-sm text-muted-foreground">• {formattedDate}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto overflow-x-hidden pb-0">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn("flex items-start gap-3", message.role === "user" ? "flex-row-reverse" : "")}
              >
                <Avatar className={cn("h-8 w-8", message.role === "user" ? "bg-primary" : "bg-muted")}>
                  <AvatarFallback>{message.role === "user" ? "U" : "AI"}</AvatarFallback>
                  {message.role === "assistant" && <AvatarImage src="/futuristic-helper-bot.png" />}
                </Avatar>
                <div
                  className={cn(
                    "rounded-lg px-3 py-2 max-w-[80%] text-sm break-words overflow-hidden",
                    message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted",
                  )}
                >
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mb-2">
                      <div className="flex flex-wrap gap-1 mb-2">
                        {message.attachments.slice(0, 3).map((attachment) => (
                          <img
                            key={attachment.id}
                            src={attachment.url || "/placeholder.svg"}
                            alt={attachment.name}
                            className="h-16 w-16 object-cover rounded-md"
                          />
                        ))}
                        {message.attachments.length > 3 && (
                          <div className="h-16 w-16 bg-muted-foreground/20 rounded-md flex items-center justify-center text-xs font-medium">
                            +{message.attachments.length - 3}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="whitespace-pre-wrap break-words overflow-wrap-anywhere">
                    {message.content.split("\n").map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8 bg-muted">
                  <AvatarFallback>AI</AvatarFallback>
                  <AvatarImage src="/futuristic-helper-bot.png" />
                </Avatar>
                <div className="rounded-lg px-3 py-2 bg-muted max-w-[80%]">
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
        <CardFooter className="pt-3">
          <div className="flex w-full items-center gap-2 rounded-md border bg-background p-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full shrink-0 text-muted-foreground hover:text-foreground flex items-center justify-center"
              onClick={handleFileUpload}
              disabled={isChecking || !isVerified}
            >
              <Paperclip className="h-4 w-4" />
              <span className="sr-only">{t("attach_file")}</span>
            </Button>
            <div className="flex-1 flex items-center">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t("type_message")}
                className="min-h-8 h-8 py-0 flex-1 resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 flex items-center"
                style={{ paddingTop: "8px", lineHeight: "1" }}
                disabled={isChecking || !isVerified}
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8 rounded-full shrink-0 text-muted-foreground hover:text-foreground flex items-center justify-center",
                isRecording && "text-destructive hover:text-destructive",
              )}
              onClick={toggleRecording}
              disabled={isChecking || !isVerified}
            >
              {isRecording ? <StopCircle className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              <span className="sr-only">{isRecording ? t("stop_recording") : t("start_recording")}</span>
            </Button>
            <div className="flex items-center justify-center h-8 w-8">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center"
                onClick={handleSend}
                disabled={!input.trim() || isLoading || isChecking || !isVerified}
              >
                <div className="flex items-center justify-center">
                  <Send className="h-4 w-4" />
                </div>
                <span className="sr-only">{t("send")}</span>
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>

      <FileAttachmentDialog
        open={isAttachmentDialogOpen}
        onOpenChange={setIsAttachmentDialogOpen}
        onAttach={handleAttachFiles}
      />
    </>
  )
}
