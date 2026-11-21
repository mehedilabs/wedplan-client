"use client";

import { useEffect, useState } from "react";
import { X, Power, PowerOff, LoaderCircle, AlertTriangle } from "lucide-react";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { updateAdminServiceActive } from "@/lib/api/admin-service-api";
import type { Service } from "@/types/service";

interface ServiceActiveDialogProps {
  service: Service | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ServiceActiveDialog(props: ServiceActiveDialogProps) {
  const { service, isOpen } = props;

  const dialogKey = `${service?._id ?? "no-service"}-${service?.isActive ?? "no-status"}-${isOpen ? "open" : "closed"}`;

  return <ServiceActiveDialogContent key={dialogKey} {...props} />;
}

function ServiceActiveDialogContent({
  service,
  isOpen,
  onClose,
  onSuccess,
}: ServiceActiveDialogProps) {
  const [isActive, setIsActive] = useState<boolean>(service?.isActive ?? true);
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

    if (service.isActive === isActive) {
      toast.add({
        title: "No Change",
        description: `Service is already ${isActive ? "active" : "inactive"}`,
        type: "info",
      });
      onClose();
      return;
    }

    try {
      setIsSubmitting(true);

      const message = await updateAdminServiceActive(service._id, isActive);

      toast.add({
        title: "Availability Updated",
        description:
          message ||
          `Service was successfully ${isActive ? "activated" : "deactivated"}`,
        type: "success",
      });

      onSuccess();
      onClose();
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to update service availability";

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
              <span className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                <Power className="size-4" />
              </span>

              <div>
                <h2 className="font-heading text-lg font-bold text-foreground">
                  Update Service Availability
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
                Current Availability
              </p>
              <p className="text-sm font-semibold text-foreground">
                {service.isActive ? "Active (Listed)" : "Inactive (Paused)"}
              </p>
            </div>

            <div className="space-y-2.5">
              {/* Active Option */}
              <label
                className={`relative flex items-start gap-3.5 rounded-xl border p-3.5 transition cursor-pointer ${
                  isActive
                    ? "border-emerald-400 bg-emerald-50/60 ring-1 ring-emerald-300"
                    : "border-border/80 bg-background/50 hover:border-border hover:bg-muted/30"
                }`}
              >
                <input
                  type="radio"
                  name="service-active"
                  checked={isActive}
                  onChange={() => setIsActive(true)}
                  className="mt-1 size-4 accent-emerald-600"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="flex size-6 items-center justify-center rounded-md bg-emerald-100 text-emerald-700">
                      <Power className="size-3.5" />
                    </span>

                    <span className="text-sm font-bold text-foreground">
                      Active (Accepting Bookings)
                    </span>

                    {service.isActive && (
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                        Current
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    Service is active. If approved by admin, customers can
                    discover and book this service on WedPlan.
                  </p>
                </div>
              </label>

              {/* Inactive Option */}
              <label
                className={`relative flex items-start gap-3.5 rounded-xl border p-3.5 transition cursor-pointer ${
                  !isActive
                    ? "border-zinc-400 bg-zinc-100/70 ring-1 ring-zinc-300"
                    : "border-border/80 bg-background/50 hover:border-border hover:bg-muted/30"
                }`}
              >
                <input
                  type="radio"
                  name="service-active"
                  checked={!isActive}
                  onChange={() => setIsActive(false)}
                  className="mt-1 size-4 accent-zinc-700"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="flex size-6 items-center justify-center rounded-md bg-zinc-200 text-zinc-700">
                      <PowerOff className="size-3.5" />
                    </span>

                    <span className="text-sm font-bold text-foreground">
                      Inactive (Paused)
                    </span>

                    {!service.isActive && (
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                        Current
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    Temporarily hides the service from public view and prevents
                    new booking requests.
                  </p>
                </div>
              </label>
            </div>

            {/* Inactive Warning */}
            {!isActive && (
              <div className="flex items-start gap-2.5 rounded-xl border border-amber-200/80 bg-amber-50/70 p-3 text-xs text-amber-800">
                <AlertTriangle className="size-4 shrink-0 mt-0.5 text-amber-600" />

                <div>
                  <p className="font-semibold">Deactivation Notice</p>
                  <p className="mt-0.5 text-amber-700/90 leading-relaxed">
                    Deactivating this service will immediately remove it from
                    public search results and category exploration. Existing
                    confirmed bookings are not deleted.
                  </p>
                </div>
              </div>
            )}
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
              className="rounded-full cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle className="mr-2 size-4 animate-spin" />
                  Saving...
                </>
              ) : isActive ? (
                "Activate Service"
              ) : (
                "Deactivate Service"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
