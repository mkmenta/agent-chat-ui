"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { LangGraphLogoSVG } from "@/components/icons/langgraph";
import { ArrowRight, LoaderCircle } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: formData.get("username"),
        password: formData.get("password"),
      }),
    });

    if (res.ok) {
      router.push(searchParams.get("from") || "/");
      router.refresh();
    } else {
      setError("Invalid username or password.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4">
      <div className="animate-in fade-in-0 zoom-in-95 bg-background flex w-full max-w-sm flex-col rounded-lg border shadow-lg">
        <div className="mt-14 flex flex-col gap-2 border-b p-6">
          <div className="flex flex-col items-start gap-2">
            <LangGraphLogoSVG className="h-7" />
            <h1 className="text-xl font-semibold tracking-tight">Agent Chat</h1>
          </div>
          <p className="text-muted-foreground">Sign in to continue.</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-muted/50 flex flex-col gap-6 p-6"
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              autoComplete="username"
              required
              className="bg-background"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Password</Label>
            <PasswordInput
              id="password"
              name="password"
              autoComplete="current-password"
              required
              className="bg-background"
            />
          </div>

          {error && <p className="text-sm text-rose-500">{error}</p>}

          <div className="flex justify-end">
            <Button
              type="submit"
              size="lg"
              disabled={loading}
            >
              {loading ? (
                <LoaderCircle className="size-5 animate-spin" />
              ) : (
                <>
                  Sign in
                  <ArrowRight className="size-5" />
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
