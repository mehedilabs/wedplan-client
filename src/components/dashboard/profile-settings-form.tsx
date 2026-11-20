"use client";

import { useEffect, useState } from "react";
import { Camera, Loader2, Save, UserRound } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { uploadProfileImage } from "@/lib/api/service-api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

interface ProfileSettingsFormProps {
  role: "customer" | "vendor" | "admin";
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    businessName?: string | null;
  };
}

export function ProfileSettingsForm({ role, user }: ProfileSettingsFormProps) {
  const [name, setName] = useState(user.name || "");
  const [businessName, setBusinessName] = useState(user.businessName || "");
  const [image, setImage] = useState(user.image || "");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleImageChange = (file?: File) => {
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      toast.add({
        title: "Invalid image",
        description: "Please select a JPG, PNG or WebP image.",
        type: "error",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.add({
        title: "Image too large",
        description: "Profile image must be smaller than 5MB.",
        type: "error",
      });
      return;
    }

    setPreview(URL.createObjectURL(file));
    setSelectedFile(file);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.add({
        title: "Name required",
        description: "Please enter your name.",
        type: "error",
      });
      return;
    }

    if (role === "vendor" && !businessName.trim()) {
      toast.add({
        title: "Business name required",
        description: "Please enter your business name.",
        type: "error",
      });
      return;
    }

    setIsSaving(true);

    try {
      let imageUrl = image;

      if (selectedFile) {
        imageUrl = await uploadProfileImage(selectedFile);
      }

      const { error } = await authClient.updateUser({
        name: name.trim(),
        image: imageUrl || undefined,
        ...(role === "vendor" && {
          businessName: businessName.trim(),
        }),
      });

      if (error) {
        throw new Error(error.message || "Profile update failed.");
      }

      setImage(imageUrl);
      setSelectedFile(null);
      setPreview("");

      toast.add({
        title: "Profile updated",
        description: "Your profile information has been saved.",
        type: "success",
      });
    } catch (error) {
      toast.add({
        title: "Update failed",
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
        type: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const displayedImage = preview || image;

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
          Account
        </p>

        <h2 className="mt-2 font-heading text-3xl font-semibold text-foreground sm:text-4xl">
          Profile Settings
        </h2>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Manage your personal information and profile appearance.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm sm:p-8">
          <div className="mb-7 flex items-center gap-4">
            <div className="relative">
              {displayedImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={displayedImage}
                  alt="Profile preview"
                  referrerPolicy="no-referrer"
                  className="size-24 rounded-2xl border border-border object-cover"
                />
              ) : (
                <div className="flex size-24 items-center justify-center rounded-2xl border border-border bg-primary/10 text-primary">
                  <UserRound className="size-10" />
                </div>
              )}

              <label
                htmlFor="profile-image"
                className="absolute -bottom-2 -right-2 flex size-9 cursor-pointer items-center justify-center rounded-xl border border-border bg-card text-primary shadow-md transition hover:bg-primary hover:text-primary-foreground"
                title="Change profile photo"
              >
                <Camera className="size-4" />
              </label>

              <input
                id="profile-image"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => handleImageChange(e.target.files?.[0])}
              />
            </div>

            <div>
              <h3 className="font-heading text-xl font-semibold">
                Profile Photo
              </h3>

              <p className="mt-1 text-xs text-muted-foreground">
                JPG, PNG or WebP · Maximum 5MB
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <div className="space-y-2">
              <label
                htmlFor="profile-name"
                className="text-sm font-semibold text-foreground"
              >
                Full Name
              </label>

              <Input
                id="profile-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="profile-email"
                className="text-sm font-semibold text-foreground"
              >
                Email Address
              </label>

              <Input
                id="profile-email"
                value={user.email || ""}
                readOnly
                className="h-11 cursor-not-allowed bg-muted/50"
              />

              <p className="text-xs text-muted-foreground">
                Email address cannot be changed here.
              </p>
            </div>

            {role === "vendor" && (
              <div className="space-y-2">
                <label
                  htmlFor="business-name"
                  className="text-sm font-semibold text-foreground"
                >
                  Business Name
                </label>

                <Input
                  id="business-name"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Enter your business name"
                  required
                  className="h-11"
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSaving}
            className="h-11 w-full gap-2 rounded-xl sm:w-auto"
          >
            {isSaving ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Saving Changes...
              </>
            ) : (
              <>
                <Save className="size-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
