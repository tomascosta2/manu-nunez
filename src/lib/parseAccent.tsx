import React from 'react'

/**
 * Parsea markers de énfasis en el texto:
 *   **bold**   → primary color
 *   *italic*   → italic
 * No soporta anidamiento (italic dentro de bold, etc).
 */
export function parseAccent(text?: string | null): React.ReactNode {
  if (!text) return null
  const out: React.ReactNode[] = []
  const regex = /\*\*([^*]+)\*\*|\*([^*]+)\*/g
  let lastIndex = 0
  let match: RegExpExecArray | null
  let key = 0

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      out.push(<React.Fragment key={key++}>{text.slice(lastIndex, match.index)}</React.Fragment>)
    }
    if (match[1] !== undefined) {
      out.push(
        <span key={key++} className="font-extrabold">
          {match[1]}
        </span>
      )
    } else if (match[2] !== undefined) {
      out.push(
        <em key={key++} className="italic">
          {match[2]}
        </em>
      )
    }
    lastIndex = regex.lastIndex
  }

  if (lastIndex < text.length) {
    out.push(<React.Fragment key={key++}>{text.slice(lastIndex)}</React.Fragment>)
  }

  return out
}
