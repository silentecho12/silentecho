import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Github, Linkedin, Twitter, Youtube, Download } from "lucide-react";
import portrait from "@/assets/portrait.jpg";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Vincent Stephen — Portfolio" },
      { name: "description", content: "Portfolio of Vincent Stephen — Frontend Developer, Backend Developer and Designer." },
    ],
  }),
});

const ROLES = ["Frontend Developer", "Backend Developer", "Designer"];

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
    }, deleting ? deleteMs : typeMs);
    return () => clearTimeout(t);
  }, [text, deleting, i, words, typeMs, deleteMs, pauseMs]);

  return text;
}

function Index() {
  const typed = useTypewriter(ROLES);

  const nav = ["Home", "About", "Portfolio", "Services", "Contact"];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <a href="#" className="text-xl font-bold">Portfolio<span className="text-[var(--accent-green)]">.</span></a>
        <nav className="hidden gap-8 text-sm md:flex">
          {nav.map((n, idx) => (
            <a
              key={n}
              href="#"
              className={idx === 0 ? "text-[var(--accent-green)]" : "hover:text-[var(--accent-green)] transition-colors"}
            >
              {n}
            </a>
          ))}
        </nav>
      </header>

      <main className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 md:grid-cols-2">
        <section>
          <h1 className="text-5xl font-extrabold tracking-tight md:text-6xl">Vincent Stephen</h1>
          <h2 className="mt-3 text-2xl font-semibold md:text-3xl">
            I'm a{" "}
            <span className="text-[var(--accent-green)]">
              {typed}
              <span className="ml-0.5 inline-block w-[2px] animate-pulse bg-[var(--accent-green)]" style={{ height: "1em", verticalAlign: "-0.15em" }} />
            </span>
          </h2>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-white/70">
            Hello, welcome to my portfolio website! I'm passionate about creating responsive
            and user-friendly websites. My goal is to build websites that are not only visually
            appealing but also functional and accessible to all users.
          </p>

          <div className="mt-8 flex items-center gap-4">
            <a
              href="#"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--accent-green)] px-6 py-3 text-sm font-semibold text-black shadow-[0_8px_30px_-8px_var(--accent-green)] transition-transform hover:scale-105"
            >
              <Download className="h-4 w-4" /> Download CV
            </a>
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
        </section>

        <section className="relative mx-auto aspect-square w-full max-w-md">
          <div className="absolute inset-0 rounded-full border-2 border-[var(--accent-green)]" style={{ clipPath: "polygon(0 0, 100% 0, 100% 70%, 70% 100%, 0 100%)" }} />
          <img
            src={portrait}
            alt="Vincent Stephen portrait"
            width={800}
            height={800}
            className="absolute inset-4 h-[calc(100%-2rem)] w-[calc(100%-2rem)] rounded-full object-cover"
          />
        </section>
      </main>
    </div>
  );
}
