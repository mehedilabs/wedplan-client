"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ImagePlus,
  MapPin,
  Sparkles,
  Tag,
  UploadCloud,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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

type Feedback = { type: "success" | "error"; text: string } | null;

const fieldClass =
  "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/70 hover:border-primary/40 focus:border-primary focus:ring-4 focus:ring-primary/10";

function SectionHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Sparkles;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="size-5" />
      </span>

      <div>
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
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
    <label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
      {children} <span className="text-destructive">*</span>
    </label>
  );
}

export default function AddServiceForm() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [description, setDescription] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [imageError, setImageError] = useState("");
  const [feedback, setFeedback] = useState<Feedback>(null);

  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imagesRef = useRef<ImageItem[]>([]);

  // Latest images ref-e rakho, jate unmount-e shob URL clean kora jay
  // imagesRef.current = images;

  useEffect(() => {
    return () => {
      imagesRef.current.forEach((item) => URL.revokeObjectURL(item.url));
    };
  }, []);

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
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter((item) => item.id !== id);
    });
    setImageError("");
  };

  const handleReset = () => {
    images.forEach((item) => URL.revokeObjectURL(item.url));
    setImages([]);
    setDescription("");
    setImageError("");
    setFeedback(null);
    formRef.current?.reset();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);

    const formData = new FormData(event.currentTarget);
    const price = Number(formData.get("price"));

    if (!Number.isFinite(price) || price <= 0) {
      setFeedback({
        type: "error",
        text: "Please enter a valid price greater than 0.",
      });
      return;
    }

    if (images.length === 0) {
      setImageError("Please upload at least one service image.");
      setFeedback({
        type: "error",
        text: "Add at least one photo to showcase your service.",
      });
      return;
    }

    images.forEach((item) => formData.append("images", item.file));

    // TODO: formData diye API call koro

    setFeedback({
      type: "success",
      text: "Looks great! Your service information is valid.",
    });
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Info */}
      <section className="space-y-5">
        <SectionHeader
          icon={Sparkles}
          title="Basic Information"
          description="Tell couples what you offer."
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
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

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>

            <div className="relative">
              <select
                id="category"
                name="category"
                required
                defaultValue=""
                className={cn(
                  fieldClass,
                  "cursor-pointer appearance-none pr-10 invalid:text-muted-foreground/70",
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

              <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>

          <div className="space-y-2 sm:col-span-2">
            <div className="flex items-end justify-between">
              <Label htmlFor="description">Description</Label>

              <span
                className={cn(
                  "text-xs tabular-nums",
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
              rows={5}
              maxLength={MAX_DESCRIPTION}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Describe your wedding service, what's included, and what makes it special..."
              required
              className={cn(fieldClass, "resize-y")}
            />
          </div>
        </div>
      </section>

      <div className="h-px bg-border" />

      {/* Pricing & Location */}
      <section className="space-y-5">
        <SectionHeader
          icon={Tag}
          title="Pricing & Location"
          description="Set your starting price and where you operate."
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>

            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">
                ৳
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
                className={cn(fieldClass, "pl-9")}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>

            <div className="relative">
              <MapPin className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <input
                id="location"
                name="location"
                type="text"
                placeholder="e.g. Dhaka, Bangladesh"
                required
                className={cn(fieldClass, "pl-10")}
              />
            </div>
          </div>
        </div>
      </section>

      <div className="h-px bg-border" />

      {/* Images */}
      <section className="space-y-5">
        <SectionHeader
          icon={ImagePlus}
          title="Service Photos"
          description={`Upload up to ${MAX_IMAGES} photos. The first one becomes your cover.`}
        />

        <div
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
            "rounded-2xl border-2 border-dashed p-6 text-center transition-all",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/40 hover:bg-muted/40",
          )}
        >
          <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <UploadCloud className="size-6" />
          </span>

          <p className="mt-3 text-sm text-foreground">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="font-semibold text-primary hover:underline"
            >
              Click to upload
            </button>{" "}
            or drag & drop
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            PNG, JPG or WebP · Max 5MB each
          </p>

          <input
            ref={fileInputRef}
            id="images"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            multiple
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
            <AlertCircle className="size-3.5" />
            {imageError}
          </p>
        )}

        {images.length > 0 && (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {images.map((item, index) => (
              <li
                key={item.id}
                className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-muted"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.url}
                  alt={`Service photo ${index + 1}`}
                  className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {index === 0 && (
                  <span className="absolute left-2 top-2 rounded-full bg-primary px-2.5 py-0.5 text-[11px] font-semibold text-primary-foreground shadow">
                    Cover
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => removeImage(item.id)}
                  aria-label={`Remove photo ${index + 1}`}
                  className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur transition-colors hover:bg-destructive"
                >
                  <X className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Feedback */}
      {feedback && (
        <div
          role={feedback.type === "error" ? "alert" : "status"}
          className={cn(
            "flex items-start gap-2.5 rounded-xl border px-4 py-3 text-sm",
            feedback.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-destructive/30 bg-destructive/5 text-destructive",
          )}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
          ) : (
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
          )}
          {feedback.text}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={handleReset}
          className="rounded-full px-6"
        >
          Reset
        </Button>

        <Button
          type="submit"
          size="lg"
          className="rounded-full px-8 shadow-md shadow-primary/25"
        >
          Validate Service Information
        </Button>
      </div>
    </form>
  );
}
