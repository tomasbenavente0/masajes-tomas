import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-server'
import PublicNav from '@/components/PublicNav'
import WhatsappFab from '@/components/WhatsappFab'
import { ArrowRight, Clock } from 'lucide-react'
import { formatPostDate } from '@/lib/utils'
import type { Post, SiteSetting } from '@/lib/types'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Blog | Masajes Tomás',
  description:
    'Artículos sobre masoterapia, contracturas, manejo del estrés y cuidado del cuerpo. Escritos desde la consulta en Concepción y Parral.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'Blog | Masajes Tomás',
    description:
      'Artículos sobre masoterapia, contracturas y cuidado del cuerpo.',
    type: 'website',
    url: '/blog',
  },
}

export default async function BlogIndexPage() {
  const supabase = createClient()

  const [{ data: posts }, { data: settings }] = await Promise.all([
    supabase
      .from('posts')
      .select('*')
      .eq('is_published', true)
      .order('published_at', { ascending: false }),
    supabase.from('site_settings').select('*'),
  ])

  const cfg: Record<string, string> = {}
  for (const s of ((settings as SiteSetting[]) ?? [])) cfg[s.key] = s.value ?? ''

  const businessName = cfg.business_name || 'Masajes Tomás'
  const whatsapp = cfg.whatsapp_number || '56900000000'
  const list = (posts as Post[]) ?? []

  return (
    <main className="overflow-x-hidden">
      <PublicNav businessName={businessName} whatsappNumber={whatsapp} />

      <section className="relative overflow-hidden -mt-[73px] pt-[73px]">
        <div className="absolute inset-0 bg-gradient-to-b from-terra-soft via-sand to-sand" />
        <div className="blob w-[32rem] h-[32rem] bg-honey/20 -top-40 -right-32" />

        <div className="container-tight relative py-20">
          <p className="eyebrow mb-4">
            <span className="w-6 h-px bg-terra" />
            Blog
          </p>
          <h1 className="font-display text-5xl md:text-6xl text-ink mb-5 max-w-3xl leading-[1.05]">
            Cuidar el cuerpo también se aprende
          </h1>
          <p className="text-lg text-clay max-w-2xl leading-relaxed">
            Artículos sobre contracturas, estrés y hábitos que ayudan a que el
            cuerpo aguante mejor el día a día.
          </p>
        </div>
      </section>

      <section className="py-16 bg-cream">
        <div className="container-tight">
          {list.length === 0 ? (
            <p className="text-clay">Todavía no hay artículos publicados.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
              {list.map((post) => (
                <article
                  key={post.id}
                  className="group card overflow-hidden flex flex-col hover:shadow-lift hover:-translate-y-1.5 transition-all duration-300"
                >
                  <Link
                    href={`/blog/${post.slug}`}
                    className="flex flex-col h-full"
                  >
                    <div className="relative h-44 overflow-hidden">
                      {post.cover_image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={post.cover_image_url}
                          alt={post.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-terra-light via-honey to-sage-light transition-transform duration-500 group-hover:scale-105" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/25 to-transparent" />
                    </div>

                    <div className="p-7 flex flex-col flex-1">
                      <div className="flex items-center gap-3 text-xs text-clay mb-3">
                        <time dateTime={post.published_at}>
                          {formatPostDate(post.published_at)}
                        </time>
                        <span className="flex items-center gap-1.5">
                          <Clock size={12} />
                          {post.reading_minutes} min
                        </span>
                      </div>

                      <h2 className="font-display text-xl text-ink mb-3 leading-snug">
                        {post.title}
                      </h2>

                      {post.excerpt && (
                        <p className="text-sm text-clay leading-relaxed mb-5">
                          {post.excerpt}
                        </p>
                      )}

                      <span className="mt-auto inline-flex items-center gap-2 text-sm font-500 text-terra group-hover:text-terra-dark transition-colors">
                        Leer artículo
                        <ArrowRight
                          size={15}
                          className="transition-transform duration-300 group-hover:translate-x-1"
                        />
                      </span>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <WhatsappFab whatsappNumber={whatsapp} />
    </main>
  )
}
