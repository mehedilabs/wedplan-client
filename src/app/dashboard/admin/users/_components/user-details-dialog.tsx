"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Activity,
  AlertCircle,
  Ban,
  Briefcase,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Clock3,
  Copy,
  Crown,
  KeyRound,
  Mail,
  Shield,
  ShieldCheck,
  Tag,
  User,
  UserCog,
  X,
} from "lucide-react";

import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import type { AdminUser } from "@/types/admin-user";

interface UserDetailsDialogProps {
  user: AdminUser | null;
  isOpen: boolean;
  onClose: () => void;
  onChangeRole: (user: AdminUser) => void;
  onChangeStatus: (user: AdminUser) => void;
}

const statusConfig = {
  active: {
    label: "Active",
    icon: Check,
    badge:
      "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  },
  inactive: {
    label: "Inactive",
    icon: Clock3,
    badge:
      "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400",
  },
  blocked: {
    label: "Blocked",
    icon: Ban,
    badge: "border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-400",
  },
};

const roleConfig = {
  admin: {
    label: "Administrator",
    icon: Shield,
    badge: "border-foreground/20 bg-foreground text-background",
  },
  vendor: {
    label: "Vendor Partner",
    icon: Briefcase,
    badge: "border-primary/25 bg-primary/10 text-primary",
  },
  customer: {
    label: "Customer",
    icon: User,
    badge: "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-400",
  },
};

type StatusKey = keyof typeof statusConfig;
type RoleKey = keyof typeof roleConfig;

function formatDate(dateString?: string, withTime = true) {
  if (!dateString) return "N/A";

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
    });
  } catch {
    return "N/A";
  }
}

