"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  LoaderCircle,
  MapPin,
  PackageOpen,
  Pencil,
  PlusCircle,
  RefreshCw,
  Store,
  Trash2,
  X,
  XCircle,
} from "lucide-react";
import { toast } from "@/components/ui/toast";

import { authClient } from "@/lib/auth-client";
import {
  getVendorServices,
  deleteService,
  updateServiceAvailability,
} from "@/lib/api/service-api";
import { Button } from "@/components/ui/button";
import EditServiceDialog from "./_components/edit-service-dialog";
import type { Service } from "@/types/service";
import { cn } from "@/lib/utils";

const approvalConfig = {
  approved: {
    label: "Approved",
    icon: CheckCircle2,
    badge:
      "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    bar: "from-emerald-400 to-emerald-600",
  },
  pending: {
    label: "Pending",
    icon: Clock,
    badge:
      "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400",
    bar: "from-amber-400 to-amber-600",
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    badge: "border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-400",
    bar: "from-rose-400 to-rose-600",
  },
};

type ApprovalKey = keyof typeof approvalConfig;

const gridCols =
  "@[48rem]:grid-cols-[minmax(0,2.4fr)_6rem_7rem_10.5rem_9.5rem]";

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}
function formatDate(date: string) {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
}

export default function VendorServicesPage() {
  const { data: session, isPending } = authClient.useSession();
  const userId = session?.user?.id;

  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingService, setEditingService] = useState<Service | null>(null);
  const [deletingService, setDeletingService] = useState<Service | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  async function handleToggleAvailability(service: Service) {
    const serviceId = String(service._id);
    const nextState = !service.isActive;

    setTogglingId(serviceId);

    try {
      await updateServiceAvailability(serviceId, nextState);

      setServices((prev) =>
        prev.map((item) =>
          item._id === service._id ? { ...item, isActive: nextState } : item,
        ),
      );

      toast.add({
        title: nextState ? "Service Activated" : "Service Deactivated",
        description: nextState
          ? service.status === "pending"
            ? "Your service is active, but it is still awaiting admin approval. Once approved, it will be visible to customers."
            : "Your service is now active and available for public browsing."
          : service.status === "pending"
            ? "Your service is inactive. Even after admin approval, it will remain hidden from customers until you activate it."
            : "Your service is inactive and hidden from public bookings.",
        type: "success",
      });
    } catch (err) {
      toast.add({
        title: "Failed to update service status",
        description:
          err instanceof Error
            ? err.message
            : "Something went wrong. Please try again.",
        type: "error",
      });
    } finally {
      setTogglingId(null);
    }
  }

  const fetchServices = useCallback(async () => {
    if (isPending) return;

    if (!userId) {
      setServices([]);
      setError("Unable to identify your vendor account. Please sign in again.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const data = await getVendorServices(userId);
      setServices(data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load your services. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [isPending, userId]);

  useEffect(() => {
    const loadServices = async () => {
      await fetchServices();
    };

    void loadServices();
  }, [fetchServices]);

  async function handleDeleteService() {
    if (!deletingService || !userId) return;

    setIsDeleting(true);

    try {
      await deleteService(deletingService._id, userId);

      toast.add({
        title: "Service Deleted",
        description: "Your service has been deleted successfully.",
        type: "success",
      });

      setDeletingService(null);

      await fetchServices();
    } catch (error) {
      toast.add({
        title: "Delete Failed",
        description:
          error instanceof Error
            ? error.message
            : "Failed to delete service. Please try again.",
        type: "error",
      });
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* ---------- Page Header ---------- */}
      <header className="relative overflow-hidden rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-7">
        <div className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-accent/15 blur-3xl" />

        <div className="relative flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div className="flex items-start gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25 sm:size-14">
              <Store className="size-6" />
            </span>

            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <span className="h-px w-6 bg-gradient-to-r from-accent to-transparent sm:w-8" />
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
                  Vendor Workspace
                </p>
              </div>

              <h1 className="mt-2 font-heading text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">
                My <span className="italic text-primary">Services</span>
              </h1>

              <p className="mt-1.5 text-sm text-muted-foreground">
                Manage and keep track of all your wedding service listings.
              </p>
            </div>
          </div>

          <Button
            className="w-full shrink-0 rounded-full shadow-md shadow-primary/25 sm:w-auto"
            nativeButton={false}
            render={<Link href="/dashboard/vendor/add-service" />}
          >
            <PlusCircle className="mr-2 size-4" />
            Add New Service
          </Button>
        </div>
      </header>

      {/* ---------- Service Count ---------- */}
      {!isLoading && !error && (
        <div className="inline-flex items-center gap-2.5 rounded-full border border-border bg-card px-4 py-2 shadow-sm">
          <Store className="size-4 text-primary" />

          <p className="text-sm text-muted-foreground">
            You have{" "}
            <span className="font-semibold text-foreground">
              {services.length} {services.length === 1 ? "service" : "services"}
            </span>{" "}
            in your workspace.
          </p>
        </div>
      )}

      {/* ---------- Loading State ---------- */}
      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="flex animate-pulse items-center gap-4 rounded-2xl border border-border bg-card p-4"
            >
              <div className="size-16 shrink-0 rounded-xl bg-muted" />

              <div className="flex-1 space-y-2.5">
                <div className="h-3 w-24 rounded-full bg-muted" />
                <div className="h-5 w-2/3 max-w-xs rounded-full bg-muted" />
                <div className="h-3 w-1/2 max-w-[14rem] rounded-full bg-muted" />
              </div>

              <div className="hidden h-9 w-40 rounded-full bg-muted sm:block" />
            </div>
          ))}
        </div>
      )}

      {/* ---------- Error State ---------- */}
      {!isLoading && error && (
        <div className="relative overflow-hidden rounded-3xl border border-rose-500/30 bg-rose-500/10 px-5 py-12 text-center">
          <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-rose-500/15 text-rose-600 ring-8 ring-rose-500/10 dark:text-rose-400">
            <Store className="size-7" />
          </span>

          <h2 className="mt-4 font-heading text-2xl font-semibold text-foreground">
            Unable to Load Services
          </h2>

          <p className="mx-auto mt-1.5 max-w-md text-sm leading-6 text-rose-700 dark:text-rose-400">
            {error}
          </p>

          <Button
            variant="outline"
            className="mt-5 rounded-full border-rose-500/30 text-rose-700 hover:bg-rose-500/10 dark:text-rose-400"
            onClick={() => void fetchServices()}
          >
            <RefreshCw className="mr-2 size-4" />
            Try Again
          </Button>
        </div>
      )}

      {/* ---------- Empty State ---------- */}
      {!isLoading && !error && services.length === 0 && (
        <div className="relative overflow-hidden rounded-3xl border border-dashed border-accent/60 bg-card/70 px-5 py-14 text-center sm:py-16">
          <div className="pointer-events-none absolute -top-16 left-1/2 size-48 -translate-x-1/2 rounded-full bg-accent/15 blur-3xl" />

          <span className="relative mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary ring-8 ring-primary/5">
            <PackageOpen className="size-7" />
          </span>

          <h2 className="relative mt-5 font-heading text-3xl font-semibold text-foreground">
            No Services Yet
          </h2>

          <p className="relative mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
            You haven&apos;t added any wedding services yet. Create your first
            listing to get started.
          </p>

          <Button
            className="relative mt-5 rounded-full shadow-md shadow-primary/25"
            nativeButton={false}
            render={<Link href="/dashboard/vendor/add-service" />}
          >
            <PlusCircle className="mr-2 size-4" />
            Add Your First Service
          </Button>
        </div>
      )}

      {/* ---------- Services table ---------- */}
      {!isLoading && !error && services.length > 0 && (
        <div className="@container">
          <div
            className={cn(
              "mb-2.5 hidden items-center gap-4 rounded-2xl border border-border bg-secondary/70 py-3 pl-6 pr-5 text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground @[48rem]:grid",
              gridCols,
            )}
          >
            <span>Service</span>
            <span>Price</span>
            <span>Approval</span>
            <span>Availability</span>
            <span className="text-right">Actions</span>
          </div>

          <div className="space-y-2.5">
            {services.map((service) => {
              const serviceId = String(service._id);
              const isToggling = togglingId === serviceId;

              const approvalKey = (service.status || "pending") as ApprovalKey;
              const approval =
                approvalConfig[approvalKey] ?? approvalConfig.pending;
              const ApprovalIcon = approval.icon;

              return (
                <article
                  key={service._id}
                  className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:border-accent/50 hover:shadow-lg hover:shadow-primary/5"
                >
                  {/* Approval line */}
                  <span
                    aria-hidden="true"
                    className={`absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b ${approval.bar}`}
                  />

                  <div
                    className={cn(
                      "space-y-3 p-4 pl-5 @[48rem]:grid @[48rem]:items-center @[48rem]:gap-4 @[48rem]:space-y-0 @[48rem]:py-3.5 @[48rem]:pl-6 @[48rem]:pr-5",
                      gridCols,
                    )}
                  >
                    {/* ----- Service ----- */}
                    <div className="flex min-w-0 items-center gap-3.5">
                      <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-muted ring-2 ring-accent/30 @[48rem]:size-16">
                        {service.images[0] ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={service.images[0]}
                            alt={service.serviceName}
                            className={cn(
                              "size-full object-cover transition-transform duration-500 group-hover:scale-110",
                              !service.isActive && "opacity-70 grayscale",
                            )}
                          />
                        ) : (
                          <div className="flex size-full items-center justify-center">
                            <Store className="size-6 text-muted-foreground/40" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">
                          {service.category}
                        </p>

                        <h2
                          className="truncate font-heading text-lg font-semibold leading-tight text-foreground @[48rem]:text-xl"
                          title={service.serviceName}
                        >
                          {service.serviceName}
                        </h2>

                        <p className="mt-1 flex min-w-0 flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-muted-foreground">
                          <span className="flex min-w-0 items-center gap-1">
                            <MapPin className="size-3 shrink-0 text-accent" />
                            <span className="truncate">{service.location}</span>
                          </span>
                          <span className="flex shrink-0 items-center gap-1">
                            <CalendarDays className="size-3 text-accent" />
                            {formatDate(service.createdAt)}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 border-t border-dashed border-border pt-3 @[48rem]:contents">
                      <p className="font-heading text-xl font-semibold leading-none text-primary @[48rem]:text-lg">
                        {formatPrice(service.price)}
                      </p>

                      <div>
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold",
                            approval.badge,
                          )}
                        >
                          <ApprovalIcon className="size-3" />
                          {approval.label}
                        </span>
                      </div>
                    </div>

                    {/* ----- Availability ----- */}
                    <div className="flex items-center justify-between gap-3 @[48rem]:justify-start">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground @[48rem]:hidden">
                        Availability
                      </span>

                      {service.status !== "rejected" ? (
                        <div
                          role="group"
                          aria-label="Service status"
                          aria-busy={isToggling}
                          className="inline-flex items-center rounded-full border border-border bg-muted/70 p-0.5"
                        >
                          {isToggling && (
                            <LoaderCircle className="mx-1.5 size-3.5 animate-spin text-primary" />
                          )}

                          <button
                            type="button"
                            aria-pressed={service.isActive}
                            disabled={isToggling}
                            onClick={() => {
                              if (!service.isActive) {
                                void handleToggleAvailability(service);
                              }
                            }}
                            className={cn(
                              "inline-flex cursor-pointer items-center justify-center rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60",
                              service.isActive
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : "text-muted-foreground hover:bg-background hover:text-foreground",
                            )}
                          >
                            Active
                          </button>

                          <button
                            type="button"
                            aria-pressed={!service.isActive}
                            disabled={isToggling}
                            onClick={() => {
                              if (service.isActive) {
                                void handleToggleAvailability(service);
                              }
                            }}
                            className={cn(
                              "inline-flex cursor-pointer items-center justify-center rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60",
                              !service.isActive
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : "text-muted-foreground hover:bg-background hover:text-foreground",
                            )}
                          >
                            Inactive
                          </button>
                        </div>
                      ) : (
                        <span className="rounded-full border border-border bg-muted px-3 py-1 text-[11px] font-semibold text-muted-foreground">
                          {service.isActive ? "Active" : "Inactive"}
                        </span>
                      )}
                    </div>

                    {/* ----- Actions ----- */}
                    <div className="grid grid-cols-2 gap-2 border-t border-border pt-3 @[48rem]:border-0 @[48rem]:pt-0">
                      <button
                        type="button"
                        onClick={() => setEditingService(service)}
                        aria-label={`Edit ${service.serviceName}`}
                        className="inline-flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-border bg-card text-xs font-semibold text-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:bg-primary/10 hover:text-primary active:translate-y-0 active:scale-95"
                      >
                        <Pencil className="size-3.5" />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeletingService(service)}
                        aria-label={`Delete ${service.serviceName}`}
                        className="inline-flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/5 text-xs font-semibold text-rose-600 transition-all duration-200 hover:-translate-y-0.5 hover:border-rose-500/60 hover:bg-rose-500/10 active:translate-y-0 active:scale-95 dark:text-rose-400"
                      >
                        <Trash2 className="size-3.5" />
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}

      {/* ---------- Edit Service Dialog ---------- */}
      {editingService && userId && (
        <EditServiceDialog
          service={editingService}
          vendorId={userId}
          onClose={() => setEditingService(null)}
          onUpdated={() => void fetchServices()}
        />
      )}

      {/* ---------- Delete Confirmation Dialog ---------- */}
      {deletingService && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !isDeleting) {
              setDeletingService(null);
            }
          }}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-service-title"
            aria-describedby="delete-service-description"
            className="w-full max-w-md rounded-3xl border border-border bg-background p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="flex size-14 items-center justify-center rounded-full bg-rose-500/10 text-rose-600 ring-8 ring-rose-500/5 dark:text-rose-400">
                <Trash2 className="size-6" />
              </span>

              <button
                type="button"
                onClick={() => setDeletingService(null)}
                disabled={isDeleting}
                className="flex size-8 cursor-pointer items-center justify-center rounded-full bg-secondary text-muted-foreground transition hover:bg-primary hover:text-primary-foreground disabled:opacity-50"
                aria-label="Close delete confirmation"
              >
                <X className="size-4" />
              </button>
            </div>

            <h2
              id="delete-service-title"
              className="mt-4 font-heading text-2xl font-semibold text-foreground"
            >
              Delete Service?
            </h2>

            <p
              id="delete-service-description"
              className="mt-2 text-sm leading-6 text-muted-foreground"
            >
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                {deletingService.serviceName}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                variant="outline"
                className="cursor-pointer rounded-full"
                disabled={isDeleting}
                onClick={() => setDeletingService(null)}
              >
                Cancel
              </Button>

              <Button
                className="cursor-pointer rounded-full bg-destructive text-white hover:bg-destructive/90"
                disabled={isDeleting}
                onClick={() => void handleDeleteService()}
              >
                {isDeleting ? (
                  <>
                    <LoaderCircle className="mr-2 size-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="mr-2 size-4" />
                    Delete Service
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
