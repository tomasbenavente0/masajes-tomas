'use client'

import type { City, SiteSetting } from '@/lib/types'
import { toggleCity, saveSettings, toggleSitePublished } from '@/app/admin/actions'
import { MapPin, Globe, EyeOff } from 'lucide-react'

export function CitiesManager({ cities }: { cities: City[] }) {
  return (
    <div>
      <h2 className="font-display text-2xl text-ink mb-2">Ciudades</h2>
      <p className="text-sm text-clay mb-6">
        Activa la ciudad donde estás trabajando. Al desactivarla, sus servicios
        y horarios dejan de mostrarse en el sitio.
      </p>
      <div className="space-y-3">
        {cities.map((c) => (
          <div
            key={c.id}
            className="bg-cream rounded-xl p-4 border border-ink/5 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-sage/15 flex items-center justify-center">
                <MapPin size={18} className="text-sage-dark" />
              </div>
              <span className="font-500 text-ink">{c.name}</span>
            </div>
            <form action={toggleCity}>
              <input type="hidden" name="id" value={c.id} />
              <input
                type="hidden"
                name="active"
                value={(!c.is_active).toString()}
              />
              <button
                type="submit"
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  c.is_active ? 'bg-sage' : 'bg-ink/20'
                }`}
                aria-label={c.is_active ? 'Desactivar' : 'Activar'}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 bg-cream rounded-full transition-transform ${
                    c.is_active ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  )
}

export function SettingsManager({
  settings,
}: {
  settings: SiteSetting[]
}) {
  const get = (k: string) =>
    settings.find((s) => s.key === k)?.value ?? ''

  const isPublished = get('site_published') === 'true'

  return (
    <div>
      <h2 className="font-display text-2xl text-ink mb-6">
        Información del sitio
      </h2>

      {/* Estado de publicación */}
      <div className="bg-cream rounded-xl p-5 border border-ink/5 mb-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                isPublished ? 'bg-sage/15' : 'bg-amber-100'
              }`}
            >
              {isPublished ? (
                <Globe size={20} className="text-sage-dark" />
              ) : (
                <EyeOff size={20} className="text-amber-700" />
              )}
            </div>
            <div>
              <p className="font-500 text-ink">
                {isPublished ? 'Sitio publicado' : 'Modo privado'}
              </p>
              <p className="text-sm text-clay">
                {isPublished
                  ? 'Cualquier persona puede ver tu sitio completo.'
                  : 'El público ve la página “próximamente”. Solo tú ves el sitio real.'}
              </p>
            </div>
          </div>
          <form action={toggleSitePublished}>
            <input
              type="hidden"
              name="publish"
              value={(!isPublished).toString()}
            />
            <button
              type="submit"
              className={`px-5 py-2.5 rounded-lg font-500 text-sm whitespace-nowrap ${
                isPublished
                  ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                  : 'bg-sage text-cream hover:bg-sage-dark'
              }`}
            >
              {isPublished ? 'Pasar a privado' : 'Publicar sitio'}
            </button>
          </form>
        </div>
      </div>

      <form action={saveSettings} className="space-y-4 max-w-xl">
        <SField label="Nombre del negocio" name="business_name" value={get('business_name')} />
        <SField
          label="WhatsApp (con código país, ej: 56912345678)"
          name="whatsapp_number"
          value={get('whatsapp_number')}
        />

        <div className="border-t border-ink/10 pt-4 mt-2">
          <p className="text-xs uppercase tracking-wide text-clay mb-3 font-500">
            Página “próximamente” (modo privado)
          </p>
          <SField label="Título" name="coming_soon_title" value={get('coming_soon_title')} />
          <div className="mt-4">
            <label className="block text-xs uppercase tracking-wide text-clay mb-1.5">
              Texto
            </label>
            <textarea
              name="coming_soon_text"
              defaultValue={get('coming_soon_text')}
              rows={2}
              className="input"
            />
          </div>
        </div>

        <div className="border-t border-ink/10 pt-4 mt-2">
          <p className="text-xs uppercase tracking-wide text-clay mb-3 font-500">
            Sitio publicado
          </p>
        </div>
        <SField label="Título principal (hero)" name="hero_title" value={get('hero_title')} />
        <SField label="Subtítulo (hero)" name="hero_subtitle" value={get('hero_subtitle')} />
        <div>
          <label className="block text-xs uppercase tracking-wide text-clay mb-1.5">
            Texto "sobre mí"
          </label>
          <textarea
            name="about_text"
            defaultValue={get('about_text')}
            rows={3}
            className="input"
          />
        </div>
        <SField label="Correo" name="email" value={get('email')} />
        <SField label="Instagram (URL)" name="instagram_url" value={get('instagram_url')} />
        <button
          type="submit"
          className="bg-ink text-cream px-6 py-2.5 rounded-lg font-500 hover:bg-ink/90"
        >
          Guardar cambios
        </button>
      </form>
    </div>
  )
}

function SField({
  label,
  name,
  value,
}: {
  label: string
  name: string
  value: string
}) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-wide text-clay mb-1.5">
        {label}
      </label>
      <input name={name} defaultValue={value} className="input" />
    </div>
  )
}
