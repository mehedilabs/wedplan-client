"use client";

import { authClient } from "@/lib/auth-client";
import { ProfileSettingsForm } from "@/components/dashboard/profile-settings-form";

export default function CustomerProfilePage() {
  const { data: session } = authClient.useSession();

  if (!session?.user) return null;

  return <ProfileSettingsForm role="customer" user={session.user} />;
}
