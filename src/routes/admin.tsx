import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/useAuth";
import { Trash2, Plus, Save, LogOut, Loader2 } from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
  head: () => ({ meta: [{ title: "Admin — Felix Nyandiko" }] }),
});

type Tab = "portfolio" | "services" | "content";

function AdminPage() {
  const { session, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("portfolio");

  useEffect(() => {
    if (!loading && !session) navigate({ to: "/login" });
  }, [session, loading, navigate]);

  if (loading) return <Center><Loader2 className="h-6 w-6 animate-spin" /></Center>;
  if (!session) return null;

  if (!isAdmin) {
    return (
      <Center>
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Access denied</h1>
          <p className="text-sm text-white/60 max-w-sm">
            Your account ({session.user.email}) does not have admin privileges.
          </p>
          <button
            onClick={() => supabase.auth.signOut().then(() => navigate({ to: "/login" }))}
            className="rounded-full bg-[var(--accent-green)] px-5 py-2 text-sm font-semibold text-black"
          >Sign out</button>
        </div>
      </Center>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="text-sm font-bold tracking-widest text-[var(--accent-green)]">SILENT ECHO · ADMIN</Link>
          <div className="flex items-center gap-4 text-xs text-white/60">
            <span>{session.user.email}</span>
            <button
              onClick={() => supabase.auth.signOut().then(() => navigate({ to: "/login" }))}
              className="inline-flex items-center gap-1 hover:text-white"
            ><LogOut className="h-3.5 w-3.5" /> Sign out</button>
          </div>
        </div>
        <div className="mx-auto flex max-w-6xl gap-1 px-6">
          {(["portfolio", "services", "content"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm capitalize border-b-2 transition-colors ${
                tab === t ? "border-[var(--accent-green)] text-[var(--accent-green)]" : "border-transparent text-white/60 hover:text-white"
              }`}
            >{t}</button>
          ))}
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">
        {tab === "portfolio" && <PortfolioTab />}
        {tab === "services" && <ServicesTab />}
        {tab === "content" && <ContentTab />}
      </main>
    </div>
  );
}

function Center({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-6">{children}</div>;
}

/* -------------------- Portfolio -------------------- */
function PortfolioTab() {
  const qc = useQueryClient();
  const { data: items = [], isLoading } = useQuery({
    queryKey: ["admin-portfolio"],
    queryFn: async () => {
      const { data, error } = await supabase.from("portfolio_items").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const add = async () => {
    const { error } = await supabase.from("portfolio_items").insert({
      title: "New Project", description: "", tags: [], sort_order: items.length + 1,
    });
    if (error) return alert(error.message);
    qc.invalidateQueries({ queryKey: ["admin-portfolio"] });
    qc.invalidateQueries({ queryKey: ["portfolio"] });
  };

  return (
    <Section title="Portfolio Projects" onAdd={add}>
      {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : items.map((it) => (
        <PortfolioRow key={it.id} item={it} />
      ))}
    </Section>
  );
}

function PortfolioRow({ item }: { item: any }) {
  const qc = useQueryClient();
  const [form, setForm] = useState({
    title: item.title, description: item.description, image_url: item.image_url ?? "",
    link_url: item.link_url ?? "", tags: (item.tags ?? []).join(", "), sort_order: item.sort_order,
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${item.id}/${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage.from("portfolio-images").upload(path, file, { upsert: true });
    if (upErr) { setUploading(false); return alert(upErr.message); }
    const { data } = supabase.storage.from("portfolio-images").getPublicUrl(path);
    const publicUrl = data.publicUrl;
    const { error: updErr } = await supabase.from("portfolio_items").update({ image_url: publicUrl }).eq("id", item.id);
    setUploading(false);
    if (updErr) return alert(updErr.message);
    setForm((f) => ({ ...f, image_url: publicUrl }));
    qc.invalidateQueries({ queryKey: ["admin-portfolio"] });
    qc.invalidateQueries({ queryKey: ["portfolio"] });
  };

  const save = async () => {
    setSaving(true);
    const { error } = await supabase.from("portfolio_items").update({
      title: form.title, description: form.description,
      image_url: form.image_url || null, link_url: form.link_url || null,
      tags: form.tags.split(",").map((t: string) => t.trim()).filter(Boolean),
      sort_order: Number(form.sort_order) || 0,
    }).eq("id", item.id);
    setSaving(false);
    if (error) return alert(error.message);
    qc.invalidateQueries({ queryKey: ["admin-portfolio"] });
    qc.invalidateQueries({ queryKey: ["portfolio"] });
  };

  const remove = async () => {
    if (!confirm("Delete this project?")) return;
    const { error } = await supabase.from("portfolio_items").delete().eq("id", item.id);
    if (error) return alert(error.message);
    qc.invalidateQueries({ queryKey: ["admin-portfolio"] });
    qc.invalidateQueries({ queryKey: ["portfolio"] });
  };

  return (
    <Card>
      <Input label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
      <Textarea label="Description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} />
      <Input label="Tags (comma-separated)" value={form.tags} onChange={(v) => setForm({ ...form, tags: v })} />
      <div className="grid gap-3 md:grid-cols-2">
        <Input label="Image URL" value={form.image_url} onChange={(v) => setForm({ ...form, image_url: v })} />
        <Input label="Project link" value={form.link_url} onChange={(v) => setForm({ ...form, link_url: v })} />
      </div>
      <Input label="Sort order" type="number" value={String(form.sort_order)} onChange={(v) => setForm({ ...form, sort_order: Number(v) })} />
      <RowActions onSave={save} onDelete={remove} saving={saving} />
    </Card>
  );
}

/* -------------------- Services -------------------- */
function ServicesTab() {
  const qc = useQueryClient();
  const { data: items = [], isLoading } = useQuery({
    queryKey: ["admin-services"],
    queryFn: async () => {
      const { data, error } = await supabase.from("services").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const add = async () => {
    const { error } = await supabase.from("services").insert({
      title: "New Service", description: "", icon: "Sparkles", sort_order: items.length + 1,
    });
    if (error) return alert(error.message);
    qc.invalidateQueries({ queryKey: ["admin-services"] });
    qc.invalidateQueries({ queryKey: ["services"] });
  };

  return (
    <Section title="Services" onAdd={add}>
      {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : items.map((it) => <ServiceRow key={it.id} item={it} />)}
    </Section>
  );
}

function ServiceRow({ item }: { item: any }) {
  const qc = useQueryClient();
  const [form, setForm] = useState({
    title: item.title, description: item.description, icon: item.icon, sort_order: item.sort_order,
  });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    const { error } = await supabase.from("services").update({
      title: form.title, description: form.description, icon: form.icon,
      sort_order: Number(form.sort_order) || 0,
    }).eq("id", item.id);
    setSaving(false);
    if (error) return alert(error.message);
    qc.invalidateQueries({ queryKey: ["admin-services"] });
    qc.invalidateQueries({ queryKey: ["services"] });
  };

  const remove = async () => {
    if (!confirm("Delete this service?")) return;
    const { error } = await supabase.from("services").delete().eq("id", item.id);
    if (error) return alert(error.message);
    qc.invalidateQueries({ queryKey: ["admin-services"] });
    qc.invalidateQueries({ queryKey: ["services"] });
  };

  return (
    <Card>
      <Input label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
      <Textarea label="Description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} />
      <div className="grid gap-3 md:grid-cols-2">
        <Input
          label="Icon (lucide name: Code, Server, Palette, Smartphone, Database, Search, Sparkles, ...)"
          value={form.icon} onChange={(v) => setForm({ ...form, icon: v })}
        />
        <Input label="Sort order" type="number" value={String(form.sort_order)} onChange={(v) => setForm({ ...form, sort_order: Number(v) })} />
      </div>
      <RowActions onSave={save} onDelete={remove} saving={saving} />
    </Card>
  );
}

/* -------------------- Site content -------------------- */
const CONTENT_FIELDS: { key: string; label: string; type?: "text" | "textarea"; help?: string }[] = [
  { key: "home_name", label: "Home — Name (use \\n for line break)", help: "e.g. Felix\\nNyandiko" },
  { key: "home_intro", label: "Home — Intro phrase", help: "e.g. I'm a" },
  { key: "home_roles", label: "Home — Typewriter roles (comma-separated)", help: "Frontend Developer,Backend Developer,Designer" },
  { key: "about_headline", label: "About — Headline" },
  { key: "about_bio", label: "About — Bio", type: "textarea" },
  { key: "contact_email", label: "Contact — Email" },
  { key: "contact_phone_primary", label: "Contact — Primary phone (digits only, country code, no +)" },
  { key: "contact_phone_secondary", label: "Contact — Secondary phone" },
  { key: "contact_whatsapp", label: "Contact — WhatsApp number (digits only)" },
];

function ContentTab() {
  const qc = useQueryClient();
  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["admin-content"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_content").select("*");
      if (error) throw error;
      return data;
    },
  });

  const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  const [form, setForm] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(Object.fromEntries(CONTENT_FIELDS.map((f) => [f.key, map[f.key] ?? ""])));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows.length]);

  const saveAll = async () => {
    setSaving(true);
    const payload = CONTENT_FIELDS.map((f) => ({ key: f.key, value: form[f.key] ?? "" }));
    const { error } = await supabase.from("site_content").upsert(payload, { onConflict: "key" });
    setSaving(false);
    if (error) return alert(error.message);
    qc.invalidateQueries({ queryKey: ["admin-content"] });
    qc.invalidateQueries({ queryKey: ["site_content"] });
    alert("Saved.");
  };

  if (isLoading) return <Loader2 className="h-5 w-5 animate-spin" />;

  return (
    <Section title="Page Content">
      <Card>
        {CONTENT_FIELDS.map((f) => f.type === "textarea" ? (
          <Textarea key={f.key} label={f.label} value={form[f.key] ?? ""} onChange={(v) => setForm({ ...form, [f.key]: v })} help={f.help} />
        ) : (
          <Input key={f.key} label={f.label} value={form[f.key] ?? ""} onChange={(v) => setForm({ ...form, [f.key]: v })} help={f.help} />
        ))}
        <button
          onClick={saveAll} disabled={saving}
          className="inline-flex items-center gap-2 rounded-full bg-[var(--accent-green)] px-5 py-2 text-sm font-semibold text-black disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save all
        </button>
      </Card>
    </Section>
  );
}

/* -------------------- shared bits -------------------- */
function Section({ title, onAdd, children }: { title: string; onAdd?: () => void; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">{title}</h2>
        {onAdd && (
          <button onClick={onAdd} className="inline-flex items-center gap-1.5 rounded-full bg-[var(--accent-green)] px-4 py-2 text-sm font-semibold text-black">
            <Plus className="h-4 w-4" /> Add new
          </button>
        )}
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}
function Card({ children }: { children: React.ReactNode }) {
  return <div className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5">{children}</div>;
}
function Input({ label, value, onChange, type = "text", help }: { label: string; value: string; onChange: (v: string) => void; type?: string; help?: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] uppercase tracking-widest text-white/50">{label}</span>
      <input
        type={type} value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-[var(--accent-green)]"
      />
      {help && <span className="mt-1 block text-[10px] text-white/40">{help}</span>}
    </label>
  );
}
function Textarea({ label, value, onChange, help }: { label: string; value: string; onChange: (v: string) => void; help?: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] uppercase tracking-widest text-white/50">{label}</span>
      <textarea
        value={value} onChange={(e) => onChange(e.target.value)} rows={3}
        className="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-[var(--accent-green)]"
      />
      {help && <span className="mt-1 block text-[10px] text-white/40">{help}</span>}
    </label>
  );
}
function RowActions({ onSave, onDelete, saving }: { onSave: () => void; onDelete: () => void; saving: boolean }) {
  return (
    <div className="flex items-center gap-2 pt-2">
      <button
        onClick={onSave} disabled={saving}
        className="inline-flex items-center gap-1.5 rounded-full bg-[var(--accent-green)] px-4 py-2 text-xs font-semibold text-black disabled:opacity-50"
      >
        {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />} Save
      </button>
      <button
        onClick={onDelete}
        className="inline-flex items-center gap-1.5 rounded-full border border-red-500/50 px-4 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/10"
      >
        <Trash2 className="h-3.5 w-3.5" /> Delete
      </button>
    </div>
  );
}
