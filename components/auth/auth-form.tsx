"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { Input } from "@/components/input/input";
import { PasswordInput } from "@/components/password-input/password-input";

type Mode = "login" | "signup";

type Message = {
  type: "error" | "success";
  text: string;
} | null;

const toggleClassName =
  "flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors duration-200";

export function AuthForm() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<Message>(null);

  const isSignup = mode === "signup";

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSignup && password !== confirmPassword) {
      setMessage({ type: "error", text: "As senhas não coincidem." });
      return;
    }

    router.push("/passwords");
  };

  const handleModeChange = (next: Mode) => {
    setMode(next);
    setMessage(null);
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="w-full max-w-md rounded-lg border border-border bg-card p-6">
      <div className="flex flex-col items-center gap-2">
        <span className="grid size-11 place-items-center rounded-lg bg-primary text-background">
          <ShieldCheck className="size-5" />
        </span>
        <h1 className="text-lg font-semibold tracking-tight text-foreground">
          Vaultify
        </h1>
        <p className="text-sm text-muted">
          {isSignup
            ? "Crie sua conta para começar."
            : "Entre para acessar suas senhas."}
        </p>
      </div>

      <div
        role="tablist"
        aria-label="Modo de acesso"
        className="mt-6 flex gap-1 rounded-lg bg-background p-1"
      >
        <button
          type="button"
          role="tab"
          aria-selected={mode === "login"}
          onClick={() => handleModeChange("login")}
          className={`${toggleClassName} ${mode === "login" ? "bg-primary text-background" : "text-muted hover:text-foreground"}`}
        >
          Entrar
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={isSignup}
          onClick={() => handleModeChange("signup")}
          className={`${toggleClassName} ${isSignup ? "bg-primary text-background" : "text-muted hover:text-foreground"}`}
        >
          Criar conta
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        {isSignup && (
          <Input
            label="Nome"
            variant="card"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Seu nome"
            autoFocus
            required
          />
        )}

        <Input
          label="E-mail"
          type="email"
          variant="card"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="voce@email.com"
          autoFocus={!isSignup}
          required
        />

        <PasswordInput
          label="Senha"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="••••••••"
          required
        />

        {isSignup && (
          <PasswordInput
            label="Confirmar senha"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="••••••••"
            required
          />
        )}

        {message && (
          <p
            className={
              message.type === "error"
                ? "text-sm text-red-400"
                : "text-sm text-primary"
            }
          >
            {message.text}
          </p>
        )}

        <button
          type="submit"
          className="mt-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-background transition-colors duration-200 hover:bg-primary/90"
        >
          {isSignup ? "Criar conta" : "Entrar"}
        </button>
      </form>
    </div>
  );
}
