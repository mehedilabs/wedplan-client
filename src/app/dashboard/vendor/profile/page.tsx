"use client";

import { authClient } from "@/lib/auth-client";
import { ProfileSettingsForm } from "@/components/dashboard/profile-settings-form";

export default function VendorProfilePage() {
  const { data: session } = authClient.useSession();

  if (!session?.user) return null;

  const user = session.user as typeof session.user & {
    businessName?: string | null;
  };

  return <ProfileSettingsForm role="vendor" user={user} />;
}
