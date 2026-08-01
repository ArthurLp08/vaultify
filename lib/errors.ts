const FALLBACK_MESSAGE = "Algo deu errado. Tente novamente.";

export function getErrorMessage(error: unknown): string {
  if (typeof error === "string" && error.trim()) return error;

  if (error instanceof Error) {
    const message = error.message?.trim();
    if (message && message !== "{}") return message;

    return "Falha de conexão com o Supabase. Verifique as credenciais em .env.local e reinicie o servidor.";
  }

  return FALLBACK_MESSAGE;
}
