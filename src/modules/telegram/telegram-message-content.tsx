'use client';

import { memo, useMemo, useState } from 'react';
import { Check, Copy, ExternalLink } from 'lucide-react';

interface TelegramMessageContentProps {
  content: string;
  role: 'user' | 'assistant';
  searchQuery?: string;
}

interface CodeBlockProps {
  code: string;
  language?: string;
}

const CodeBlock = memo(({ code, language }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="my-2.5 overflow-hidden rounded-xl border border-neutral-700/60 bg-[#1e1e2e] shadow-md dir-ltr text-left">
      <div className="flex items-center justify-between border-b border-neutral-700/50 bg-[#181825] px-3 py-1.5 text-xs text-neutral-300">
        <span className="font-mono text-[11px] font-semibold uppercase text-sky-400">
          {language || 'code'}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium transition-colors hover:bg-white/10 active:scale-95 text-neutral-300 hover:text-white"
        >
          {copied ? (
            <>
              <Check size={12} className="text-emerald-400" />
              <span className="text-emerald-400">کپی شد</span>
            </>
          ) : (
            <>
              <Copy size={12} />
              <span>کپی</span>
            </>
          )}
        </button>
      </div>
      <div className="max-h-96 overflow-x-auto p-3 text-xs font-mono text-neutral-100 leading-relaxed select-text">
        <pre className="m-0 font-mono">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
});
CodeBlock.displayName = 'CodeBlock';

// Helper to highlight search term
const highlightText = (text: string, query?: string) => {
  if (!query || !query.trim()) return text;
  const trimmed = query.trim();
  const parts = text.split(new RegExp(`(${trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
  if (parts.length === 1) return text;

  return parts.map((part, i) =>
    part.toLowerCase() === trimmed.toLowerCase() ? (
      <mark key={i} className="bg-yellow-300 dark:bg-yellow-500/50 text-neutral-900 dark:text-neutral-100 rounded-xs px-0.5 font-bold">
        {part}
      </mark>
    ) : (
      part
    ),
  );
};

// Formats inline markdown elements: bold, italic, code, links, mentions, hashtags
const formatInlineText = (text: string, searchQuery?: string) => {
  // Regex parsing tokens in order:
  // 1. Markdown link: [text](url)
  // 2. Raw URL: https?://...
  // 3. Inline code: `code`
  // 4. Bold: **text** or __text__
  // 5. Italic: *text* or _text_
  // 6. Strikethrough: ~~text~~
  // 7. Mention: @username
  // 8. Bot Command: /command
  const inlineRegex =
    /(\[[^\]]+\]\(https?:\/\/[^\s)]+\)|https?:\/\/[^\s)]+|`[^`]+`|\*\*[^*]+\*\*|__[^_]+__|\*[^*]+\*|_[^_]+_|~~[^~]+~~|@[a-zA-Z0-9_]{3,32}|\/[a-zA-Z0-9_]+)/g;

  const parts = text.split(inlineRegex);

  return parts.map((part, index) => {
    if (!part) return null;

    // Link: [title](url)
    const mdLinkMatch = part.match(/^\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)$/);
    if (mdLinkMatch) {
      const [, title, url] = mdLinkMatch;
      return (
        <a
          key={index}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-0.5 text-sky-600 dark:text-sky-400 underline underline-offset-2 hover:opacity-80 transition-opacity"
        >
          <span>{highlightText(title, searchQuery)}</span>
          <ExternalLink size={11} className="inline opacity-70" />
        </a>
      );
    }

    // Raw URL
    if (part.startsWith('http://') || part.startsWith('https://')) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-0.5 text-sky-600 dark:text-sky-400 underline underline-offset-2 hover:opacity-80 transition-opacity dir-ltr font-sans text-xs"
        >
          <span>{part}</span>
          <ExternalLink size={11} className="inline opacity-70" />
        </a>
      );
    }

    // Inline code: `code`
    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      const codeContent = part.slice(1, -1);
      return (
        <code
          key={index}
          className="mx-0.5 rounded-md border border-neutral-300/70 bg-neutral-200/50 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-pink-600 dark:border-neutral-700 dark:bg-neutral-800/80 dark:text-pink-400 dir-ltr inline-block"
        >
          {highlightText(codeContent, searchQuery)}
        </code>
      );
    }

    // Bold: **text** or __text__
    if (
      (part.startsWith('**') && part.endsWith('**') && part.length >= 4) ||
      (part.startsWith('__') && part.endsWith('__') && part.length >= 4)
    ) {
      const boldContent = part.slice(2, -2);
      return (
        <strong key={index} className="font-bold text-foreground">
          {highlightText(boldContent, searchQuery)}
        </strong>
      );
    }

    // Italic: *text* or _text_
    if (
      (part.startsWith('*') && part.endsWith('*') && part.length >= 2) ||
      (part.startsWith('_') && part.endsWith('_') && part.length >= 2)
    ) {
      const italicContent = part.slice(1, -1);
      return (
        <em key={index} className="italic opacity-90">
          {highlightText(italicContent, searchQuery)}
        </em>
      );
    }

    // Strikethrough: ~~text~~
    if (part.startsWith('~~') && part.endsWith('~~') && part.length >= 4) {
      const strikeContent = part.slice(2, -2);
      return (
        <del key={index} className="line-through opacity-60">
          {highlightText(strikeContent, searchQuery)}
        </del>
      );
    }

    // Mention: @username
    if (part.startsWith('@')) {
      return (
        <span
          key={index}
          className="font-medium text-sky-600 dark:text-sky-400 dir-ltr inline-block cursor-default"
        >
          {highlightText(part, searchQuery)}
        </span>
      );
    }

    // Command: /command
    if (part.startsWith('/')) {
      return (
        <span
          key={index}
          className="font-mono text-xs font-semibold text-sky-500 dir-ltr inline-block bg-sky-500/10 px-1 rounded"
        >
          {highlightText(part, searchQuery)}
        </span>
      );
    }

    return <span key={index}>{highlightText(part, searchQuery)}</span>;
  });
};

