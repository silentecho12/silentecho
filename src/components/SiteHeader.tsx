import { Link } from "@tanstack/react-router";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/useTheme";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/services", label: "Services" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const { theme, toggle } = useTheme();
  return (
    <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
      <Link to="/" className="text-xl font-bold tracking-widest animate-blink">
        SILENT ECHO<span className="text-[var(--accent-green)]">.</span>
      </Link>
      <nav className="hidden items-center gap-8 text-sm md:flex">
        {NAV.map((n) => (
          <Link
            key={n.to}
            to={n.to}
            activeOptions={{ exact: true }}
            activeProps={{ className: "text-[var(--accent-green)]" }}
            className="hover:text-[var(--accent-green)] transition-colors"
          >
            {n.label}
          </Link>
        ))}
        <button
          type="button"
          onClick={toggle}
          aria-label="Toggle theme"
          className="rounded-full border border-foreground/15 p-2 hover:border-[var(--accent-green)] hover:text-[var(--accent-green)] transition-colors"
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </nav>
    </header>
  );
}
