import React from "react";

/**
 * Renderer simple de texto tipo markdown ligero:
 *   - Líneas que empiezan con `# `   → h1
 *   - Líneas que empiezan con `## `  → h2
 *   - Líneas que empiezan con `### ` → h3
 *   - Otras líneas no vacías → <p>
 *   - **bold** dentro del texto se renderiza como <strong>
 *   - Líneas en blanco separan bloques
 */
function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="font-semibold text-[var(--text-primary)]">{part.slice(2, -2)}</strong>;
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}

function renderMarkdown(text: string): React.ReactNode {
  const lines = text.split("\n");
  const out: React.ReactNode[] = [];
  let key = 0;
  let buffer: string[] = [];

  const flushParagraph = () => {
    if (buffer.length === 0) return;
    const content = buffer.join(" ");
    out.push(
      <p key={key++} className="text-[15px] md:text-[16px] text-[var(--text-muted)] leading-[1.75] mb-4">
        {renderInline(content)}
      </p>
    );
    buffer = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      flushParagraph();
      continue;
    }
    if (line.startsWith("### ")) {
      flushParagraph();
      out.push(
        <h3 key={key++} className="text-[18px] md:text-[20px] font-semibold text-[var(--text-primary)] mt-8 mb-3">
          {renderInline(line.slice(4))}
        </h3>
      );
    } else if (line.startsWith("## ")) {
      flushParagraph();
      out.push(
        <h2 key={key++} className="text-[22px] md:text-[26px] font-bold text-[var(--text-primary)] mt-10 mb-4 tracking-[-0.01em]">
          {renderInline(line.slice(3))}
        </h2>
      );
    } else if (line.startsWith("# ")) {
      flushParagraph();
      out.push(
        <h1 key={key++} className="text-[30px] md:text-[42px] font-bold text-[var(--text-primary)] mt-2 mb-6 tracking-[-0.02em] leading-[1.1]">
          {renderInline(line.slice(2))}
        </h1>
      );
    } else if (line.startsWith("- ")) {
      flushParagraph();
      out.push(
        <ul key={key++} className="text-[15px] md:text-[16px] text-[var(--text-muted)] leading-[1.75] mb-4 ml-5 list-disc">
          <li>{renderInline(line.slice(2))}</li>
        </ul>
      );
    } else {
      buffer.push(line);
    }
  }
  flushParagraph();
  return out;
}

export function LegalPage({ title, body }: { title: string; body?: string }) {
  return (
    <main className="bg-[var(--background)]">
      <div className="max-w-[760px] mx-auto px-5 md:px-6 py-[64px] md:py-[88px]">
        <a
          href="/"
          className="inline-flex items-center gap-1.5 text-[13px] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors mb-8"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Volver al inicio
        </a>
        <article className="prose-legal">
          {body
            ? renderMarkdown(body)
            : (
              <p className="text-[var(--text-muted)] italic">
                Sin contenido. Cargá el texto desde /admin/legales.
              </p>
            )}
        </article>
      </div>
    </main>
  );
}
