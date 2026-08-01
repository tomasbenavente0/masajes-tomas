import type { MetadataRoute } from 'next'
import { createPublicClient } from '@/lib/supabase-server'

const SITE_URL = 'https://masajes-tomas.vercel.app'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createPublicClient()
  const { data } = await supabase
    .from('posts')
    .select('slug, updated_at')
    .eq('is_published', true)

  const posts = ((data as { slug: string; updated_at: string }[]) ?? []).map(
    (p) => ({
      url: `${SITE_URL}/blog/${p.slug}`,
      lastModified: new Date(p.updated_at),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })
  )

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...posts,
  ]
}
