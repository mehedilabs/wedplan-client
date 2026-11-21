"use client";

import { useEffect, useState } from "react";
import {
  X,
  Shield,
  Briefcase,
  User,
  LoaderCircle,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { updateAdminUserRole } from "@/lib/api/admin-user-api";
import type { AdminUser, AdminUserRole } from "@/types/admin-user";

interface ChangeRoleDialogProps {
  user: AdminUser | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const roleOptions: {
  id: AdminUserRole;
  title: string;
  description: string;
  icon: typeof User;
  badgeClass: string;
}[] = [
  {
    id: "customer",
    title: "Customer",
    description:
      "Can browse services, write reviews, and submit booking requests.",
    icon: User,
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
  },
  {
    id: "vendor",
    title: "Vendor",
    description:
      "Can list wedding services, accept bookings, and manage vendor profile.",
    icon: Briefcase,
    badgeClass: "bg-primary/10 text-primary border-primary/20",
  },
  {
    id: "admin",
    title: "Administrator",
    description:
      "Full access to platform management, users, services, and transactions.",
    icon: Shield,
    badgeClass: "bg-zinc-900 text-zinc-100 border-zinc-800",
  },
];

export default function ChangeRoleDialog({
  user,
  isOpen,
  onClose,
  onSuccess,
}: ChangeRoleDialogProps) {
  if (!isOpen || !user) return null;

  return (
    <ChangeRoleDialogContent
      key={user._id}
      user={user}
      onClose={onClose}
      onSuccess={onSuccess}
    />
  );
}

function ChangeRoleDialogContent({
  user,
  onClose,
  onSuccess,
}: {
  user: AdminUser;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [selectedRole, setSelectedRole] = useState<AdminUserRole>(user.role);
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

    if (selectedRole === user.role) {
      toast.add({
        title: "No Change",
        description: `User is already assigned the ${selectedRole} role`,
        type: "info",
      });
      onClose();
      return;
    }

    try {
      setIsSubmitting(true);
      const message = await updateAdminUserRole(user._id, selectedRole);

      toast.add({
        title: "Role Updated",
        description:
          message || `User role successfully changed to ${selectedRole}`,
        type: "success",
      });

      onSuccess();
      onClose();
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update user role";

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
                <Shield className="size-4" />
              </span>
              <div>
                <h2 className="font-heading text-lg font-bold text-foreground">
                  Change User Role
                </h2>
                <p className="text-xs text-muted-foreground truncate max-w-[280px] sm:max-w-md">
                  Update permissions for {user.name} ({user.email})
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
              Select the new role to grant this user:
            </p>

            <div className="space-y-2.5">
              {roleOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = selectedRole === option.id;
                const isCurrent = user.role === option.id;

                return (
                  <label
                    key={option.id}
                    className={`relative flex items-start gap-3.5 rounded-xl border p-3.5 transition cursor-pointer ${
                      isSelected
                        ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                        : "border-border/80 bg-background/50 hover:border-border hover:bg-muted/30"
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={option.id}
                      checked={isSelected}
                      onChange={() => setSelectedRole(option.id)}
                      className="mt-1 size-4 accent-primary"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="flex size-6 items-center justify-center rounded-md bg-muted text-foreground">
                          <Icon className="size-3.5" />
                        </span>
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

                    {isSelected && (
                      <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
                    )}
                  </label>
                );
              })}
            </div>

            {/* Warning Callout */}
            <div className="flex items-start gap-2.5 rounded-xl border border-amber-200/80 bg-amber-50/70 p-3 text-xs text-amber-800">
              <AlertTriangle className="size-4 shrink-0 mt-0.5 text-amber-600" />
              <div>
                <p className="font-semibold">Session Revocation Notice</p>
                <p className="mt-0.5 text-amber-700/90 leading-relaxed">
                  Changing this role will immediately revoke the user&apos;s
                  active sessions. They will receive their updated permissions
                  the next time they sign in.
                </p>
              </div>
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
              className="rounded-full cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle className="mr-2 size-4 animate-spin" />
                  Updating Role...
                </>
              ) : (
                "Save Role"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
