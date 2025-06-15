"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

type Language = "pt" | "es" | "en";

type Translations = {
  [key: string]: {
    pt: string;
    es: string;
    en: string;
  };
};

const translations: Translations = {
  login: {
    pt: "Login",
    es: "Iniciar sesión",
    en: "Login",
  },
  loading: {
    pt: "Carregando...",
    es: "Cargando...",
    en: "Loading...",
  },
  phone: {
    pt: "Telefone",
    es: "Teléfono",
    en: "Phone",
  },
  password: {
    pt: "Senha",
    es: "Contraseña",
    en: "Password",
  },
  forgot_password: {
    pt: "Esqueceu sua senha?",
    es: "¿Olvidó su contraseña?",
    en: "Forgot your password?",
  },
  required_field: {
    pt: "Campo obrigatório",
    es: "Campo obligatorio",
    en: "Required field",
  },
  no_account: {
    pt: "Não tem uma conta?",
    es: "¿No tiene una cuenta?",
    en: "Don't have an account?",
  },
  sign_up: {
    pt: "Cadastre-se",
    es: "Regístrese",
    en: "Sign up",
  },
  create_account: {
    pt: "Criar Conta",
    es: "Crear Cuenta",
    en: "Create Account",
  },
  invalid_email: {
    pt: "Email inválido",
    es: "Email inválido",
    en: "Invalid email",
  },
  confirm_password: {
    pt: "Confirmar Senha",
    es: "Confirmar Contraseña",
    en: "Confirm Password",
  },
  password_min_length: {
    pt: "A senha deve ter pelo menos 8 caracteres",
    es: "La contraseña debe tener al menos 8 caracteres",
    en: "Password must be at least 8 characters",
  },
  passwords_dont_match: {
    pt: "As senhas não coincidem",
    es: "Las contraseñas no coinciden",
    en: "Passwords don't match",
  },
  medical_student: {
    pt: "Sou estudante de medicina",
    es: "Soy estudiante de medicina",
    en: "I am a medical student",
  },
  student_checkbox: {
    pt: "Sou estudante",
    es: "Soy estudiante",
    en: "I am a student",
  },
  register: {
    pt: "Cadastrar",
    es: "Registrar",
    en: "Register",
  },
  processing: {
    pt: "Processando...",
    es: "Procesando...",
    en: "Processing...",
  },
  already_have_account: {
    pt: "Já tem uma conta?",
    es: "¿Ya tiene una cuenta?",
    en: "Already have an account?",
  },
  verification: {
    pt: "Verificação",
    es: "Verificación",
    en: "Verification",
  },
  verification_sent: {
    pt: "Enviamos um código de verificação para seu email e telefone. Por favor, insira o código abaixo para confirmar seu cadastro.",
    es: "Enviamos un código de verificación a su email y teléfono. Por favor, ingrese el código a continuación para confirmar su registro.",
    en: "We've sent a verification code to your email and phone. Please enter the code below to confirm your registration.",
  },
  verification_code: {
    pt: "Código de Verificação",
    es: "Código de Verificación",
    en: "Verification Code",
  },
  invalid_verification_code: {
    pt: "Código de verificação inválido",
    es: "Código de verificación inválido",
    en: "Invalid verification code",
  },
  verifying: {
    pt: "Verificando...",
    es: "Verificando...",
    en: "Verifying...",
  },
  confirm: {
    pt: "Confirmar",
    es: "Confirmar",
    en: "Confirm",
  },
  back: {
    pt: "Voltar",
    es: "Volver",
    en: "Back",
  },
  success: {
    pt: "Sucesso",
    es: "Éxito",
    en: "Success",
  },
  registration_success: {
    pt: "Você já pode fazer login com suas credenciais.",
    es: "Ya puede iniciar sesión con sus credenciales.",
    en: "You can now log in with your credentials.",
  },
  attention: {
    pt: "Atenção",
    es: "Atención",
    en: "Attention",
  },
  invalid_credentials: {
    pt: "Usuário ou senha inválidos...",
    es: "Usuario o contraseña inválidos...",
    en: "Invalid username or password...",
  },
  login_error: {
    pt: "Ocorreu um erro durante o login. Tente novamente mais tarde.",
    es: "Ocurrió un error durante el inicio de sesión. Inténtelo de nuevo más tarde.",
    en: "An error occurred during login. Please try again later.",
  },
  brazil: {
    pt: "Brasil",
    es: "Brasil",
    en: "Brazil",
  },
  spain: {
    pt: "Espanha",
    es: "España",
    en: "Spain",
  },
  france: {
    pt: "França",
    es: "Francia",
    en: "France",
  },
  germany: {
    pt: "Alemanha",
    es: "Alemania",
    en: "Germany",
  },
  italy: {
    pt: "Itália",
    es: "Italia",
    en: "Italy",
  },
  portugal: {
    pt: "Portugal",
    es: "Portugal",
    en: "Portugal",
  },
  enter_phone_for_reset: {
    pt: "Digite seu número de telefone para receber um código de verificação para redefinir sua senha.",
    es: "Ingrese su número de teléfono para recibir un código de verificación para restablecer su contraseña.",
    en: "Enter your phone number to receive a verification code to reset your password.",
  },
  send_code: {
    pt: "Enviar Código",
    es: "Enviar Código",
    en: "Send Code",
  },
  sending: {
    pt: "Enviando...",
    es: "Enviando...",
    en: "Sending...",
  },
  back_to_login: {
    pt: "Voltar para o login",
    es: "Volver al inicio de sesión",
    en: "Back to login",
  },
  verify_code: {
    pt: "Verificar Código",
    es: "Verificar Código",
    en: "Verify Code",
  },
  enter_verification_code: {
    pt: "Digite o código de verificação enviado para o seu telefone.",
    es: "Ingrese el código de verificación enviado a su teléfono.",
    en: "Enter the verification code sent to your phone.",
  },
  verify: {
    pt: "Verificar",
    es: "Verificar",
    en: "Verify",
  },
  reset_password: {
    pt: "Redefinir Senha",
    es: "Restablecer Contraseña",
    en: "Reset Password",
  },
  enter_new_password: {
    pt: "Digite sua nova senha.",
    es: "Ingrese su nueva contraseña.",
    en: "Enter your new password.",
  },
  new_password: {
    pt: "Nova Senha",
    es: "Nueva Contraseña",
    en: "New Password",
  },
  resetting: {
    pt: "Redefinindo...",
    es: "Restableciendo...",
    en: "Resetting...",
  },
  password_reset_success: {
    pt: "Sua senha foi redefinida com sucesso.",
    es: "Su contraseña ha sido restablecida con éxito.",
    en: "Your password has been successfully reset.",
  },
  code_sent: {
    pt: "Código Enviado",
    es: "Código Enviado",
    en: "Code Sent",
  },
  verification_code_sent_to_phone: {
    pt: "Um código de verificação foi enviado para o seu telefone.",
    es: "Se ha enviado un código de verificación a su teléfono.",
    en: "A verification code has been sent to your phone.",
  },
  home: {
    pt: "Home",
    es: "Inicio",
    en: "Home",
  },
  exam_analysis: {
    pt: "Análise de Exames",
    es: "Análisis de Exámenes",
    en: "Exam Analysis",
  },
  ai_medical_chat: {
    pt: "Estudo de Caso",
    es: "Estudio de Caso",
    en: "Case Study",
  },
  anamnesis_report: {
    pt: "Análise Anamnese",
    es: "Análisis de Anamnesis",
    en: "Anamnesis Analysis",
  },
  logout: {
    pt: "Sair",
    es: "Salir",
    en: "Logout",
  },
  page_not_found: {
    pt: "Página não encontrada",
    es: "Página no encontrada",
    en: "Page not found",
  },
  return: {
    pt: "Voltar",
    es: "Volver",
    en: "Return",
  },
  welcome: {
    pt: "Bem-vindo ao Doctor Grace - Sua plataforma de análise de imagens médicas",
    es: "Bienvenido a Doctor Grace - Su plataforma de análisis de imágenes médicas",
    en: "Welcome to Doctor Grace - Your medical image analysis platform",
  },
  tools: {
    pt: "Ferramentas",
    es: "Herramientas",
    en: "Tools",
  },
  analyze_exams: {
    pt: "Analisar Exames",
    es: "Analizar Exámenes",
    en: "Analyze Exams",
  },
  start_chat: {
    pt: "Iniciar Estudo de Caso",
    es: "Iniciar Estudio de Caso",
    en: "Start Case Study",
  },
  create_report: {
    pt: "Criar Relatório",
    es: "Crear Informe",
    en: "Create Report",
  },
  exam_analysis_desc: {
    pt: "Carregue e analise imagens de exames médicos (Raio-X, Tomografia, Ressonância)",
    es: "Cargue y analice imágenes de exámenes médicos (Rayos X, Tomografía, Resonancia)",
    en: "Upload and analyze medical exam images (X-Ray, CT Scan, MRI)",
  },
  exam_analysis_desc_simple: {
    pt: "Carregue e analise imagens de exames médicos",
    es: "Cargue y analise imágenes de exámenes médicos",
    en: "Upload and analyze medical exam images",
  },
  ai_chat_desc: {
    pt: "Converse com nosso assistente virtual para estudos de casos médicos",
    es: "Converse con nuestro asistente virtual para estudios de casos médicos",
    en: "Chat with our virtual assistant for medical case studies",
  },
  anamnesis_report_desc: {
    pt: "Grave uma consulta e receba uma análise de anamnese gerada por IA",
    es: "Grabe una consulta y reciba un análisis de anamnesis generada por IA",
    en: "Record a consultation and receive an AI-generated anamnesis analysis",
  },
  language: {
    pt: "Idioma",
    es: "Idioma",
    en: "Language",
  },
  portuguese: {
    pt: "Português",
    es: "Portugués",
    en: "Portuguese",
  },
  spanish: {
    pt: "Espanhol",
    es: "Español",
    en: "Spanish",
  },
  english: {
    pt: "Inglês",
    es: "Inglés",
    en: "English",
  },
  recent_analyses: {
    pt: "Análises recentes",
    es: "Análisis recientes",
    en: "Recent analyses",
  },
  recent_chats: {
    pt: "Estudos de caso recentes",
    es: "Estudios de caso recientes",
    en: "Recent case studies",
  },
  analysis_history: {
    pt: "Histórico de análises",
    es: "Historial de análisis",
    en: "Analysis history",
  },
  chat_history: {
    pt: "Histórico de estudos de caso",
    es: "Historial de estudios de caso",
    en: "Case study history",
  },
  record_consultation: {
    pt: "Gravar Consulta",
    es: "Grabar Consulta",
    en: "Record Consultation",
  },
  stop_recording: {
    pt: "Parar Gravação",
    es: "Detener Grabación",
    en: "Stop Recording",
  },
  recording_in_progress: {
    pt: "Gravação em andamento...",
    es: "Grabación en curso...",
    en: "Recording in progress...",
  },
  recording_time: {
    pt: "Tempo de gravação",
    es: "Tiempo de grabación",
    en: "Recording time",
  },
  generate_report: {
    pt: "Gerar Relatório",
    es: "Generar Informe",
    en: "Generate Report",
  },
  generating_report: {
    pt: "Gerando relatório...",
    es: "Generando informe...",
    en: "Generating report...",
  },
  anamnesis_report_title: {
    pt: "Análise de Anamnese",
    es: "Análisis de Anamnesis",
    en: "Anamnesis Analysis",
  },
  patient_info: {
    pt: "Informações do Paciente",
    es: "Información del Paciente",
    en: "Patient Information",
  },
  main_complaint: {
    pt: "Queixa Principal",
    es: "Queja Principal",
    en: "Main Complaint",
  },
  history_current_disease: {
    pt: "História da Doença Atual",
    es: "Historia de la Enfermedad Actual",
    en: "History of Current Disease",
  },
  personal_background: {
    pt: "Antecedentes Pessoais",
    es: "Antecedentes Personales",
    en: "Personal Background",
  },
  family_background: {
    pt: "Antecedentes Familiares",
    es: "Antecedentes Familiares",
    en: "Family Background",
  },
  diagnosis_hypothesis: {
    pt: "Hipóteses Diagnósticas",
    es: "Hipótesis Diagnósticas",
    en: "Diagnostic Hypotheses",
  },
  recommendations: {
    pt: "Recomendações",
    es: "Recomendaciones",
    en: "Recommendations",
  },
  download_report: {
    pt: "Baixar Relatório",
    es: "Descargar Informe",
    en: "Download Report",
  },
  new_recording: {
    pt: "Nova Gravação",
    es: "Nueva Grabación",
    en: "New Recording",
  },
  microphone_permission_required: {
    pt: "Permissão de microfone necessária",
    es: "Permiso de micrófono necesario",
    en: "Microphone permission required",
  },
  request_microphone_permission: {
    pt: "Solicitar permissão",
    es: "Solicitar permiso",
    en: "Request permission",
  },
  microphone_permission_denied: {
    pt: "Permissão de microfone negada. Clique para tentar novamente.",
    es: "Permiso de micrófono denegado. Haga clic para intentarlo de nuevo.",
    en: "Microphone permission denied. Click to try again.",
  },
  file_attached: {
    pt: "Arquivo anexado",
    es: "Archivo adjunto",
    en: "File attached",
  },
  recording_audio: {
    pt: "Gravando áudio...",
    es: "Grabando audio...",
    en: "Recording audio...",
  },
  collapse: {
    pt: "Recolher",
    es: "Colapsar",
    en: "Collapse",
  },
  expand: {
    pt: "Expandir",
    es: "Expandir",
    en: "Expand",
  },
  type_your_message: {
    pt: "Digite sua mensagem...",
    es: "Escribe tu mensaje...",
    en: "Type your message...",
  },
  xray: {
    pt: "Raio-X",
    es: "Rayos X",
    en: "X-Ray",
  },
  tomography: {
    pt: "Tomografia",
    es: "Tomografía",
    en: "CT Scan",
  },
  mri: {
    pt: "Ressonância Magnética",
    es: "Resonancia Magnética",
    en: "MRI",
  },
  select_exam_type: {
    pt: "Selecione o tipo de exame e carregue as imagens para análise",
    es: "Seleccione el tipo de examen y cargue las imágenes para análisis",
    en: "Select the exam type and upload images for analysis",
  },
  exam_type: {
    pt: "Tipo de Exame",
    es: "Tipo de Examen",
    en: "Exam Type",
  },
  select_exam_type_placeholder: {
    pt: "Selecione o tipo de exame",
    es: "Seleccione el tipo de examen",
    en: "Select exam type",
  },
  upload_images: {
    pt: "Carregar Imagens",
    es: "Cargar Imágenes",
    en: "Upload Images",
  },
  click_to_upload: {
    pt: "Clique para carregar",
    es: "Haga clic para cargar",
    en: "Click to upload",
  },
  or_drag_and_drop: {
    pt: "ou arraste e solte",
    es: "o arrastre y suelte",
    en: "or drag and drop",
  },
  supported_formats: {
    pt: "PNG, JPG ou DICOM (MAX. 10 imagens)",
    es: "PNG, JPG o DICOM (MÁX. 10 imágenes)",
    en: "PNG, JPG or DICOM (MAX. 10 images)",
  },
  of: {
    pt: "de",
    es: "de",
    en: "of",
  },
  images_uploaded: {
    pt: "imagens carregadas",
    es: "imágenes cargadas",
    en: "images uploaded",
  },
  uploaded_images: {
    pt: "Imagens Carregadas",
    es: "Imágenes Cargadas",
    en: "Uploaded Images",
  },
  remove: {
    pt: "Remover",
    es: "Eliminar",
    en: "Remove",
  },
  analyzing: {
    pt: "Analisando...",
    es: "Analizando...",
    en: "Analyzing...",
  },
  analyze_images: {
    pt: "Analisar Imagens",
    es: "Analizar Imágenes",
    en: "Analyze Images",
  },
  error_title: {
    pt: "Erro",
    es: "Error",
    en: "Error",
  },
  error: {
    pt: "Erro",
    es: "Error",
    en: "Error",
  },
  server_error: {
    pt: "Ocorreu um erro ao conectar com o servidor. Tente novamente mais tarde.",
    es: "Ocurrió un error al conectar con el servidor. Inténtelo de nuevo más tarde.",
    en: "An error occurred while connecting to the server. Please try again later.",
  },
  user_not_found: {
    pt: "Usuário não encontrado. Por favor, tente novamente.",
    es: "Usuario no encontrado. Por favor, inténtelo de nuevo.",
    en: "User not found. Please try again.",
  },
  invalid_token: {
    pt: "Token inválido ou expirado.",
    es: "Token inválido o expirado.",
    en: "Invalid or expired token.",
  },
  invalid_current_password: {
    pt: "Senha atual incorreta.",
    es: "Contraseña actual incorrecta.",
    en: "Current password is incorrect.",
  },
  update_user_error: {
    pt: "Falha ao atualizar usuário.",
    es: "Error al actualizar usuario.",
    en: "Failed to update user.",
  },
  change_email_error: {
    pt: "Falha ao alterar email.",
    es: "Error al cambiar email.",
    en: "Failed to change email.",
  },
  change_phone_error: {
    pt: "Falha ao alterar telefone.",
    es: "Error al cambiar telefone.",
    en: "Failed to change phone.",
  },
  send_email_error: {
    pt: "Falha ao enviar email de ativação.",
    es: "Error al enviar email de ativação.",
    en: "Failed to send activation email.",
  },
  send_sms_error: {
    pt: "Falha ao enviar SMS de ativação.",
    es: "Error al enviar SMS de ativação.",
    en: "Failed to send activation SMS.",
  },
  email_verification: {
    pt: "Verificação de Email",
    es: "Verificación de Email",
    en: "Email Verification",
  },
  email_verification_sent: {
    pt: "Enviamos um código de verificação para o seu email. Por favor, insira o código abaixo para confirmar seu cadastro.",
    es: "Hemos enviado un código de verificación a su correo electrónico. Por favor, ingrese el código a continuación para confirmar su registro.",
    en: "We've sent a verification code to your email. Please enter the code below to confirm your registration.",
  },
  verify_email: {
    pt: "Verificar Email",
    es: "Verificar Email",
    en: "Verify Email",
  },
  sms_verification: {
    pt: "Verificação por SMS",
    es: "Verificación por SMS",
    en: "SMS Verification",
  },
  sms_verification_sent: {
    pt: "Enviamos um código de verificação para o seu telefone. Por favor, insira o código abaixo para confirmar seu cadastro.",
    es: "Hemos enviado un código de verificación a su teléfono. Por favor, ingrese el código a continuación para confirmar su registro.",
    en: "We've sent a verification code to your phone. Please enter the code below to confirm your registration.",
  },
  verify_sms: {
    pt: "Verificar SMS",
    es: "Verificar SMS",
    en: "Verify SMS",
  },
  resend_code: {
    pt: "Reenviar Código",
    es: "Reenviar Código",
    en: "Resend Code",
  },
  email_verified: {
    pt: "Email verificado com sucesso!",
    es: "¡Email verificado con éxito!",
    en: "Email successfully verified!",
  },
  sms_verified: {
    pt: "SMS verificado com sucesso!",
    es: "¡SMS verificado con éxito!",
    en: "SMS successfully verified!",
  },
  sms_resent: {
    pt: "Código de verificação reenviado para seu telefone.",
    es: "Código de verificación reenviado a su teléfono.",
    en: "Verification code resent to your phone.",
  },
  reset_code_sent: {
    pt: "Enviamos um código de redefinição para o seu email.",
    es: "Hemos enviado un código de restablecimiento a su correo electrónico.",
    en: "We've sent a reset code to your email.",
  },
  activation_email_sent: {
    pt: "Email de ativação enviado com sucesso.",
    es: "Email de activación enviado con éxito.",
    en: "Activation email sent successfully.",
  },
  activation_sms_sent: {
    pt: "SMS de ativação enviado com sucesso.",
    es: "SMS de activación enviado con éxito.",
    en: "Activation SMS sent successfully.",
  },
  profile_updated: {
    pt: "Perfil atualizado com sucesso.",
    es: "Perfil actualizado con éxito.",
    en: "Profile updated successfully.",
  },
  email_changed: {
    pt: "Email alterado com sucesso. Por favor, verifique seu novo email.",
    es: "Email cambiado con éxito. Please verify your new email.",
    en: "Email changed successfully. Please verify your new email.",
  },
  phone_changed: {
    pt: "Telefone alterado com sucesso. Por favor, verifique seu novo telefone.",
    es: "Teléfono cambiado con éxito. Por favor, verifique su nuevo teléfono.",
    en: "Phone changed successfully. Please verify your new phone.",
  },
  password_changed: {
    pt: "Senha alterada com sucesso.",
    es: "Contraseña cambiada con éxito.",
    en: "Password changed successfully.",
  },
  enter_email_for_reset: {
    pt: "Digite seu email para receber um código de redefinição de senha.",
    es: "Ingrese su correo electrónico para recibir un código de restablecimiento de contraseña.",
    en: "Enter your email to receive a password reset code.",
  },
  reset_code: {
    pt: "Código de Redefinição",
    es: "Código de Restablecimento",
    en: "Reset Code",
  },
  enter_reset_code_and_new_password: {
    pt: "Digite o código de redefinição recebido por email e sua nova senha.",
    es: "Ingrese el código de restablecimiento recibido por correo electrónico y su nueva contraseña.",
    en: "Enter the reset code received by email and your new password.",
  },
  patient_info_optional: {
    pt: "Informações do Paciente (opcional)",
    es: "Información del Paciente (opcional)",
    en: "Patient Information (optional)",
  },
  anonymous: {
    pt: "Anônimo",
    es: "Anónimo",
    en: "Anonymous",
  },
  patient_name: {
    pt: "Nome do Paciente",
    es: "Nombre del Paciente",
    en: "Patient Name",
  },
  patient_age: {
    pt: "Idade",
    es: "Edad",
    en: "Age",
  },
  patient_gender: {
    pt: "Sexo",
    es: "Sexo",
    en: "Gender",
  },
  specialty: {
    pt: "Especialidade",
    es: "Especialidad",
    en: "Specialty",
  },
  invalid_file_type: {
    pt: "Tipo de arquivo inválido",
    es: "Tipo de archivo inválido",
    en: "Invalid file type",
  },
  invalid_file_type_description: {
    pt: "Os seguintes arquivos não são imagens válidas: {files}. Por favor, envie apenas arquivos PNG, JPG ou DICOM.",
    es: "Los siguientes archivos no son imágenes válidas: {files}. Por favor, envíe solo archivos PNG, JPG o DICOM.",
    en: "The following files are not valid images: {files}. Please upload only PNG, JPG or DICOM files.",
  },
  max_10_images: {
    pt: "Você pode enviar no máximo 10 imagens",
    es: "Puede enviar un máximo de 10 imágenes",
    en: "You can upload a maximum of 10 images",
  },
  name: {
    pt: "Nome",
    es: "Nombre",
    en: "Name",
  },
  professional_register: {
    pt: "Registro Profissional",
    es: "Registro Profesional",
    en: "Professional Register",
  },
  professional_type: {
    pt: "Tipo Profissional",
    es: "Tipo Profesional",
    en: "Professional Type",
  },
  select_professional_type: {
    pt: "Selecione o tipo profissional",
    es: "Seleccione el tipo profesional",
    en: "Select professional type",
  },
  medic: {
    pt: "Médico",
    es: "Médico",
    en: "Physician",
  },
  nurse: {
    pt: "Enfermeiro",
    es: "Enfermero",
    en: "Nurse",
  },
  nursing_technician: {
    pt: "Técnico de Enfermagem",
    es: "Técnico de Enfermería",
    en: "Nursing Technician",
  },
  student: {
    pt: "Estudante",
    es: "Estudiante",
    en: "Student",
  },
  show_password: {
    pt: "Mostrar senha",
    es: "Mostrar contraseña",
    en: "Show password",
  },
  hide_password: {
    pt: "Esconder senha",
    es: "Ocultar contraseña",
    en: "Hide password",
  },
  register_min_length: {
    pt: "O registro deve ter entre 9 e 15 caracteres",
    es: "El registro debe tener entre 9 y 15 caracteres",
    en: "Register must be between 9 and 15 characters",
  },
  name_min_length: {
    pt: "O nome deve ter entre 2 e 100 caracteres",
    es: "El nombre debe tener entre 2 e 100 caracteres",
    en: "Name must be between 2 and 100 characters",
  },
  email_already_verified: {
    pt: "Seu email já foi verificado",
    es: "Su correo electrónico ya ha sido verificado",
    en: "Your email has already been verified",
  },
  phone_already_verified: {
    pt: "Seu telefone já foi verificado",
    es: "Su teléfono ya ha sido verificado",
    en: "Your phone has already been verified",
  },
  error_checking_application_access: {
    pt: "Erro ao verificar acesso à aplicação",
    es: "Error al verificar el acceso a la aplicación",
    en: "Error checking application access",
  },
  verification_required: {
    pt: "Verificação Necessária",
    es: "Verificación Necesaria",
    en: "Verification Required",
  },
  email_and_phone_verification_required: {
    pt: "É necessário verificar seus dados para utilizar todas as funcionalidades do aplicativo.",
    es: "Es necesario verificar sus datos para utilizar todas las funcionalidades de la aplicación.",
    en: "You need to verify your data to use all the app's features.",
  },
  email_verification_required: {
    pt: "É necessário verificar seu email para utilizar todas as funcionalidades do aplicativo.",
    es: "Es necesario verificar su correo electrónico para utilizar todas las funcionalidades de la aplicación.",
    en: "You need to verify your email to use all the app's features.",
  },
  phone_verification_required: {
    pt: "É necessário verificar seu telefone para utilizar todas as funcionalidades do aplicativo.",
    es: "Es necesario verificar su teléfono para utilizar todas las funcionalidades de la aplicación.",
    en: "You need to verify your phone to use all the app's features.",
  },
  verify_now: {
    pt: "Verificar Agora",
    es: "Verificar Ahora",
    en: "Verify Now",
  },
  feature_restricted: {
    pt: "Funcionalidade Restrita",
    es: "Funcionalidad Restringida",
    en: "Restricted Feature",
  },
  verification_needed_to_use: {
    pt: "Você precisa verificar seu email e telefone para usar esta funcionalidade.",
    es: "Necesita verificar su correo electrónico y teléfono para usar esta funcionalidad.",
    en: "You need to verify your email and phone to use this feature.",
  },
  select_exam_type_and_upload: {
    pt: "Selecione o tipo de exame e carregue as imagens para análise",
    es: "Seleccione el tipo de examen y cargue las imágenes para análisis",
    en: "Select the exam type and upload images for analysis",
  },
  max_10: {
    pt: "máximo 10",
    es: "máximo 10",
    en: "maximum 10",
  },
  drag_drop_or: {
    pt: "Arraste e solte ou",
    es: "Arrastre y suelte o",
    en: "Drag and drop or",
  },
  browse: {
    pt: "navegue",
    es: "navegue",
    en: "browse",
  },
  selected_images: {
    pt: "Imagens selecionadas",
    es: "Imágenes seleccionadas",
    en: "Selected images",
  },
  ultrasound: {
    pt: "Ultrassom",
    es: "Ultrasonido",
    en: "Ultrasound",
  },
  mammography: {
    pt: "Mamografia",
    es: "Mamografía",
    en: "Mammography",
  },
  missing_exam_type: {
    pt: "Tipo de exame não selecionado",
    es: "Tipo de examen no seleccionado",
    en: "Exam type not selected",
  },
  missing_images: {
    pt: "Imagens não selecionadas",
    es: "Imágenes no seleccionadas",
    en: "Images not selected",
  },
  upload_at_least_one_image: {
    pt: "Carregue pelo menos uma imagem",
    es: "Cargue al menos una imagen",
    en: "Upload at least one image",
  },
  analysis_complete: {
    pt: "Análise concluída",
    es: "Análisis completado",
    en: "Analysis complete",
  },
  analysis_success: {
    pt: "Análise realizada com sucesso",
    es: "Análisis realizado con éxito",
    en: "Analysis completed successfully",
  },
  checking_verification: {
    pt: "Verificando status",
    es: "Verificando estado",
    en: "Checking verification status",
  },
  please_wait: {
    pt: "Por favor, aguarde...",
    es: "Por favor, espere...",
    en: "Please wait...",
  },
  // Novas traduções para a tela de anamnese
  anamnesis_description: {
    pt: "Preencha os dados do paciente e da consulta para gerar um relatório de anamnese",
    es: "Complete los datos del paciente y de la consulta para generar un informe de anamnesis",
    en: "Fill in patient and consultation data to generate an anamnesis report",
  },
  basic_info: {
    pt: "Informações Básicas",
    es: "Información Básica",
    en: "Basic Information",
  },
  symptoms: {
    pt: "Sintomas",
    es: "Síntomas",
    en: "Symptoms",
  },
  medical_history: {
    pt: "Histórico Médico",
    es: "Historia Médica",
    en: "Medical History",
  },
  enter_patient_name: {
    pt: "Digite o nome do paciente",
    es: "Ingrese el nombre del paciente",
    en: "Enter patient name",
  },
  enter_patient_age: {
    pt: "Digite a idade do paciente",
    es: "Ingrese la edad del paciente",
    en: "Enter patient age",
  },
  select_gender: {
    pt: "Selecione o sexo",
    es: "Seleccione el sexo",
    en: "Select gender",
  },
  male: {
    pt: "Masculino",
    es: "Masculino",
    en: "Male",
  },
  female: {
    pt: "Femenino",
    es: "Femenino",
    en: "Female",
  },
  other: {
    pt: "Outro",
    es: "Otro",
    en: "Other",
  },
  consultation_date: {
    pt: "Data da Consulta",
    es: "Fecha de Consulta",
    en: "Consultation Date",
  },
  describe_main_complaint: {
    pt: "Descreva a queixa principal",
    es: "Describa la queja principal",
    en: "Describe the main complaint",
  },
  symptoms_duration: {
    pt: "Duração dos Sintomas",
    es: "Duración de los Síntomas",
    en: "Symptoms Duration",
  },
  duration: {
    pt: "Duração",
    es: "Duración",
    en: "Duration",
  },
  unit: {
    pt: "Unidade",
    es: "Unidad",
    en: "Unit",
  },
  hours: {
    pt: "Horas",
    es: "Horas",
    en: "Hours",
  },
  days: {
    pt: "Dias",
    es: "Días",
    en: "Days",
  },
  weeks: {
    pt: "Semanas",
    es: "Semanas",
    en: "Weeks",
  },
  months: {
    pt: "Meses",
    es: "Meses",
    en: "Months",
  },
  years: {
    pt: "Anos",
    es: "Años",
    en: "Years",
  },
  associated_symptoms: {
    pt: "Sintomas Associados",
    es: "Síntomas Asociados",
    en: "Associated Symptoms",
  },
  describe_associated_symptoms: {
    pt: "Descreva os sintomas associados",
    es: "Describa los síntomas asociados",
    en: "Describe associated symptoms",
  },
  previous_medical_history: {
    pt: "Histórico Médico Anterior",
    es: "Historia Médica Previa",
    en: "Previous Medical History",
  },
  describe_medical_history: {
    pt: "Descreva o histórico médico",
    es: "Describa la historia médica",
    en: "Describe medical history",
  },
  current_medications: {
    pt: "Medicamentos Atuais",
    es: "Medicamentos Actuales",
    en: "Current Medications",
  },
  list_current_medications: {
    pt: "Liste os medicamentos atuais",
    es: "Liste los medicamentos actuales",
    en: "List current medications",
  },
  allergies: {
    pt: "Alergias",
    es: "Alergias",
    en: "Allergies",
  },
  list_allergies: {
    pt: "Liste as alergias",
    es: "Liste las alergias",
    en: "List allergies",
  },
  family_history: {
    pt: "Histórico Familiar",
    es: "Historia Familiar",
    en: "Family History",
  },
  describe_family_history: {
    pt: "Descreva o histórico familiar",
    es: "Describa la historia familiar",
    en: "Describe family history",
  },
  previous: {
    pt: "Anterior",
    es: "Anterior",
    en: "Previous",
  },
  next: {
    pt: "Próximo",
    es: "Siguiente",
    en: "Next",
  },
  generating: {
    pt: "Gerando...",
    es: "Generando...",
    en: "Generating...",
  },
  anamnesis_generated: {
    pt: "Anamnese Gerada",
    es: "Anamnesis Generada",
    en: "Anamnesis Generated",
  },
  anamnesis_success: {
    pt: "Anamnese gerada com sucesso",
    es: "Anamnesis generada con éxito",
    en: "Anamnesis successfully generated",
  },
  // Adicionar as novas chaves de tradução para as instruções de verificação
  email_verification_instructions: {
    pt: "Para verificar seu email, clique no botão 'Enviar Código' abaixo e insira o código recebido.",
    es: "Para verificar su correo electrónico, haga clic en el botón 'Enviar Código' a continuación e ingrese el código recibido.",
    en: "To verify your email, click the 'Send Code' button below and enter the code you receive.",
  },
  sms_verification_instructions: {
    pt: "Para verificar seu telefone, clique no botão 'Enviar Código' abaixo e insira o código recebido por SMS.",
    es: "Para verificar su teléfono, haga clic en el botón 'Enviar Código' a continuación e ingrese el código recibido por SMS.",
    en: "To verify your phone, click the 'Send Code' button below and enter the code you receive by SMS.",
  },
  confirm_email: {
    pt: "Confirmar email",
    es: "Confirmar correo electrónico",
    en: "Confirm email",
  },
  fill_fields_to_reset: {
    pt: "Preencha os campos para redefinir senha",
    es: "Complete los campos para restablecer la contraseña",
    en: "Fill in the fields to reset your password",
  },
  ai_chat_welcome: {
    pt: "Olá! Como posso ajudar com seu estudo de caso hoje?",
    es: "¡Hola! ¿Cómo puedo ayudar con su estudio de caso hoy?",
    en: "Hello! How can I help with your case study today?",
  },
  attach_file: {
    pt: "Anexar arquivo",
    es: "Adjuntar archivo",
    en: "Attach file",
  },
  type_message: {
    pt: "Digite sua mensagem...",
    es: "Escribe tu mensaje...",
    en: "Type your message...",
  },
  start_recording: {
    pt: "Iniciar gravação",
    es: "Iniciar grabación",
    en: "Start recording",
  },
  chat: {
    pt: "Estudo de Caso",
    es: "Estudio de Caso",
    en: "Case Study",
  },
  ai_chat_response: {
    pt: "Estou analisando sua mensagem. Como posso ajudar com mais informações médicas?",
    es: "Estoy analisando su mensaje. ¿Cómo puedo ayudar con más información médica?",
    en: "I'm analyzing your message. How can I help with more medical information?",
  },
  microphone_error: {
    pt: "Erro de microfone",
    es: "Error de micrófono",
    en: "Microphone error",
  },
  too_many_files: {
    pt: "Muitos arquivos",
    es: "Demasiados archivos",
    en: "Too many files",
  },
  max_10_files: {
    pt: "Você pode anexar no máximo 10 arquivos",
    es: "Puede adjuntar un máximo de 10 archivos",
    en: "You can attach a maximum of 10 files",
  },
  send: {
    pt: "Enviar",
    es: "Enviar",
    en: "Send",
  },
  user_not_authenticated: {
    pt: "Usuário não autenticado",
    es: "Usuario no autenticado",
    en: "User not authenticated",
  },
  settings: {
    pt: "Configurações",
    es: "Configuraciones",
    en: "Settings",
  },
  user_settings: {
    pt: "Configurações do Usuário",
    es: "Configuraciones del Usuario",
    en: "User Settings",
  },
  edit_profile: {
    pt: "Editar Perfil",
    es: "Editar Perfil",
    en: "Edit Profile",
  },
  edit_email: {
    pt: "Editar Email",
    es: "Editar Email",
    en: "Edit Email",
  },
  edit_phone: {
    pt: "Editar Telefone",
    es: "Editar Teléfono",
    en: "Edit Phone",
  },
  change_email: {
    pt: "Alterar Email",
    es: "Cambiar Email",
    en: "Change Email",
  },
  change_phone: {
    pt: "Alterar Telefone",
    es: "Cambiar Teléfono",
    en: "Change Phone",
  },
  save_changes: {
    pt: "Salvar Alterações",
    es: "Guardar Cambios",
    en: "Save Changes",
  },
  cancel: {
    pt: "Cancelar",
    es: "Cancelar",
    en: "Cancel",
  },
  current_email: {
    pt: "Email Atual",
    es: "Email Actual",
    en: "Current Email",
  },
  new_email: {
    pt: "Novo Email",
    es: "Nuevo Email",
    en: "New Email",
  },
  current_phone: {
    pt: "Telefone Atual",
    es: "Teléfono Actual",
    en: "Current Phone",
  },
  new_phone: {
    pt: "Novo Telefone",
    es: "Nuevo Teléfono",
    en: "New Phone",
  },
  phone_number: {
    pt: "Número de telefone",
    es: "Número de teléfono",
    en: "Phone number",
  },
  profile_updated_success: {
    pt: "Perfil atualizado com sucesso",
    es: "Perfil actualizado con éxito",
    en: "Profile updated successfully",
  },
  email_updated_success: {
    pt: "Email atualizado com sucesso",
    es: "Email actualizado con sucesso",
    en: "Email updated successfully",
  },
  phone_updated_success: {
    pt: "Telefone atualizado com sucesso",
    es: "Teléfono actualizado con éxito",
    en: "Phone updated successfully",
  },
  verification_required_after_update: {
    pt: "Verificação necessária após atualização",
    es: "Verificación necesaria después de la actualización",
    en: "Verification required after update",
  },
  manage_your_account_settings: {
    pt: "Gerencie as configurações da sua conta",
    es: "Administre la configuración de su cuenta",
    en: "Manage your account settings",
  },
  update_your_profile_information: {
    pt: "Atualize suas informações de perfil",
    es: "Actualice su información de perfil",
    en: "Update your profile information",
  },
  update_your_email_address: {
    pt: "Atualize seu endereço de email",
    es: "Actualice su dirección de correo electrónico",
    en: "Update your email address",
  },
  update_your_phone_number: {
    pt: "Atualize seu número de telefone",
    es: "Actualice su número de teléfono",
    en: "Update your phone number",
  },
  saving: {
    pt: "Salvando",
    es: "Guardando",
    en: "Saving",
  },
  phone_min_length: {
    pt: "O telefone deve ter pelo menos 8 dígitos",
    es: "El teléfono debe tener al menos 8 dígitos",
    en: "Phone must be at least 8 digits",
  },
  change_password: {
    pt: "Alterar Senha",
    es: "Cambiar Contraseña",
    en: "Change Password",
  },
  current_password: {
    pt: "Senha Atual",
    es: "Contraseña Actual",
    en: "Current Password",
  },
  update_your_password: {
    pt: "Atualize sua senha",
    es: "Actualice su contraseña",
    en: "Update your password",
  },
  auto_login_failed: {
    pt: "Login automático falhou. Por favor, faça login manualmente.",
    es: "El inicio de sesión automático falló. Por favor, inicie sesión manualmente.",
    en: "Automatic login failed. Please log in manually.",
  },
  logout_confirmation_title: {
    pt: "Confirmar Saída",
    es: "Confirmar Salida",
    en: "Confirm Logout",
  },
  logout_confirmation_description: {
    pt: "Tem certeza que deseja sair do sistema?",
    es: "¿Está seguro que desea salir del sistema?",
    en: "Are you sure you want to log out?",
  },
  confirm_logout: {
    pt: "Sim, sair",
    es: "Sí, salir",
    en: "Yes, log out",
  },
};

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string>) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("pt");

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language;
    if (
      savedLanguage &&
      (savedLanguage === "pt" ||
        savedLanguage === "es" ||
        savedLanguage === "en")
    ) {
      setLanguage(savedLanguage);
    }
  }, []);

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
  };

  const t = (key: string, params?: Record<string, string>): string => {
    if (!translations[key]) {
      return key;
    }

    let text = translations[key][language];

    // Replace parameters if they exist
    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        text = text.replace(`{{${paramKey}}}`, paramValue);
      });
    }

    return text;
  };

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage: changeLanguage, t }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
