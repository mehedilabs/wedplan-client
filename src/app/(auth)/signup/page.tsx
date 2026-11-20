"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Heart, UserRound, Store, Camera, X, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { uploadProfileImage } from "@/lib/api/service-api";

type AccountRole = "customer" | "vendor";

const roles: {
  value: AccountRole;
  title: string;
  description: string;
  icon: typeof UserRound;
}[] = [
  {
    value: "customer",
    title: "Customer",
    description: "Plan & book services",
    icon: UserRound,
  },
  {
    value: "vendor",
    title: "Vendor",
    description: "Publish your services",
    icon: Store,
  },
];

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024;

export default function SignupPage() {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [role, setRole] = useState<AccountRole>("customer");
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [photoError, setPhotoError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const photoPreview = useMemo(() => {
    if (!profilePhoto) return null;

    return URL.createObjectURL(profilePhoto);
  }, [profilePhoto]);

  const resetPhotoInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setPhotoError("Please upload a PNG, JPG, or WebP image.");
      setProfilePhoto(null);
      resetPhotoInput();
      return;
    }

    if (file.size > MAX_SIZE) {
      setPhotoError("Image size must be 5MB or less.");
      setProfilePhoto(null);
      resetPhotoInput();
      return;
    }

    setPhotoError("");
    setProfilePhoto(file);
  };

  const removePhoto = () => {
    setProfilePhoto(null);
    setPhotoError("");
    resetPhotoInput();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const businessName = String(formData.get("businessName") ?? "").trim();

    setSubmitError("");
    setIsSubmitting(true);

    try {
      // Upload profile photo first, if selected
      let imageUrl: string | undefined;

      if (profilePhoto) {
        imageUrl = await uploadProfileImage(profilePhoto);
      }

      const { error } = await authClient.signUp.email({
        name,
        email,
        password,
        image: imageUrl,
        role,
        ...(role === "vendor" && { businessName }),
        callbackURL: "/",
      });

      if (error) {
        setSubmitError(error.message || "Unable to create account.");
        return;
      }

      router.replace("/");
      router.refresh();
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignup = async () => {
    setSubmitError("");
    setIsGoogleLoading(true);

    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
        additionalData: {
          role,
        },
      });
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Google sign up failed. Please try again.",
      );

      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-xl shadow-primary/5 sm:p-7">
      {/* Header */}
      <div className="mb-5 text-center">
        <div className="mx-auto mb-3 flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/70 shadow-md shadow-primary/30">
          <Heart className="size-5 fill-primary-foreground text-primary-foreground" />
        </div>

        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Create Your Account
        </h1>

        <p className="mt-1.5 text-sm text-muted-foreground">
          Plan your dream wedding or offer your services.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Account Role */}
        <div
          role="radiogroup"
          aria-label="Account role"
          className="grid grid-cols-2 gap-2 sm:gap-3"
        >
          {roles.map(({ value, title, description, icon: Icon }) => {
            const selected = role === value;

            return (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setRole(value)}
                className={cn(
                  "flex flex-col items-center gap-1.5 cursor-pointer rounded-xl border px-1.5 py-2.5 text-center transition-all",
                  "sm:flex-row sm:gap-3 sm:px-3.5 sm:py-3 sm:text-left",
                  selected
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "border-border hover:border-primary/40 hover:bg-muted/50",
                )}
              >
                <span
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors sm:size-10",
                    selected
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  <Icon className="size-4 sm:size-5" />
                </span>

                <span className="flex flex-col">
                  <span className="whitespace-nowrap text-[13px] font-semibold leading-tight text-foreground sm:text-sm">
                    {title}
                  </span>

                  <span className="mt-0.5 whitespace-nowrap text-[10.5px] leading-tight tracking-tight text-muted-foreground sm:text-xs sm:tracking-normal">
                    {description}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Profile Photo */}
        <div>
          <div className="flex items-center gap-3 rounded-xl border border-dashed border-border p-2.5">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              aria-label="Choose profile photo"
              className="group relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10 transition-colors hover:bg-primary/20"
            >
              {photoPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={photoPreview}
                  alt="Profile preview"
                  className="size-full object-cover"
                />
              ) : (
                <Camera className="size-5 text-primary" />
              )}
            </button>

            <div className="min-w-0 flex-1">
              {profilePhoto ? (
                <p className="truncate text-sm font-medium text-foreground">
                  {profilePhoto.name}
                </p>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Upload profile photo
                </button>
              )}

              <p className="text-xs text-muted-foreground">
                Optional · PNG, JPG, WebP · Max 5MB
              </p>
            </div>

            {profilePhoto && (
              <button
                type="button"
                aria-label="Remove selected photo"
                onClick={removePhoto}
                className="shrink-0 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
              >
                <X className="size-4" />
              </button>
            )}

            <input
              ref={fileInputRef}
              id="profilePhoto"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handlePhotoChange}
              className="sr-only"
              tabIndex={-1}
            />
          </div>

          {photoError && (
            <p role="alert" className="mt-1.5 text-xs text-destructive">
              {photoError}
            </p>
          )}
        </div>

        {/* Full Name */}
        <div className="space-y-1.5">
          <label htmlFor="name" className="text-sm font-semibold">
            Full Name
          </label>

          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Your full name"
            autoComplete="name"
            className="h-11"
            required
          />
        </div>

        {/* Business / Studio Name */}
        {role === "vendor" && (
          <div className="space-y-1.5">
            <label htmlFor="businessName" className="text-sm font-semibold">
              Business / Studio Name
            </label>

            <Input
              id="businessName"
              name="businessName"
              type="text"
              placeholder="Your business or studio name"
              autoComplete="organization"
              className="h-11"
              required
            />
          </div>
        )}

        {/* Email */}
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-semibold">
            Email
          </label>

          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            className="h-11"
            required
          />
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label htmlFor="password" className="text-sm font-semibold">
            Password
          </label>

          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
              autoComplete="new-password"
              minLength={6}
              pattern="(?=.*[a-z])(?=.*[A-Z]).{6,}"
              title="At least 6 characters with 1 uppercase and 1 lowercase letter."
              className="h-10 pr-10"
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground cursor-pointer transition-colors hover:text-foreground"
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>

          <p className="text-xs text-muted-foreground">
            Min 6 characters, with 1 uppercase & 1 lowercase letter.
          </p>
        </div>

        {/* Error Message */}
        {submitError && (
          <p
            role="alert"
            className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            {submitError}
          </p>
        )}

        {/* Submit */}
        <Button
          type="submit"
          disabled={isSubmitting || isGoogleLoading}
          className="h-11 w-full rounded-full cursor-pointer text-sm font-semibold shadow-md shadow-primary/25"
        >
          {isSubmitting ? "Creating Account..." : "Create Account"}
        </Button>
      </form>

      {/* Google Signup - Customer and Vendor */}
      <div className="my-4 flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs font-medium text-muted-foreground">OR</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <Button
        type="button"
        variant="outline"
        disabled={isGoogleLoading || isSubmitting}
        onClick={handleGoogleSignup}
        className="h-11 w-full cursor-pointer rounded-full"
      >
        <svg viewBox="0 0 48 48" aria-hidden="true" className="size-5">
          <path
            fill="#EA4335"
            d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z"
          />
          <path
            fill="#4285F4"
            d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.25 5.48-4.73 7.18l7.64 5.94c4.46-4.12 7.13-10.2 7.13-17.59Z"
          />
          <path
            fill="#FBBC05"
            d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.77-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.87.93 7.52 2.56 10.78l7.97-6.19Z"
          />
          <path
            fill="#34A853"
            d="M24 48c6.48 0 11.93-2.13 15.92-5.86l-7.64-5.94c-2.12 1.42-4.84 2.26-8.28 2.26-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z"
          />
        </svg>

        {isGoogleLoading ? "Connecting to Google..." : "Continue with Google"}
      </Button>

      {/* Sign In Link */}
      <p className="mt-5 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-primary transition-colors hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
