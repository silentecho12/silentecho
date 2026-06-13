import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ExternalLink, Loader2 } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { usePortfolio } from "@/lib/content";

export const Route = createFileRoute("/portfolio")({
  component: PortfolioPage,
  head: () => ({
    meta: [
      { title: "Portfolio — Felix Nyandiko" },
      {
        name: "description",
        content: "Selected projects by Felix Nyandiko — web apps, dashboards, and designs.",
      },
    ],
  }),
});

function PortfolioPage() {
  const { data: projects = [], isLoading } = usePortfolio();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <motion.main
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-6xl px-6 py-16"
      >
        <p className="text-sm font-semibold uppercase tracking-widest text-[var(--accent-green)]">
          Portfolio
        </p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">
          Recent <span className="text-[var(--accent-green)]">Work</span>
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
          A selection of projects I've shipped recently — spanning full-stack apps, dashboards and
          design work.
        </p>

        {isLoading ? (
          <div className="mt-12 flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-[var(--accent-green)]" />
          </div>
        ) : projects.length === 0 ? (
          <p className="mt-10 text-sm text-muted-foreground">No projects yet.</p>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <motion.article
                key={p.id}
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 260, damping: 24 }}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card/40 p-6 transition-colors hover:border-[var(--accent-green)]"
              >
                {p.image_url && (
                  <img
                    src={p.image_url}
                    alt={p.title}
                    className="mb-4 aspect-video w-full rounded-lg object-cover"
                  />
                )}
                <div className="flex flex-wrap gap-1.5">
                  {(p.tags ?? []).map((t: string) => (
                    <span
                      key={t}
                      className="rounded-full bg-[var(--accent-green)]/10 px-2.5 py-0.5 text-[10px] font-medium text-[var(--accent-green)]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <h3 className="mt-3 text-lg font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {p.description}
                </p>
                {p.link_url && (
                  <a
                    href={p.link_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 text-sm text-[var(--accent-green)] hover:underline"
                  >
                    View project <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </motion.article>
            ))}
          </div>
        )}
      </motion.main>
    </div>
  );
}
