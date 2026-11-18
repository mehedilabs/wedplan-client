"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { authClient } from "@/lib/auth-client";

export default function DashboardIndexPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      router.replace("/login");
      return;
    }

    const role = (session.user as { role?: string }).role;
    const target =
      role === "vendor"
        ? "/dashboard/vendor"
        : role === "admin"
          ? "/dashboard/admin"
          : "/dashboard/customer";

    router.replace(target);
  }, [session, isPending, router]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="size-6 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Opening your dashboard...</p>
      </div>
    </div>
  );
}
