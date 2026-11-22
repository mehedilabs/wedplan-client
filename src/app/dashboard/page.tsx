"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";
import { DashboardLoader } from "@/components/dashboard/dashboard-loader";

type DashboardRole = "vendor" | "admin" | "customer";

function resolveRole(role?: string): DashboardRole | null {
  if (role === "vendor" || role === "admin" || role === "customer") return role;
  return null;
}

export default function DashboardIndexPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;
  const role = user ? resolveRole((user as { role?: string }).role) : null;

  useEffect(() => {
    if (isPending) return;

    if (!user || !role) {
      router.replace("/login");
      return;
    }

    router.replace(`/dashboard/${role}`);
  }, [user, role, isPending, router]);

  return (
    <DashboardLoader
      title={role ? `Opening your ${role} dashboard` : "Opening your dashboard"}
      description="You'll be there in just a moment."
    />
  );
}
