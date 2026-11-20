"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlus, LoaderCircle, X } from "lucide-react";
import { toast } from "@/components/ui/toast";

import { updateService, uploadServiceImage } from "@/lib/api/service-api";
import type { Service } from "@/types/service";
import { Button } from "@/components/ui/button";

const categories = [
  "Photography & Videography",
  "Wedding Venues",
  "Decoration & Florist",
  "Catering Services",
  "Makeup & Styling",
  "Wedding Fashion",
];

type ImageItem =
  | { type: "existing"; url: string }
  | { type: "new"; file: File; preview: string };

interface EditServiceDialogProps {
  service: Service;
  vendorId: string;
  onClose: () => void;
  onUpdated: () => void;
}

export default function EditServiceDialog({
  service,
  vendorId,
  onClose,
  onUpdated,
}: EditServiceDialogProps) {
  const [serviceName, setServiceName] = useState(service.serviceName);
  const [category, setCategory] = useState(service.category);
  const [description, setDescription] = useState(service.description);
  const [price, setPrice] = useState(String(service.price));
  const [location, setLocation] = useState(service.location);

  const [images, setImages] = useState<ImageItem[]>(
    service.images.map((url) => ({ type: "existing", url })),
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageError, setImageError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const imagesRef = useRef<ImageItem[]>(images);

  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  useEffect(() => {
    return () => {
      imagesRef.current.forEach((image) => {
        if (image.type === "new") {
          URL.revokeObjectURL(image.preview);
        }
      });
    };
  }, []);

  function handleFiles(files: FileList | null) {
    if (!files) return;

    setImageError("");

    const selectedFiles = Array.from(files);
    const remainingSlots = 6 - images.length;

    if (remainingSlots <= 0) {
      setImageError("You can upload a maximum of 6 images.");
      return;
    }

    const validFiles: File[] = [];

    for (const file of selectedFiles) {
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        setImageError("Only JPG, PNG and WEBP images are allowed.");
        continue;
      }

      if (file.size > 5 * 1024 * 1024) {
        setImageError("Each image must be 5MB or smaller.");
        continue;
      }

      validFiles.push(file);
    }

    const filesToAdd = validFiles.slice(0, remainingSlots);

    if (validFiles.length > remainingSlots) {
      setImageError("Only 6 images are allowed. Extra images were ignored.");
    }

    setImages((prev) => [
      ...prev,
      ...filesToAdd.map((file) => ({
        type: "new" as const,
        file,
        preview: URL.createObjectURL(file),
      })),
    ]);
  }

  function removeImage(index: number) {
    setImages((prev) => {
      const image = prev[index];

      if (image?.type === "new") {
        URL.revokeObjectURL(image.preview);
      }

      return prev.filter((_, imageIndex) => imageIndex !== index);
    });

    setImageError("");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (
      !serviceName.trim() ||
      !category ||
      !description.trim() ||
      !location.trim()
    ) {
      toast.add({
        title: "Missing Required Fields",
        description: "Please fill in all required fields.",
        type: "error",
      });
      return;
    }

    const numericPrice = Number(price);

    if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
      toast.add({
        title: "Invalid Price",
        description: "Please enter a valid service price.",
        type: "error",
      });
      return;
    }

    if (images.length === 0) {
      toast.add({
        title: "Images Required",
        description: "Please add at least one service image.",
        type: "error",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const imageUrls = await Promise.all(
        images.map((image) =>
          image.type === "existing"
            ? Promise.resolve(image.url)
            : uploadServiceImage(image.file),
        ),
      );

      await updateService(service._id, {
        vendorId,
        serviceName: serviceName.trim(),
        category,
        description: description.trim(),
        price: numericPrice,
        location: location.trim(),
        images: imageUrls,
      });

      toast.add({
        title: "Service Updated",
        description: "Your service has been updated successfully.",
        type: "success",
      });

      onUpdated();
      onClose();
    } catch (error) {
      toast.add({
        title: "Update Failed",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update service. Please try again.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 backdrop-blur-sm sm:p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSubmitting) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-service-title"
        className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl"
      >
        {/* Dialog Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4 sm:px-6">
          <div>
            <h2
              id="edit-service-title"
              className="font-heading text-xl font-bold text-foreground"
            >
              Edit Service
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Update your service listing details.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex size-9 items-center justify-center cursor-pointer rounded-full border border-border text-muted-foreground transition hover:bg-muted disabled:opacity-50"
            aria-label="Close edit dialog"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Dialog Form */}
        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5 sm:px-6">
            {/* Service Name */}
            <div className="space-y-2">
              <label
                htmlFor="edit-service-name"
                className="text-sm font-medium text-foreground"
              >
                Service Name
              </label>

              <input
                id="edit-service-name"
                value={serviceName}
                onChange={(event) => setServiceName(event.target.value)}
                required
                maxLength={100}
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                placeholder="Enter service name"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label
                htmlFor="edit-service-category"
                className="text-sm font-medium text-foreground"
              >
                Category
              </label>

              <select
                id="edit-service-category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                required
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              >
                <option value="">Select a category</option>
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label
                htmlFor="edit-service-description"
                className="text-sm font-medium text-foreground"
              >
                Description
              </label>

              <textarea
                id="edit-service-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                required
                rows={4}
                maxLength={2000}
                className="w-full resize-y rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                placeholder="Describe your service..."
              />
            </div>

            {/* Price */}
            <div className="space-y-2">
              <label
                htmlFor="edit-service-price"
                className="text-sm font-medium text-foreground"
              >
                Price (BDT)
              </label>

              <input
                id="edit-service-price"
                type="number"
                min="1"
                step="1"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                required
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                placeholder="Enter price"
              />
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label
                htmlFor="edit-service-location"
                className="text-sm font-medium text-foreground"
              >
                Location
              </label>

              <input
                id="edit-service-location"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                required
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                placeholder="Enter service location"
              />
            </div>

            {/* Images */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">
                  Service Images
                </label>

                <span className="text-xs text-muted-foreground">
                  {images.length}/6 images
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {images.map((image, index) => (
                  <div
                    key={image.type === "existing" ? image.url : image.preview}
                    className="group relative aspect-square overflow-hidden rounded-xl border border-border bg-muted"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        image.type === "existing" ? image.url : image.preview
                      }
                      alt={`Service image ${index + 1}`}
                      className="size-full object-cover"
                    />

                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-destructive"
                      aria-label={`Remove image ${index + 1}`}
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                ))}

                {images.length < 6 && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex aspect-square flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted/30 text-muted-foreground transition hover:border-primary hover:bg-primary/5 hover:text-primary"
                  >
                    <ImagePlus className="size-7" />
                    <span className="text-xs font-medium">Add Image</span>
                  </button>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                className="hidden"
                onChange={(event) => {
                  handleFiles(event.target.files);
                  event.target.value = "";
                }}
              />

              <p className="text-xs leading-5 text-muted-foreground">
                JPG, PNG or WEBP. Maximum 5MB per image and 6 images total.
              </p>

              {imageError && (
                <p className="text-sm text-destructive">{imageError}</p>
              )}
            </div>
          </div>

          {/* Dialog Footer */}
          <div className="flex flex-col-reverse gap-3 border-t border-border bg-muted/20 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
            <Button
              type="button"
              variant="outline"
              className="rounded-full cursor-pointer"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              className="rounded-full cursor-pointer"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle className="mr-2 size-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
