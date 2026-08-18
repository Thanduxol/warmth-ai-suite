import { useChat } from "@ai-sdk/react";
import { createFileRoute } from "@tanstack/react-router";
import { DefaultChatTransport } from "ai";
import { useState } from "react";

import emberMark from "@/assets/ember-mark.png";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { Button } from "@/components/ui/button";

const DESCRIPTION =
  "Think out loud with Ember: draft, rewrite, plan, or pressure-test an idea in one continuous conversation.";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "Ember Chat — AI workplace assistant" },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: "Ember Chat — AI workplace assistant" },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ChatPage,
});

const STARTERS = [
  "Rewrite this so it sounds calmer and more confident.",
  "Help me prepare for a difficult performance conversation.",
  "Turn these notes into a one-page update for leadership.",
];

function ChatPage() {
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { messages, sendMessage, status, stop } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    onError: (err) => setError(err.message || "Ember could not respond just now."),
  });

  const busy = status === "submitted" || status === "streaming";

  const submit = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    setError(null);
    setInput("");
    void sendMessage({ text: trimmed });
  };

  return (
    <div className="flex h-[calc(100svh-9.5rem)] min-h-[30rem] flex-col overflow-hidden rounded-xl border bg-card">
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b bg-secondary/40 px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <img src={emberMark} alt="" width={512} height={512} className="h-8 w-8 shrink-0" />
          <div className="min-w-0">
            <h1 className="truncate font-display text-base font-semibold">Ember Chat</h1>
            <p className="truncate text-xs text-muted-foreground">Conversational assistant · this session only</p>
          </div>
        </div>
      </header>

      <Conversation className="flex-1">
        <ConversationContent className="gap-6">
          {messages.length === 0 ? (
            <ConversationEmptyState
              title="What are you working on?"
              description={DESCRIPTION}
              icon={<img src={emberMark} alt="" width={512} height={512} className="h-10 w-10" />}
            >
              <div className="flex flex-col items-center gap-3">
                <img src={emberMark} alt="" width={512} height={512} className="h-10 w-10" />
                <h2 className="font-display text-lg font-semibold">What are you working on?</h2>
                <p className="max-w-sm text-sm text-muted-foreground">{DESCRIPTION}</p>
                <div className="mt-2 flex flex-wrap justify-center gap-2">
                  {STARTERS.map((starter) => (
                    <Button key={starter} variant="outline" size="sm" onClick={() => submit(starter)}>
                      {starter}
                    </Button>
                  ))}
                </div>
              </div>
            </ConversationEmptyState>
          ) : (
            messages.map((message) => (
              <Message key={message.id} from={message.role} className={message.role === "user" ? "ml-auto items-end" : ""}>
                <MessageContent
                  className={
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-transparent p-0 text-foreground"
                  }
                >
                  {message.parts.map((part, index) =>
                    part.type === "text" ? (
                      <MessageResponse key={index}>{part.text}</MessageResponse>
                    ) : null,
                  )}
                </MessageContent>
              </Message>
            ))
          )}

          {status === "submitted" && <Shimmer>Thinking…</Shimmer>}

          {error && (
            <p className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm">{error}</p>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="border-t p-3">
        <PromptInput
          onSubmit={(message) => {
            submit(message.text ?? input);
          }}
        >
          <PromptInputTextarea
            value={input}
            placeholder="Ask Ember anything about your work…"
            onChange={(event) => setInput(event.target.value)}
          />
          <PromptInputFooter className="justify-end">
            <PromptInputSubmit status={status} disabled={!input.trim() && !busy} onStop={stop} />
          </PromptInputFooter>
        </PromptInput>
        <p className="mt-2 text-[11px] text-muted-foreground">
          Ember can be wrong. Verify anything factual, and don't paste confidential data you wouldn't send to a
          third-party AI service.
        </p>
      </div>
    </div>
  );
}
