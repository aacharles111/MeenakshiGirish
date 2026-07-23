// src/components/admin/TipTapEditor.tsx
// Controlled WYSIWYG editor wrapping TipTap's `useEditor`. Emits an HTML
// string via `onChange` for the BlogsPanel to stash on `Blog.body`. The
// public blog page (Task 13) renders this same HTML through DOMPurify before
// `dangerouslySetInnerHTML`, so the TipTap subset emitted here is the only
// shape that ever reaches the DOM.
//
// Toolbar: H2 / H3 (no H1 — the blog Title field is the H1), bold, italic,
// bullet list, ordered list, link (window.prompt), image (uploads through
// `cmsApi.uploadImage` and inserts at the caret).

import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import {
  Bold,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  Link2,
  Link2Off,
  List,
  ListOrdered,
  Loader2,
  type LucideIcon,
} from 'lucide-react'
import cmsApi from '../../lib/cmsApi'

interface TipTapEditorProps {
  value: string
  onChange: (html: string) => void
  disabled?: boolean
}

interface ToolbarButton {
  icon: LucideIcon
  label: string
  isActive: () => boolean
  run: () => void
  disabled: boolean
}

export default function TipTapEditor({
  value,
  onChange,
  disabled = false,
}: TipTapEditorProps) {
  // Keep the latest onChange in a ref so the editor's onUpdate closure (bound
  // once at creation) always calls the freshest handler without forcing a
  // re-creation of the editor instance.
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  const [imageUploading, setImageUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' },
      }),
      Image.configure({ inline: false, allowBase64: false }),
    ],
    content: value,
    editable: !disabled,
    onUpdate({ editor }) {
      onChangeRef.current(editor.getHTML())
    },
  })

  // Flip editable when the `disabled` prop changes (no recreation).
  useEffect(() => {
    if (editor) editor.setEditable(!disabled)
  }, [editor, disabled])

  // Pull external value changes into the editor when they diverge from the
  // current document. Same-HTML short-circuit avoids feedback loops; the
  // `emitUpdate:false` setContent never re-fires onUpdate.
  useEffect(() => {
    if (!editor) return
    if (editor.getHTML() === value) return
    editor.commands.setContent(value, { emitUpdate: false })
  }, [editor, value])

  // ── Image: file picker → cmsApi.uploadImage → insert at caret ──
  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (fileInputRef.current) fileInputRef.current.value = ''
    if (!file || !editor) return
    setImageUploading(true)
    try {
      const url = await cmsApi.uploadImage(file)
      editor.chain().focus().setImage({ src: url }).run()
    } catch {
      // Surface non-fatal: banner uploads in BlogsPanel carry their own
      // error UI; here we simply drop the insert and reset the spinner.
    } finally {
      setImageUploading(false)
    }
  }

  // ── Link: window.prompt with the current href pre-filled ──
  const handleLinkClick = () => {
    if (!editor) return
    const attrs = editor.getAttributes('link') as { href?: unknown }
    const previous = typeof attrs.href === 'string' ? attrs.href : ''
    const url = window.prompt('Link URL', previous || 'https://')
    if (url === null) return // user cancelled
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor
      .chain()
      .focus()
      .extendMarkRange('link')
      .setLink({ href: url })
      .run()
  }

  if (!editor) {
    return (
      <div className="prose-cms rounded-2xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
        Loading editor…
      </div>
    )
  }

  const toolbar: ToolbarButton[] = [
    {
      icon: Heading2,
      label: 'Heading 2',
      isActive: () => editor.isActive('heading', { level: 2 }),
      run: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      disabled,
    },
    {
      icon: Heading3,
      label: 'Heading 3',
      isActive: () => editor.isActive('heading', { level: 3 }),
      run: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      disabled,
    },
    {
      icon: Bold,
      label: 'Bold',
      isActive: () => editor.isActive('bold'),
      run: () => editor.chain().focus().toggleBold().run(),
      disabled,
    },
    {
      icon: Italic,
      label: 'Italic',
      isActive: () => editor.isActive('italic'),
      run: () => editor.chain().focus().toggleItalic().run(),
      disabled,
    },
    {
      icon: List,
      label: 'Bullet list',
      isActive: () => editor.isActive('bulletList'),
      run: () => editor.chain().focus().toggleBulletList().run(),
      disabled,
    },
    {
      icon: ListOrdered,
      label: 'Ordered list',
      isActive: () => editor.isActive('orderedList'),
      run: () => editor.chain().focus().toggleOrderedList().run(),
      disabled,
    },
    {
      icon: Link2,
      label: 'Insert / edit link',
      isActive: () => editor.isActive('link'),
      run: handleLinkClick,
      disabled,
    },
    {
      icon: ImagePlus,
      label: 'Insert image',
      isActive: () => false,
      run: handleImageClick,
      disabled: disabled || imageUploading,
    },
  ]

  return (
    <div
      className={
        'prose-cms rounded-2xl border border-border bg-card overflow-hidden focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-colors ' +
        (disabled ? 'opacity-60 pointer-events-none' : '')
      }
    >
      {/* Toolbar */}
      <div
        role="toolbar"
        aria-label="Text formatting"
        className="flex flex-wrap items-center gap-1 border-b border-border/60 bg-muted/40 px-2 py-1.5"
      >
        {toolbar.map((btn) => {
          const Icon = btn.icon
          const active = btn.isActive()
          return (
            <button
              key={btn.label}
              type="button"
              title={btn.label}
              aria-label={btn.label}
              aria-pressed={active}
              disabled={btn.disabled}
              onClick={btn.run}
              className={
                'inline-flex items-center justify-center w-9 h-9 rounded-md transition-colors ' +
                (active
                  ? 'bg-primary/15 text-primary '
                  : 'text-muted-foreground hover:text-primary hover:bg-primary/10 ') +
                'disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-muted-foreground'
              }
            >
              <Icon size={16} />
            </button>
          )
        })}
        {editor.isActive('link') && (
          <button
            type="button"
            title="Remove link"
            aria-label="Remove link"
            disabled={disabled}
            onClick={() =>
              editor.chain().focus().extendMarkRange('link').unsetLink().run()
            }
            className="inline-flex items-center justify-center w-9 h-9 rounded-md text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-40"
          >
            <Link2Off size={16} />
          </button>
        )}
        {imageUploading && (
          <span className="inline-flex items-center gap-1.5 px-2 text-xs text-muted-foreground">
            <Loader2 size={13} className="animate-spin" />
            Uploading…
          </span>
        )}
      </div>

      {/* Editing surface — EditorContent injects its own DOM (.ProseMirror). */}
      <EditorContent editor={editor} className="prose-cms-surface" />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageChange}
        aria-hidden="true"
        tabIndex={-1}
      />
    </div>
  )
}
