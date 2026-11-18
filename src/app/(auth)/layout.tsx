import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-[calc(100vh-5rem)] flex-1 items-center justify-center bg-background px-4 py-10 sm:px-6">
      <div className="w-full max-w-md">{children}</div>
    </main>
  );
}
