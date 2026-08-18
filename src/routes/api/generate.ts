import { createFileRoute } from "@tanstack/react-router";
import { streamText } from "ai";

import {
  AI_MODEL,
  createLovableAiGatewayProvider,
  getLovableAiGatewayRunId,
} from "@/lib/ai-gateway.server";
import { TOOL_SYSTEM_PROMPTS } from "@/lib/tool-prompts.server";

type GenerateBody = {
  toolId?: string;
  values?: Record<string, string>;
};

export const Route = createFileRoute("/api/generate")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json()) as GenerateBody;
        const system = body.toolId ? TOOL_SYSTEM_PROMPTS[body.toolId] : undefined;

        if (!system) {
          return new Response("Unknown tool.", { status: 400 });
        }

        const entries = Object.entries(body.values ?? {}).filter(([, value]) => value?.trim());
        if (entries.length === 0) {
          return new Response("Please fill in the form before generating.", { status: 400 });
        }

        const key = process.env["LOVABLE_API_KEY"];
        if (!key) {
          return new Response("AI is not configured for this app.", { status: 500 });
        }

        const prompt = entries.map(([label, value]) => `${label}:\n${value.trim()}`).join("\n\n");

        const initialRunId = getLovableAiGatewayRunId(request);
        const gateway = createLovableAiGatewayProvider(key, initialRunId);

        try {
          const result = streamText({
            model: gateway(AI_MODEL),
            system,
            prompt,
          });

          return result.toTextStreamResponse({
            headers: { "Content-Type": "text/plain; charset=utf-8" },
          });
        } catch (error) {
          const message = error instanceof Error ? error.message : "Generation failed.";
          return new Response(message, { status: 500 });
        }
      },
    },
  },
});
