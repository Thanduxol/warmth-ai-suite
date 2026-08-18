# Workly-style AI Productivity Workspace

A responsive, dark-warm SaaS workspace with five AI tools, powered by real AI (Lovable AI) — not mocks.

## Look and feel
Warm, editorial SaaS instead of the blue/purple reference:
- Deep espresso/dark-brown canvas, maroon primary, cream text, warm sand/clay accents
- Minimal chrome: hairline warm borders, soft depth, restrained motion
- Typography: a distinctive display face for headings paired with a clean grotesque for body (not Inter/Poppins)
- Light and dark themes both tuned; all colors as semantic tokens in `src/styles.css`

## Screens
- `/` Dashboard — collapsible sidebar, hero intro, quick stats, tool cards
- `/email` Smart Email Generator — recipient, intent, key points, tone, length
- `/notes` Meeting Notes Summarizer — paste transcript, get summary, decisions, action items
- `/tasks` AI Task Planner — brain-dump tasks, get a prioritized plan by urgency/importance
- `/research` AI Research Assistant — topic + depth, get structured briefing with key points and open questions
- `/chat` AI Chat — streaming conversation with markdown rendering

## Shared behaviors
- Structured prompt forms per tool (selects/fields, not just a blank box)
- Every AI output lands in an editable panel with copy, regenerate, and clear
- Streaming output so results appear as they generate
- Loading, empty, and error states; credit/rate-limit errors surfaced in plain language
- Responsible AI disclaimer banner in the shell plus a short note under each output
- Sidebar collapses to icons on desktop and becomes an off-canvas drawer on mobile

## Technical
- TanStack Start routes under `src/routes`, shared shell in `__root.tsx` (sidebar + disclaimer bar)
- AI via Lovable AI Gateway with the AI SDK; server-only key
  - Chat: streaming server route `src/routes/api/chat.ts`
  - Tools: streaming generation through the same route with per-tool system prompts
- Markdown rendering for AI output; editable textarea view toggle
- No database — nothing is persisted this pass (say the word and I'll add saved history via Lovable Cloud)
- Per-route `head()` metadata with unique titles/descriptions
