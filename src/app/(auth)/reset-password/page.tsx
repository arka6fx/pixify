import { Suspense } from "react"
import { headers } from "next/headers"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Layers } from "lucide-react"
import { ResetPasswordForm } from "@/components/auth/reset-password-form"
import { auth } from "@/lib/auth"

export default async function ResetPasswordPage() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="w-full max-w-sm space-y-6">
      {/* Logo + heading */}
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="flex items-center gap-2 mb-1">
          <Layers className="h-5 w-5 text-primary" />
          <span className="font-semibold text-foreground">Pixify</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Set new password</h1>
        <p className="text-sm text-muted-foreground">
          Choose a strong password for your account
        </p>
      </div>

      {/* Card */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-[0_0_30px_oklch(0.60_0.22_270_/_12%)]">
        <Suspense fallback={<div>Loading...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>

      {/* Footer link */}
      <p className="text-center text-sm text-muted-foreground">
        <Link href="/login" className="text-primary hover:underline">
          Back to sign in
        </Link>
      </p>
    </div>
  )
}
