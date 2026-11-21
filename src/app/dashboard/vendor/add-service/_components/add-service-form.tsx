"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  AlertCircle,
  ChevronDown,
  ImagePlus,
  MapPin,
  Sparkles,
  UploadCloud,
  X,
} from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { authClient } from "@/lib/auth-client";
import {
  createService,
  getVendorServices,
  uploadServiceImage,
} from "@/lib/api/service-api";

const categories = [
  "Photography & Videography",
  "Wedding Venues",
  "Decoration & Florist",
  "Catering Services",
  "Makeup & Styling",
  "Wedding Fashion",
];

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024;
const MAX_IMAGES = 6;
const MAX_DESCRIPTION = 600;

type ImageItem = {
  id: string;
  file: File;
  url: string;
};

const fieldClass =
  "w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/70 hover:border-primary/40 focus:border-primary focus:ring-4 focus:ring-primary/10";

function SectionHeader({
  icon: Icon,
  title,
  description,
  aside,
}: {
  icon: typeof Sparkles;
  title: string;
  description: string;
  aside?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="size-4" />
      </span>

      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-semibold leading-tight text-foreground">
          {title}
        </h3>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>

      {aside}
    </div>
  );
}

function Label({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-[13px] font-medium text-foreground"
    >
      {children} <span className="text-destructive">*</span>
    </label>
  );
}

