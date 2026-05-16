import { createFileRoute, Link } from "@tanstack/react-router";
import * as Icons from "lucide-react";
import { Loader2 } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { useServices } from "@/lib/content";

export const Route = createFileRoute("/services")({
  component: ServicesPage,
  head: () => ({
    meta: [
      { title: "Services — Felix Nyandiko" },
      { name: "description", content: "Services offered by Felix Nyandiko: frontend, backend, UI/UX, mobile-first design and SEO." },
    ],
  }),
});

function ServiceIcon({ name }: { name: string }) {
  const Cmp = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[name] ?? Icons.Sparkles;
  return <Cmp className="h-6 w-6" />;
}

function ServicesPage() {
  const { data: services = [], isLoading } = useServices();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-16">
        <p className="text-sm font-semibold uppercase tracking-widest text-[var(--accent-green)]">Services</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">
          What I <span className="text-[var(--accent-green)]">Offer</span>
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-white/70">
          End-to-end product development — from idea and design to deployment and maintenance.
        </p>

        {isLoading ? (
          <div className="mt-12 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-[var(--accent-green)]" /></div>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <div
                key={s.id}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-[var(--accent-green)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--accent-green)]/10 text-[var(--accent-green)]">
                  <ServiceIcon name={s.icon} />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{s.description}</p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 flex justify-center">
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--accent-green)] px-6 py-3 text-sm font-semibold text-black hover:scale-105 transition-transform"
          >
            Start a project
          </Link>
        </div>
      </main>
    </div>
  );
}
