"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangleIcon, HelpCircleIcon } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "primary";
}

/**
 * ConfirmModal
 * A premium reusable confirmation dialog with smooth animations.
 */
export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Konfirmasi",
  cancelLabel = "Batal",
  variant = "primary"
}: ConfirmModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-sm p-0 overflow-hidden" showCloseButton={false}>
        <DialogHeader className="p-8 text-center">
          <div className={cn(
            "flex size-16 items-center justify-center rounded-2xl mx-auto mb-4 shadow-inner",
            variant === "danger" ? "bg-destructive/10 text-destructive" : "bg-primary-50 text-primary"
          )}>
            {variant === "danger" ? (
              <AlertTriangleIcon className="size-7" />
            ) : (
              <HelpCircleIcon className="size-7" />
            )}
          </div>

          <DialogTitle className="text-xl font-black text-text-primary">
            {title}
          </DialogTitle>
          <DialogDescription className="text-sm font-medium leading-relaxed text-text-secondary">
            {message}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="grid grid-cols-2 gap-0 border-t border-border sm:flex-none">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="h-14 rounded-none border-r border-border text-[0.65rem] font-black uppercase tracking-[0.2em] text-text-muted"
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant={variant === "danger" ? "destructive" : "ghost"}
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={cn(
              "h-14 rounded-none text-[0.65rem] font-black uppercase tracking-[0.2em]",
              variant === "primary" && "text-primary hover:bg-primary-50"
            )}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
