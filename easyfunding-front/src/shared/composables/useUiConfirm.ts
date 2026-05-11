import { useConfirm } from "primevue/useconfirm";

type Variant = "danger" | "primary" | "neutral";

type UiConfirmOptions = {
  target?: EventTarget | null;
  header: string;
  message: string;

  acceptLabel?: string;
  rejectLabel?: string;

  variant?: Variant; 
  icon?: string;     

  onAccept: () => void;
  onReject?: () => void;
};

const ACCEPT_BY_VARIANT: Record<Variant, string> = {
  danger: "ui-confirm-accept ui-confirm-accept--danger",
  primary: "ui-confirm-accept ui-confirm-accept--primary",
  neutral: "ui-confirm-accept ui-confirm-accept--neutral",
};

export function useUiConfirm() {
  const confirm = useConfirm();

  function ask(opts: UiConfirmOptions) {
    const variant = opts.variant ?? "primary";

    confirm.require({
      target: opts.target as any,
      header: opts.header,
      message: opts.message,
      icon: opts.icon ?? (variant === "danger" ? "pi pi-exclamation-triangle" : "pi pi-info-circle"),
      acceptLabel: opts.acceptLabel ?? "Confirmar",
      rejectLabel: opts.rejectLabel ?? "Cancelar",

      acceptClass: ACCEPT_BY_VARIANT[variant],
      rejectClass: "ui-confirm-reject",

      accept: opts.onAccept,
      reject: opts.onReject,
    });
  }

  return { ask };
}
