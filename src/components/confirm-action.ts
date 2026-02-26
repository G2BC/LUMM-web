import { Alert } from "@/components/alert";

type ConfirmActionOptions = {
  title: string;
  text: string;
  confirmButtonText: string;
  cancelButtonText: string;
  requireCode?: boolean;
  codeLabel?: string;
  codePlaceholder?: string;
  codeInvalidMessage?: string;
};

export async function confirmAction(options: ConfirmActionOptions): Promise<boolean> {
  const {
    title,
    text,
    confirmButtonText,
    cancelButtonText,
    requireCode = false,
    codeLabel = "",
    codePlaceholder = "",
    codeInvalidMessage = "",
  } = options;

  const confirmationCode = requireCode ? String(Math.floor(1000 + Math.random() * 9000)) : null;

  const result = await Alert({
    icon: "warning",
    title,
    html: requireCode
      ? `
        <p>${text}</p>
        <p style="margin-top:10px">
          ${codeLabel}
          <strong style="font-family:monospace;font-size:18px">${confirmationCode}</strong>
        </p>
      `
      : text,
    input: requireCode ? "text" : undefined,
    inputPlaceholder: requireCode ? codePlaceholder : undefined,
    inputValidator: requireCode
      ? (value: string) => (value?.trim() === confirmationCode ? undefined : codeInvalidMessage)
      : undefined,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
  });

  return result.isConfirmed;
}
