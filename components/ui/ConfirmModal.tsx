"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  isOpen,
  title = "Warning",
  message = "This website plays audio.",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && onCancel();
    if (isOpen) document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        <div className="flex justify-center gap-4">
          <Button
            onClick={onConfirm}
            className="flex-auto bg-sky-600 hover:bg-sky-700 font-semibold"
          >
            OK
          </Button>
          <Button onClick={onCancel} className="flex-auto">
            Stay muted
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
