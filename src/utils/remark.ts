import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import remarkToc from 'remark-toc'
import remarkLinkCard from './remark-link-card-plus'
import rehypeSlug from 'rehype-slug'
import rehypeStringify from 'rehype-stringify'
import remarkGfm, { type Options as OptionsGfm } from 'remark-gfm'
import type { Options as OptionsToc } from 'mdast-util-toc'
import type { Options as OptionsToHast } from 'mdast-util-to-hast'
import type { Options as OptionsToHtml } from 'hast-util-to-html'

export const remark = unified()
  .use(remarkParse)
  .use(remarkGfm, {} satisfies OptionsGfm)
  .use(remarkToc, { heading: '目次', tight: true } as OptionsToc)
  .use(remarkLinkCard, { shortenUrl: true })
  .use(remarkRehype, { allowDangerousHtml: true } satisfies OptionsToHast)
  // 見出しに ID を自動付与する
  .use(rehypeSlug)
  .use(rehypeStringify, { allowDangerousHtml: true } satisfies OptionsToHtml)

export const processMarkdown = async (mdStr: string): Promise<string> =>
  await remark.process(mdStr).then((vfile) => String(vfile))
