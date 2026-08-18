import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/page-header";
import { ToolWorkspace } from "@/components/tool-workspace";
import { getTool } from "@/lib/tools";

const tool = getTool("notes");

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title: `${tool.name} — Ember` },
      { name: "description", content: tool.description },
      { property: "og:title", content: `${tool.name} — Ember` },
      { property: "og:description", content: tool.description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ToolPage,
});

function ToolPage() {
  return (
    <div>
      <PageHeader eyebrow={tool.tagline} title={tool.name} description={tool.description} />
      <ToolWorkspace tool={tool} />
    </div>
  );
}
