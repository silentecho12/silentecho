import { Link } from "@tanstack/react-router";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/services", label: "Services" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  return (
    <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
      <Link to="/" className="text-xl font-bold">
        Portfolio<span className="text-[var(--accent-green)]">.</span>
      </Link>
      <nav className="hidden gap-8 text-sm md:flex">
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
      </nav>
    </header>
  );
}
