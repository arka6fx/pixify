import { headers } from "next/headers"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Layers } from "lucide-react"
import { SignInButton } from "@/components/auth/sign-in-button"
import { auth } from "@/lib/auth"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ reset?: string }>
}) {
  const session = await auth.api.getSession({ headers: await headers() })

  if (session) {
    redirect("/dashboard")
  }

  const { reset } = await searchParams

  return (
    <div className="w-full max-w-sm space-y-6">
      {/* Logo + heading */}
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="flex items-center gap-2 mb-1">
          <Layers className="h-5 w-5 text-primary" />
          <span className="font-semibold text-foreground">Pixify</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Sign in to your Pixify account
        </p>
      </div>

      {/* Card */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-[0_0_30px_oklch(0.60_0.22_270_/_12%)]">
        {reset === "success" && (
          <p className="mb-4 text-sm text-green-600 dark:text-green-400 text-center">
            Password reset successfully. Please sign in with your new password.
          </p>
        )}
        <SignInButton />
      </div>

      {/* Footer links */}
      <div className="space-y-2 text-center text-sm text-muted-foreground">
        <p>
          Forgot password?{" "}
          <Link
            href="/forgot-password"
            className="text-primary hover:underline"
          >
            Reset it
          </Link>
        </p>
        <p>
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
