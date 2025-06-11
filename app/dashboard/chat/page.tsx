"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Mic, MicOff, Info } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useLanguage } from "@/hooks/use-language"
import { useFeatureAccess } from "@/hooks/use-feature-access"
import { routesMapper } from "@/utils/routes-mapper"

export default function ChatPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const { toast } = useToast()
  const { checkAccess, isVerified, isChecking } = useFeatureAccess()

  const [isRecording, setIsRecording] = useState(false)
  const [recordingPermission, setRecordingPermission] = useState<boolean | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showRecordingModal, setShowRecordingModal] = useState(false)

  // Formulário de anamnese
  const [patientName, setPatientName] = useState("")
  const [patientAge, setPatientAge] = useState("")
  const [patientGender, setPatientGender] = useState("")
  const [mainComplaint, setMainComplaint] = useState("")
  const [symptomsDuration, setSymptomsDuration] = useState("")
  const [durationUnit, setDurationUnit] = useState("")
  const [associatedSymptoms, setAssociatedSymptoms] = useState("")
  const [medicalHistory, setMedicalHistory] = useState("")
  const [currentMedications, setCurrentMedications] = useState("")
  const [allergies, setAllergies] = useState("")
  const [familyHistory, setFamilyHistory] = useState("")

  const audioRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  const handleAudioButtonClick = () => {
    if (isChecking || !isVerified) {
      checkAccess()
      return
    }

    if (isRecording) {
      stopRecording()
    } else {
      setShowRecordingModal(true)
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      setRecordingPermission(true)
      setIsRecording(true)

      const mediaRecorder = new MediaRecorder(stream)
      audioRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" })
        processAudioToText(audioBlob)
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorder.start()

      toast({
        title: t("recording_audio"),
        description: t("recording_in_progress"),
      })
    } catch (error) {
      setRecordingPermission(false)
      toast({
        title: t("microphone_error"),
        description: t("microphone_permission_denied"),
        variant: "destructive",
      })
    }
  }

  const stopRecording = () => {
    if (audioRef.current && audioRef.current.state !== "inactive") {
      audioRef.current.stop()
      setIsRecording(false)
    }
  }

  const processAudioToText = (audioBlob: Blob) => {
    // Aqui seria implementada a integração com um serviço de transcrição
    // Por enquanto, vamos simular uma transcrição após um breve delay
    toast({
      title: t("processing"),
      description: t("please_wait"),
    })

    setTimeout(() => {
      // Simulação de texto transcrito para todos os campos
      setPatientName("João Silva")
      setPatientAge("45")
      setPatientGender("male")
      setMainComplaint("Dor no peito há 3 dias, com irradiação para o braço esquerdo")
      setSymptomsDuration("3")
      setDurationUnit("days")
      setAssociatedSymptoms("Falta de ar, sudorese e náusea")
      setMedicalHistory("Hipertensão arterial há 10 anos, diabetes tipo 2")
      setCurrentMedications("Losartana 50mg, Metformina 850mg")
      setAllergies("Penicilina")
      setFamilyHistory("Pai faleceu de infarto aos 60 anos, mãe com hipertensão")

      toast({
        title: t("success"),
        description: "Áudio transcrito com sucesso",
      })
    }, 2000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isChecking || !isVerified) {
      checkAccess()
      return
    }

    setIsSubmitting(true)

    try {
      // Aqui seria feita a chamada para o endpoint que gera o GUID
      // Por enquanto, vamos simular com um GUID aleatório
      const mockGuid = "chat-" + Math.random().toString(36).substring(2, 15)

      // Simulando uma chamada de API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Redirecionar para a página de chat com o GUID
      router.push(`${routesMapper.chat}/${mockGuid}`)
    } catch (error) {
      toast({
        title: t("error"),
        description: t("server_error"),
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  const confirmRecording = () => {
    setShowRecordingModal(false)
    startRecording()
  }

  const cancelRecording = () => {
    setShowRecordingModal(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{t("chat")}</h1>
        <div className="flex items-center gap-2">
          <Button
            variant={isRecording ? "destructive" : "outline"}
            size="sm"
            onClick={handleAudioButtonClick}
            disabled={isChecking || !isVerified}
            className="flex items-center gap-2"
          >
            {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            {isRecording ? "Parar gravação" : "Preenchimento por áudio"}
          </Button>
        </div>
      </div>

      <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-900">
        <Info className="h-4 w-4 text-blue-500 dark:text-blue-400" />
        <AlertTitle>Preenchimento por áudio disponível</AlertTitle>
        <AlertDescription>
          Você pode preencher os campos deste formulário usando sua voz. Clique no botão "Preenchimento por áudio" no
          canto superior direito para começar a gravar.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>{t("patient_info")}</CardTitle>
          <CardDescription>Preencha as informações do paciente para iniciar o estudo de caso</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informações Básicas */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">{t("basic_info")}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="patient-name">{t("patient_name")}</Label>
                  <Input
                    id="patient-name"
                    placeholder={t("enter_patient_name")}
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="patient-age">{t("patient_age")}</Label>
                  <Input
                    id="patient-age"
                    type="number"
                    placeholder={t("enter_patient_age")}
                    value={patientAge}
                    onChange={(e) => setPatientAge(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="patient-gender">{t("patient_gender")}</Label>
                <Select value={patientGender} onValueChange={setPatientGender}>
                  <SelectTrigger id="patient-gender">
                    <SelectValue placeholder={t("select_gender")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">{t("male")}</SelectItem>
                    <SelectItem value="female">{t("female")}</SelectItem>
                    <SelectItem value="other">{t("other")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Sintomas */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">{t("symptoms")}</h3>
              <div className="space-y-2">
                <Label htmlFor="main-complaint">{t("main_complaint")}</Label>
                <Textarea
                  id="main-complaint"
                  placeholder={t("describe_main_complaint")}
                  className="min-h-[100px]"
                  value={mainComplaint}
                  onChange={(e) => setMainComplaint(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="symptoms-duration">{t("symptoms_duration")}</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    id="symptoms-duration"
                    type="number"
                    placeholder={t("duration")}
                    value={symptomsDuration}
                    onChange={(e) => setSymptomsDuration(e.target.value)}
                  />
                  <Select value={durationUnit} onValueChange={setDurationUnit}>
                    <SelectTrigger>
                      <SelectValue placeholder={t("unit")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hours">{t("hours")}</SelectItem>
                      <SelectItem value="days">{t("days")}</SelectItem>
                      <SelectItem value="weeks">{t("weeks")}</SelectItem>
                      <SelectItem value="months">{t("months")}</SelectItem>
                      <SelectItem value="years">{t("years")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="associated-symptoms">{t("associated_symptoms")}</Label>
                <Textarea
                  id="associated-symptoms"
                  placeholder={t("describe_associated_symptoms")}
                  className="min-h-[100px]"
                  value={associatedSymptoms}
                  onChange={(e) => setAssociatedSymptoms(e.target.value)}
                />
              </div>
            </div>

            {/* Histórico Médico */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">{t("medical_history")}</h3>
              <div className="space-y-2">
                <Label htmlFor="medical-history">{t("previous_medical_history")}</Label>
                <Textarea
                  id="medical-history"
                  placeholder={t("describe_medical_history")}
                  className="min-h-[100px]"
                  value={medicalHistory}
                  onChange={(e) => setMedicalHistory(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="medications">{t("current_medications")}</Label>
                <Textarea
                  id="medications"
                  placeholder={t("list_current_medications")}
                  className="min-h-[100px]"
                  value={currentMedications}
                  onChange={(e) => setCurrentMedications(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="allergies">{t("allergies")}</Label>
                <Textarea
                  id="allergies"
                  placeholder={t("list_allergies")}
                  className="min-h-[100px]"
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="family-history">{t("family_history")}</Label>
                <Textarea
                  id="family-history"
                  placeholder={t("describe_family_history")}
                  className="min-h-[100px]"
                  value={familyHistory}
                  onChange={(e) => setFamilyHistory(e.target.value)}
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={handleSubmit} disabled={isSubmitting || isRecording}>
            {isSubmitting ? t("processing") : "Iniciar Estudo de Caso"}
          </Button>
        </CardFooter>
      </Card>

      {/* Modal de confirmação para gravação de áudio */}
      <Dialog open={showRecordingModal} onOpenChange={setShowRecordingModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Iniciar gravação de áudio</DialogTitle>
            <DialogDescription>
              Você está prestes a iniciar a gravação de áudio para preencher automaticamente os campos do formulário.
              Fale claramente as informações do paciente quando a gravação começar.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2">
            <Button variant="outline" onClick={cancelRecording}>
              Cancelar
            </Button>
            <Button onClick={confirmRecording}>
              <Mic className="mr-2 h-4 w-4" />
              Iniciar Gravação
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
