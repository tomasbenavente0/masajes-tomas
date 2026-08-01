import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient, createPublicClient } from '@/lib/supabase-server'
import PublicNav from '@/components/PublicNav'
import WhatsappFab from '@/components/WhatsappFab'
import Markdown from '@/components/Markdown'
import { ArrowLeft, Clock, MessageCircle } from 'lucide-react'
import { formatPostDate, whatsappLink } from '@/lib/utils'
import type { Post, SiteSetting } from '@/lib/types'

export const revalidate = 60

const SITE_URL = 'https://masajes-tomas.vercel.app'

async function getPost(slug: string): Promise<Post | null> {
  const supabase = createClient()
  const { data } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .maybeSingle()
  return (data as Post) ?? null
}

/** Genera las etiquetas SEO de cada artículo a partir de sus campos. */
export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const post = await getPost(params.slug)
  if (!post) return { title: 'Artículo no encontrado | Masajes Tomás' }

  const title = post.meta_title || `${post.title} | Masajes Tomás`
  const description =
    post.meta_description || post.excerpt || undefined
  const url = `/blog/${post.slug}`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      publishedTime: post.published_at,
      modifiedTime: post.updated_at,
      images: post.cover_image_url ? [post.cover_image_url] : undefined,
    },
    twitter: {
      card: post.cover_image_url ? 'summary_large_image' : 'summary',
      title,
      description,
    },
  }
}

/**
 * Pre-genera las rutas de los artículos publicados. Corre en build, fuera
 * de un request, así que usa el cliente sin cookies.
 */
export async function generateStaticParams() {
  const supabase = createPublicClient()
  const { data } = await supabase
    .from('posts')
    .select('slug')
    .eq('is_published', true)
  return ((data as { slug: string }[]) ?? []).map((p) => ({ slug: p.slug }))
}

export default async function PostPage({
  params,
}: {
  params: { slug: string }
}) {
  const supabase = createClient()

  const [post, { data: settings }] = await Promise.all([
    getPost(params.slug),
    supabase.from('site_settings').select('*'),
  ])

  if (!post) notFound()

  const cfg: Record<string, string> = {}
  for (const s of ((settings as SiteSetting[]) ?? [])) cfg[s.key] = s.value ?? ''

  const businessName = cfg.business_name || 'Masajes Tomás'
  const whatsapp = cfg.whatsapp_number || '56900000000'

  // Datos estructurados: ayudan a Google a mostrar el artículo enriquecido.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.meta_description || post.excerpt || undefined,
    image: post.cover_image_url || undefined,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    author: { '@type': 'Person', name: businessName },
    publisher: { '@type': 'Organization', name: businessName },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/blog/${post.slug}`,
    },
  }

  return (
    <main className="overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PublicNav businessName={businessName} whatsappNumber={whatsapp} />

      <article>
        <header className="relative overflow-hidden -mt-[73px] pt-[73px]">
          <div className="absolute inset-0 bg-gradient-to-b from-terra-soft via-sand to-sand" />
          <div className="blob w-[30rem] h-[30rem] bg-honey/20 -top-40 -right-32" />

          <div className="container-tight relative py-16 max-w-3xl">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-sm text-clay hover:text-terra-dark mb-8 transition-colors"
            >
              <ArrowLeft size={15} />
              Volver al blog
            </Link>

            <div className="flex items-center gap-3 text-sm text-clay mb-5">
              <time dateTime={post.published_at}>
                {formatPostDate(post.published_at)}
              </time>
              <span className="flex items-center gap-1.5">
                <Clock size={13} />
                {post.reading_minutes} min de lectura
              </span>
            </div>

            <h1 className="font-display text-4xl md:text-5xl text-ink leading-[1.1] mb-6">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="text-lg text-clay leading-relaxed">
                {post.excerpt}
              </p>
            )}
          </div>
        </header>

        {post.cover_image_url && (
          <div className="container-tight max-w-3xl -mt-4 mb-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.cover_image_url}
              alt={post.title}
              className="w-full rounded-4xl shadow-lift aspect-[16/9] object-cover"
            />
          </div>
        )}

        <div className="bg-cream py-16">
          <div className="container-tight max-w-3xl">
            <Markdown content={post.content} />

            {/* Llamado a la acción al final del artículo */}
            <div className="mt-14 card p-8 md:p-10 text-center">
              <h2 className="font-display text-2xl md:text-3xl text-ink mb-3">
                ¿Te identificaste con algo de esto?
              </h2>
              <p className="text-clay mb-7 max-w-md mx-auto leading-relaxed">
                Agenda tu sesión online o escríbeme y lo conversamos antes de
                reservar.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/#disponibilidad" className="btn-primary">
                  Ver disponibilidad
                </Link>
                <a
                  href={whatsappLink(
                    whatsapp,
                    `Hola! Leí tu artículo "${post.title}" y quiero agendar una sesión.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost"
                >
                  <MessageCircle size={18} />
                  Escribir por WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </article>

      <WhatsappFab whatsappNumber={whatsapp} />
    </main>
  )
}
