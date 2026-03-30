import { cn } from "@/lib/utils";
import { Sparkles, User } from "lucide-react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
}

export function ChatMessage({ role, content, timestamp }: ChatMessageProps) {
  const isUser = role === "user";

  function renderContent(text: string) {
    return text.split("\n").map((line, i) => {
      const boldParsed = line.split(/\*\*(.*?)\*\*/g).map((part, j) =>
        j % 2 === 1 ? <strong key={j} className="font-semibold">{part}</strong> : part
      );

      if (line.startsWith("- ")) {
        return (
          <div key={i} className="flex gap-2 py-0.5">
            <span className="text-muted-foreground mt-0.5 shrink-0">&#8226;</span>
            <span>{boldParsed.slice(0)}</span>
          </div>
        );
      }

      return (
        <span key={i}>
          {i > 0 && <br />}
          {boldParsed}
        </span>
      );
    });
  }

  return (
    <div className={cn("flex gap-3", isUser && "flex-row-reverse")}>
      {/* Avatar */}
      <div
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl shadow-sm",
          isUser
            ? "bg-slate-800 text-white"
            : "bg-gradient-to-br from-violet-500 to-indigo-600 text-white"
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
      </div>

      {/* Message bubble */}
      <div className={cn("max-w-[75%] space-y-1", isUser && "text-right")}>
        <div
          className={cn(
            "inline-block rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
            isUser
              ? "bg-slate-800 text-white rounded-tr-md"
              : "bg-card border shadow-sm rounded-tl-md"
          )}
        >
          <div className={cn(!isUser && "text-foreground")}>{renderContent(content)}</div>
        </div>
        {timestamp && (
          <p className="text-[10px] text-muted-foreground/50 px-1">
            {timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </p>
        )}
      </div>
    </div>
  );
}