type BlockType =
  | { type: 'code'; code: string; language?: string }
  | { type: 'heading'; level: number; text: string }
  | { type: 'blockquote'; lines: string[] }
  | { type: 'bullet-list'; items: string[] }
  | { type: 'ordered-list'; items: string[] }
  | { type: 'paragraph'; lines: string[] };

export const TelegramMessageContent = memo(
  ({ content, searchQuery }: TelegramMessageContentProps) => {
    // Parse message into semantic blocks
    const blocks = useMemo(() => {
      if (!content) return [];

      const result: BlockType[] = [];
      const lines = content.split('\n');
      let i = 0;

      while (i < lines.length) {
        const line = lines[i];

        // 1. Code block detection: ```lang
        if (line.trim().startsWith('```')) {
          const matchLang = line.trim().match(/^```([a-zA-Z0-9_-]*)/);
          const language = matchLang ? matchLang[1] : '';
          const codeLines: string[] = [];
          i++;
          while (i < lines.length && !lines[i].trim().startsWith('```')) {
            codeLines.push(lines[i]);
            i++;
          }
          i++; // skip closing ```
          result.push({
            type: 'code',
            code: codeLines.join('\n'),
            language: language || undefined,
          });
          continue;
        }

        // 2. Blockquote: lines starting with >
        if (line.trim().startsWith('>')) {
          const quoteLines: string[] = [];
          while (i < lines.length && lines[i].trim().startsWith('>')) {
            quoteLines.push(lines[i].replace(/^>\s?/, ''));
            i++;
          }
          result.push({
            type: 'blockquote',
            lines: quoteLines,
          });
          continue;
        }

        // 3. Headings: #, ##, ###
        const headingMatch = line.match(/^(#{1,3})\s+(.*)$/);
        if (headingMatch) {
          result.push({
            type: 'heading',
            level: headingMatch[1].length,
            text: headingMatch[2],
          });
          i++;
          continue;
        }

        // 4. Bullet list: *, -, •
        if (line.match(/^(\*|-|•)\s+(.*)$/)) {
          const items: string[] = [];
          while (i < lines.length && lines[i].match(/^(\*|-|•)\s+(.*)$/)) {
            const itemMatch = lines[i].match(/^(\*|-|•)\s+(.*)$/);
            if (itemMatch) items.push(itemMatch[2]);
            i++;
          }
          result.push({
            type: 'bullet-list',
            items,
          });
          continue;
        }

        // 5. Ordered list: 1. , 2.
        if (line.match(/^\d+\.\s+(.*)$/)) {
          const items: string[] = [];
          while (i < lines.length && lines[i].match(/^\d+\.\s+(.*)$/)) {
            const itemMatch = lines[i].match(/^\d+\.\s+(.*)$/);
            if (itemMatch) items.push(itemMatch[1]);
            i++;
          }
          result.push({
            type: 'ordered-list',
            items,
          });
          continue;
        }

        // 6. Regular paragraph (or empty lines)
        if (line.trim() === '') {
          // Empty line - will be handled by spacing
          i++;
          continue;
        }

        const paraLines: string[] = [];
        while (
          i < lines.length &&
          lines[i].trim() !== '' &&
          !lines[i].trim().startsWith('```') &&
          !lines[i].trim().startsWith('>') &&
          !lines[i].match(/^(#{1,3})\s+/) &&
          !lines[i].match(/^(\*|-|•)\s+/) &&
          !lines[i].match(/^\d+\.\s+/)
        ) {
          paraLines.push(lines[i]);
          i++;
        }

        if (paraLines.length > 0) {
          result.push({
            type: 'paragraph',
            lines: paraLines,
          });
        }
      }

      return result;
    }, [content]);

    if (!content) return null;

    return (
      <div className="space-y-2 text-sm leading-relaxed text-inherit select-text">
        {blocks.map((block, idx) => {
          switch (block.type) {
            case 'code':
              return <CodeBlock key={idx} code={block.code} language={block.language} />;

            case 'heading': {
              const HeadingTag =
                block.level === 1 ? 'h3' : block.level === 2 ? 'h4' : 'h5';
              const sizeClass =
                block.level === 1
                  ? 'text-base font-extrabold text-foreground mt-3 mb-1.5'
                  : block.level === 2
                  ? 'text-sm font-bold text-foreground mt-2.5 mb-1'
                  : 'text-xs font-bold text-foreground mt-2 mb-0.5';
              return (
                <HeadingTag key={idx} className={`${sizeClass} flex items-center gap-1.5`} dir="auto">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  <span>{formatInlineText(block.text, searchQuery)}</span>
                </HeadingTag>
              );
            }

            case 'blockquote':
              return (
                <blockquote
                  key={idx}
                  dir="auto"
                  className="my-2 rounded-r-none rounded-l-lg border-r-3 border-sky-500 bg-sky-500/10 px-3 py-1.5 text-xs italic text-neutral-700 dark:text-neutral-300"
                >
                  {block.lines.map((l, lIdx) => (
                    <p key={lIdx} className="leading-relaxed">
                      {formatInlineText(l, searchQuery)}
                    </p>
                  ))}
                </blockquote>
              );

            case 'bullet-list':
              return (
                <ul key={idx} className="my-1.5 space-y-1 pr-1" dir="auto">
                  {block.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="flex items-start gap-2 text-xs md:text-sm leading-relaxed">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-70" />
                      <span className="flex-1">{formatInlineText(item, searchQuery)}</span>
                    </li>
                  ))}
                </ul>
              );

            case 'ordered-list':
              return (
                <ol key={idx} className="my-1.5 space-y-1 pr-1" dir="auto">
                  {block.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="flex items-start gap-2 text-xs md:text-sm leading-relaxed">
                      <span className="mt-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-primary/15 text-[10px] font-bold text-primary shrink-0">
                        {itemIdx + 1}
                      </span>
                      <span className="flex-1">{formatInlineText(item, searchQuery)}</span>
                    </li>
                  ))}
                </ol>
              );

            case 'paragraph':
              return (
                <p key={idx} dir="auto" className="leading-relaxed whitespace-pre-line text-xs md:text-sm">
                  {block.lines.map((line, lineIdx) => (
                    <span key={lineIdx}>
                      {formatInlineText(line, searchQuery)}
                      {lineIdx < block.lines.length - 1 && '\n'}
                    </span>
                  ))}
                </p>
              );

            default:
              return null;
          }
        })}
      </div>
    );
  },
);
TelegramMessageContent.displayName = 'TelegramMessageContent';
