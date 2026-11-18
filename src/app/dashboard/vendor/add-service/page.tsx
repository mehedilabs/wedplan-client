import AddServiceForm from "./_components/add-service-form";

export default function AddServicePage() {
  return (
    <main className="min-h-screen bg-background px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Vendor Dashboard
          </p>

          <h1 className="font-heading text-3xl font-semibold text-foreground sm:text-4xl">
            Add a New Service
          </h1>

          <p className="mt-3 text-muted-foreground">
            Share your wedding service with couples planning their special day.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-8">
          <AddServiceForm />
        </div>
      </div>
    </main>
  );
}
