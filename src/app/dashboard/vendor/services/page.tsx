"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  PlusCircle,
  Store,
  MapPin,
  CalendarDays,
  RefreshCw,
  PackageOpen,
  Pencil,
  Trash2,
  LoaderCircle,
  X,
} from "lucide-react";
import { toast } from "@/components/ui/toast";

import { authClient } from "@/lib/auth-client";
import { getVendorServices, deleteService } from "@/lib/api/service-api";
import { Button } from "@/components/ui/button";
import EditServiceDialog from "./_components/edit-service-dialog";
import type { Service } from "@/types/service";
import { cn } from "@/lib/utils";

function getStatusStyles(status: Service["status"]) {
  switch (status) {
    case "approved":
      return "border-green-200 bg-green-50 text-green-700";
    case "rejected":
      return "border-red-200 bg-red-50 text-red-700";
    default:
      return "border-amber-200 bg-amber-50 text-amber-700";
  }
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
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
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <Store className="size-3.5" />
            Vendor Workspace
          </div>

          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            My Services
          </h1>

          <p className="text-sm text-muted-foreground">
            Manage and keep track of all your wedding service listings.
          </p>
        </div>

        <Button
          className="w-full rounded-full shadow-md shadow-primary/20 sm:w-auto"
          nativeButton={false}
          render={<Link href="/dashboard/vendor/add-service" />}
        >
          <PlusCircle className="mr-2 size-4" />
          Add New Service
        </Button>
      </div>

      {/* Service Count */}
      {!isLoading && !error && (
        <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3">
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

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border border-border bg-card"
            >
              <div className="aspect-[16/10] animate-pulse bg-muted" />

              <div className="space-y-3 p-5">
                <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
                <div className="h-6 w-1/3 animate-pulse rounded bg-muted" />
                <div className="h-9 animate-pulse rounded-lg bg-muted" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {!isLoading && error && (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-5 py-12 text-center">
          <Store className="mx-auto size-9 text-destructive/70" />

          <h2 className="mt-3 font-heading text-lg font-semibold text-foreground">
            Unable to Load Services
          </h2>

          <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
            {error}
          </p>

          <Button
            variant="outline"
            className="mt-5 rounded-full"
            onClick={() => void fetchServices()}
          >
            <RefreshCw className="mr-2 size-4" />
            Try Again
          </Button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && services.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border bg-card/60 px-5 py-14 text-center sm:py-16">
          <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <PackageOpen className="size-7" />
          </span>

          <h2 className="mt-4 font-heading text-xl font-semibold text-foreground">
            No Services Yet
          </h2>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
            You haven&apos;t added any wedding services yet. Create your first
            listing to get started.
          </p>

          <Button
            className="mt-5 rounded-full"
            nativeButton={false}
            render={<Link href="/dashboard/vendor/add-service" />}
          >
            <PlusCircle className="mr-2 size-4" />
            Add Your First Service
          </Button>
        </div>
      )}

      {/* Services Grid */}
      {!isLoading && !error && services.length > 0 && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <article
              key={service._id}
              className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5"
            >
              {/* Service Image */}
              <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                {service.images[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={service.images[0]}
                    alt={service.serviceName}
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center">
                    <Store className="size-10 text-muted-foreground/40" />
                  </div>
                )}

                <span
                  className={cn(
                    "absolute left-3 top-3 rounded-full border px-3 py-1 text-[11px] font-semibold capitalize shadow-sm",
                    getStatusStyles(service.status),
                  )}
                >
                  {service.status}
                </span>
              </div>

              {/* Service Information */}
              <div className="space-y-4 p-5">
                <div className="space-y-1.5">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                    {service.category}
                  </p>

                  <h2 className="line-clamp-1 font-heading text-xl font-bold text-foreground">
                    {service.serviceName}
                  </h2>

                  <p className="line-clamp-2 min-h-10 text-sm leading-5 text-muted-foreground">
                    {service.description}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-lg font-bold text-foreground">
                    {formatPrice(service.price)}
                  </span>

                  <span
                    className={cn(
                      "rounded-full px-2.5 py-1 text-[10px] font-semibold",
                      service.isActive
                        ? "bg-green-50 text-green-700"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {service.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                <div className="flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
                  <span className="flex min-w-0 items-center gap-1.5">
                    <MapPin className="size-3.5 shrink-0" />
                    <span className="truncate">{service.location}</span>
                  </span>

                  <span className="flex shrink-0 items-center gap-1.5">
                    <CalendarDays className="size-3.5" />
                    {formatDate(service.createdAt)}
                  </span>
                </div>

                {/* Service Actions */}
                <div className="grid grid-cols-2 gap-3 border-t border-border pt-4">
                  <Button
                    variant="outline"
                    className="rounded-xl cursor-pointer"
                    onClick={() => setEditingService(service)}
                  >
                    <Pencil className="mr-2 size-4" />
                    Edit
                  </Button>

                  <Button
                    variant="outline"
                    className="rounded-xl border-destructive/30 text-destructive hover:bg-destructive/5 hover:text-destructive cursor-pointer"
                    onClick={() => setDeletingService(service)}
                  >
                    <Trash2 className="mr-2 size-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Edit Service Dialog */}
      {editingService && userId && (
        <EditServiceDialog
          service={editingService}
          vendorId={userId}
          onClose={() => setEditingService(null)}
          onUpdated={() => void fetchServices()}
        />
      )}

      {/* Delete Confirmation Dialog */}
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
            className="w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex size-12 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
                <Trash2 className="size-5" />
              </div>

              <button
                type="button"
                onClick={() => setDeletingService(null)}
                disabled={isDeleting}
                className="flex size-8 items-center justify-center cursor-pointer rounded-full text-muted-foreground transition hover:bg-muted disabled:opacity-50"
                aria-label="Close delete confirmation"
              >
                <X className="size-4" />
              </button>
            </div>

            <h2
              id="delete-service-title"
              className="mt-4 font-heading text-xl font-bold text-foreground"
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
                className="rounded-full cursor-pointer"
                disabled={isDeleting}
                onClick={() => setDeletingService(null)}
              >
                Cancel
              </Button>

              <Button
                className="rounded-full bg-destructive cursor-pointer text-white hover:bg-destructive/90"
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
