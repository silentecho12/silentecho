import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import portrait from "@/assets/portrait.jpg";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About — Felix Nyandiko" },
      { name: "description", content: "Learn more about Felix Nyandiko — a Kenyan developer and designer building modern web experiences." },
    ],
  }),
});

function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 md:grid-cols-2">
        <img
          src={portrait}
          alt="Felix Nyandiko"
          className="mx-auto w-full max-w-sm rounded-2xl object-cover"
        />
        <section>
          <p className="text-sm font-semibold uppercase tracking-widest text-[var(--accent-green)]">About Me</p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">
            A passionate <span className="text-[var(--accent-green)]">developer</span> from Kenya
          </h1>
          <p className="mt-5 text-sm leading-relaxed text-white/70">
            I'm Felix Nyandiko, a full-stack developer and designer who loves turning ideas
            into clean, accessible, and performant web products. I work across the stack — from
            crafting pixel-perfect interfaces to designing scalable backends and APIs.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-white/70">
            When I'm not coding, I'm exploring new tech, mentoring upcoming developers, and
            collaborating on open-source projects.
          </p>


          <Link
            to="/contact"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--accent-green)] px-6 py-3 text-sm font-semibold text-black hover:scale-105 transition-transform"
          >
            Get in touch
          </Link>
        </section>
      </main>
    </div>
  );
}
