import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Phone, MessageCircle, Send } from "lucide-react";
import { z } from "zod";
import { SiteHeader } from "@/components/SiteHeader";
import { CONTACT } from "@/lib/contact";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Contact — Felix Nyandiko" },
      { name: "description", content: "Reach Felix Nyandiko via WhatsApp, phone or email. Let's build something great together." },
    ],
  }),
});

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  subject: z.string().trim().min(1, "Subject is required").max(150),
  message: z.string().trim().min(1, "Message is required").max(1000),
});

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string>>>({});

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const sendViaWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    const result = schema.safeParse(form);
    if (!result.success) {
      const fieldErrors: typeof errors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof typeof form;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    const { name, email, subject, message } = result.data;
    const text =
      `Hello Felix,%0A%0A` +
      `*Name:* ${encodeURIComponent(name)}%0A` +
      `*Email:* ${encodeURIComponent(email)}%0A` +
      `*Subject:* ${encodeURIComponent(subject)}%0A%0A` +
      `${encodeURIComponent(message)}`;
    window.open(`https://wa.me/${CONTACT.primaryWhatsApp}?text=${text}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-16">
        <p className="text-sm font-semibold uppercase tracking-widest text-[var(--accent-green)]">Contact</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">
          Let's <span className="text-[var(--accent-green)]">talk</span>
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-white/70">
          Have a project in mind or just want to say hi? Send a message and it'll reach me on WhatsApp instantly.
        </p>

        <div className="mt-10 grid gap-10 md:grid-cols-2">
          <div className="space-y-5">
            <ContactRow
              icon={MessageCircle}
              label="WhatsApp"
              value={`+${CONTACT.phones[0]}`}
              href={`https://wa.me/${CONTACT.phones[0]}`}
            />
            <ContactRow
              icon={Phone}
              label="Phone"
              value={`+${CONTACT.phones[1]}`}
              href={`tel:+${CONTACT.phones[1]}`}
            />
            <ContactRow
              icon={Mail}
              label="Email"
              value={CONTACT.email}
              href={`mailto:${CONTACT.email}`}
            />

            <div className="rounded-2xl border border-[var(--accent-green)]/30 bg-[var(--accent-green)]/5 p-5 text-sm text-white/80">
              <p className="font-semibold text-[var(--accent-green)]">Fastest response</p>
              <p className="mt-1">Messages sent through the form below open WhatsApp with your details pre-filled — usually replied within a few hours.</p>
            </div>
          </div>

          <form onSubmit={sendViaWhatsApp} className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <Field label="Your name" error={errors.name}>
              <input
                type="text"
                value={form.name}
                onChange={update("name")}
                maxLength={100}
                className="input-base"
                placeholder="John Doe"
              />
            </Field>
            <Field label="Email" error={errors.email}>
              <input
                type="email"
                value={form.email}
                onChange={update("email")}
                maxLength={255}
                className="input-base"
                placeholder="you@example.com"
              />
            </Field>
            <Field label="Subject" error={errors.subject}>
              <input
                type="text"
                value={form.subject}
                onChange={update("subject")}
                maxLength={150}
                className="input-base"
                placeholder="Project inquiry"
              />
            </Field>
            <Field label="Message" error={errors.message}>
              <textarea
                value={form.message}
                onChange={update("message")}
                maxLength={1000}
                rows={5}
                className="input-base resize-none"
                placeholder="Tell me about your project..."
              />
            </Field>
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--accent-green)] px-6 py-3 text-sm font-semibold text-black transition-transform hover:scale-[1.02]"
            >
              <Send className="h-4 w-4" /> Send via WhatsApp
            </button>
          </form>
        </div>
      </main>

      <style>{`
        .input-base {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 0.75rem;
          padding: 0.65rem 0.9rem;
          font-size: 0.875rem;
          color: inherit;
          outline: none;
          transition: border-color 0.15s;
        }
        .input-base:focus {
          border-color: var(--accent-green);
        }
        .input-base::placeholder {
          color: rgba(255,255,255,0.35);
        }
      `}</style>
    </div>
  );
}

function ContactRow({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-[var(--accent-green)]"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--accent-green)]/10 text-[var(--accent-green)]">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs uppercase tracking-widest text-white/50">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </a>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-white/60">{label}</span>
      {children}
      {error ? <span className="mt-1 block text-xs text-red-400">{error}</span> : null}
    </label>
  );
}
