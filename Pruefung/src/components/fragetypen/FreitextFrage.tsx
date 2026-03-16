import { useEffect, useRef } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import { usePruefungStore } from '../../store/pruefungStore.ts'
import type { FreitextFrage as FreitextFrageType } from '../../types/fragen.ts'
import { renderMarkdown } from '../../utils/markdown.ts'
import { fachbereichFarbe } from '../FragenNavigation.tsx'

interface Props {
  frage: FreitextFrageType
}

export default function FreitextFrage({ frage }: Props) {
  const antworten = usePruefungStore((s) => s.antworten)
  const setAntwort = usePruefungStore((s) => s.setAntwort)
  const abgegeben = usePruefungStore((s) => s.abgegeben)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null)

  const aktuelleAntwort = antworten[frage.id]
  const gespeicherterText =
    aktuelleAntwort?.typ === 'freitext' ? aktuelleAntwort.text : ''

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
    ],
    content: gespeicherterText,
    editable: !abgegeben,
    editorProps: {
      attributes: {
        class: 'prose prose-slate dark:prose-invert max-w-none focus:outline-none min-h-[300px] p-4',
      },
    },
    onUpdate: ({ editor: ed }) => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => {
        const html = ed.getHTML()
        setAntwort(frage.id, { typ: 'freitext', text: html, formatierung: 'html' })
      }, 500)
    },
  })

  // Sync editor content when switching between questions
  useEffect(() => {
    if (editor && !editor.isDestroyed) {
      const currentContent = editor.getHTML()
      if (currentContent !== gespeicherterText && gespeicherterText) {
        editor.commands.setContent(gespeicherterText)
      } else if (!gespeicherterText && currentContent !== '<p></p>') {
        editor.commands.clearContent()
      }
    }
  }, [frage.id]) // eslint-disable-line react-hooks/exhaustive-deps

  // Wort- und Zeichenzähler
  const text = editor?.getText() ?? ''
  const zeichenAnzahl = text.length
  const wortAnzahl = text.trim() ? text.trim().split(/\s+/).length : 0
  const zeichenUeberschritten = frage.maxZeichen ? zeichenAnzahl > frage.maxZeichen : false

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-2">
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${fachbereichFarbe(frage.fachbereich)}`}>
          {frage.fachbereich}
        </span>
        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
          {frage.bloom}
        </span>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {frage.punkte} {frage.punkte === 1 ? 'Punkt' : 'Punkte'}
        </span>
        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
          {frage.laenge === 'kurz' ? '1–3 Sätze' : frage.laenge === 'mittel' ? 'Absatz' : 'Ausführlich'}
        </span>
      </div>

      {/* Fragetext (fixiert) */}
      <div
        className="text-base leading-relaxed text-slate-800 dark:text-slate-200 sticky top-0 bg-white dark:bg-slate-900 pb-3 border-b border-slate-200 dark:border-slate-700 z-10"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(frage.fragetext) }}
      />

      {/* Toolbar */}
      {editor && !abgegeben && (
        <div className="flex flex-wrap gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <ToolbarButton
            aktiv={editor.isActive('bold')}
            onClick={() => editor.chain().focus().toggleBold().run()}
            title="Fett"
          >
            <strong>F</strong>
          </ToolbarButton>
          <ToolbarButton
            aktiv={editor.isActive('italic')}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            title="Kursiv"
          >
            <em>K</em>
          </ToolbarButton>
          <ToolbarButton
            aktiv={editor.isActive('underline')}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            title="Unterstrichen"
          >
            <u>U</u>
          </ToolbarButton>
          <span className="w-px bg-slate-300 dark:bg-slate-600 mx-1" />
          <ToolbarButton
            aktiv={editor.isActive('bulletList')}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            title="Aufzählung"
          >
            •
          </ToolbarButton>
          <ToolbarButton
            aktiv={editor.isActive('orderedList')}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            title="Nummerierte Liste"
          >
            1.
          </ToolbarButton>
        </div>
      )}

      {/* Editor */}
      <div className={`tiptap-editor flex-1 min-h-[300px] border-2 rounded-xl overflow-auto
        ${abgegeben
          ? 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 opacity-75'
          : 'border-slate-300 dark:border-slate-600 focus-within:border-blue-500 dark:focus-within:border-blue-400 bg-white dark:bg-slate-900'
        }`}
      >
        <EditorContent editor={editor} />
      </div>

      {/* Zähler */}
      <div className="flex justify-end gap-4 text-xs text-slate-500 dark:text-slate-400">
        <span>{wortAnzahl} {wortAnzahl === 1 ? 'Wort' : 'Wörter'}</span>
        <span className={zeichenUeberschritten ? 'text-red-600 dark:text-red-400 font-semibold' : ''}>
          {zeichenAnzahl}{frage.maxZeichen ? ` / ${frage.maxZeichen}` : ''} Zeichen
        </span>
      </div>
    </div>
  )
}

function ToolbarButton({
  aktiv,
  onClick,
  title,
  children,
}: {
  aktiv: boolean
  onClick: () => void
  title: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`w-8 h-8 rounded flex items-center justify-center text-sm transition-colors cursor-pointer
        ${aktiv
          ? 'bg-blue-500 text-white'
          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
        }
      `}
    >
      {children}
    </button>
  )
}
