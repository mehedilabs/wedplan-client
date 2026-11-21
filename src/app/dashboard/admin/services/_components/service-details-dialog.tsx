"use client";

import { useEffect, useState } from "react";
import {
  X,
  Layers,
  MapPin,
  Mail,
  User,
  Clock,
  CheckCircle2,
  XCircle,
  Power,
  PowerOff,
  Copy,
  Check,
  Calendar,
  DollarSign,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import type { Service } from "@/types/service";

interface ServiceDetailsDialogProps {
  service: Service | null;
  isOpen: boolean;
  onClose: () => void;
  onReviewStatus: (service: Service) => void;
  onToggleActive: (service: Service) => void;
  onDelete: (service: Service) => void;
}

export default function ServiceDetailsDialog(props: ServiceDetailsDialogProps) {
  const { service, isOpen } = props;

  const dialogKey = `${service?._id ?? "no-service"}-${isOpen ? "open" : "closed"}`;

  return <ServiceDetailsDialogContent key={dialogKey} {...props} />;
}

function ServiceDetailsDialogContent({
  service,
  isOpen,
  onClose,
  onReviewStatus,
  onToggleActive,
  onDelete,
}: ServiceDetailsDialogProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
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

  if (!isOpen || !service) return null;

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(service._id);
      setCopiedId(true);
      toast.add({
        title: "Service ID Copied",
        description: "Service ID copied to clipboard",
        type: "success",
      });
      setTimeout(() => setCopiedId(false), 2000);
    } catch {
      toast.add({
        title: "Copy Failed",
        description: "Could not copy service ID",
        type: "error",
      });
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "N/A";
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "N/A";
    }
  };

  const isPubliclyVisible = service.status === "approved" && service.isActive;
  const images =
    service.images && service.images.length > 0 ? service.images : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Card */}
      <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl transition-all">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/70 px-5 py-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Layers className="size-4" />
            </span>
            <div>
              <h2 className="font-heading text-lg font-bold text-foreground">
                Service Details
              </h2>
              <p className="text-xs text-muted-foreground">
                Review vendor submission and platform parameters
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="max-h-[75vh] overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* Image Showcase */}
          {images.length > 0 ? (
            <div className="space-y-2.5">
              <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border/80 bg-muted/40">
                <Image
                  src={images[activeImageIndex] || images[0]}
                  alt={service.serviceName}
                  fill
                  sizes="(max-width: 768px) 100vw, 672px"
                  className="object-cover"
                />

                {/* Left/Right buttons if multiple */}
                {images.length > 1 && (
                  <div className="absolute inset-0 flex items-center justify-between p-2 pointer-events-none">
                    <button
                      type="button"
                      onClick={() =>
                        setActiveImageIndex((prev) =>
                          prev === 0 ? images.length - 1 : prev - 1,
                        )
                      }
                      className="pointer-events-auto flex size-8 items-center justify-center rounded-full bg-black/60 text-white shadow-md transition hover:bg-black/80 cursor-pointer"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setActiveImageIndex((prev) =>
                          prev === images.length - 1 ? 0 : prev + 1,
                        )
                      }
                      className="pointer-events-auto flex size-8 items-center justify-center rounded-full bg-black/60 text-white shadow-md transition hover:bg-black/80 cursor-pointer"
                      aria-label="Next image"
                    >
                      <ChevronRight className="size-4" />
                    </button>
                  </div>
                )}

                {/* Counter Pill */}
                {images.length > 1 && (
                  <span className="absolute bottom-2.5 right-2.5 rounded-full bg-black/70 px-2.5 py-0.5 text-[11px] font-semibold text-white">
                    {activeImageIndex + 1} / {images.length}
                  </span>
                )}
              </div>

              {/* Thumbnails row */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative size-14 shrink-0 overflow-hidden rounded-lg border-2 transition cursor-pointer ${
                        activeImageIndex === idx
                          ? "border-primary ring-2 ring-primary/20"
                          : "border-border/80 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex aspect-video w-full flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 text-muted-foreground">
              <Layers className="size-8 opacity-40" />
              <p className="mt-2 text-xs">
                No images provided for this service
              </p>
            </div>
          )}

          {/* Title, Category & Price Header */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary ring-1 ring-primary/20">
                  {service.category}
                </span>
                {service.isPremium && (
                  <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] font-bold text-amber-800 ring-1 ring-amber-500/30 uppercase tracking-wider">
                    Premium
                  </span>
                )}
              </div>
              <h3 className="font-heading text-xl font-bold text-foreground">
                {service.serviceName}
              </h3>
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="size-3.5 shrink-0 text-primary" />
                <span>{service.location}</span>
              </p>
            </div>

            <div className="rounded-xl border border-border/80 bg-muted/20 px-4 py-2.5 text-left sm:text-right shrink-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Starting Price
              </p>
              <p className="font-heading text-xl font-bold text-primary">
                ${service.price.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Public Visibility Banner */}
          <div
            className={`flex items-start gap-3 rounded-xl border p-3.5 text-xs leading-relaxed ${
              isPubliclyVisible
                ? "border-emerald-200 bg-emerald-50/70 text-emerald-900"
                : "border-amber-200 bg-amber-50/70 text-amber-900"
            }`}
          >
            {isPubliclyVisible ? (
              <CheckCircle2 className="size-4 shrink-0 text-emerald-600 mt-0.5" />
            ) : (
              <ShieldAlert className="size-4 shrink-0 text-amber-600 mt-0.5" />
            )}
            <div>
              <p className="font-semibold">
                {isPubliclyVisible
                  ? "Live on Browse Services"
                  : "Hidden from Browse Services"}
              </p>
              <p className="mt-0.5 opacity-90">
                {isPubliclyVisible
                  ? "This service is currently approved and active, making it visible to prospective customers on the public marketplace."
                  : service.status !== "approved"
                    ? `This service is currently "${service.status}" and will not be displayed on the public page until an admin approves it.`
                    : "This service is approved but marked Inactive. It is temporarily hidden from customer view."}
              </p>
            </div>
          </div>

          {/* Status Badges Grid */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {/* Approval Status */}
            <div className="rounded-xl border border-border/70 bg-card p-3.5 space-y-1.5">
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Approval Status
              </p>
              <div>
                {service.status === "approved" && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200">
                    <CheckCircle2 className="size-3.5" />
                    Approved
                  </span>
                )}
                {service.status === "pending" && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 ring-1 ring-amber-200">
                    <Clock className="size-3.5" />
                    Pending Admin Review
                  </span>
                )}
                {service.status === "rejected" && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-700 ring-1 ring-rose-200">
                    <XCircle className="size-3.5" />
                    Rejected
                  </span>
                )}
              </div>
            </div>

            {/* Availability */}
            <div className="rounded-xl border border-border/70 bg-card p-3.5 space-y-1.5">
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Marketplace Availability
              </p>
              <div>
                {service.isActive ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200">
                    <Power className="size-3.5 text-emerald-600" />
                    Active (Accepting Bookings)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-bold text-zinc-700 ring-1 ring-zinc-300">
                    <PowerOff className="size-3.5 text-zinc-500" />
                    Inactive (Paused)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Vendor Information Card */}
          <div className="rounded-xl border border-border/70 bg-card p-4 space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Vendor Information
            </h4>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 text-xs">
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="size-3.5 text-primary shrink-0" />
                <span>Vendor:</span>
                <span className="font-semibold text-foreground truncate">
                  {service.vendorName || "Unknown Vendor"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="size-3.5 text-primary shrink-0" />
                <span>Email:</span>
                <span className="font-semibold text-foreground truncate">
                  {service.vendorEmail || "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="rounded-xl border border-border/70 bg-card p-4 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Description
            </h4>
            <p className="text-xs text-foreground/90 leading-relaxed whitespace-pre-line">
              {service.description || "No description provided."}
            </p>
          </div>

          {/* Metadata & ID */}
          <div className="rounded-xl border border-border/70 bg-muted/20 p-3.5 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="size-3.5 text-primary" />
              <span>Submitted: {formatDate(service.createdAt)}</span>
            </div>

            <div className="flex items-center gap-1.5 font-mono text-[11px]">
              <span className="bg-background/80 px-2 py-0.5 rounded border border-border/60">
                ID: {service._id}
              </span>
              <button
                type="button"
                onClick={handleCopyId}
                className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium text-primary hover:bg-primary/10 transition cursor-pointer"
                title="Copy Service ID"
              >
                {copiedId ? (
                  <Check className="size-3 text-emerald-600" />
                ) : (
                  <Copy className="size-3" />
                )}
                {copiedId ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col-reverse gap-2 border-t border-border/70 bg-muted/20 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="rounded-full cursor-pointer"
          >
            Close
          </Button>

          <div className="flex flex-wrap items-center gap-2">
            {/* Review Status Action */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                onClose();
                onReviewStatus(service);
              }}
              className="gap-1.5 rounded-full border-border/80 text-xs font-medium cursor-pointer"
            >
              <ShieldCheck className="size-3.5 text-primary" />
              Approval Status
            </Button>

            {/* Toggle Availability Action */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                onClose();
                onToggleActive(service);
              }}
              className="gap-1.5 rounded-full border-border/80 text-xs font-medium cursor-pointer"
            >
              {service.isActive ? (
                <>
                  <PowerOff className="size-3.5 text-zinc-600" />
                  Deactivate
                </>
              ) : (
                <>
                  <Power className="size-3.5 text-emerald-600" />
                  Activate
                </>
              )}
            </Button>

            {/* Delete Action */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                onClose();
                onDelete(service);
              }}
              className="gap-1.5 rounded-full border-rose-200 text-xs font-medium text-rose-600 hover:bg-rose-50 hover:text-rose-700 cursor-pointer"
            >
              <Trash2 className="size-3.5" />
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