export default function UserDetailsDialog({
  user,
  isOpen,
  onClose,
  onChangeRole,
  onChangeStatus,
}: UserDetailsDialogProps) {
  const [copiedId, setCopiedId] = useState(false);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
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
  }, [isOpen, onClose]);

  if (!isOpen || !user) return null;

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(user._id);
      setCopiedId(true);

      toast.add({
        title: "User ID Copied",
        description: "User ID copied to clipboard",
        type: "success",
      });

      setTimeout(() => setCopiedId(false), 2000);
    } catch {
      toast.add({
        title: "Copy Failed",
        description: "Could not copy user ID",
        type: "error",
      });
    }
  };

  const statusKey = (user.status || "active") as StatusKey;
  const status = statusConfig[statusKey] ?? statusConfig.active;
  const StatusIcon = status.icon;

  const roleKey = (user.role || "customer") as RoleKey;
  const role = roleConfig[roleKey] ?? roleConfig.customer;
  const RoleIcon = role.icon;

  const isAdmin = user.role === "admin";
  const isVendor = user.role === "vendor";

  const planName = String(user.subscriptionPlan || "free").toLowerCase();
  const isPremium = isVendor && planName.includes("premium");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 animate-in fade-in duration-200 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex size-8 cursor-pointer items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
          aria-label="Close dialog"
        >
          <X className="size-4" />
        </button>

        {/* Body */}
        <div className="max-h-[78vh] overflow-y-auto">
          {/* ---------- Profile header ---------- */}
          <div className="relative overflow-hidden px-6 pb-5 pt-8 text-center">
            <div className="pointer-events-none absolute -top-16 left-1/2 size-48 -translate-x-1/2 rounded-full bg-accent/15 blur-3xl" />

            <div className="relative mx-auto w-fit">
              <span
                className={`relative flex size-20 items-center justify-center overflow-hidden rounded-full bg-primary/10 ring-4 ${
                  isAdmin ? "ring-foreground/70" : "ring-accent/40"
                }`}
              >
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                ) : (
                  <span className="font-heading text-3xl font-semibold text-primary">
                    {user.name?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                )}
              </span>

              {/* Premium vendor crown */}
              {isPremium && (
                <span className="absolute -right-1 -top-1 flex size-7 items-center justify-center rounded-full border-2 border-card bg-accent text-accent-foreground shadow-md">
                  <Crown className="size-3.5" />
                </span>
              )}

              {/* Admin shield */}
              {isAdmin && (
                <span className="absolute -right-1 -top-1 flex size-7 items-center justify-center rounded-full border-2 border-card bg-foreground text-background shadow-md">
                  <Shield className="size-3.5" />
                </span>
              )}
            </div>

            <div className="relative mt-4 flex flex-wrap items-center justify-center gap-2">
              <h2 className="font-heading text-2xl font-semibold text-foreground">
                {user.name}
              </h2>

              {user.emailVerified ? (
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 className="size-3" />
                  Verified
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[11px] font-semibold text-amber-700 dark:text-amber-400">
                  <AlertCircle className="size-3" />
                  Unverified
                </span>
              )}
            </div>

            <p className="relative mt-1 flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
              <Mail className="size-3.5 shrink-0 text-accent" />
              <span className="truncate">{user.email}</span>
            </p>

            {/* ID + copy */}
            <div className="relative mt-3 inline-flex max-w-full items-center gap-1.5 rounded-full border border-border bg-background py-1 pl-3 pr-1.5 text-[11px] text-muted-foreground">
              <span className="truncate font-mono">ID: {user._id}</span>

              <button
                type="button"
                onClick={handleCopyId}
                className="inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                title="Copy User ID"
              >
                {copiedId ? (
                  <Check className="size-3" />
                ) : (
                  <Copy className="size-3" />
                )}
                {copiedId ? "Copied" : "Copy"}
              </button>
            </div>
          </div>

          <div className="space-y-3 px-5 pb-5 sm:px-6 sm:pb-6">
            {/* ---------- Role + Status ---------- */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-border bg-secondary/50 p-3.5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  User Role
                </p>
                <span
                  className={`mt-2 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${role.badge}`}
                >
                  <RoleIcon className="size-3" />
                  {role.label}
                </span>
              </div>

              <div className="rounded-2xl border border-border bg-secondary/50 p-3.5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Account Status
                </p>
                <span
                  className={`mt-2 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${status.badge}`}
                >
                  <StatusIcon className="size-3" />
                  {status.label}
                </span>
              </div>
            </div>

            {/* ---------- Admin: আলাদা কার্ড ---------- */}
            {isAdmin && (
              <div className="relative overflow-hidden rounded-2xl bg-foreground p-4 text-background">
                <div className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full bg-accent/25 blur-2xl" />

                <div className="relative flex items-center gap-3.5">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-background/10 text-accent ring-1 ring-background/20">
                    <ShieldCheck className="size-5" />
                  </span>

                  <div className="min-w-0">
                    <p className="font-heading text-lg font-semibold leading-tight">
                      Platform Administrator
                    </p>
                    <p className="mt-0.5 flex items-center gap-1.5 text-xs text-background/70">
                      <KeyRound className="size-3 shrink-0 text-accent" />
                      Full platform access
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ---------- Vendor: Business + Plan ---------- */}
            {isVendor && (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-border bg-secondary/50 p-3.5">
                  <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    <Briefcase className="size-3 text-accent" />
                    Business Name
                  </p>

                  <p className="mt-2 text-sm font-semibold text-foreground">
                    {user.businessName || (
                      <span className="text-xs font-normal italic text-muted-foreground">
                        Not set
                      </span>
                    )}
                  </p>
                </div>

                <div
                  className={`rounded-2xl border p-3.5 ${
                    isPremium
                      ? "border-accent/60 bg-accent/10"
                      : "border-border bg-secondary/50"
                  }`}
                >
                  <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    <Crown className="size-3 text-accent" />
                    Subscription
                  </p>

                  <div className="mt-2">
                    {isPremium ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/40 bg-gradient-to-r from-accent via-[#E6C77E] to-accent px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-accent-foreground shadow-sm">
                        <Crown className="size-3" />
                        Premium Plan
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
                        <Tag className="size-3" />
                        Free Plan
                      </span>
                    )}

                    {isPremium && user.subscriptionExpiresAt && (
                      <p className="mt-1.5 text-[11px] text-muted-foreground">
                        Expires {formatDate(user.subscriptionExpiresAt, false)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ---------- Timestamps ---------- */}
            <div className="space-y-2.5 rounded-2xl border border-dashed border-border bg-background/60 p-4 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="size-4 text-accent" />
                  Registered
                </span>
                <span className="font-medium text-foreground">
                  {formatDate(user.createdAt)}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="size-4 text-accent" />
                  Last Updated
                </span>
                <span className="font-medium text-foreground">
                  {formatDate(user.updatedAt)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ---------- Footer ---------- */}
        <div className="flex flex-col-reverse gap-2 border-t border-border bg-secondary/40 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="cursor-pointer rounded-full"
          >
            Close
          </Button>

          <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onClose();
                onChangeRole(user);
              }}
              className="cursor-pointer gap-1.5 rounded-full text-xs font-semibold"
            >
              <UserCog className="size-3.5 text-primary" />
              Change Role
            </Button>

            <Button
              type="button"
              onClick={() => {
                onClose();
                onChangeStatus(user);
              }}
              className="cursor-pointer gap-1.5 rounded-full text-xs font-semibold shadow-md shadow-primary/25"
            >
              <Activity className="size-3.5" />
              Change Status
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
