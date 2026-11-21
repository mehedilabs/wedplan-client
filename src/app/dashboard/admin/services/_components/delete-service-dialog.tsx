"use client";

import { useEffect, useState } from "react";
import {
  X,
  Trash2,
  AlertTriangle,
  LoaderCircle,
} from "lucide-react";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { deleteAdminService } from "@/lib/api/admin-service-api";
import type { Service } from "@/types/service";

interface DeleteServiceDialogProps {
  service: Service | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function DeleteServiceDialog({
  service,
  isOpen,
  onClose,
  onSuccess,
}: DeleteServiceDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen && !isDeleting) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, isDeleting, onClose]);

  if (!isOpen || !service) return null;

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const message = await deleteAdminService(service._id);

      toast.add({
        title: "Service Deleted",
        description:
          message || `"${service.serviceName}" was successfully deleted`,
        type: "success",
      });

      onSuccess();
      onClose();
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete service";
      toast.add({
        title: "Deletion Failed",
        description: errorMessage,
        type: "error",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={() => !isDeleting && onClose()}
      />

      {/* Modal Dialog Card */}
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-rose-200 bg-card shadow-2xl transition-all">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/70 px-5 py-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-lg bg-rose-100 text-rose-600">
              <Trash2 className="size-4" />
            </span>
            <h2 className="font-heading text-lg font-bold text-foreground">
              Delete Service Listing
            </h2>
          </div>
          <button
            type="button"
            disabled={isDeleting}
            onClick={onClose}
            className="rounded-full p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-50 cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-4">
          <div className="rounded-xl border border-rose-100 bg-rose-50/60 p-4 space-y-2">
            <div className="flex items-center gap-2 text-rose-900 font-semibold text-sm">
              <AlertTriangle className="size-4 shrink-0 text-rose-600" />
              <span>Permanent Deletion Warning</span>
            </div>
            <p className="text-xs text-rose-700 leading-relaxed">
              Are you sure you want to permanently delete{" "}
              <strong className="text-rose-900 font-bold">
                {service.serviceName}
              </strong>
              ?
            </p>
          </div>

          <div className="rounded-xl border border-border/70 bg-muted/20 p-3.5 space-y-1.5 text-xs text-muted-foreground">
            <div className="flex justify-between">
              <span>Category:</span>
              <span className="font-medium text-foreground">
                {service.category}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Vendor:</span>
              <span className="font-medium text-foreground truncate max-w-[200px]">
                {service.vendorName} ({service.vendorEmail})
              </span>
            </div>
            <div className="flex justify-between">
              <span>Price:</span>
              <span className="font-medium text-foreground">
                ${service.price.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Service ID:</span>
              <span className="font-mono text-[11px] text-foreground">
                {service._id}
              </span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            This action cannot be undone. The service listing and its associated platform records will be permanently removed from the system.
          </p>
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse gap-2 border-t border-border/70 bg-muted/20 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-full cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className="rounded-full bg-rose-600 hover:bg-rose-700 text-white cursor-pointer"
          >
            {isDeleting ? (
              <>
                <LoaderCircle className="mr-2 size-4 animate-spin" />
                Deleting Service...
              </>
            ) : (
              "Yes, Delete Service"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
