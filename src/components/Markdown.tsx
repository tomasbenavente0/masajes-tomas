import { Fragment } from 'react'

/**
 * Renderiza el subconjunto de Markdown que usan los artículos:
 * ## y ### para títulos, listas con "-", párrafos y **negrita**.
 *
 * Se parsea a elementos de React a propósito: nada de
 * dangerouslySetInnerHTML, así el contenido no puede inyectar HTML.
 */

function inline(text: string) {
  // Divide por **negrita** conservando los delimitadores
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return (
        <strong key={i} className="font-600 text-ink">
          {part.slice(2, -2)}
        </strong>
      )
    }
    return <Fragment key={i}>{part}</Fragment>
  })
}

export default function Markdown({ content }: { content: string }) {
  const lines = content.replace(/\r\n/g, '\n').split('\n')
  const blocks: React.ReactNode[] = []

  let paragraph: string[] = []
  let list: string[] = []

  const flushParagraph = () => {
    if (paragraph.length === 0) return
    blocks.push(
      <p key={`p-${blocks.length}`} className="text-clay leading-relaxed mb-5">
        {inline(paragraph.join(' '))}
      </p>
    )
    paragraph = []
  }

  const flushList = () => {
    if (list.length === 0) return
    blocks.push(
      <ul key={`ul-${blocks.length}`} className="space-y-2.5 mb-6 ml-1">
        {list.map((item, i) => (
          <li key={i} className="flex items-start gap-3 text-clay leading-relaxed">
            <span className="w-1.5 h-1.5 rounded-full bg-terra shrink-0 mt-2.5" />
            <span>{inline(item)}</span>
          </li>
        ))}
      </ul>
    )
    list = []
  }

  const flushAll = () => {
    flushParagraph()
    flushList()
  }

  for (const raw of lines) {
    const line = raw.trim()

    if (line === '') {
      flushAll()
      continue
    }

    if (line.startsWith('### ')) {
      flushAll()
      blocks.push(
        <h3
          key={`h3-${blocks.length}`}
          className="font-display text-xl text-ink mt-8 mb-3"
        >
          {line.slice(4)}
        </h3>
      )
      continue
    }

    if (line.startsWith('## ')) {
      flushAll()
      blocks.push(
        <h2
          key={`h2-${blocks.length}`}
          className="font-display text-2xl md:text-3xl text-ink mt-10 mb-4"
        >
          {line.slice(3)}
        </h2>
      )
      continue
    }

    if (line.startsWith('- ')) {
      flushParagraph()
      list.push(line.slice(2))
      continue
    }

    flushList()
    paragraph.push(line)
  }

  flushAll()

  return <div>{blocks}</div>
}
