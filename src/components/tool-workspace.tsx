import { Loader2, Sparkle } from "lucide-react";
import { useCallback, useRef, useState } from "react";

import { AiOutputPanel } from "@/components/ai-output-panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { ToolConfig } from "@/lib/tools";

function initialValues(tool: ToolConfig) {
  return Object.fromEntries(
    tool.fields.map((field) => [field.id, field.type === "select" ? (field.options?.[0] ?? "") : ""]),
  ) as Record<string, string>;
}

export function ToolWorkspace({ tool }: { tool: ToolConfig }) {
  const [values, setValues] = useState<Record<string, string>>(() => initialValues(tool));
  const [output, setOutput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastRun = useRef<Record<string, string> | null>(null);

  const run = useCallback(
    async (payloadValues: Record<string, string>) => {
      const missing = tool.fields.find((field) => field.required && !payloadValues[field.id]?.trim());
      if (missing) {
        setError(`${missing.label} is needed before Ember can help.`);
        return;
      }

      lastRun.current = payloadValues;
      setError(null);
      setOutput("");
      setIsStreaming(true);

      try {
        const labelled = Object.fromEntries(
          tool.fields
            .filter((field) => payloadValues[field.id]?.trim())
            .map((field) => [field.label, payloadValues[field.id]]),
        );

        const response = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ toolId: tool.id, values: labelled }),
        });

        if (!response.ok || !response.body) {
          const message = (await response.text()) || "Ember could not generate this right now.";
          setError(
            response.status === 402
              ? "The workspace is out of AI credits. Add credits to keep generating."
              : response.status === 429
                ? "Too many requests in a row — give it a few seconds and try again."
                : message,
          );
          return;
        }

        const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
        let text = "";
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          text += value;
          setOutput(text);
        }
      } catch {
        setError("Connection lost while generating. Please try again.");
      } finally {
        setIsStreaming(false);
      }
    },
    [tool],
  );

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:items-start">
      <form
        className="rounded-xl border bg-card p-4 sm:p-5"
        onSubmit={(event) => {
          event.preventDefault();
          void run(values);
        }}
      >
        <h2 className="font-display text-base font-semibold">Structured prompt</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          The more specific these are, the less editing you'll do afterwards.
        </p>

        <div className="mt-5 grid gap-4">
          {tool.fields.map((field) => (
            <div key={field.id} className="grid gap-1.5">
              <Label htmlFor={field.id} className="text-xs font-medium tracking-wide uppercase">
                {field.label}
                {field.required && <span className="text-primary"> *</span>}
              </Label>

              {field.type === "textarea" ? (
                <Textarea
                  id={field.id}
                  value={values[field.id] ?? ""}
                  placeholder={field.placeholder}
                  className="min-h-28 resize-y"
                  onChange={(event) => setValues((v) => ({ ...v, [field.id]: event.target.value }))}
                />
              ) : field.type === "select" ? (
                <Select
                  value={values[field.id] ?? ""}
                  onValueChange={(next) => setValues((v) => ({ ...v, [field.id]: next }))}
                >
                  <SelectTrigger id={field.id}>
                    <SelectValue placeholder="Choose one" />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id={field.id}
                  value={values[field.id] ?? ""}
                  placeholder={field.placeholder}
                  onChange={(event) => setValues((v) => ({ ...v, [field.id]: event.target.value }))}
                />
              )}
            </div>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <Button type="submit" disabled={isStreaming}>
            {isStreaming ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkle className="mr-2 h-4 w-4" />
            )}
            {isStreaming ? "Generating…" : tool.cta}
          </Button>
          <Button
            type="button"
            variant="ghost"
            disabled={isStreaming}
            onClick={() => {
              setValues(initialValues(tool));
              setOutput("");
              setError(null);
            }}
          >
            Reset
          </Button>
        </div>
      </form>

      <AiOutputPanel
        value={output}
        onChange={setOutput}
        isStreaming={isStreaming}
        error={error}
        emptyHint={tool.description}
        canRegenerate={Boolean(lastRun.current)}
        onRegenerate={() => lastRun.current && void run(lastRun.current)}
      />
    </div>
  );
}
