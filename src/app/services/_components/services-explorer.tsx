"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  MapPin,
  SlidersHorizontal,
  ChevronDown,
  RotateCcw,
  SearchX,
} from "lucide-react";

import type { Service } from "@/types/service";
import ServiceCard from "@/components/services/service-card";

const CATEGORIES = [
  "Photography & Videography",
  "Wedding Venues",
  "Decoration & Florist",
  "Catering Services",
  "Makeup & Styling",
  "Wedding Fashion",
] as const;

interface ServicesExplorerProps {
  initialServices: Service[];
}

export default function ServicesExplorer({
  initialServices,
}: ServicesExplorerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Active filters from URL query parameters (source of truth)
  const urlSearch = searchParams.get("search") || "";
  const urlCategory = searchParams.get("category") || "All Categories";
  const urlLocation = searchParams.get("location") || "";
  const urlSort = searchParams.get("sort") || "newest";

  // Local form state
  const [searchTerm, setSearchTerm] = useState(urlSearch);
  const [selectedCategory, setSelectedCategory] = useState(urlCategory);
  const [locationTerm, setLocationTerm] = useState(urlLocation);
  const [selectedSort, setSelectedSort] = useState(urlSort);

  // Synchronize local form inputs when URL parameters change (e.g. browser back/forward or category clicks)
  useEffect(() => {
    setSearchTerm(urlSearch);
    setSelectedCategory(urlCategory);
    setLocationTerm(urlLocation);
    setSelectedSort(urlSort);
  }, [urlSearch, urlCategory, urlLocation, urlSort]);

  // Apply filters and sorting to the dynamically fetched services
  const filteredServices = useMemo(() => {
    const searchNormalized = urlSearch.toLowerCase().trim();
    const locationNormalized = urlLocation.toLowerCase().trim();

    const result = initialServices.filter((service) => {
      // 1. Keyword search: match against serviceName or description
      if (searchNormalized) {
        const nameMatch = service.serviceName
          ?.toLowerCase()
          .includes(searchNormalized);
        const descMatch = service.description
          ?.toLowerCase()
          .includes(searchNormalized);
        if (!nameMatch && !descMatch) return false;
      }

      // 2. Category filter
      if (urlCategory && urlCategory !== "All Categories") {
        if (service.category !== urlCategory) return false;
      }

      // 3. Location filter: case-insensitive match
      if (locationNormalized) {
        const locMatch = service.location
          ?.toLowerCase()
          .includes(locationNormalized);
        if (!locMatch) return false;
      }

      return true;
    });

    // 4. Sorting
    result.sort((a, b) => {
      if (urlSort === "price-low") {
        return a.price - b.price;
      }
      if (urlSort === "price-high") {
        return b.price - a.price;
      }
      // Default: Featured & Newest (newest first based on createdAt)
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return timeB - timeA;
    });

    return result;
  }, [initialServices, urlSearch, urlCategory, urlLocation, urlSort]);

  // Apply search/filter and update URL query parameters
  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const params = new URLSearchParams();

    if (searchTerm.trim()) {
      params.set("search", searchTerm.trim());
    }

    if (selectedCategory && selectedCategory !== "All Categories") {
      params.set("category", selectedCategory);
    }

    if (locationTerm.trim()) {
      params.set("location", locationTerm.trim());
    }

    if (selectedSort && selectedSort !== "newest") {
      params.set("sort", selectedSort);
    }

    const queryString = params.toString();
    router.push(queryString ? `/services?${queryString}` : "/services");
  };

  // Reset all filters and remove query parameters
  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All Categories");
    setLocationTerm("");
    setSelectedSort("newest");
    router.push("/services");
  };

  const hasActiveFilters = Boolean(
    urlSearch ||
      (urlCategory && urlCategory !== "All Categories") ||
      urlLocation ||
      (urlSort && urlSort !== "newest"),
  );

  return (
    <div className="space-y-8">
      {/* Search and Filter Bar Card */}
      <form
        onSubmit={handleSearchSubmit}
        className="rounded-2xl border border-border bg-card p-3 shadow-sm sm:p-3.5"
      >
        <div className="flex flex-col gap-2.5 lg:flex-row lg:items-center">
          {/* Keyword Search */}
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search service name or keyword..."
              className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-3.5 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/70 hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>

          {/* Category Dropdown */}
          <div className="relative w-full lg:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-11 w-full appearance-none rounded-xl border border-border bg-background pl-3.5 pr-9 text-sm text-foreground outline-none transition-all hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/10 cursor-pointer"
            >
              <option value="All Categories">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          </div>

          {/* Location Filter */}
          <div className="relative w-full lg:w-52">
            <MapPin className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={locationTerm}
              onChange={(e) => setLocationTerm(e.target.value)}
              placeholder="Filter by city / location..."
              className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-3.5 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/70 hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>

          {/* Sorting Dropdown */}
          <div className="relative w-full lg:w-48">
            <SlidersHorizontal className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="h-11 w-full appearance-none rounded-xl border border-border bg-background pl-10 pr-9 text-sm text-foreground outline-none transition-all hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/10 cursor-pointer"
            >
              <option value="newest">Featured & Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          </div>

          {/* Search Button */}
          <button
            type="submit"
            className="h-11 w-full shrink-0 rounded-xl bg-primary px-7 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow cursor-pointer lg:w-auto"
          >
            Search
          </button>
        </div>
      </form>

      {/* Results Meta Info */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
        <p>
          Showing{" "}
          <span className="font-semibold text-foreground">
            {filteredServices.length}
          </span>{" "}
          {filteredServices.length === 1 ? "service" : "services"}
          {hasActiveFilters && " matching your criteria"}
        </p>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleResetFilters}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline cursor-pointer"
          >
            <RotateCcw className="size-3.5" />
            Reset all filters
          </button>
        )}
      </div>

      {/* Services Grid or Empty State */}
      {filteredServices.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredServices.map((service) => (
            <ServiceCard key={service._id} service={service} />
          ))}
        </div>
      ) : initialServices.length === 0 ? (
        /* Entire marketplace is currently empty */
        <div className="rounded-2xl border border-dashed border-border bg-card/60 px-6 py-16 text-center">
          <h2 className="font-heading text-2xl font-semibold text-foreground">
            No Services Available
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            There are no wedding services available right now. Please check back
            later.
          </p>
        </div>
      ) : (
        /* Part 4: No Matching Services Empty State */
        <div className="rounded-3xl border border-dashed border-border bg-card/60 px-6 py-16 text-center shadow-xs">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <SearchX className="size-7" />
          </div>

          <h3 className="mt-5 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
            No matching wedding services found
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground leading-relaxed">
            Try adjusting your search keywords, category, or location filters.
          </p>

          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-lg cursor-pointer"
            >
              <RotateCcw className="size-4" />
              Reset All Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
