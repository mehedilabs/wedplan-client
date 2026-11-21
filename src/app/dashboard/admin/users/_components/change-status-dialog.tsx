"use client";

import { useEffect, useState } from "react";
import {
  X,
  Activity,
  CheckCircle2,
  AlertCircle,
  Ban,
  LoaderCircle,
  AlertTriangle,
} from "lucide-react";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { updateAdminUserStatus } from "@/lib/api/admin-user-api";
import type { AdminUser, AdminUserStatus } from "@/types/admin-user";

interface ChangeStatusDialogProps {
  user: AdminUser | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const statusOptions: {
  id: AdminUserStatus;
  title: string;
  description: string;
  icon: typeof CheckCircle2;
  borderClass: string;
  badgeClass: string;
  dotColor: string;
}[] = [
  {
    id: "active",
    title: "Active",
    description: "Account is in good standing with full platform access.",
    icon: CheckCircle2,
    borderClass: "border-emerald-300 bg-emerald-50/50",
    badgeClass: "text-emerald-700 bg-emerald-100",
    dotColor: "bg-emerald-500",
  },
  {
    id: "inactive",
    title: "Inactive",
    description:
      "Temporarily disabled. User cannot sign in and all active sessions are revoked.",
    icon: AlertCircle,
    borderClass: "border-amber-300 bg-amber-50/50",
    badgeClass: "text-amber-700 bg-amber-100",
    dotColor: "bg-amber-500",
  },
  {
    id: "blocked",
    title: "Blocked",
    description:
      "Account is suspended/banned. Access is blocked and active sessions are terminated.",
    icon: Ban,
    borderClass: "border-rose-300 bg-rose-50/50",
    badgeClass: "text-rose-700 bg-rose-100",
    dotColor: "bg-rose-500",
  },
];

export default function ChangeStatusDialog({
  user,
  isOpen,
  onClose,
  onSuccess,
}: ChangeStatusDialogProps) {
  if (!isOpen || !user) return null;

  return (
    <ChangeStatusDialogContent
      key={user._id}
      user={user}
      onClose={onClose}
      onSuccess={onSuccess}
    />
  );
}

function ChangeStatusDialogContent({
  user,
  onClose,
  onSuccess,
}: {
  user: AdminUser;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const currentStatus = user.status || "active";

  const [selectedStatus, setSelectedStatus] =
    useState<AdminUserStatus>(currentStatus);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && !isSubmitting) {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isSubmitting, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedStatus === currentStatus) {
      toast.add({
        title: "No Change",
        description: `User account is already ${selectedStatus}`,
        type: "info",
      });
      onClose();
      return;
    }

    try {
      setIsSubmitting(true);
      const message = await updateAdminUserStatus(user._id, selectedStatus);

      toast.add({
        title: "Status Updated",
        description: message || `User account status set to ${selectedStatus}`,
        type: "success",
      });

      onSuccess();
      onClose();
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update user status";

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
                <Activity className="size-4" />
              </span>
              <div>
                <h2 className="font-heading text-lg font-bold text-foreground">
                  Update Account Status
                </h2>
                <p className="text-xs text-muted-foreground truncate max-w-[280px] sm:max-w-md">
                  Manage access for {user.name} ({user.email})
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
            <p className="text-xs font-medium text-muted-foreground">
              Select the account status:
            </p>

            <div className="space-y-2.5">
              {statusOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = selectedStatus === option.id;
                const isCurrent = currentStatus === option.id;

                return (
                  <label
                    key={option.id}
                    className={`relative flex items-start gap-3.5 rounded-xl border p-3.5 transition cursor-pointer ${
                      isSelected
                        ? `${option.borderClass} ring-1 ring-primary/20`
                        : "border-border/80 bg-background/50 hover:border-border hover:bg-muted/30"
                    }`}
                  >
                    <input
                      type="radio"
                      name="status"
                      value={option.id}
                      checked={isSelected}
                      onChange={() => setSelectedStatus(option.id)}
                      className="mt-1 size-4 accent-primary"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`size-2 rounded-full ${option.dotColor}`}
                        />
                        <span className="text-sm font-bold text-foreground">
                          {option.title}
                        </span>
                        {isCurrent && (
                          <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {option.description}
                      </p>
                    </div>

                    <Icon className="size-4 text-muted-foreground shrink-0 mt-0.5" />
                  </label>
                );
              })}
            </div>

            {/* Inactive / Blocked Warning */}
            {selectedStatus !== "active" && (
              <div className="flex items-start gap-2.5 rounded-xl border border-rose-200/80 bg-rose-50/70 p-3 text-xs text-rose-800">
                <AlertTriangle className="size-4 shrink-0 mt-0.5 text-rose-600" />
                <div>
                  <p className="font-semibold">Security Enforcement Warning</p>
                  <p className="mt-0.5 text-rose-700/90 leading-relaxed">
                    Setting account to{" "}
                    <span className="font-bold uppercase tracking-wider">
                      {selectedStatus}
                    </span>{" "}
                    will immediately invalidate all active user sessions and
                    deny any further login attempts.
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
                  Updating Status...
                </>
              ) : (
                "Save Status"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