export default function AddServiceForm() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [description, setDescription] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [imageError, setImageError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [serviceCount, setServiceCount] = useState(0);
  const [isLoadingServices, setIsLoadingServices] = useState(true);
  const [serviceFetchError, setServiceFetchError] = useState("");

  const { data: session, isPending: isSessionPending } =
    authClient.useSession();

  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imagesRef = useRef<ImageItem[]>([]);

  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  useEffect(() => {
    return () => {
      imagesRef.current.forEach((item) => URL.revokeObjectURL(item.url));
    };
  }, []);

  // Fetch vendor services to check the Free plan limit
  useEffect(() => {
    const vendorId = session?.user?.id;

    if (isSessionPending) {
      return;
    }

    if (!vendorId || session.user.role !== "vendor") {
      return;
    }

    let ignore = false;

    const fetchServices = async () => {
      try {
        const services = await getVendorServices(vendorId);

        if (!ignore) {
          setServiceCount(services.length);
          setServiceFetchError("");
        }
      } catch (error) {
        console.error("Failed to fetch vendor services:", error);

        if (!ignore) {
          setServiceFetchError(
            "Failed to load your services. Please try again.",
          );
        }
      } finally {
        if (!ignore) {
          setIsLoadingServices(false);
        }
      }
    };

    fetchServices();

    return () => {
      ignore = true;
    };
  }, [session?.user?.id, session?.user?.role, isSessionPending]);

  const openFilePicker = () => fileInputRef.current?.click();

  const addFiles = (fileList: FileList | File[]) => {
    const incoming = Array.from(fileList);
    const accepted: ImageItem[] = [];
    let error = "";

    for (const file of incoming) {
      if (images.length + accepted.length >= MAX_IMAGES) {
        error = `You can upload up to ${MAX_IMAGES} images.`;
        break;
      }

      if (!ALLOWED_TYPES.includes(file.type)) {
        error = "Only PNG, JPG, or WebP images are allowed.";
        continue;
      }

      if (file.size > MAX_SIZE) {
        error = `"${file.name}" is larger than 5MB.`;
        continue;
      }

      accepted.push({
        id: `${file.name}-${file.size}-${crypto.randomUUID()}`,
        file,
        url: URL.createObjectURL(file),
      });
    }

    setImageError(error);

    if (accepted.length > 0) {
      setImages((prev) => [...prev, ...accepted]);
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const target = prev.find((item) => item.id === id);

      if (target) {
        URL.revokeObjectURL(target.url);
      }

      return prev.filter((item) => item.id !== id);
    });

    setImageError("");
  };

  const handleReset = () => {
    images.forEach((item) => URL.revokeObjectURL(item.url));

    imagesRef.current = [];
    setImages([]);
    setDescription("");
    setImageError("");
    formRef.current?.reset();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setImageError("");

    if (isSessionPending) {
      toast.add({
        title: "Please wait",
        description: "Your account is loading.",
        type: "warning",
      });
      return;
    }

    if (!session?.user?.id) {
      toast.add({
        title: "Sign in required",
        description: "Please sign in before adding a service.",
        type: "error",
      });
      return;
    }

    if (session.user.role !== "vendor") {
      toast.add({
        title: "Access denied",
        description: "Only vendors can add services.",
        type: "error",
      });
      return;
    }

    // Check Free plan service limit
    if (session.user.subscriptionPlan !== "premium" && serviceCount >= 3) {
      toast.add({
        title: "Service limit reached",
        description:
          "Your Free plan allows up to 3 services. Delete an existing service or upgrade to Premium.",
        type: "warning",
      });
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);
    const price = Number(formData.get("price"));

    if (!Number.isFinite(price) || price <= 0) {
      toast.add({
        title: "Invalid price",
        description: "Please enter a valid price greater than 0.",
        type: "error",
      });
      return;
    }

    if (images.length === 0) {
      setImageError("Please upload at least one service image.");

      toast.add({
        title: "Service image required",
        description: "Add at least one photo to showcase your service.",
        type: "error",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const imageUrls = await Promise.all(
        images.map((item) => uploadServiceImage(item.file)),
      );

      await createService({
        vendorId: session.user.id,
        vendorName: session.user.businessName || session.user.name,
        vendorEmail: session.user.email,
        serviceName: String(formData.get("serviceName")).trim(),
        category: String(formData.get("category")),
        description: String(formData.get("description")).trim(),
        price,
        location: String(formData.get("location")).trim(),
        images: imageUrls,
      });

      // Update service count after successful submission
      setServiceCount((prev) => prev + 1);

      toast.add({
        title: "Service submitted!",
        description:
          "Your service has been submitted successfully. It is now waiting for admin approval.",
        type: "success",
      });

      handleReset();
    } catch (error) {
      console.error("Failed to submit service:", error);

      toast.add({
        title: "Submission failed",
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (
    isSessionPending ||
    (session?.user?.role === "vendor" && isLoadingServices)
  ) {
    return (
      <div className="flex min-h-60 items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // Service fetch error
  if (serviceFetchError) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 text-center">
        <p className="font-medium text-foreground">
          Unable to load your services
        </p>

        <p className="mt-2 text-sm text-muted-foreground">
          {serviceFetchError}
        </p>

        <p className="mt-2 text-sm text-muted-foreground">
          Please refresh the page to try again.
        </p>
      </div>
    );
  }

  // Free plan limit reached
  if (
    session?.user?.role === "vendor" &&
    session.user.subscriptionPlan !== "premium" &&
    serviceCount >= 3
  ) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 text-center sm:p-8">
        <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <span className="text-2xl">♛</span>
        </div>

        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          Free Plan Limit Reached
        </p>

        <h2 className="font-heading text-2xl font-semibold text-foreground sm:text-3xl">
          You&apos;ve reached your service limit
        </h2>

        <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-muted-foreground">
          Your Free plan allows up to 3 services. Delete an existing service to
          add another one, or upgrade to Premium for unlimited services.
        </p>

        {/* Service usage */}
        <div className="mt-7 rounded-xl border border-border bg-muted/40 p-5 text-left">
          <div className="flex items-center justify-between">
            <span className="font-medium text-foreground">
              Your service usage
            </span>

            <span className="font-semibold text-primary">
              {serviceCount} / 3
            </span>
          </div>

          <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-muted">
            <div className="h-full w-full rounded-full bg-primary" />
          </div>

          <p className="mt-3 text-xs leading-5 text-muted-foreground">
            Pending, approved and rejected services all count toward your Free
            plan limit.
          </p>
        </div>

        {/* Premium upgrade */}
        <div className="mt-6 rounded-xl border border-primary/20 bg-primary/5 p-5 text-left">
          <h3 className="font-heading text-xl font-semibold text-foreground">
            Upgrade to Premium
          </h3>

          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>✓ Create unlimited services</li>
            <li>✓ Get a Premium Vendor Badge</li>
            <li>✓ Enjoy all Free plan features</li>
          </ul>

          <Link
            href="/dashboard/vendor/subscription"
            className="mt-6 flex w-full items-center justify-center rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground transition hover:opacity-90"
          >
            Explore Premium
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
      {/* Free plan usage indicator */}
      {session?.user?.role === "vendor" &&
        session.user.subscriptionPlan !== "premium" && (
          <div className="rounded-xl border border-border bg-muted/40 p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-medium text-foreground">
                Free plan service usage
              </span>

              <span className="text-sm font-semibold text-primary">
                {serviceCount} / 3
              </span>
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all duration-300"
                style={{
                  width: `${(serviceCount / 3) * 100}%`,
                }}
              />
            </div>

            <p className="mt-2 text-xs text-muted-foreground">
              {3 - serviceCount} service
              {3 - serviceCount !== 1 ? "s" : ""} remaining on your Free plan.
            </p>
          </div>
        )}

      {/* Service Details */}
      <section className="space-y-3.5">
        <SectionHeader
          icon={Sparkles}
          title="Service Details"
          description="Tell couples what you offer and where."
        />

        <div className="grid gap-3.5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="serviceName">Service Name</Label>

            <input
              id="serviceName"
              name="serviceName"
              type="text"
              placeholder="e.g. Premium Wedding Photography"
              required
              className={fieldClass}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="category">Category</Label>

            <div className="relative">
              <select
                id="category"
                name="category"
                required
                defaultValue=""
                className={cn(
                  fieldClass,
                  "cursor-pointer appearance-none pr-9 invalid:text-muted-foreground/70",
                )}
              >
                <option value="" disabled>
                  Select a category
                </option>

                {categories.map((category) => (
                  <option
                    key={category}
                    value={category}
                    className="text-foreground"
                  >
                    {category}
                  </option>
                ))}
              </select>

              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="price">Price</Label>

            <div className="relative">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">
                $
              </span>

              <input
                id="price"
                name="price"
                type="number"
                min="1"
                step="1"
                inputMode="numeric"
                placeholder="25000"
                required
                className={cn(fieldClass, "pl-8")}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="location">Location</Label>

            <div className="relative">
              <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <input
                id="location"
                name="location"
                type="text"
                placeholder="e.g. Dhaka, Bangladesh"
                required
                className={cn(fieldClass, "pl-9")}
              />
            </div>
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <div className="flex items-end justify-between">
              <Label htmlFor="description">Description</Label>

              <span
                className={cn(
                  "text-[11px] tabular-nums",
                  description.length >= MAX_DESCRIPTION
                    ? "text-destructive"
                    : "text-muted-foreground",
                )}
              >
                {description.length}/{MAX_DESCRIPTION}
              </span>
            </div>

            <textarea
              id="description"
              name="description"
              rows={4}
              maxLength={MAX_DESCRIPTION}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Describe your service, what's included, and what makes it special..."
              required
              className={cn(fieldClass, "resize-y")}
            />
          </div>
        </div>
      </section>

      <div className="h-px bg-border" />

      {/* Images */}
      <section className="space-y-3">
        <SectionHeader
          icon={ImagePlus}
          title="Service Photos"
          description="The first photo becomes your cover."
          aside={
            <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium tabular-nums text-muted-foreground">
              {images.length}/{MAX_IMAGES}
            </span>
          }
        />

        {/* Whole box is clickable */}
        <div
          role="button"
          tabIndex={0}
          aria-label="Upload service photos"
          onClick={openFilePicker}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              openFilePicker();
            }
          }}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setIsDragging(false);
            addFiles(event.dataTransfer.files);
          }}
          className={cn(
            "flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed px-4 py-3 outline-none transition-all",
            "focus-visible:ring-4 focus-visible:ring-primary/15",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50 hover:bg-primary/[0.03]",
          )}
        >
          <span
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-full transition-colors",
              isDragging
                ? "bg-primary text-primary-foreground"
                : "bg-primary/10 text-primary",
            )}
          >
            <UploadCloud className="size-5" />
          </span>

          <div className="min-w-0 text-left">
            <p className="text-sm text-foreground">
              <span className="font-semibold text-primary">
                Click to upload
              </span>{" "}
              <span className="text-muted-foreground">or drag & drop</span>
            </p>

            <p className="text-xs text-muted-foreground">
              PNG, JPG or WebP · Max 5MB each
            </p>
          </div>

          <input
            ref={fileInputRef}
            id="images"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            multiple
            onClick={(event) => event.stopPropagation()}
            onChange={(event) => {
              if (event.target.files) addFiles(event.target.files);
            }}
            className="sr-only"
            tabIndex={-1}
          />
        </div>

        {imageError && (
          <p
            role="alert"
            className="flex items-center gap-1.5 text-xs text-destructive"
          >
            <AlertCircle className="size-3.5 shrink-0" />
            {imageError}
          </p>
        )}

        {images.length > 0 && (
          <ul className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {images.map((item, index) => (
              <li
                key={item.id}
                className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-muted"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.url}
                  alt={`Service photo ${index + 1}`}
                  className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {index === 0 && (
                  <span className="absolute bottom-1 left-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold leading-none text-primary-foreground shadow">
                    Cover
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => removeImage(item.id)}
                  aria-label={`Remove photo ${index + 1}`}
                  className="absolute right-1 top-1 flex size-5 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white backdrop-blur transition-colors hover:bg-destructive"
                >
                  <X className="size-3" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Actions */}
      <div className="flex flex-col-reverse gap-2.5 pt-1 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={handleReset}
          disabled={isSubmitting}
          className="h-10 cursor-pointer rounded-full px-6 disabled:cursor-not-allowed"
        >
          Reset
        </Button>

        <Button
          type="submit"
          disabled={isSubmitting || isSessionPending}
          className="h-10 cursor-pointer rounded-full px-8 shadow-md shadow-primary/25 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Uploading & Submitting..." : "Submit Service"}
        </Button>
      </div>
    </form>
  );
}
