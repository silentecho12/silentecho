import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";

export const Route = createFileRoute("/portfolio")({
  component: PortfolioPage,
  head: () => ({
    meta: [
      { title: "Portfolio — Felix Nyandiko" },
      { name: "description", content: "Selected projects by Felix Nyandiko — web apps, dashboards, and designs." },
    ],
  }),
});

const PROJECTS = [
  { title: "Silent Echo Platform", tag: "Web App", desc: "A community platform amplifying unheard voices, built with React and a serverless backend." },
  { title: "Kenyan E-Commerce", tag: "Full Stack", desc: "Mobile-first shop with M-Pesa integration, product catalog and admin dashboard." },
  { title: "Analytics Dashboard", tag: "Dashboard", desc: "Real-time charts and KPI tracking for SMEs, built with TanStack Query and Recharts." },
  { title: "Portfolio Template", tag: "Design", desc: "Reusable dark-themed portfolio template with smooth typewriter hero." },
  { title: "Learning Hub", tag: "Education", desc: "Online learning platform with course progress, quizzes and certificates." },
  { title: "Brand Identity", tag: "Design", desc: "Logo and brand system for a fintech startup focused on the East African market." },
];

function PortfolioPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-16">
        <p className="text-sm font-semibold uppercase tracking-widest text-[var(--accent-green)]">Portfolio</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">
          Recent <span className="text-[var(--accent-green)]">Work</span>
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-white/70">
          A selection of projects I've shipped recently — spanning full-stack apps, dashboards and design work.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((p) => (
            <article
              key={p.title}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-[var(--accent-green)]"
            >
              <span className="inline-block rounded-full bg-[var(--accent-green)]/10 px-3 py-1 text-xs font-medium text-[var(--accent-green)]">
                {p.tag}
              </span>
              <h3 className="mt-4 text-lg font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">{p.desc}</p>
              <a
                href="#"
                className="mt-4 inline-flex items-center gap-1.5 text-sm text-[var(--accent-green)] hover:underline"
              >
                View project <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
