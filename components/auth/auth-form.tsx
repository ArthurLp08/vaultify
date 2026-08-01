"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/button/button";
import { Input } from "@/components/input/input";
import { PasswordInput } from "@/components/password-input/password-input";

type Mode = "login" | "signup";

type Message = {
  type: "error" | "success";
  text: string;
} | null;

const tabs: { mode: Mode; label: string }[] = [
  { mode: "login", label: "Entrar" },
  { mode: "signup", label: "Criar conta" },
];

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
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="w-full max-w-2xl rounded-lg border border-border bg-card p-6 shadow-card"
    >
      <div className="flex flex-col items-center gap-2">
        <span className="grid size-11 place-items-center rounded-lg bg-primary text-background shadow-sm shadow-primary/30">
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
        className="mt-6 grid grid-cols-2 gap-1 rounded-lg bg-background p-1"
      >
        {tabs.map(({ mode: tabMode, label }) => {
          const isSelected = mode === tabMode;

          return (
            <button
              key={tabMode}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => handleModeChange(tabMode)}
              className={`relative rounded-md px-4 py-2 text-sm font-medium transition-colors duration-200 ${isSelected ? "text-background" : "text-muted hover:text-foreground"}`}
            >
              {isSelected && (
                <motion.span
                  layoutId="auth-tab-pill"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  className="absolute inset-0 rounded-md bg-primary"
                />
              )}
              <span className="relative">{label}</span>
            </button>
          );
        })}
      </div>

      <motion.form onSubmit={handleSubmit} className="mt-6 flex flex-col">
        <AnimatePresence initial={false}>
          {isSignup && (
            <motion.div
              key="name-field"
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <Input
                label="Nome"
                variant="card"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Seu nome"
                autoFocus
                required
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mb-4">
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
        </div>

        <div className="mb-4">
          <PasswordInput
            label="Senha"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
            required
          />
        </div>

        <AnimatePresence initial={false}>
          {isSignup && (
            <motion.div
              key="confirm-field"
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <PasswordInput
                label="Confirmar senha"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="••••••••"
                required
              />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence initial={false}>
          {message && (
            <motion.div
              key={message.text}
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <p
                className={
                  message.type === "error"
                    ? "text-sm text-red-400"
                    : "text-sm text-primary"
                }
              >
                {message.text}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <Button type="submit">
          {isSignup ? "Criar conta" : "Entrar"}
        </Button>
      </motion.form>
    </motion.div>
  );
}
