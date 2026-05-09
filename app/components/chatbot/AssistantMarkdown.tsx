"use client";

import { type Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const RISK_LEVEL_BADGE: Record<string, string> = {
  low: "rounded px-1.5 py-0.5 font-semibold uppercase tracking-wide bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/35",
  medium:
    "rounded px-1.5 py-0.5 font-semibold uppercase tracking-wide bg-amber-500/15 text-amber-200 ring-1 ring-amber-500/40",
  high: "rounded px-1.5 py-0.5 font-semibold uppercase tracking-wide bg-orange-500/15 text-orange-300 ring-1 ring-orange-500/40",
  critical:
    "rounded px-1.5 py-0.5 font-semibold uppercase tracking-wide bg-red-500/15 text-red-300 ring-1 ring-red-500/45",
  unknown:
    "rounded px-1.5 py-0.5 font-semibold uppercase tracking-wide bg-zinc-500/20 text-zinc-300 ring-1 ring-zinc-500/40",
};

const RISK_SEGMENT =
  /(\*{0,2}?(?:risk|ryzyko)(?:\s+level|\s+poziom)?\*{0,2}?\s*:\s*\*{0,2}?)(low|medium|high|critical|unknown)\b\*{0,2}?/gi;

type Segment =
  | { kind: "md"; text: string }
  | { kind: "risk"; prefix: string; level: string };

function splitRiskSegments(source: string): Segment[] {
  const segments: Segment[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  const re = new RegExp(RISK_SEGMENT.source, RISK_SEGMENT.flags);
  while ((match = re.exec(source)) !== null) {
    if (match.index > last) {
      segments.push({ kind: "md", text: source.slice(last, match.index) });
    }
    segments.push({
      kind: "risk",
      prefix: match[1].replace(/\*/g, ""),
      level: match[2].toLowerCase(),
    });
    last = match.index + match[0].length;
  }
  if (last < source.length) {
    segments.push({ kind: "md", text: source.slice(last) });
  }
  return segments.length ? segments : [{ kind: "md", text: source }];
}

const markdownComponents: Components = {
  p: ({ children }) => (
    <p className="mb-2 text-pretty leading-relaxed text-zinc-100 last:mb-0">{children}</p>
  ),
  strong: ({ children }) => <strong className="font-semibold text-zinc-50">{children}</strong>,
  em: ({ children }) => <em className="italic text-zinc-200">{children}</em>,
  ul: ({ children }) => (
    <ul className="my-2 list-disc space-y-1 pl-5 text-zinc-100">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="my-2 list-decimal space-y-1 pl-5 text-zinc-100">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-relaxed [&>p]:mb-0">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="my-2 border-l-2 border-zinc-600 pl-3 text-zinc-300 italic">{children}</blockquote>
  ),
  hr: () => <hr className="my-3 border-zinc-700" />,
  a: ({ href, children }) => (
    <a
      href={href}
      className="text-blue-400 underline decoration-blue-400/40 underline-offset-2 hover:text-blue-300"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
  h1: ({ children }) => (
    <h3 className="mt-3 mb-2 text-base font-semibold text-zinc-50 first:mt-0">{children}</h3>
  ),
  h2: ({ children }) => (
    <h3 className="mt-3 mb-2 text-base font-semibold text-zinc-50 first:mt-0">{children}</h3>
  ),
  h3: ({ children }) => (
    <h4 className="mt-2 mb-1 text-sm font-semibold text-zinc-50 first:mt-0">{children}</h4>
  ),
  table: ({ children }) => (
    <div className="chatbot-scrollbar my-2 overflow-x-auto rounded-lg border border-zinc-700">
      <table className="w-full min-w-[240px] border-collapse text-left text-xs">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="border-b border-zinc-600 bg-zinc-950/80">{children}</thead>,
  tbody: ({ children }) => <tbody>{children}</tbody>,
  tr: ({ children }) => <tr className="border-b border-zinc-800 last:border-b-0">{children}</tr>,
  th: ({ children }) => <th className="px-2 py-2 font-semibold text-zinc-200">{children}</th>,
  td: ({ children }) => <td className="px-2 py-2 text-zinc-300">{children}</td>,
  pre: ({ children }) => (
    <pre className="chatbot-scrollbar my-2 overflow-x-auto rounded-lg border border-zinc-700 bg-zinc-950 p-3 text-xs text-zinc-200">
      {children}
    </pre>
  ),
  code: ({ className, children, ...props }) => {
    const inline = !className;
    if (inline) {
      return (
        <code
          className="rounded bg-zinc-950 px-1 py-0.5 font-mono text-[0.9em] text-emerald-200/95"
          {...props}
        >
          {children}
        </code>
      );
    }
    return (
      <code className={`font-mono text-[0.9em] ${className ?? ""}`} {...props}>
        {children}
      </code>
    );
  },
};

export function AssistantMarkdown({ content }: { content: string }) {
  const segments = splitRiskSegments(content);

  return (
    <div className="assistant-markdown space-y-1 text-sm [&>:first-child>*:first-child]:mt-0 [&>:last-child>*:last-child]:mb-0">
      {segments.map((seg, index) => {
        if (seg.kind === "risk") {
          const badgeClass = RISK_LEVEL_BADGE[seg.level] ?? RISK_LEVEL_BADGE.unknown;
          return (
            <div key={`risk-${index}`} className="py-0.5">
              <span>{seg.prefix}</span>
              <span className={`${badgeClass} ml-0.5`}>{seg.level.toUpperCase()}</span>
            </div>
          );
        }
        if (!seg.text) return null;
        return (
          <div key={`md-${index}`} className="min-w-0">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
              {seg.text}
            </ReactMarkdown>
          </div>
        );
      })}
    </div>
  );
}
