"use client";

import Image from "next/image";
import {
  Activity,
  Ban,
  Briefcase,
  Calendar,
  Check,
  CheckCircle2,
  Clock3,
  Crown,
  Eye,
  SearchX,
  Shield,
  Tag,
  Trash2,
  User,
  UserCog,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import type { AdminUser } from "@/types/admin-user";

interface UserTableProps {
  users: AdminUser[];
  onViewDetails: (user: AdminUser) => void;
  onChangeRole: (user: AdminUser) => void;
  onChangeStatus: (user: AdminUser) => void;
  onDeleteUser: (user: AdminUser) => void;
  onResetFilters?: () => void;
}

const statusConfig = {
  active: {
    label: "Active",
    icon: Check,
    badge:
      "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    dot: "bg-emerald-500",
    bar: "from-emerald-400 to-emerald-600",
  },
  inactive: {
    label: "Inactive",
    icon: Clock3,
    badge:
      "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400",
    dot: "bg-amber-500",
    bar: "from-amber-400 to-amber-600",
  },
  blocked: {
    label: "Blocked",
    icon: Ban,
    badge: "border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-400",
    dot: "bg-rose-500",
    bar: "from-rose-400 to-rose-600",
  },
};

const roleConfig = {
  admin: {
    label: "Admin",
    icon: Shield,
    badge: "border-foreground/20 bg-foreground text-background",
  },
  vendor: {
    label: "Vendor",
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

function formatDate(dateString?: string) {
  if (!dateString) return "N/A";

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "N/A";
  }
}

function getStatus(user: AdminUser) {
  const raw = (user.status || "active") as StatusKey;
  const key: StatusKey = statusConfig[raw] ? raw : "active";
  return { key, config: statusConfig[key] };
}

function getRole(user: AdminUser) {
  const key = (user.role || "customer") as RoleKey;
  return roleConfig[key] ?? roleConfig.customer;
}

// শুধু vendor-এর plan থাকবে, বাকিদের null
function getVendorPlan(user: AdminUser) {
  if (user.role !== "vendor") return null;

  const plan = String(user.subscriptionPlan || "free").toLowerCase();
  return { isPremium: plan.includes("premium") };
}

/* ---------- Action button ---------- */

function ActionButton({
  label,
  icon: Icon,
  onClick,
  variant = "default",
  ariaLabel,
}: {
  label: string;
  icon: typeof Eye;
  onClick: () => void;
  variant?: "primary" | "default" | "success" | "danger";
  ariaLabel: string;
}) {
  const variants = {
    primary:
      "border-primary bg-primary text-primary-foreground shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/30",
    default:
      "border-border bg-card text-foreground hover:border-primary/50 hover:bg-primary/10 hover:text-primary",
    success:
      "border-border bg-card text-foreground hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-700 dark:hover:text-emerald-400",
    danger:
      "border-rose-500/30 bg-rose-500/5 text-rose-600 hover:border-rose-500/60 hover:bg-rose-500/10 dark:text-rose-400",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={`inline-flex h-10 cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-xl border px-1 text-xs font-semibold transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 ${variants[variant]}`}
    >
      <Icon className="size-3.5 shrink-0" />
      {label}
    </button>
  );
}

/* ---------- User card ---------- */

function UserCard({
  user,
  onViewDetails,
  onChangeRole,
  onChangeStatus,
  onDeleteUser,
}: {
  user: AdminUser;
  onViewDetails: (user: AdminUser) => void;
  onChangeRole: (user: AdminUser) => void;
  onChangeStatus: (user: AdminUser) => void;
  onDeleteUser: (user: AdminUser) => void;
}) {
  const { config: status } = getStatus(user);
  const role = getRole(user);
  const RoleIcon = role.icon;
  const StatusIcon = status.icon;
  const plan = getVendorPlan(user);
  const isPremiumVendor = Boolean(plan?.isPremium);

  return (
    <article
      className={`group relative overflow-hidden rounded-3xl border bg-card shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/10 ${
        isPremiumVendor
          ? "border-accent/60 ring-1 ring-accent/20 hover:border-accent"
          : "border-border hover:border-accent/50"
      }`}
    >
      {/* Status line: ছোট কার্ডে উপরে, চওড়া কার্ডে বামে */}
      <span
        aria-hidden="true"
        className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${status.bar} @[44rem]:inset-x-auto @[44rem]:inset-y-0 @[44rem]:left-0 @[44rem]:h-auto @[44rem]:w-1.5 @[44rem]:bg-gradient-to-b`}
      />

      <div className="pt-1.5 @[44rem]:grid @[44rem]:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)_19rem] @[44rem]:items-center @[44rem]:gap-5 @[44rem]:py-4 @[44rem]:pt-4">
        {/* ---------- Column 1: user info ---------- */}
        <div className="p-5 pb-3 @[44rem]:p-0 @[44rem]:pl-6">
          <div className="flex items-center gap-3.5">
            {/* Avatar */}
            <span className="relative shrink-0">
              <span
                className={`relative flex size-14 items-center justify-center overflow-hidden rounded-full bg-primary/10 ring-2 ${
                  isPremiumVendor ? "ring-accent" : "ring-accent/40"
                }`}
              >
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                ) : (
                  <span className="font-heading text-xl font-semibold text-primary">
                    {user.name?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                )}
              </span>

              <span
                className={`absolute -bottom-0.5 -right-0.5 size-4 rounded-full border-2 border-card ${status.dot}`}
              />

              {isPremiumVendor && (
                <span className="absolute -left-1 -top-1 flex size-5 items-center justify-center rounded-full border-2 border-card bg-accent text-accent-foreground shadow-sm">
                  <Crown className="size-2.5" />
                </span>
              )}
            </span>

            {/* Name + email */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <h3 className="truncate font-heading text-xl font-semibold leading-tight text-foreground">
                  {user.name}
                </h3>

                {user.emailVerified && (
                  <span title="Email verified" className="inline-flex shrink-0">
                    <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
                  </span>
                )}
              </div>

              <p
                className="mt-0.5 truncate text-xs text-muted-foreground"
                title={user.email}
              >
                {user.email}
              </p>
            </div>
          </div>

          {/* Badges: role, status, vendor plan */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${role.badge}`}
            >
              <RoleIcon className="size-3" />
              {role.label}
            </span>

            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${status.badge}`}
            >
              <StatusIcon className="size-3" />
              {status.label}
            </span>

            {plan &&
              (plan.isPremium ? (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/40 bg-gradient-to-r from-accent via-[#E6C77E] to-accent px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-accent-foreground shadow-sm">
                  <Crown className="size-3" />
                  Premium Plan
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
                  <Tag className="size-3" />
                  Free Plan
                </span>
              ))}
          </div>
        </div>

        {/* ---------- Column 2: business + joined ---------- */}
        <div className="mx-5 flex flex-wrap items-center justify-between gap-2 border-t border-dashed border-border py-3 text-xs text-muted-foreground @[44rem]:mx-0 @[44rem]:flex-col @[44rem]:items-start @[44rem]:justify-center @[44rem]:gap-2 @[44rem]:border-0 @[44rem]:py-0">
          {user.businessName && (
            <span className="inline-flex max-w-full items-center gap-1.5 rounded-lg bg-accent/15 px-2 py-1 text-[11px] font-semibold text-foreground">
              <Briefcase className="size-3 shrink-0 text-accent" />
              <span className="truncate">{user.businessName}</span>
            </span>
          )}

          <span className="inline-flex items-center gap-1.5">
            <Calendar className="size-3.5 text-accent" />
            Joined {formatDate(user.createdAt)}
          </span>
        </div>

        {/* ---------- Column 3: actions ---------- */}
        <div className="grid grid-cols-4 gap-2 border-t border-border bg-secondary/40 p-3 @[44rem]:border-0 @[44rem]:bg-transparent @[44rem]:p-0 @[44rem]:pr-5">
          <ActionButton
            label="View"
            icon={Eye}
            variant="primary"
            onClick={() => onViewDetails(user)}
            ariaLabel={`View details for ${user.name}`}
          />
          <ActionButton
            label="Role"
            icon={UserCog}
            onClick={() => onChangeRole(user)}
            ariaLabel={`Change role for ${user.name}`}
          />
          <ActionButton
            label="Status"
            icon={Activity}
            variant="success"
            onClick={() => onChangeStatus(user)}
            ariaLabel={`Change status for ${user.name}`}
          />
          <ActionButton
            label="Delete"
            icon={Trash2}
            variant="danger"
            onClick={() => onDeleteUser(user)}
            ariaLabel={`Delete user ${user.name}`}
          />
        </div>
      </div>
    </article>
  );
}

/* ---------- Main component ---------- */

export default function UserTable({
  users,
  onViewDetails,
  onChangeRole,
  onChangeStatus,
  onDeleteUser,
  onResetFilters,
}: UserTableProps) {
  if (users.length === 0) {
    return (
      <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-3xl border border-dashed border-accent/60 bg-card/70 p-10 text-center sm:p-14">
        <div className="pointer-events-none absolute -top-16 left-1/2 size-48 -translate-x-1/2 rounded-full bg-accent/15 blur-3xl" />

        <div className="relative flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary ring-8 ring-primary/5">
          <SearchX className="size-7" />
        </div>

        <h3 className="relative mt-5 font-heading text-2xl font-semibold text-foreground">
          No users match your criteria
        </h3>

        <p className="relative mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
          Try adjusting your search query, clearing filters, or checking back
          later as new users register.
        </p>

        {onResetFilters && (
          <Button
            type="button"
            variant="outline"
            onClick={onResetFilters}
            className="relative mt-5 cursor-pointer rounded-full"
          >
            Clear Filters
          </Button>
        )}
      </div>
    );
  }

  const counts = users.reduce(
    (acc, user) => {
      const key = getStatus(user).key;
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <div className="space-y-4">
      {/* ---------- Summary strip ---------- */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-semibold text-foreground shadow-sm">
          <Users className="size-3.5 text-primary" />
          {users.length} {users.length === 1 ? "user" : "users"}
        </span>

        {(Object.keys(statusConfig) as StatusKey[]).map((key) => {
          const config = statusConfig[key];
          const count = counts[key] ?? 0;

          return (
            <span
              key={key}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${config.badge} ${
                count === 0 ? "opacity-50" : ""
              }`}
            >
              <span className={`size-1.5 rounded-full ${config.dot}`} />
              {count} {config.label}
            </span>
          );
        })}
      </div>

      {/* ---------- Cards: mobile 1 • tablet 2 • PC 1 (চওড়া কার্ড) ---------- */}
      <div className="@container">
        <div className="grid grid-cols-1 gap-4 @lg:grid-cols-2 @[44rem]:grid-cols-1">
          {users.map((user) => (
            <UserCard
              key={user._id}
              user={user}
              onViewDetails={onViewDetails}
              onChangeRole={onChangeRole}
              onChangeStatus={onChangeStatus}
              onDeleteUser={onDeleteUser}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
