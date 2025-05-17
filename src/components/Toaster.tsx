"use client"

import { Toast, ToastTitle, ToastDescription, ToastClose, ToastViewport } from "@/components/ui/toast"
import { useToast } from "./ui/toast-context"

export function Toaster() {
  const { toasts, dismissToast } = useToast()

  return (
    <>
      {toasts.map(({ id, title, description, variant, ...props }) => (
        <Toast
          key={id}
          variant={variant}
          {...props}
          onOpenChange={() => dismissToast(id)}
        >
          <div className="grid gap-1">
            {title && <ToastTitle>{title}</ToastTitle>}
            {description && <ToastDescription>{description}</ToastDescription>}
          </div>
          <ToastClose />
        </Toast>
      ))}
      <ToastViewport />
    </>
  )
}