'use client'

import { useState } from 'react'
import { Plus, Pencil, Trash2, X } from 'lucide-react'
import type { Service } from '@/lib/types'
import { formatCLP } from '@/lib/utils'
import { saveService, deleteService } from '@/app/admin/actions'

export default function ServicesManager({ services }: { services: Service[] }) {
  const [editing, setEditing] = useState<Service | null>(null)
  const [showForm, setShowForm] = useState(false)

  function openNew() {
    setEditing(null)
    setShowForm(true)
  }
  function openEdit(s: Service) {
    setEditing(s)
    setShowForm(true)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl text-ink">Servicios</h2>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-ink text-cream px-4 py-2 rounded-lg text-sm font-500 hover:bg-ink/90"
        >
          <Plus size={16} /> Nuevo servicio
        </button>
      </div>

      <div className="space-y-3">
        {services.length === 0 && (
          <p className="text-clay text-sm">Aún no hay servicios. Crea el primero.</p>
        )}
        {services.map((s) => (
          <div
            key={s.id}
            className="bg-cream rounded-xl p-4 border border-ink/5 flex items-center justify-between gap-4"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-500 text-ink truncate">{s.name}</h3>
                {!s.is_active && (
                  <span className="text-xs bg-ink/10 text-clay px-2 py-0.5 rounded-full">
                    Oculto
                  </span>
                )}
                {s.promo_price != null && (
                  <span className="text-xs bg-sage text-cream px-2 py-0.5 rounded-full">
                    {s.promo_label || 'Promo'}
                  </span>
                )}
              </div>
              <p className="text-sm text-clay">
                {s.duration_minutes} min ·{' '}
                {s.promo_price != null ? (
                  <>
                    <span className="line-through">{formatCLP(s.price)}</span>{' '}
                    {formatCLP(s.promo_price)}
                  </>
                ) : (
                  formatCLP(s.price)
                )}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => openEdit(s)}
                className="p-2 rounded-lg hover:bg-sand text-clay hover:text-ink"
                aria-label="Editar"
              >
                <Pencil size={16} />
              </button>
              <form action={deleteService}>
                <input type="hidden" name="id" value={s.id} />
                <button
                  type="submit"
                  className="p-2 rounded-lg hover:bg-red-50 text-clay hover:text-red-600"
                  aria-label="Eliminar"
                  onClick={(e) => {
                    if (!confirm(`¿Eliminar "${s.name}"?`)) e.preventDefault()
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <ServiceForm
          service={editing}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  )
}

function ServiceForm({
  service,
  onClose,
}: {
  service: Service | null
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 bg-ink/40 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-cream rounded-2xl p-6 w-full max-w-lg my-8">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display text-xl text-ink">
            {service ? 'Editar servicio' : 'Nuevo servicio'}
          </h3>
          <button onClick={onClose} className="text-clay hover:text-ink">
            <X size={20} />
          </button>
        </div>

        <form
          action={async (fd) => {
            await saveService(fd)
            onClose()
          }}
          className="space-y-4"
        >
          {service && <input type="hidden" name="id" value={service.id} />}

          <Field label="Nombre">
            <input
              name="name"
              defaultValue={service?.name}
              required
              className="input"
            />
          </Field>

          <Field label="Descripción">
            <textarea
              name="description"
              defaultValue={service?.description ?? ''}
              rows={2}
              className="input"
            />
          </Field>

          <Field label="Beneficios (separados por |)">
            <input
              name="benefits"
              defaultValue={service?.benefits ?? ''}
              placeholder="Reduce estrés|Mejora sueño|Alivia dolor"
              className="input"
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Duración (min)">
              <input
                name="duration_minutes"
                type="number"
                defaultValue={service?.duration_minutes ?? 60}
                className="input"
              />
            </Field>
            <Field label="Precio (CLP)">
              <input
                name="price"
                type="number"
                defaultValue={service?.price ?? 25000}
                required
                className="input"
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Precio promo (opcional)">
              <input
                name="promo_price"
                type="number"
                defaultValue={service?.promo_price ?? ''}
                className="input"
              />
            </Field>
            <Field label="Etiqueta promo">
              <input
                name="promo_label"
                defaultValue={service?.promo_label ?? ''}
                placeholder="20% off"
                className="input"
              />
            </Field>
          </div>

          <Field label="URL de imagen (opcional)">
            <input
              name="image_url"
              defaultValue={service?.image_url ?? ''}
              placeholder="https://…"
              className="input"
            />
          </Field>

          <div className="grid grid-cols-2 gap-4 items-center">
            <Field label="Orden">
              <input
                name="display_order"
                type="number"
                defaultValue={service?.display_order ?? 0}
                className="input"
              />
            </Field>
            <label className="flex items-center gap-2 mt-6">
              <input
                type="checkbox"
                name="is_active"
                defaultChecked={service?.is_active ?? true}
                className="w-4 h-4 accent-sage"
              />
              <span className="text-sm text-ink">Visible en el sitio</span>
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 bg-ink text-cream py-2.5 rounded-lg font-500 hover:bg-ink/90"
            >
              Guardar
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg border border-ink/10 text-clay hover:bg-sand"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-wide text-clay mb-1.5">
        {label}
      </label>
      {children}
    </div>
  )
}
