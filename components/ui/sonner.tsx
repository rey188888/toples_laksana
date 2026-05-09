"use client"

import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4 text-emerald-500" />,
        info: <InfoIcon className="size-4 text-blue-500" />,
        warning: <TriangleAlertIcon className="size-4 text-amber-500" />,
        error: <OctagonXIcon className="size-4 text-red-500" />,
        loading: <Loader2Icon className="size-4 animate-spin text-primary-500" />,
      }}
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:bg-white group-[.toaster]:text-text-primary group-[.toaster]:border-border group-[.toaster]:rounded-xl font-bold tracking-tight",
          description: "group-[.toast]:text-text-secondary font-medium",
          actionButton: "group-[.toast]:bg-primary-500 group-[.toast]:text-white font-black uppercase tracking-widest text-[0.6rem] px-3 rounded-lg",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-text-secondary font-bold",
          success: "group-[.toast]:border-emerald-100! group-[.toast]:bg-emerald-50/50!",
          error: "group-[.toast]:border-red-100! group-[.toast]:bg-red-50/50!",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
