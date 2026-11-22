"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import type { Role } from "@/components/dashboard/dashboard-sidebar";

interface DashboardRouteGuardProps {
  role: Role | null;
  isPending: boolean;
  hasUser: boolean;
}

function RouteGuardContent({
  role,
  isPending,
  hasUser,
}: DashboardRouteGuardProps) {
  const pathname = usePathname();
  const router = useRouter();

  const getRequiredRole = (path: string): Role | null => {
    if (path.startsWith("/dashboard/vendor")) return "vendor";
    if (path.startsWith("/dashboard/customer")) return "customer";
    if (path.startsWith("/dashboard/admin")) return "admin";

    return null;
  };

  const requiredRole = getRequiredRole(pathname);
  const isRoleMismatch = requiredRole !== null && requiredRole !== role;

  useEffect(() => {
    if (isPending) return;

    if (!hasUser || !role) {
      router.replace("/login");
      return;
    }

    if (isRoleMismatch) {
      router.replace(`/dashboard/${role}`);
    }
  }, [hasUser, isPending, isRoleMismatch, role, router]);

  return null;
}

export default function DashboardRouteGuard(props: DashboardRouteGuardProps) {
  return (
    <Suspense fallback={null}>
      <RouteGuardContent {...props} />
    </Suspense>
  );
}
