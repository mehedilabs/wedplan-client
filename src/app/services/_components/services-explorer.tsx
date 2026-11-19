"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  MapPin,
  SlidersHorizontal,
  ChevronDown,
  RotateCcw,
  SearchX,
  X,
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

  // Read current URL query parameters (source of truth on mount & popstate)
  const urlSearch = searchParams.get("search") || "";
  const urlCategory = searchParams.get("category") || "All Categories";
  const urlLocation = searchParams.get("location") || "";
  const urlSort = searchParams.get("sort") || "newest";

  // Local state for immediate, lag-free UI filtering as the user types or selects
  const [searchTerm, setSearchTerm] = useState(urlSearch);
  const [selectedCategory, setSelectedCategory] = useState(urlCategory);
  const [locationTerm, setLocationTerm] = useState(urlLocation);
  const [selectedSort, setSelectedSort] = useState(urlSort);

  // Synchronize local states when the URL changes externally (e.g. browser back/forward or category clicks from Home)
  useEffect(() => {
    setSearchTerm(urlSearch);
    setSelectedCategory(urlCategory);
    setLocationTerm(urlLocation);
    setSelectedSort(urlSort);
  }, [urlSearch, urlCategory, urlLocation, urlSort]);

  // Synchronize state to URL query parameters
  const updateUrl = useCallback(
    (
      newSearch: string,
      newCategory: string,
      newLocation: string,
      newSort: string,
    ) => {
      const params = new URLSearchParams();

      if (newSearch.trim()) {
        params.set("search", newSearch.trim());
      }
      if (newCategory && newCategory !== "All Categories") {
        params.set("category", newCategory);
      }
      if (newLocation.trim()) {
        params.set("location", newLocation.trim());
      }
      if (newSort && newSort !== "newest") {
        params.set("sort", newSort);
      }

      const queryString = params.toString();
      const currentQueryString = searchParams.toString();

      // Only push/replace when query string actually changes to prevent redundant updates and infinite loops
      if (queryString !== currentQueryString) {
        const targetPath = queryString ? `/services?${queryString}` : "/services";
        router.replace(targetPath, { scroll: false });
      }
    },
    [router, searchParams],
  );

  // Debounced URL synchronization for text inputs (keyword search and location)
  useEffect(() => {
    const timer = setTimeout(() => {
      updateUrl(searchTerm, selectedCategory, locationTerm, selectedSort);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, locationTerm, selectedCategory, selectedSort, updateUrl]);

  // Instant update handlers for category & sort dropdown selections
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    updateUrl(searchTerm, category, locationTerm, selectedSort);
  };

  const handleSortChange = (sort: string) => {
    setSelectedSort(sort);
    updateUrl(searchTerm, selectedCategory, locationTerm, sort);
  };

  // Reset all filters and clear query parameters
  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All Categories");
    setLocationTerm("");
    setSelectedSort("newest");
    router.replace("/services", { scroll: false });
  };

  // Compute filtered services dynamically based on current live filter values
  const filteredServices = useMemo(() => {
    const searchNormalized = searchTerm.toLowerCase().trim();
    const locationNormalized = locationTerm.toLowerCase().trim();

    const result = initialServices.filter((service) => {
      // 1. Live Keyword search (matches serviceName or description)
      if (searchNormalized) {
        const nameMatch = service.serviceName
          ?.toLowerCase()
          .includes(searchNormalized);
        const descMatch = service.description
          ?.toLowerCase()
          .includes(searchNormalized);
        if (!nameMatch && !descMatch) return false;
      }

      // 2. Live Category filter
      if (selectedCategory && selectedCategory !== "All Categories") {
        if (service.category !== selectedCategory) return false;
      }

      // 3. Live Location filter (case-insensitive substring)
      if (locationNormalized) {
        const locMatch = service.location
          ?.toLowerCase()
          .includes(locationNormalized);
        if (!locMatch) return false;
      }

      return true;
    });

    // 4. Live Sorting
    result.sort((a, b) => {
      if (selectedSort === "price-low") {
        return a.price - b.price;
      }
      if (selectedSort === "price-high") {
        return b.price - a.price;
      }
      // Default: Featured & Newest (newest first based on createdAt)
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return timeB - timeA;
    });

    return result;
  }, [
    initialServices,
    searchTerm,
    selectedCategory,
    locationTerm,
    selectedSort,
  ]);

  const hasActiveFilters = Boolean(
    searchTerm ||
      (selectedCategory && selectedCategory !== "All Categories") ||
      locationTerm ||
      (selectedSort && selectedSort !== "newest"),
  );

  return (
    <div className="space-y-8">
      {/* Live Search and Filter Bar Card (No Search button needed) */}
      <div className="rounded-2xl border border-border bg-card p-3 shadow-sm sm:p-3.5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {/* 1. Live Keyword Search */}
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search service name or keyword..."
              className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-9 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/70 hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
                aria-label="Clear search keyword"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          {/* 2. Live Category Filter */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
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

          {/* 3. Live Location Filter */}
          <div className="relative">
            <MapPin className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={locationTerm}
              onChange={(e) => setLocationTerm(e.target.value)}
              placeholder="Filter by city / location..."
              className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-9 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/70 hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
            {locationTerm && (
              <button
                type="button"
                onClick={() => setLocationTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
                aria-label="Clear location filter"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          {/* 4. Live Sorting */}
          <div className="relative">
            <SlidersHorizontal className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <select
              value={selectedSort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="h-11 w-full appearance-none rounded-xl border border-border bg-background pl-10 pr-9 text-sm text-foreground outline-none transition-all hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/10 cursor-pointer"
            >
              <option value="newest">Featured & Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* Live Results Meta Counter */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
        <p>
          Showing{" "}
          <span className="font-semibold text-foreground">
            {filteredServices.length}
          </span>{" "}
          {filteredServices.length === 1 ? "service" : "services"}
          {hasActiveFilters && " matching your filters"}
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
        /* Entire marketplace is empty */
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
