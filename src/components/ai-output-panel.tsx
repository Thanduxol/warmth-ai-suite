import { Check, Copy, Eraser, Pencil, RefreshCw, Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { Streamdown } from "streamdown";

import { Button } from "@/components/ui/button";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  value: string;
  onChange: (value: string) => void;
  isStreaming: boolean;
  error?: string | null;
  emptyHint: string;
  onRegenerate: () => void;
  canRegenerate: boolean;
};

export function AiOutputPanel({
  value,
  onChange,
  isStreaming,
  error,
  emptyHint,
  onRegenerate,
  canRegenerate,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(timer);
  }, [copied]);

  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
  };

  const hasContent = value.trim().length > 0;

  return (
    <section className="flex min-h-[26rem] flex-col overflow-hidden rounded-xl border bg-card">
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b bg-secondary/40 px-4 py-3">
        <div className="min-w-0">
          <h2 className="truncate font-display text-base font-semibold">Output</h2>
          <p className="truncate text-xs text-muted-foreground">
            {isStreaming ? "Generating…" : editing ? "Editing — your changes are kept" : "Fully editable"}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={editing ? "Preview output" : "Edit output"}
            disabled={!hasContent}
            onClick={() => setEditing((v) => !v)}
          >
            {editing ? <Eye className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label="Copy output" disabled={!hasContent} onClick={copy}>
            {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Regenerate"
            disabled={!canRegenerate || isStreaming}
            onClick={onRegenerate}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Clear output"
            disabled={!hasContent || isStreaming}
            onClick={() => onChange("")}
          >
            <Eraser className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4">
        {error ? (
          <p className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-foreground">
            {error}
          </p>
        ) : !hasContent && isStreaming ? (
          <Shimmer>Thinking…</Shimmer>
        ) : !hasContent ? (
          <p className="max-w-sm text-sm text-muted-foreground">{emptyHint}</p>
        ) : editing ? (
          <Textarea
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className="min-h-[22rem] resize-y font-mono text-sm"
            aria-label="Edit AI output"
          />
        ) : (
          <div className="text-sm leading-relaxed">
            <Streamdown>{value}</Streamdown>
          </div>
        )}
      </div>

      <footer className="border-t px-4 py-2.5 text-[11px] leading-relaxed text-muted-foreground">
        AI-generated. Review facts, names, numbers and commitments before you send or act on this.
      </footer>
    </section>
  );
}
