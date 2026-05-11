import { createFileRoute, Link } from "@tanstack/react-router";
import { Code2, Server, Palette, Smartphone, Database, Search } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";

export const Route = createFileRoute("/services")({
  component: ServicesPage,
  head: () => ({
    meta: [
      { title: "Services — Felix Nyandiko" },
      { name: "description", content: "Services offered by Felix Nyandiko: frontend, backend, UI/UX, mobile-first design and SEO." },
    ],
  }),
});

const SERVICES = [
  { icon: Code2, title: "Frontend Development", desc: "Modern, responsive interfaces built with React, TanStack and Tailwind." },
  { icon: Server, title: "Backend Development", desc: "APIs, server functions and integrations with secure databases and auth." },
  { icon: Palette, title: "UI/UX Design", desc: "Clean, accessible designs focused on usability and conversion." },
  { icon: Smartphone, title: "Mobile-First Web", desc: "Sites and PWAs that feel native on any device, optimized for performance." },
  { icon: Database, title: "Database & APIs", desc: "Schema design, REST/GraphQL APIs and real-time data with Postgres." },
  { icon: Search, title: "SEO & Performance", desc: "Page speed, Core Web Vitals and SEO best practices baked in from day one." },
];

function ServicesPage() {
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

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-[var(--accent-green)]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--accent-green)]/10 text-[var(--accent-green)]">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">{desc}</p>
            </div>
          ))}
        </div>

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
