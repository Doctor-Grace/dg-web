/**
 * Mapeamento centralizado de todas as rotas da aplicação
 * Isso facilita a manutenção e evita strings duplicadas
 */
export const routesMapper = {
  // Rotas de autenticação
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
  forgotPasswordByUrl: "/forgot-password-by-url",
  resetPassword: "/forgot-password-by-url",

  // Rotas principais
  dashboard: "/dashboard",

  // Rotas de funcionalidades
  analysis: "/dashboard/analise",
  chat: "/dashboard/chat",
  anamnesis: "/dashboard/anamnesis",
  userSettings: "/dashboard/user-settings",

  // Rotas de verificação
  verification: "/verification",

  // Outras rotas
  404: "/404",
}

// Função auxiliar para obter uma rota com parâmetros
export function getRoute(route: keyof typeof routesMapper, params?: Record<string, string>): string {
  let path = routesMapper[route]

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      path = path.replace(`:${key}`, value)
    })
  }

  return path
}
