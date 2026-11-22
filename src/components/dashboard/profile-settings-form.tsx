"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Camera,
  Loader2,
  Save,
  UserRound,
  LogOut,
  Mail,
  Briefcase,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { invalidateAuthToken } from "@/lib/api/api-client";
import { uploadProfileImage } from "@/lib/api/service-api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
  const router = useRouter();

  const [name, setName] = useState(user.name || "");
  const [businessName, setBusinessName] = useState(user.businessName || "");
  const [image, setImage] = useState(user.image || "");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
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

      if (fileInputRef.current) fileInputRef.current.value = "";

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

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      invalidateAuthToken();
      const { error } = await authClient.signOut();

      if (error) {
        toast.add({
          title: "Sign out failed",
          description: error.message || "Unable to sign out.",
          type: "error",
        });
        setIsLoggingOut(false);
        return;
      }

      setLogoutDialogOpen(false);
      router.replace("/");
      router.refresh();
    } catch {
      toast.add({
        title: "Sign out failed",
        description: "Something went wrong. Please try again.",
        type: "error",
      });
      setIsLoggingOut(false);
    }
  };

  const displayedImage = preview || image;

  const roleMeta = {
    customer: {
      label: "Customer",
      icon: Sparkles,
      badgeClass: "border-accent/40 bg-accent/15 text-foreground",
    },
    vendor: {
      label: "Vendor",
      icon: Briefcase,
      badgeClass: "border-primary/30 bg-primary/10 text-primary",
    },
    admin: {
      label: "Admin",
      icon: ShieldCheck,
      badgeClass: "border-zinc-700 bg-zinc-800 text-zinc-100",
    },
  }[role];

  const RoleIcon = roleMeta.icon;

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      {/* ============ HEADER ============ */}
      <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-gradient-to-br from-card via-card to-secondary/40 p-6 shadow-sm sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-accent/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 left-1/3 size-40 rounded-full bg-primary/10 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.15em] text-foreground">
              <RoleIcon className="size-3" />
              {roleMeta.label} Account
            </span>

            <h2 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Profile Settings
            </h2>

            <p className="mt-1.5 max-w-md text-sm leading-6 text-muted-foreground">
              Manage your personal information and profile appearance.
            </p>
          </div>

          <div className="hidden size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/25 ring-1 ring-accent/30 sm:flex">
            <UserRound className="size-7" />
          </div>
        </div>
      </div>

      {/* ============ FORM ============ */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-2xl border border-border/70 bg-card shadow-sm">
          {/* Photo section */}
          <div className="relative flex flex-col items-center gap-5 border-b border-border/70 bg-gradient-to-br from-secondary/40 via-card to-card p-6 sm:flex-row sm:items-center sm:p-8">
            <div className="relative shrink-0">
              <div className="relative">
                {displayedImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={displayedImage}
                    alt="Profile preview"
                    referrerPolicy="no-referrer"
                    className="size-24 rounded-2xl border-2 border-accent/50 object-cover shadow-lg shadow-primary/10 sm:size-28"
                  />
                ) : (
                  <div className="flex size-24 items-center justify-center rounded-2xl border-2 border-accent/50 bg-gradient-to-br from-primary/10 to-accent/10 text-primary shadow-lg shadow-primary/10 sm:size-28">
                    <UserRound className="size-12" />
                  </div>
                )}

                <label
                  htmlFor="profile-image"
                  className="group/camera absolute -bottom-2 -right-2 flex size-9 cursor-pointer items-center justify-center rounded-xl border border-border bg-card text-primary shadow-md transition-all hover:scale-110 hover:border-primary hover:bg-primary hover:text-primary-foreground"
                  title="Change profile photo"
                >
                  <Camera className="size-4 transition-transform group-hover/camera:rotate-12" />
                </label>

                <input
                  ref={fileInputRef}
                  id="profile-image"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => handleImageChange(e.target.files?.[0])}
                />
              </div>
            </div>

            <div className="min-w-0 flex-1 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <h3 className="font-heading text-xl font-semibold text-foreground">
                  {name || "Your Name"}
                </h3>
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                    roleMeta.badgeClass,
                  )}
                >
                  <RoleIcon className="size-2.5" />
                  {roleMeta.label}
                </span>
              </div>

              <p className="mt-1 truncate text-sm text-muted-foreground">
                {user.email}
              </p>

              <p className="mt-2 text-xs text-muted-foreground">
                JPG, PNG or WebP · Maximum 5MB
              </p>
            </div>
          </div>

          {/* Fields */}
          <div className="space-y-5 p-6 sm:p-8">
            <div className="space-y-2">
              <label
                htmlFor="profile-name"
                className="text-sm font-semibold text-foreground"
              >
                Full Name
              </label>

              <div className="relative">
                <UserRound className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="profile-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                  className="h-11 pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="profile-email"
                className="text-sm font-semibold text-foreground"
              >
                Email Address
              </label>

              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="profile-email"
                  value={user.email || ""}
                  readOnly
                  className="h-11 cursor-not-allowed bg-muted/50 pl-9"
                />
              </div>

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

                <div className="relative">
                  <Briefcase className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="business-name"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Enter your business name"
                    required
                    className="h-11 pl-9"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Save footer */}
          <div className="flex flex-col items-stretch gap-3 border-t border-border/70 bg-secondary/30 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <p className="text-xs text-muted-foreground">
              Your changes will be visible across the platform.
            </p>

            <Button
              type="submit"
              disabled={isSaving}
              className="group/save relative h-11 cursor-pointer gap-2 overflow-hidden rounded-xl bg-primary px-5 font-semibold shadow-md shadow-primary/20 transition-all hover:shadow-lg hover:shadow-primary/30"
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-accent/40 to-transparent transition-transform duration-700 group-hover/save:translate-x-full" />
              <span className="relative flex items-center gap-2">
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
              </span>
            </Button>
          </div>
        </div>
      </form>

      {/* ============ LOGOUT SECTION ============ */}
      <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-gradient-to-br from-secondary/30 via-card to-card p-6 shadow-sm sm:p-8">
        <div className="pointer-events-none absolute -right-12 -top-12 size-40 rounded-full bg-primary/[0.06] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 left-1/4 size-32 rounded-full bg-accent/[0.08] blur-3xl" />

        <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-accent/30 bg-gradient-to-br from-primary/10 to-accent/10 text-primary shadow-sm">
              <LogOut className="size-5" />
            </span>

            <div>
              <h3 className="font-heading text-lg font-semibold text-foreground">
                Sign Out
              </h3>
              <p className="mt-0.5 max-w-md text-sm text-muted-foreground">
                You&apos;ll be signed out of your account on this device. You
                can sign back in anytime.
              </p>
            </div>
          </div>

          {/* Sign Out Trigger → Opens AlertDialog */}
          <AlertDialog
            open={logoutDialogOpen}
            onOpenChange={setLogoutDialogOpen}
          >
            <AlertDialogTrigger
              render={
                <Button
                  type="button"
                  variant="outline"
                  className="group/logout h-11 gap-2 rounded-xl cursor-pointer border-primary/25 bg-background font-semibold text-primary shadow-sm transition-all hover:border-primary/50 hover:bg-primary/5 hover:shadow-md"
                />
              }
            >
              <LogOut className="size-4 transition-transform group-hover/logout:-translate-x-0.5" />
              Log Out
            </AlertDialogTrigger>

            <AlertDialogContent size="sm">
              <AlertDialogHeader>
                <AlertDialogMedia className="bg-primary/10 text-primary">
                  <LogOut className="size-5" />
                </AlertDialogMedia>

                <AlertDialogTitle className="font-heading text-lg">
                  Sign out of your account?
                </AlertDialogTitle>

                <AlertDialogDescription>
                  You&apos;ll be signed out on this device. Any unsaved profile
                  changes will be lost. You can sign back in anytime.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel
                  disabled={isLoggingOut}
                  className="cursor-pointer"
                >
                  Cancel
                </AlertDialogCancel>

                <AlertDialogAction
                  onClick={(e) => {
                    e.preventDefault();
                    handleLogout();
                  }}
                  disabled={isLoggingOut}
                  className="gap-2 bg-primary cursor-pointer text-primary-foreground hover:bg-primary/90"
                >
                  {isLoggingOut ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Signing Out...
                    </>
                  ) : (
                    <>
                      <LogOut className="size-4 cursor-p" />
                      Sign Out
                    </>
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <div className="relative z-10 mt-4 flex items-start gap-2 rounded-lg border border-accent/20 bg-accent/5 p-3">
          <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-accent-foreground/70" />
          <p className="text-xs leading-relaxed text-muted-foreground">
            Make sure your changes are saved before signing out. Unsaved changes
            will be lost.
          </p>
        </div>
      </div>
    </div>
  );
}
