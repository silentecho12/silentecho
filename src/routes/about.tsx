import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import portrait from "@/assets/portrait.jpg";
import { useSiteContent } from "@/lib/content";

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
  const { data: content } = useSiteContent();
  const headline = content?.about_headline ?? "About Me";
  const bio = content?.about_bio ?? "";

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
          <p className="text-sm font-semibold uppercase tracking-widest text-[var(--accent-green)]">{headline}</p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">
            A passionate <span className="text-[var(--accent-green)]">developer</span> from Kenya
          </h1>
          {bio.split("\n").filter(Boolean).map((para, i) => (
            <p key={i} className="mt-5 text-sm leading-relaxed text-white/70 whitespace-pre-line">{para}</p>
          ))}

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
