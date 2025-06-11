import ResetPasswordPage from "@/components/reset-password"

export default function ResetPassword({ params }: { params: { token: string } }) {
  return <ResetPasswordPage token={params.token} />
}
