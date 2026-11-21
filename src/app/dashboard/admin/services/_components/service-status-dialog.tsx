"use client";

import { useEffect, useState } from "react";
import {
  X,
  CheckCircle2,
  XCircle,
  LoaderCircle,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { updateAdminServiceStatus } from "@/lib/api/admin-service-api";
import type { Service } from "@/types/service";

interface ServiceStatusDialogProps {
  service: Service | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ServiceStatusDialog(props: ServiceStatusDialogProps) {
  const { service, isOpen } = props;

  const dialogKey = `${service?._id ?? "no-service"}-${service?.status ?? "no-status"}-${isOpen ? "open" : "closed"}`;

  return <ServiceStatusDialogContent key={dialogKey} {...props} />;
}

function ServiceStatusDialogContent({
  service,
  isOpen,
  onClose,
  onSuccess,
}: ServiceStatusDialogProps) {
  const [selectedStatus, setSelectedStatus] = useState<"approved" | "rejected">(
    service?.status === "rejected" ? "rejected" : "approved",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen && !isSubmitting) {
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
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen || !service) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (service.status === selectedStatus) {
      toast.add({
        title: "No Change",
        description: `Service is already ${selectedStatus}`,
        type: "info",
      });
      onClose();
      return;
    }

    try {
      setIsSubmitting(true);

      const message = await updateAdminServiceStatus(
        service._id,
        selectedStatus,
      );

      toast.add({
        title: "Status Updated",
        description:
          message || `Service was successfully marked as ${selectedStatus}`,
        type: "success",
      });

      onSuccess();
      onClose();
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to update service approval status";

      toast.add({
        title: "Update Failed",
        description: errorMessage,
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={() => !isSubmitting && onClose()}
      />

      {/* Modal Dialog Card */}
      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-card shadow-2xl transition-all">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/70 px-5 py-4 sm:px-6">
            <div className="flex items-center gap-2.5">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <ShieldCheck className="size-4" />
              </span>

              <div>
                <h2 className="font-heading text-lg font-bold text-foreground">
                  Review Approval Status
                </h2>
                <p className="text-xs text-muted-foreground truncate max-w-[280px] sm:max-w-md">
                  {service.serviceName}
                </p>
              </div>
            </div>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={onClose}
              className="rounded-full p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-50 cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Options */}
          <div className="p-5 sm:p-6 space-y-4">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Current Status
              </p>
              <p className="text-sm font-semibold text-foreground capitalize">
                {service.status}
              </p>
            </div>

            <div className="space-y-2.5">
              {/* Approved Option */}
              <label
                className={`relative flex items-start gap-3.5 rounded-xl border p-3.5 transition cursor-pointer ${
                  selectedStatus === "approved"
                    ? "border-emerald-400 bg-emerald-50/60 ring-1 ring-emerald-300"
                    : "border-border/80 bg-background/50 hover:border-border hover:bg-muted/30"
                }`}
              >
                <input
                  type="radio"
                  name="service-status"
                  value="approved"
                  checked={selectedStatus === "approved"}
                  onChange={() => setSelectedStatus("approved")}
                  className="mt-1 size-4 accent-emerald-600"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="flex size-6 items-center justify-center rounded-md bg-emerald-100 text-emerald-700">
                      <CheckCircle2 className="size-3.5" />
                    </span>

                    <span className="text-sm font-bold text-foreground">
                      Approve Service
                    </span>

                    {service.status === "approved" && (
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                        Current
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    Grants platform approval. If active, this service will be
                    visible to prospective couples on the public Browse Services
                    marketplace.
                  </p>
                </div>
              </label>

              {/* Rejected Option */}
              <label
                className={`relative flex items-start gap-3.5 rounded-xl border p-3.5 transition cursor-pointer ${
                  selectedStatus === "rejected"
                    ? "border-rose-400 bg-rose-50/60 ring-1 ring-rose-300"
                    : "border-border/80 bg-background/50 hover:border-border hover:bg-muted/30"
                }`}
              >
                <input
                  type="radio"
                  name="service-status"
                  value="rejected"
                  checked={selectedStatus === "rejected"}
                  onChange={() => setSelectedStatus("rejected")}
                  className="mt-1 size-4 accent-rose-600"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="flex size-6 items-center justify-center rounded-md bg-rose-100 text-rose-700">
                      <XCircle className="size-3.5" />
                    </span>

                    <span className="text-sm font-bold text-foreground">
                      Reject Service
                    </span>

                    {service.status === "rejected" && (
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                        Current
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    Rejects this submission. A rejected service is immediately
                    hidden from customer browse views.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col-reverse gap-2 border-t border-border/70 bg-muted/20 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-full cursor-pointer"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting}
              className={`rounded-full cursor-pointer ${
                selectedStatus === "rejected"
                  ? "bg-rose-600 hover:bg-rose-700 text-white"
                  : ""
              }`}
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle className="mr-2 size-4 animate-spin" />
                  Updating...
                </>
              ) : selectedStatus === "approved" ? (
                "Approve Service"
              ) : (
                "Reject Service"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
