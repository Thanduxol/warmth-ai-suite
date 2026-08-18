import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Clock, Compass, ListChecks, Mail, MessageSquare, NotebookPen, ShieldCheck, Zap } from "lucide-react";

import { TOOLS } from "@/lib/tools";

const DESCRIPTION =
  "Ember is a warm, focused AI workspace: draft email, summarize meetings, plan your week and research faster — all editable, all in one place.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ember — AI workplace productivity assistant" },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: "Ember — AI workplace productivity assistant" },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

const icons = {
  email: Mail,
  notes: NotebookPen,
  tasks: ListChecks,
  research: Compass,
} as const;

const stats = [
  { icon: Clock, value: "8.5h", label: "Typical hours saved each week" },
  { icon: Zap, value: "12×", label: "Faster first drafts" },
  { icon: ShieldCheck, value: "100%", label: "Editable before it leaves you" },
];

function Dashboard() {
  return (
    <div className="grid gap-8">
      <section className="warm-grain relative overflow-hidden rounded-2xl border bg-card px-5 py-9 sm:px-9 sm:py-12">
        <p className="text-[11px] font-semibold tracking-[0.2em] text-clay uppercase">Powered by Ember AI</p>
        <h1 className="mt-3 max-w-2xl font-display text-3xl leading-[1.08] font-semibold sm:text-5xl">
          Your workday, <span className="text-primary">drafted for you</span> — then handed straight back.
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          {DESCRIPTION}
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            to="/email"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Start with email <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/chat"
            className="inline-flex items-center gap-2 rounded-lg border bg-background/60 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-accent"
          >
            <MessageSquare className="h-4 w-4" /> Open Ember Chat
          </Link>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="flex items-center gap-4 rounded-xl border bg-card p-4">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
              <stat.icon className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="font-display text-xl font-semibold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        ))}
      </section>

      <section>
        <div className="mb-4">
          <h2 className="font-display text-xl font-semibold">Productivity tools</h2>
          <p className="text-sm text-muted-foreground">Pick a tool, fill in a short structured prompt, edit the result.</p>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {TOOLS.map((tool) => {
            const Icon = icons[tool.id];
            return (
              <Link
                key={tool.id}
                to={tool.path}
                className="group rounded-xl border bg-card p-5 transition-colors hover:border-primary/45 hover:bg-accent/40"
              >
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-clay/15 text-clay">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display text-base font-semibold">{tool.name}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{tool.tagline}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                  Open tool
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            );
          })}

          <Link
            to="/chat"
            className="group rounded-xl border bg-card p-5 transition-colors hover:border-primary/45 hover:bg-accent/40"
          >
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-clay/15 text-clay">
              <MessageSquare className="h-5 w-5" />
            </span>
            <h3 className="mt-4 font-display text-base font-semibold">Ember Chat</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              Open-ended conversation when the task doesn't fit a form.
            </p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
              Open chat
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        </div>
      </section>

      <section className="rounded-xl border border-primary/25 bg-primary/5 p-5">
        <h2 className="flex items-center gap-2 font-display text-base font-semibold">
          <ShieldCheck className="h-4 w-4 text-primary" /> Responsible AI
        </h2>
        <ul className="mt-3 grid gap-2 text-sm leading-relaxed text-muted-foreground">
          <li>Every output is a draft. You review, edit and own what you send.</li>
          <li>Ember can be confidently wrong — verify names, numbers, dates and commitments.</li>
          <li>Don't paste confidential or personal data you wouldn't share with a third-party AI service.</li>
          <li>Nothing is stored: your prompts and drafts stay in this browser session.</li>
        </ul>
      </section>
    </div>
  );
}
