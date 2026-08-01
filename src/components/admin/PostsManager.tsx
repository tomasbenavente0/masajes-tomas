'use client'

import { useState } from 'react'
import { Plus, Trash2, Pencil, X, Eye, EyeOff, ExternalLink } from 'lucide-react'
import type { Post } from '@/lib/types'
import { formatPostDate } from '@/lib/utils'
import { savePost, deletePost, togglePostPublished } from '@/app/admin/actions'

export default function PostsManager({ posts }: { posts: Post[] }) {
  // null = formulario cerrado, 'new' = artículo nuevo, Post = editando
  const [editing, setEditing] = useState<Post | 'new' | null>(null)

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-display text-2xl text-ink">Blog</h2>
          <p className="text-sm text-clay mt-1">
            Los artículos publicados aparecen en el home y en /blog.
          </p>
        </div>
        {editing === null && (
          <button
            onClick={() => setEditing('new')}
            className="flex items-center gap-2 bg-ink text-cream px-4 py-2.5 rounded-lg text-sm font-500 hover:bg-ink/90 whitespace-nowrap"
          >
            <Plus size={16} /> Nuevo artículo
          </button>
        )}
      </div>

      {editing !== null && (
        <PostForm
          post={editing === 'new' ? null : editing}
          onClose={() => setEditing(null)}
        />
      )}

      <div className="space-y-2">
        {posts.length === 0 && editing === null && (
          <p className="text-clay text-sm">
            Todavía no hay artículos. Crea el primero con el botón de arriba.
          </p>
        )}

        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-cream rounded-xl p-4 border border-ink/5 flex items-center justify-between gap-4"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-500 text-ink truncate">{post.title}</p>
                {!post.is_published && (
                  <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full shrink-0">
                    Borrador
                  </span>
                )}
              </div>
              <p className="text-xs text-clay mt-1 truncate">
                /blog/{post.slug} · {formatPostDate(post.published_at)} ·{' '}
                {post.reading_minutes} min
              </p>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {post.is_published && (
                <a
                  href={`/blog/${post.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg text-clay hover:bg-sand hover:text-ink"
                  title="Ver en el sitio"
                >
                  <ExternalLink size={15} />
                </a>
              )}

              <form action={togglePostPublished}>
                <input type="hidden" name="id" value={post.id} />
                <input type="hidden" name="slug" value={post.slug} />
                <input
                  type="hidden"
                  name="publish"
                  value={(!post.is_published).toString()}
                />
                <button
                  className="p-2 rounded-lg text-clay hover:bg-sand hover:text-ink"
                  title={post.is_published ? 'Pasar a borrador' : 'Publicar'}
                >
                  {post.is_published ? <Eye size={15} /> : <EyeOff size={15} />}
                </button>
              </form>

              <button
                onClick={() => setEditing(post)}
                className="p-2 rounded-lg text-clay hover:bg-sand hover:text-ink"
                title="Editar"
              >
                <Pencil size={15} />
              </button>

              <form
                action={deletePost}
                onSubmit={(e) => {
                  if (!confirm(`¿Eliminar "${post.title}"? No se puede deshacer.`))
                    e.preventDefault()
                }}
              >
                <input type="hidden" name="id" value={post.id} />
                <input type="hidden" name="slug" value={post.slug} />
                <button
                  className="p-2 rounded-lg text-clay hover:bg-red-50 hover:text-red-600"
                  title="Eliminar"
                >
                  <Trash2 size={15} />
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function PostForm({
  post,
  onClose,
}: {
  post: Post | null
  onClose: () => void
}) {
  return (
    <form
      action={savePost}
      onSubmit={onClose}
      className="bg-cream rounded-xl p-6 border border-ink/5 mb-6 space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg text-ink">
          {post ? 'Editar artículo' : 'Nuevo artículo'}
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg text-clay hover:bg-sand"
          aria-label="Cerrar"
        >
          <X size={18} />
        </button>
      </div>

      {post && <input type="hidden" name="id" value={post.id} />}

      <Field
        label="Título"
        name="title"
        defaultValue={post?.title ?? ''}
        required
      />
      <Field
        label="URL del artículo (slug)"
        name="slug"
        defaultValue={post?.slug ?? ''}
        hint="Déjalo vacío y se genera desde el título. Ej: masaje-descontracturante-que-es"
      />

      <div>
        <Label>Resumen</Label>
        <textarea
          name="excerpt"
          defaultValue={post?.excerpt ?? ''}
          rows={2}
          className="input"
        />
        <Hint>Se muestra en la tarjeta del listado. Dos líneas bastan.</Hint>
      </div>

      <div>
        <Label>Contenido</Label>
        <textarea
          name="content"
          defaultValue={post?.content ?? ''}
          rows={16}
          required
          className="input font-mono text-xs leading-relaxed"
        />
        <Hint>
          Usa <code>## </code> para títulos, <code>- </code> para viñetas y{' '}
          <code>**texto**</code> para negrita. Deja una línea en blanco entre
          párrafos.
        </Hint>
      </div>

      <Field
        label="Imagen de portada (URL)"
        name="cover_image_url"
        defaultValue={post?.cover_image_url ?? ''}
        hint="Opcional. Sin imagen se muestra un degradado."
      />

      <div className="border-t border-ink/10 pt-4">
        <p className="text-xs uppercase tracking-wide text-clay font-500 mb-3">
          SEO
        </p>
        <div className="space-y-4">
          <Field
            label="Título para Google"
            name="meta_title"
            defaultValue={post?.meta_title ?? ''}
            hint="Hasta ~60 caracteres. Vacío = se usa el título del artículo. No escribas &quot;| Masajes Tomás&quot;: se agrega solo."
          />
          <div>
            <Label>Descripción para Google</Label>
            <textarea
              name="meta_description"
              defaultValue={post?.meta_description ?? ''}
              rows={2}
              className="input"
            />
            <Hint>
              Hasta ~155 caracteres. Vacío = se usa el resumen. Incluir
              &quot;Concepción&quot; o &quot;Parral&quot; ayuda a las búsquedas
              locales.
            </Hint>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-6 border-t border-ink/10 pt-4">
        <div className="w-32">
          <Label>Minutos de lectura</Label>
          <input
            type="number"
            name="reading_minutes"
            min={1}
            defaultValue={post?.reading_minutes ?? 3}
            className="input"
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-ink pb-2.5">
          <input
            type="checkbox"
            name="is_published"
            defaultChecked={post?.is_published ?? true}
            className="w-4 h-4 accent-terra"
          />
          Publicado
        </label>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="bg-ink text-cream px-6 py-2.5 rounded-lg font-500 hover:bg-ink/90"
        >
          Guardar
        </button>
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-2.5 rounded-lg font-500 text-clay hover:bg-sand"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-xs uppercase tracking-wide text-clay mb-1.5">
      {children}
    </label>
  )
}

function Hint({ children }: { children: React.ReactNode }) {
  return <p className="text-xs text-clay/80 mt-1.5">{children}</p>
}

function Field({
  label,
  name,
  defaultValue,
  hint,
  required,
}: {
  label: string
  name: string
  defaultValue: string
  hint?: string
  required?: boolean
}) {
  return (
    <div>
      <Label>{label}</Label>
      <input
        name={name}
        defaultValue={defaultValue}
        required={required}
        className="input"
      />
      {hint && <Hint>{hint}</Hint>}
    </div>
  )
}
