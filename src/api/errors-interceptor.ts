import type { AxiosError } from "axios";
import { API } from ".";
import { Alert } from "@/components/alert";

type ApiErrorPayload = {
  message?: string;
  detail?: string | string[];
  errors?: Record<string, string[] | string>;
};

function extractMessage(err: AxiosError<ApiErrorPayload>) {
  const data = err.response?.data;
  if (typeof data === "string") return data;

  const candidates: Array<string | undefined> = [
    data?.message,
    Array.isArray(data?.detail) ? data.detail.join("\n") : (data?.detail as string),
    data?.errors
      ? Object.entries(data.errors)
          .map(([field, msgs]) => `• ${field}: ${Array.isArray(msgs) ? msgs.join(", ") : msgs}`)
          .join("\n")
      : undefined,
    err.message,
  ];

  return candidates.find(Boolean) ?? "Falha ao comunicar com o servidor.";
}

let lastShownAt = 0;
const COOLDOWN_MS = 1200;
function showOnce(opts: {
  title: string;
  text?: string;
  icon?: "error" | "warning" | "info" | "success";
}) {
  const now = Date.now();
  if (now - lastShownAt < COOLDOWN_MS) return;
  lastShownAt = now;
  Alert({ ...opts, confirmButtonText: "Fechar" });
}

function showAlert(err: AxiosError<ApiErrorPayload>) {
  const status = err.response?.status;

  if (!status) {
    if (err.code === "ECONNABORTED") {
      return showOnce({
        title: "Tempo de resposta excedido",
        icon: "warning",
        text: "Tente novamente em instantes.",
      });
    }

    return showOnce({
      title: "Sem conexão com o servidor",
      icon: "error",
      text: "Verifique sua internet e tente de novo.",
    });
  }

  if (status === 401) {
    return showOnce({
      title: "Sessão expirada",
      icon: "warning",
      text: "Faça login novamente para continuar.",
    });
  }

  if (status === 403) {
    return showOnce({
      title: "Acesso negado",
      icon: "warning",
      text: "Você não tem permissão para esta ação.",
    });
  }

  if (status === 404) {
    return showOnce({
      title: "Não encontrado",
      icon: "info",
      text: "O recurso solicitado não foi localizado.",
    });
  }

  if (status === 400 || status === 422) {
    return showOnce({ title: "Dados inválidos", icon: "warning", text: extractMessage(err) });
  }

  if (status >= 500) {
    return showOnce({
      title: "Erro interno",
      icon: "error",
      text: "Tente novamente em alguns instantes.",
    });
  }

  return showOnce({ title: "Erro", icon: "error", text: extractMessage(err) });
}

API.interceptors.response.use(
  (res) => res,
  (error: AxiosError<ApiErrorPayload>) => {
    if (typeof window !== "undefined") {
      showAlert(error);
    }
    return Promise.reject(error);
  }
);
