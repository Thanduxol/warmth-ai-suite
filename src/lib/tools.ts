export type ToolField = {
  id: string;
  label: string;
  type: "text" | "textarea" | "select";
  placeholder?: string;
  options?: string[];
  required?: boolean;
  hint?: string;
};

export type ToolConfig = {
  id: "email" | "notes" | "tasks" | "research";
  path: string;
  name: string;
  tagline: string;
  description: string;
  cta: string;
  fields: ToolField[];
};

export const TOOLS: ToolConfig[] = [
  {
    id: "email",
    path: "/email",
    name: "Smart Email Generator",
    tagline: "Draft polished email in seconds, with tone control.",
    description:
      "Turn a few bullet points into a clear, well-structured email you can edit before sending.",
    cta: "Draft email",
    fields: [
      { id: "recipient", label: "Recipient", type: "text", placeholder: "Head of Operations, a client, the whole team…", required: true },
      { id: "intent", label: "Purpose of the email", type: "text", placeholder: "Follow up on the vendor contract", required: true },
      {
        id: "points",
        label: "Key points to cover",
        type: "textarea",
        placeholder: "- Contract expires end of month\n- We want a 12-month renewal\n- Need pricing by Friday",
        required: true,
      },
      { id: "tone", label: "Tone", type: "select", options: ["Warm & professional", "Direct & concise", "Formal", "Friendly", "Apologetic", "Persuasive"] },
      { id: "length", label: "Length", type: "select", options: ["Short (under 100 words)", "Medium", "Detailed"] },
    ],
  },
  {
    id: "notes",
    path: "/notes",
    name: "Meeting Notes Summarizer",
    tagline: "Turn raw transcripts into decisions and action items.",
    description:
      "Paste any transcript or messy notes and get a summary, the decisions made, and who owns what next.",
    cta: "Summarize notes",
    fields: [
      { id: "title", label: "Meeting", type: "text", placeholder: "Q3 planning sync" },
      { id: "transcript", label: "Transcript or raw notes", type: "textarea", placeholder: "Paste the transcript or your rough notes here…", required: true },
      { id: "focus", label: "Summary focus", type: "select", options: ["Balanced overview", "Decisions & action items only", "Risks & blockers", "Client-ready recap"] },
      { id: "audience", label: "Written for", type: "select", options: ["The team", "Leadership", "A client", "Someone who missed the meeting"] },
    ],
  },
  {
    id: "tasks",
    path: "/tasks",
    name: "AI Task Planner",
    tagline: "Prioritize your day by urgency and importance.",
    description:
      "Brain-dump everything on your plate and get a realistic, sequenced plan with time estimates.",
    cta: "Build my plan",
    fields: [
      { id: "tasks", label: "Everything on your plate", type: "textarea", placeholder: "- Finish budget deck\n- Reply to legal\n- Interview two candidates\n- Fix the onboarding bug", required: true },
      { id: "horizon", label: "Plan for", type: "select", options: ["Today", "Tomorrow", "This week", "Next two weeks"] },
      { id: "capacity", label: "Available focus time", type: "text", placeholder: "About 5 productive hours" },
      { id: "constraints", label: "Constraints & deadlines", type: "textarea", placeholder: "Board meeting at 14:00, legal deadline Thursday…" },
    ],
  },
  {
    id: "research",
    path: "/research",
    name: "AI Research Assistant",
    tagline: "Get a structured briefing on any topic.",
    description:
      "Ask about a market, competitor, or concept and get an organized briefing with open questions to verify.",
    cta: "Run briefing",
    fields: [
      { id: "topic", label: "Topic or question", type: "text", placeholder: "How are mid-market firms adopting AI assistants?", required: true },
      { id: "angle", label: "What you need from it", type: "textarea", placeholder: "I'm preparing a recommendation for our leadership team." },
      { id: "depth", label: "Depth", type: "select", options: ["Quick primer", "Working briefing", "Deep dive"] },
      { id: "format", label: "Output shape", type: "select", options: ["Briefing with sections", "Bulleted key points", "Pros & cons", "Q&A"] },
    ],
  },
];

export function getTool(id: ToolConfig["id"]) {
  const tool = TOOLS.find((t) => t.id === id);
  if (!tool) throw new Error(`Unknown tool: ${id}`);
  return tool;
}
