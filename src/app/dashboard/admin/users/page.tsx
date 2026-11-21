"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Shield, RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAdminUsers } from "@/lib/api/admin-user-api";
import type { AdminUser } from "@/types/admin-user";

import UserFilters, { type UserCounts } from "./_components/user-filters";
import UserTable from "./_components/user-table";
import UserDetailsDialog from "./_components/user-details-dialog";
import ChangeRoleDialog from "./_components/change-role-dialog";
import ChangeStatusDialog from "./_components/change-status-dialog";
import DeleteUserDialog from "./_components/delete-user-dialog";

function AdminUsersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Read URL query parameters
  const roleParam = searchParams.get("role");
  const statusParam = searchParams.get("status");

  // Adjust local overrides when URL search parameters change
  const [roleOverride, setRoleOverride] = useState<string | null>(null);
  const [prevRoleParam, setPrevRoleParam] = useState(roleParam);

  if (roleParam !== prevRoleParam) {
    setPrevRoleParam(roleParam);
    setRoleOverride(null);
  }

  const [statusOverride, setStatusOverride] = useState<string | null>(null);
  const [prevStatusParam, setPrevStatusParam] = useState(statusParam);

  if (statusParam !== prevStatusParam) {
    setPrevStatusParam(statusParam);
    setStatusOverride(null);
  }

  // Active filter states derived directly from URL parameters or user override
  const [searchQuery, setSearchQuery] = useState("");
  const selectedRole =
    roleOverride ??
    (roleParam === "vendor" ||
    roleParam === "customer" ||
    roleParam === "admin"
      ? roleParam
      : "all");

  const selectedStatus =
    statusOverride ??
    (statusParam === "active" ||
    statusParam === "inactive" ||
    statusParam === "blocked"
      ? statusParam
      : "all");

  // Modal dialog states
  const [detailsUser, setDetailsUser] = useState<AdminUser | null>(null);
  const [roleUser, setRoleUser] = useState<AdminUser | null>(null);
  const [statusUser, setStatusUser] = useState<AdminUser | null>(null);
  const [deleteUser, setDeleteUser] = useState<AdminUser | null>(null);

  // Fetch users from API
  const loadUsers = useCallback(async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      const data = await getAdminUsers();
      setUsers(data);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to load registered users";
      setError(message);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;

    getAdminUsers()
      .then((data) => {
        if (!ignore) {
          setUsers(data);
        }
      })
      .catch((err: unknown) => {
        if (!ignore) {
          const message =
            err instanceof Error
              ? err.message
              : "Failed to load registered users";

          setError(message);
        }
      })
      .finally(() => {
        if (!ignore) {
          setIsLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  // Compute metrics / counts across all fetched users
  const counts: UserCounts = useMemo(() => {
    let customers = 0;
    let vendors = 0;
    let admins = 0;
    let active = 0;
    let inactive = 0;
    let blocked = 0;

    users.forEach((user) => {
      if (user.role === "customer") customers++;
      else if (user.role === "vendor") vendors++;
      else if (user.role === "admin") admins++;

      const st = user.status || "active";
      if (st === "active") active++;
      else if (st === "inactive") inactive++;
      else if (st === "blocked") blocked++;
    });

    return {
      total: users.length,
      customers,
      vendors,
      admins,
      active,
      inactive,
      blocked,
    };
  }, [users]);

  // Filter users based on search, role, and status
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // Search by name or email
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const nameMatch = user.name?.toLowerCase().includes(query);
        const emailMatch = user.email?.toLowerCase().includes(query);
        if (!nameMatch && !emailMatch) return false;
      }

      // Filter by role
      if (selectedRole !== "all") {
        if (user.role !== selectedRole) return false;
      }

      // Filter by status
      if (selectedStatus !== "all") {
        const userStatus = user.status || "active";
        if (userStatus !== selectedStatus) return false;
      }

      return true;
    });
  }, [users, searchQuery, selectedRole, selectedStatus]);

  const hasActiveFilters = Boolean(
    searchQuery.trim() || selectedRole !== "all" || selectedStatus !== "all",
  );

  // Sync role changes to state and URL search params
  const handleRoleChange = (role: string) => {
    setRoleOverride(role);
    const params = new URLSearchParams(searchParams.toString());
    if (role && role !== "all") {
      params.set("role", role);
    } else {
      params.delete("role");
    }
    const query = params.toString();
    router.replace(
      query ? `/dashboard/admin/users?${query}` : "/dashboard/admin/users",
      { scroll: false },
    );
  };

  // Sync status changes to state and URL search params
  const handleStatusChange = (status: string) => {
    setStatusOverride(status);
    const params = new URLSearchParams(searchParams.toString());
    if (status && status !== "all") {
      params.set("status", status);
    } else {
      params.delete("status");
    }
    const query = params.toString();
    router.replace(
      query ? `/dashboard/admin/users?${query}` : "/dashboard/admin/users",
      { scroll: false },
    );
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setRoleOverride("all");
    setStatusOverride("all");
    router.replace("/dashboard/admin/users", { scroll: false });
  };

  return (
    <div className="space-y-6">
      {/* ---------- Header Banner ---------- */}
      <header className="relative overflow-hidden rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-7">
        <div className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-accent/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-1/3 size-48 rounded-full bg-primary/5 blur-3xl" />

        <div className="relative flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div className="flex items-start gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25 sm:size-14">
              <Shield className="size-6" />
            </span>

            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
                  Platform Administration
                </p>
              </div>

              <h1 className="mt-2 font-heading text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">
                Manage <span className="italic text-primary">Users</span>
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
                Search, filter, view account details, change user roles, and
                manage active platform permissions.
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() => loadUsers(true)}
            disabled={isLoading || isRefreshing}
            className="h-11 shrink-0 cursor-pointer gap-2 self-start rounded-full border-border bg-card px-5 text-sm font-semibold text-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary sm:self-auto"
          >
            <RefreshCw
              className={`size-4 ${isRefreshing ? "animate-spin text-primary" : ""}`}
            />
            <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
          </Button>
        </div>
      </header>

      {/* ---------- Error State ---------- */}
      {error && !isLoading && (
        <div className="relative flex flex-col items-center justify-center space-y-4 overflow-hidden rounded-3xl border border-rose-500/30 bg-rose-500/10 p-8 text-center sm:p-10">
          <span className="flex size-14 items-center justify-center rounded-full bg-rose-500/15 text-rose-600 ring-8 ring-rose-500/10 dark:text-rose-400">
            <AlertCircle className="size-7" />
          </span>

          <div className="space-y-1.5">
            <h3 className="font-heading text-2xl font-semibold text-foreground">
              Unable to load users
            </h3>
            <p className="mx-auto max-w-md text-sm leading-6 text-rose-700 dark:text-rose-400">
              {error}
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() => loadUsers()}
            className="cursor-pointer gap-2 rounded-full border-rose-500/30 text-rose-700 hover:bg-rose-500/10 dark:text-rose-400"
          >
            <RefreshCw className="size-4" />
            Retry Loading
          </Button>
        </div>
      )}

      {/* ---------- Loading Skeleton ---------- */}
      {isLoading && (
        <div className="space-y-5">
          {/* Metric tiles */}
          <div className="grid animate-pulse grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className="h-20 rounded-2xl border border-border bg-card"
              />
            ))}
          </div>

          {/* Filter bar */}
          <div className="h-14 animate-pulse rounded-2xl border border-border bg-card" />

          {/* User cards */}
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="relative animate-pulse overflow-hidden rounded-3xl border border-border bg-card shadow-sm"
              >
                <div className="h-1.5 w-full bg-muted" />

                <div className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:gap-6">
                  <div className="flex flex-1 items-center gap-3.5">
                    <div className="size-14 shrink-0 rounded-full bg-muted" />

                    <div className="flex-1 space-y-2.5">
                      <div className="h-5 w-40 rounded-full bg-muted" />
                      <div className="h-3 w-56 max-w-full rounded-full bg-muted" />
                      <div className="flex gap-2 pt-1">
                        <div className="h-6 w-20 rounded-full bg-muted" />
                        <div className="h-6 w-16 rounded-full bg-muted" />
                      </div>
                    </div>
                  </div>

                  <div className="hidden h-4 w-36 rounded-full bg-muted lg:block" />

                  <div className="grid grid-cols-4 gap-2 lg:w-[19rem]">
                    {Array.from({ length: 4 }).map((__, j) => (
                      <div key={j} className="h-10 rounded-xl bg-muted" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------- Main Content ---------- */}
      {!isLoading && !error && (
        <div className="space-y-5">
          {/* Filters & Metrics */}
          <UserFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedRole={selectedRole}
            onRoleChange={handleRoleChange}
            selectedStatus={selectedStatus}
            onStatusChange={handleStatusChange}
            counts={counts}
            hasActiveFilters={hasActiveFilters}
            onReset={handleResetFilters}
          />

          {/* Table / Cards List */}
          <UserTable
            users={filteredUsers}
            onViewDetails={(u) => setDetailsUser(u)}
            onChangeRole={(u) => setRoleUser(u)}
            onChangeStatus={(u) => setStatusUser(u)}
            onDeleteUser={(u) => setDeleteUser(u)}
            onResetFilters={hasActiveFilters ? handleResetFilters : undefined}
          />

          {/* Results summary footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-full border border-dashed border-border bg-card/60 px-5 py-3 text-xs text-muted-foreground backdrop-blur-sm sm:text-sm">
            <span>
              Showing{" "}
              <strong className="font-semibold text-foreground">
                {filteredUsers.length}
              </strong>{" "}
              of{" "}
              <strong className="font-semibold text-foreground">
                {users.length}
              </strong>{" "}
              registered users
            </span>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="cursor-pointer font-medium text-primary hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* Action Modals                                            */}
      {/* ======================================================== */}

      {/* 1. User Details Modal */}
      <UserDetailsDialog
        user={detailsUser}
        isOpen={Boolean(detailsUser)}
        onClose={() => setDetailsUser(null)}
        onChangeRole={(u) => setRoleUser(u)}
        onChangeStatus={(u) => setStatusUser(u)}
      />

      {/* 2. Change Role Modal */}
      <ChangeRoleDialog
        user={roleUser}
        isOpen={Boolean(roleUser)}
        onClose={() => setRoleUser(null)}
        onSuccess={() => loadUsers()}
      />

      {/* 3. Change Status Modal */}
      <ChangeStatusDialog
        user={statusUser}
        isOpen={Boolean(statusUser)}
        onClose={() => setStatusUser(null)}
        onSuccess={() => loadUsers()}
      />

      {/* 4. Delete User Modal */}
      <DeleteUserDialog
        user={deleteUser}
        isOpen={Boolean(deleteUser)}
        onClose={() => setDeleteUser(null)}
        onSuccess={() => loadUsers()}
      />
    </div>
  );
}

function AdminUsersLoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-32 rounded-3xl border border-border bg-card" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="h-20 rounded-2xl border border-border bg-card"
          />
        ))}
      </div>
      <div className="h-14 rounded-2xl border border-border bg-card" />
    </div>
  );
}

export default function AdminUsersPage() {
  return (
    <Suspense fallback={<AdminUsersLoadingSkeleton />}>
      <AdminUsersContent />
    </Suspense>
  );
}
