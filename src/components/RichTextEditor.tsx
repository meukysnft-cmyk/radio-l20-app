import { useEffect, useRef } from 'react'

type RichTextEditorProps = {
  value: string
  onChange: (html: string) => void
  placeholder?: string
}

function runCommand(command: string, value?: string) {
  document.execCommand(command, false, value)
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const editor = editorRef.current
    if (!editor) return
    if (document.activeElement !== editor && editor.innerHTML !== value) {
      editor.innerHTML = value
    }
  }, [value])

  function apply(command: string, value?: string) {
    editorRef.current?.focus()
    runCommand(command, value)
    onChange(editorRef.current?.innerHTML ?? '')
  }

  function insertLink() {
    const url = window.prompt('Link:')
    if (!url) return
    apply('createLink', url)
  }

  function insertImage() {
    const url = window.prompt('URL da imagem:')
    if (!url) return
    apply('insertHTML', `<img src="${url}" alt="" />`)
  }

  return (
    <div className="rich-editor">
      <div className="rich-editor-toolbar" role="toolbar" aria-label="Formatação do conteúdo">
        <button type="button" onClick={() => apply('bold')} title="Negrito" aria-label="Negrito"><b>B</b></button>
        <button type="button" onClick={() => apply('italic')} title="Itálico" aria-label="Itálico"><i>I</i></button>
        <button type="button" onClick={() => apply('underline')} title="Sublinhado" aria-label="Sublinhado"><u>U</u></button>
        <span className="rich-editor-sep" aria-hidden="true" />
        <button type="button" onClick={() => apply('formatBlock', 'H2')} title="Título de seção">H2</button>
        <button type="button" onClick={() => apply('formatBlock', 'H3')} title="Subtítulo de seção">H3</button>
        <button type="button" onClick={() => apply('formatBlock', 'P')} title="Parágrafo comum">¶</button>
        <span className="rich-editor-sep" aria-hidden="true" />
        <button type="button" onClick={() => apply('insertUnorderedList')} title="Lista com marcadores">• Lista</button>
        <button type="button" onClick={() => apply('insertOrderedList')} title="Lista numerada">1. Lista</button>
        <button type="button" onClick={() => apply('formatBlock', 'BLOCKQUOTE')} title="Citação">Citação</button>
        <span className="rich-editor-sep" aria-hidden="true" />
        <button type="button" onClick={insertLink} title="Inserir link">Link</button>
        <button type="button" onClick={insertImage} title="Inserir imagem">Imagem</button>
        <span className="rich-editor-sep" aria-hidden="true" />
        <button type="button" onClick={() => apply('undo')} title="Desfazer" aria-label="Desfazer">↩</button>
        <button type="button" onClick={() => apply('redo')} title="Refazer" aria-label="Refazer">↪</button>
      </div>
      <div
        aria-label={placeholder ?? 'Conteúdo da notícia'}
        aria-multiline="true"
        className="rich-editor-area"
        contentEditable
        data-placeholder={placeholder}
        onBlur={() => onChange(editorRef.current?.innerHTML ?? '')}
        onInput={() => onChange(editorRef.current?.innerHTML ?? '')}
        ref={editorRef}
        role="textbox"
      />
    </div>
  )
}
