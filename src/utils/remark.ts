import { unified, type Plugin } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import remarkToc from 'remark-toc'
import remarkSlug from 'remark-slug'
import rehypeStringify from 'rehype-stringify'
import remarkGfm, { type Options as OptionsGfm } from 'remark-gfm'
import type { Options as OptionsToc } from 'mdast-util-toc'
import type { Options as OptionsToHast } from 'mdast-util-to-hast'
import type { Options as OptionsToHtml } from 'hast-util-to-html'

/* eslint-disable @typescript-eslint/consistent-type-assertions */

export const remark = unified()
  .use(remarkParse)
  .use(remarkGfm, {} satisfies OptionsGfm)
  // 見出しに ID を自動付与する
  .use(remarkSlug as Plugin)
  .use(remarkToc, {
    heading: '目次',
    tight: true
  } as OptionsToc)
  .use(remarkRehype, { allowDangerousHtml: true } satisfies OptionsToHast)
  .use(rehypeStringify, { allowDangerousHtml: true } satisfies OptionsToHtml)

export const processMarkdown = async (mdStr: string): Promise<string> =>
  await remark.process(mdStr).then((vfile) => String(vfile))
