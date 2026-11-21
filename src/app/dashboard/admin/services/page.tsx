"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Layers, RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAdminServices } from "@/lib/api/admin-service-api";
import type { Service } from "@/types/service";

import ServiceFilters, {
  type ServiceCounts,
  WEDDING_CATEGORIES,
} from "./_components/service-filters";
import ServiceTable from "./_components/service-table";
import ServiceDetailsDialog from "./_components/service-details-dialog";
import ServiceStatusDialog from "./_components/service-status-dialog";
import ServiceActiveDialog from "./_components/service-active-dialog";
import DeleteServiceDialog from "./_components/delete-service-dialog";

function AdminServicesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Read URL query parameters on initial render
  const statusParam = searchParams.get("status");
  const categoryParam = searchParams.get("category");
  const availParam = searchParams.get("availability");

  // Adjust local overrides when URL search parameters change
  const [statusOverride, setStatusOverride] = useState<string | null>(null);
  const [prevStatusParam, setPrevStatusParam] = useState(statusParam);

  if (statusParam !== prevStatusParam) {
    setPrevStatusParam(statusParam);
    setStatusOverride(null);
  }

  const [categoryOverride, setCategoryOverride] = useState<string | null>(null);
  const [prevCategoryParam, setPrevCategoryParam] = useState(categoryParam);

  if (categoryParam !== prevCategoryParam) {
    setPrevCategoryParam(categoryParam);
    setCategoryOverride(null);
  }

  const [availOverride, setAvailOverride] = useState<string | null>(null);
  const [prevAvailParam, setPrevAvailParam] = useState(availParam);

  if (availParam !== prevAvailParam) {
    setPrevAvailParam(availParam);
    setAvailOverride(null);
  }

  // Active filter states derived directly from URL parameters or user override
  const [searchQuery, setSearchQuery] = useState("");
  const selectedStatus =
    statusOverride ??
    (statusParam === "pending" ||
    statusParam === "approved" ||
    statusParam === "rejected"
      ? statusParam
      : "all");

  const selectedCategory =
    categoryOverride ??
    (categoryParam &&
    WEDDING_CATEGORIES.includes(
      categoryParam as (typeof WEDDING_CATEGORIES)[number],
    )
      ? categoryParam
      : "all");

  const selectedAvailability =
    availOverride ??
    (availParam === "active" || availParam === "inactive" ? availParam : "all");

  // Modal dialog states
  const [detailsService, setDetailsService] = useState<Service | null>(null);
  const [statusService, setStatusService] = useState<Service | null>(null);
  const [activeService, setActiveService] = useState<Service | null>(null);
  const [deleteService, setDeleteService] = useState<Service | null>(null);

  // Fetch services from API
  const loadServices = useCallback(async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      const data = await getAdminServices();
      setServices(data);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to load submitted wedding services";
      setError(message);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;

    getAdminServices()
      .then((data) => {
        if (!ignore) {
          setServices(data);
        }
      })
      .catch((err: unknown) => {
        if (!ignore) {
          const message =
            err instanceof Error
              ? err.message
              : "Failed to load submitted wedding services";
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

  // Compute counts across all fetched services
  const counts: ServiceCounts = useMemo(() => {
    let pending = 0;
    let approved = 0;
    let rejected = 0;
    let active = 0;
    let inactive = 0;

    services.forEach((service) => {
      if (service.status === "pending") pending++;
      else if (service.status === "approved") approved++;
      else if (service.status === "rejected") rejected++;

      if (service.isActive) active++;
      else inactive++;
    });

    return {
      total: services.length,
      pending,
      approved,
      rejected,
      active,
      inactive,
    };
  }, [services]);

  // Filter services based on search, status, category, availability
  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      // Search by service name, vendor name, vendor email, or location
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const nameMatch = service.serviceName?.toLowerCase().includes(query);
        const vendorNameMatch = service.vendorName
          ?.toLowerCase()
          .includes(query);
        const vendorEmailMatch = service.vendorEmail
          ?.toLowerCase()
          .includes(query);
        const locationMatch = service.location?.toLowerCase().includes(query);

        if (
          !nameMatch &&
          !vendorNameMatch &&
          !vendorEmailMatch &&
          !locationMatch
        ) {
          return false;
        }
      }

      // Filter by approval status
      if (selectedStatus !== "all") {
        if (service.status !== selectedStatus) return false;
      }

      // Filter by category
      if (selectedCategory !== "all") {
        if (service.category !== selectedCategory) return false;
      }

      // Filter by availability
      if (selectedAvailability !== "all") {
        const isTargetActive = selectedAvailability === "active";
        if (service.isActive !== isTargetActive) return false;
      }

      return true;
    });
  }, [
    services,
    searchQuery,
    selectedStatus,
    selectedCategory,
    selectedAvailability,
  ]);

  const hasActiveFilters = Boolean(
    searchQuery.trim() ||
    selectedStatus !== "all" ||
    selectedCategory !== "all" ||
    selectedAvailability !== "all",
  );

  // Sync status changes to URL search params
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
      query
        ? `/dashboard/admin/services?${query}`
        : "/dashboard/admin/services",
      { scroll: false },
    );
  };

  // Sync category changes to URL search params
  const handleCategoryChange = (category: string) => {
    setCategoryOverride(category);
    const params = new URLSearchParams(searchParams.toString());
    if (category && category !== "all") {
      params.set("category", category);
    } else {
      params.delete("category");
    }
    const query = params.toString();
    router.replace(
      query
        ? `/dashboard/admin/services?${query}`
        : "/dashboard/admin/services",
      { scroll: false },
    );
  };

  // Sync availability changes to URL search params
  const handleAvailabilityChange = (availability: string) => {
    setAvailOverride(availability);
    const params = new URLSearchParams(searchParams.toString());
    if (availability && availability !== "all") {
      params.set("availability", availability);
    } else {
      params.delete("availability");
    }
    const query = params.toString();
    router.replace(
      query
        ? `/dashboard/admin/services?${query}`
        : "/dashboard/admin/services",
      { scroll: false },
    );
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusOverride("all");
    setCategoryOverride("all");
    setAvailOverride("all");
    router.replace("/dashboard/admin/services", { scroll: false });
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
              <Layers className="size-6" />
            </span>

            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
                  Platform Administration
                </p>
              </div>

              <h1 className="mt-2 font-heading text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">
                Manage <span className="italic text-primary">Services</span>
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
                Review submitted wedding services, filter by category and
                status, approve or reject listings, and manage marketplace
                availability.
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() => loadServices(true)}
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
          <div className="flex size-14 items-center justify-center rounded-2xl bg-rose-500/20 text-rose-600 shadow-inner">
            <AlertCircle className="size-7" />
          </div>

          <div className="space-y-1">
            <h3 className="font-heading text-xl font-bold text-rose-900">
              Unable to load services
            </h3>
            <p className="max-w-md text-sm text-rose-700">{error}</p>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() => loadServices()}
            className="cursor-pointer rounded-full border-rose-300 bg-card px-6 text-xs font-semibold text-rose-800 shadow-sm hover:bg-rose-100"
          >
            Retry Loading
          </Button>
        </div>
      )}

      {/* ---------- Loading Skeleton ---------- */}
      {isLoading && (
        <div className="space-y-4">
          <div className="grid animate-pulse grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-16 rounded-xl border border-border/60 bg-muted/40"
              />
            ))}
          </div>

          <div className="h-14 animate-pulse rounded-2xl border border-border/60 bg-muted/30" />

          <div className="space-y-4 rounded-2xl border border-border/60 bg-card p-6 animate-pulse">
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <div className="h-4 w-32 rounded bg-muted/60" />
              <div className="h-4 w-20 rounded bg-muted/60" />
            </div>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 py-2">
                <div className="size-12 shrink-0 rounded-xl bg-muted/60" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-44 rounded bg-muted/60" />
                  <div className="h-3 w-64 rounded bg-muted/40" />
                </div>
                <div className="h-6 w-20 rounded-full bg-muted/40" />
                <div className="h-6 w-16 rounded-full bg-muted/40" />
                <div className="h-8 w-28 rounded bg-muted/30" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------- Main Content Area ---------- */}
      {!isLoading && !error && (
        <div className="space-y-5">
          {/* Filters & Metrics */}
          <ServiceFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedStatus={selectedStatus}
            onStatusChange={handleStatusChange}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            selectedAvailability={selectedAvailability}
            onAvailabilityChange={handleAvailabilityChange}
            counts={counts}
            hasActiveFilters={hasActiveFilters}
            onReset={handleResetFilters}
          />

          {/* Table / Cards List */}
          <ServiceTable
            services={filteredServices}
            onViewDetails={(s) => setDetailsService(s)}
            onReviewStatus={(s) => setStatusService(s)}
            onToggleActive={(s) => setActiveService(s)}
            onDeleteService={(s) => setDeleteService(s)}
            onResetFilters={hasActiveFilters ? handleResetFilters : undefined}
          />

          {/* Results summary footer */}
          <div className="flex items-center justify-between px-1 text-xs text-muted-foreground">
            <span>
              Showing{" "}
              <strong className="font-semibold text-foreground">
                {filteredServices.length}
              </strong>{" "}
              of{" "}
              <strong className="font-semibold text-foreground">
                {services.length}
              </strong>{" "}
              submitted services
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

      {/* 1. Service Details Modal */}
      <ServiceDetailsDialog
        service={detailsService}
        isOpen={Boolean(detailsService)}
        onClose={() => setDetailsService(null)}
        onReviewStatus={(s) => setStatusService(s)}
        onToggleActive={(s) => setActiveService(s)}
        onDelete={(s) => setDeleteService(s)}
      />

      {/* 2. Review Status (Approve/Reject) Modal */}
      <ServiceStatusDialog
        service={statusService}
        isOpen={Boolean(statusService)}
        onClose={() => setStatusService(null)}
        onSuccess={() => loadServices()}
      />

      {/* 3. Availability (Active/Inactive) Modal */}
      <ServiceActiveDialog
        service={activeService}
        isOpen={Boolean(activeService)}
        onClose={() => setActiveService(null)}
        onSuccess={() => loadServices()}
      />

      {/* 4. Delete Service Modal */}
      <DeleteServiceDialog
        service={deleteService}
        isOpen={Boolean(deleteService)}
        onClose={() => setDeleteService(null)}
        onSuccess={() => loadServices()}
      />
    </div>
  );
}

function AdminServicesLoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-32 rounded-3xl border border-border bg-card" />
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-16 rounded-xl border border-border bg-card"
          />
        ))}
      </div>
      <div className="h-14 rounded-2xl border border-border bg-card" />
    </div>
  );
}

export default function AdminServicesPage() {
  return (
    <Suspense fallback={<AdminServicesLoadingSkeleton />}>
      <AdminServicesContent />
    </Suspense>
  );
}
