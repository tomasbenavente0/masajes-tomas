import Link from 'next/link'
import { ArrowRight, Clock } from 'lucide-react'
import Reveal from '@/components/Reveal'
import { formatPostDate } from '@/lib/utils'
import type { Post } from '@/lib/types'

export default function BlogSection({ posts }: { posts: Post[] }) {
  if (posts.length === 0) return null

  return (
    <section id="blog" className="relative py-24 bg-sand overflow-hidden">
      <div className="blob w-[30rem] h-[30rem] bg-terra/10 -bottom-40 -left-32" />

      <div className="container-tight relative">
        <Reveal>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-14">
            <div>
              <p className="eyebrow mb-4">
                <span className="w-6 h-px bg-terra" />
                Blog
              </p>
              <h2 className="font-display text-4xl md:text-5xl text-ink max-w-2xl leading-tight">
                Cuidar el cuerpo también se aprende
              </h2>
            </div>
            <Link
              href="/blog"
              className="btn-ghost shrink-0 whitespace-nowrap"
            >
              Ver todos
              <ArrowRight size={16} />
            </Link>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-7">
          {posts.map((post, i) => (
            <Reveal key={post.id} delay={i * 80}>
              <article className="group card h-full overflow-hidden flex flex-col hover:shadow-lift hover:-translate-y-1.5 transition-all duration-300">
                <Link href={`/blog/${post.slug}`} className="flex flex-col h-full">
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

                    <h3 className="font-display text-xl text-ink mb-3 leading-snug">
                      {post.title}
                    </h3>

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
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
