import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Editor } from '@tiptap/core'
import { AlignmentToolbar } from './alignment'
import { BlockquoteToolbar } from './blockquote'
import { BoldToolbar } from './bold'
import { BulletListToolbar } from './bullet-list'
import { CodeToolbar } from './code'
import { CodeBlockToolbar } from './code-block'
import { HorizontalRuleToolbar } from './horizontal-rule'
import { ItalicToolbar } from './italic'
import { LinkToolbar } from './link'
import { OrderedListToolbar } from './ordered-list'
import { StrikeThroughToolbar } from './strikethrough'
import { ToolbarProvider } from './toolbar-provider'
import { UnderlineToolbar } from './underline'

export const EditorToolbar = ({ editor }: { editor: Editor }) => {
  return (
    <div className='w-fit border-b bg-muted border border-input hidden sm:block'>
      <ToolbarProvider editor={editor}>
        <TooltipProvider>
          <ScrollArea className='h-fit py-0.5'>
            <div>
              <div className='flex items-center gap-1 px-2'>
                {/* HISTORY */}
                <Separator orientation='vertical' className='mx-1 h-7' />

                {/* TEXT STRUCTURE */}
                <BlockquoteToolbar />
                <CodeToolbar />
                <CodeBlockToolbar />
                <Separator orientation='vertical' className='mx-1 h-7' />

                {/* FORMATTING*/}
                <BoldToolbar />
                <ItalicToolbar />
                <UnderlineToolbar />
                <StrikeThroughToolbar />
                <LinkToolbar />
                <Separator orientation='vertical' className='mx-1 h-7' />

                {/* LIST */}
                <BulletListToolbar />
                <OrderedListToolbar />
                <HorizontalRuleToolbar />
                <Separator orientation='vertical' className='mx-1 h-7' />

                {/* ALIGNMENT */}
                <AlignmentToolbar />
                <Separator orientation='vertical' className='mx-1 h-7' />
              </div>
            </div>
            <ScrollBar className='hidden' orientation='horizontal' />
          </ScrollArea>
        </TooltipProvider>
      </ToolbarProvider>
    </div>
  )
}
