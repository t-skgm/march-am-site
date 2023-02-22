import { z, defineCollection } from 'astro:content'

const blogCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    postedAt: z.string(),
    category: z.string(),
    tags: z.array(z.string()).optional(),
    thumbnail: z.string().optional(),
    draft: z.boolean().optional()
  })
})

export const collections = {
  blog: blogCollection
}
