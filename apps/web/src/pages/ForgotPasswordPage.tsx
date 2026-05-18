import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { useForgotPassword, useResetPassword } from "@/hooks/useApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link2, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

function LogoMark() {
  return (
    <div className="flex items-center gap-2.5 mb-8 justify-center">
      <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
        <Link2 className="w-4 h-4 text-primary-foreground" strokeWidth={2.5} />
      </div>
      <span className="text-xl font-bold tracking-tight text-foreground font-mono">
        Sniplink
      </span>
    </div>
  );
}

// ─── Request Reset ────────────────────────────────────────────────────────────

function RequestResetForm() {
  const forgotPassword = useForgotPassword();
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    forgotPassword.mutate({ email });
  };

  if (forgotPassword.isSuccess) {
    return (
      <Card className="shadow-2xl backdrop-blur-sm">
        <CardHeader className="pb-4">
          <LogoMark />
          <CardTitle className="text-2xl font-bold text-foreground text-center tracking-tight">
            Check your email
          </CardTitle>
          <CardDescription className="text-center text-sm">
            If an account exists for{" "}
            <span className="font-medium text-foreground">{email}</span>, you'll
            receive a reset link shortly.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center gap-2 py-2 text-sm text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Reset email sent</span>
          </div>
          <p className="mt-5 text-center text-sm text-muted-foreground">
            <Link
              to="/login"
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Back to sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-2xl backdrop-blur-sm">
      <CardHeader className="pb-4">
        <LogoMark />
        <CardTitle className="text-2xl font-bold text-foreground text-center tracking-tight">
          Forgot password?
        </CardTitle>
        <CardDescription className="text-center text-sm">
          Enter your email and we'll send you a reset link
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {forgotPassword.error && (
            <Alert className="bg-destructive/10 border-destructive/30 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                {(forgotPassword.error as Error).message}
              </AlertDescription>
            </Alert>
          )}
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-sm font-medium text-foreground">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={forgotPassword.isPending}
              className="h-10"
            />
          </div>
          <Button
            type="submit"
            disabled={forgotPassword.isPending || !email}
            className="w-full h-10 mt-2 transition-all duration-150"
          >
            {forgotPassword.isPending && (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            )}
            {forgotPassword.isPending ? "Sending…" : "Send reset link"}
          </Button>
        </form>
        <p className="mt-5 text-center text-sm text-muted-foreground">
          Remember your password?{" "}
          <Link
            to="/login"
            className="text-primary hover:text-primary/80 font-medium transition-colors"
          >
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

// ─── Reset Password ───────────────────────────────────────────────────────────

function ResetPasswordForm({ token }: { token: string }) {
  const navigate = useNavigate();
  const resetPassword = useResetPassword();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const mismatch = confirm.length > 0 && password !== confirm;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) return;
    resetPassword.mutate(
      { token, password },
      { onSuccess: () => navigate("/login") }
    );
  };

  return (
    <Card className="shadow-2xl backdrop-blur-sm">
      <CardHeader className="pb-4">
        <LogoMark />
        <CardTitle className="text-2xl font-bold text-foreground text-center tracking-tight">
          Set new password
        </CardTitle>
        <CardDescription className="text-center text-sm">
          Choose a strong password for your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {resetPassword.error && (
            <Alert className="bg-destructive/10 border-destructive/30 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                {(resetPassword.error as Error).message}
              </AlertDescription>
            </Alert>
          )}
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-sm font-medium text-foreground">
              New password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="min 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={resetPassword.isPending}
              className="h-10"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="confirm" className="text-sm font-medium text-foreground">
              Confirm password
            </Label>
            <Input
              id="confirm"
              type="password"
              placeholder="••••••••"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              disabled={resetPassword.isPending}
              className={`h-10 ${mismatch ? "border-destructive focus-visible:ring-destructive" : ""}`}
            />
            {mismatch && (
              <p className="text-xs text-destructive">Passwords don't match</p>
            )}
          </div>
          <Button
            type="submit"
            disabled={
              resetPassword.isPending || !password || !confirm || mismatch
            }
            className="w-full h-10 mt-2 transition-all duration-150"
          >
            {resetPassword.isPending && (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            )}
            {resetPassword.isPending ? "Updating…" : "Update password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

// ─── Page Shell ───────────────────────────────────────────────────────────────

export function ForgotPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/10 rounded-full blur-3xl" />
      </div>
      <div className="w-full max-w-sm relative z-10">
        {token ? <ResetPasswordForm token={token} /> : <RequestResetForm />}
      </div>
    </div>
  );
}
