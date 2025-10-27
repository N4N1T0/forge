'use client'

import { cn } from '@/lib/utils'
import { Color } from '@tiptap/extension-color'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import TextAlign from '@tiptap/extension-text-align'
import { TextStyle } from '@tiptap/extension-text-style'
import Typography from '@tiptap/extension-typography'
import Underline from '@tiptap/extension-underline'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { TipTapFloatingMenu } from './extensions/floating-menu'
import './tiptap.css'
import { EditorToolbar } from './toolbars/editor-toolbar'

const extensions = [
  StarterKit.configure({
    orderedList: {
      HTMLAttributes: {
        class: 'list-decimal'
      }
    },
    bulletList: {
      HTMLAttributes: {
        class: 'list-disc'
      }
    },
    heading: {
      levels: [1, 2, 3, 4]
    }
  }),
  Placeholder.configure({
    emptyNodeClass: 'is-editor-empty',
    placeholder: ({ node }) => {
      switch (node.type.name) {
        case 'heading':
          return `Heading ${node.attrs.level}`
        case 'detailsSummary':
          return 'Section title'
        case 'codeBlock':
          return ''
        default:
          return "Write, type '/' for commands"
      }
    },
    includeChildren: false
  }),
  TextAlign.configure({
    types: ['heading', 'paragraph']
  }),
  Subscript,
  TextStyle,
  Superscript,
  Underline,
  Link,
  Color,
  Typography
]

export function RichTextEditor({
  value,
  onChange,
  disabled,
  className
}: {
  value?: string
  onChange?: (value: string) => void
  disabled?: boolean
  className?: string
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions,
    content: value ?? '',
    editorProps: {
      attributes: {
        // TODO: FIX HEIGHT
        class: cn(
          'border border-input bg-transparent !min-h-[520px] !max-w-none !p-4',
          'prose dark:prose-invert focus:outline-none',
          className
        )
      }
    },
    editable: !disabled,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML())
    }
  })

  if (!editor) return null

  return (
    <div className='space-y-1 relative'>
      <EditorToolbar editor={editor} disabled={disabled} />
      <TipTapFloatingMenu editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
}
