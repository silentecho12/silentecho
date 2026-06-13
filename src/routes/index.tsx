import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Github, Linkedin, Twitter, Youtube, Download } from "lucide-react";
import portrait from "@/assets/portrait.jpg";
import { SiteHeader } from "@/components/SiteHeader";
import { useSiteContent } from "@/lib/content";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Felix Nyandiko — Portfolio" },
      {
        name: "description",
        content:
          "Portfolio of Felix Nyandiko — Frontend Developer, Backend Developer and Designer.",
      },
    ],
  }),
});

function useTypewriter(words: string[], typeMs = 90, deleteMs = 50, pauseMs = 1400) {
  const [text, setText] = useState("");
  const [i, setI] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[i % words.length];
    if (!deleting && text === current) {
      const t = setTimeout(() => setDeleting(true), pauseMs);
      return () => clearTimeout(t);
    }
    if (deleting && text === "") {
      setDeleting(false);
      setI((p) => (p + 1) % words.length);
      return;
    }
    const t = setTimeout(() => {
      setText((prev) =>
        deleting ? current.substring(0, prev.length - 1) : current.substring(0, prev.length + 1),
      );
    },
      deleting ? deleteMs : typeMs,
    );
    return () => clearTimeout(t);
  }, [text, deleting, i, words, typeMs, deleteMs, pauseMs]);

  return text;
}

function Index() {
  const { data: content } = useSiteContent();
  const roles = useMemo(
    () =>
      (content?.home_roles ?? "Frontend Developer,Backend Developer,Designer")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    [content?.home_roles],
  );
  const typed = useTypewriter(roles);
  const name = (content?.home_name ?? "Felix\nNyandiko").replace(/\\n/g, "\n");
  const intro = content?.home_intro ?? "I'm a";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 md:grid-cols-2">
        <motion.section
          initial={{ opacity: 0, x: -22 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="whitespace-pre-line text-5xl font-extrabold tracking-tight md:text-6xl">
            {name}
          </h1>
          <h2 className="mt-3 text-2xl font-semibold md:text-3xl">
            {intro}{" "}
            <span className="text-[var(--accent-green)]">
              {typed}
              <span
                className="ml-0.5 inline-block w-[2px] animate-pulse bg-[var(--accent-green)]"
                style={{ height: "1em", verticalAlign: "-0.15em" }}
              />
            </span>
          </h2>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
            Hello, welcome to my portfolio website! I'm passionate about creating responsive and
            user-friendly websites. My goal is to build websites that are not only visually
            appealing but also functional and accessible to all users.
          </p>

          <div className="mt-8 flex items-center gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--accent-green)] px-6 py-3 text-sm font-semibold text-black shadow-[0_8px_30px_-8px_var(--accent-green)] transition-transform hover:scale-105"
            >
              <Download className="h-4 w-4" /> Hire Me
            </Link>
            {[Github, Linkedin, Twitter, Youtube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--accent-green)] text-[var(--accent-green)] transition-colors hover:bg-[var(--accent-green)] hover:text-black"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.65, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto aspect-square w-full max-w-md"
        >
          <motion.div
            animate={{ rotate: [0, 2, 0, -2, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 rounded-full border-2 border-[var(--accent-green)]"
            style={{
              clipPath: "polygon(0 0, 100% 0, 100% 70%, 70% 100%, 0 100%)",
            }}
          />
          <img
            src={portrait}
            alt="Felix Nyandiko portrait"
            width={800}
            height={800}
            className="absolute inset-4 h-[calc(100%-2rem)] w-[calc(100%-2rem)] rounded-full object-cover"
          />
        </motion.section>
      </main>
    </div>
  );
}
