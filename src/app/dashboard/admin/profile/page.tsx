"use client";

import { authClient } from "@/lib/auth-client";
import { ProfileSettingsForm } from "@/components/dashboard/profile-settings-form";

export default function AdminProfilePage() {
  const { data: session } = authClient.useSession();

  if (!session?.user) return null;

  return <ProfileSettingsForm role="admin" user={session.user} />;
}
