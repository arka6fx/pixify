import { headers } from "next/headers"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Layers } from "lucide-react"
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"
import { auth } from "@/lib/auth"

export default async function ForgotPasswordPage() {
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
        <h1 className="text-2xl font-bold tracking-tight">
          Reset your password
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your email and we&apos;ll send a reset link
        </p>
      </div>

      {/* Card */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-[0_0_30px_oklch(0.60_0.22_270_/_12%)]">
        <ForgotPasswordForm />
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
