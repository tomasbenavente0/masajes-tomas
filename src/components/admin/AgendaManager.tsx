'use client'

import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import type { City, AvailabilitySlot } from '@/lib/types'
import { formatDate, formatTime } from '@/lib/utils'
import { addSlot, deleteSlot, updateSlotStatus } from '@/app/admin/actions'

export default function AgendaManager({
  cities,
  slots,
}: {
  cities: City[]
  slots: AvailabilitySlot[]
}) {
  const [cityId, setCityId] = useState(cities[0]?.id ?? '')
  const [modality, setModality] = useState<'local' | 'domicilio'>('local')

  const cityName = (id: string) => cities.find((c) => c.id === id)?.name ?? ''

  const filtered = slots
    .filter((s) => s.city_id === cityId && s.modality === modality)
    .sort((a, b) => {
      if (a.slot_date !== b.slot_date)
        return a.slot_date.localeCompare(b.slot_date)
      return a.start_time.localeCompare(b.start_time)
    })

  return (
    <div>
      <h2 className="font-display text-2xl text-ink mb-6">Agenda</h2>

      {/* Selector ciudad + modalidad */}
      <div className="flex flex-wrap gap-2 mb-6">
        {cities.map((c) => (
          <button
            key={c.id}
            onClick={() => setCityId(c.id)}
            className={`px-4 py-2 rounded-lg text-sm font-500 ${
              cityId === c.id ? 'bg-sage text-cream' : 'bg-cream text-clay'
            }`}
          >
            {c.name}
          </button>
        ))}
        <div className="w-px bg-ink/10 mx-1" />
        <button
          onClick={() => setModality('local')}
          className={`px-4 py-2 rounded-lg text-sm font-500 ${
            modality === 'local' ? 'bg-sage text-cream' : 'bg-cream text-clay'
          }`}
        >
          Local
        </button>
        <button
          onClick={() => setModality('domicilio')}
          className={`px-4 py-2 rounded-lg text-sm font-500 ${
            modality === 'domicilio'
              ? 'bg-sage text-cream'
              : 'bg-cream text-clay'
          }`}
        >
          Domicilio
        </button>
      </div>

      {/* Formulario para agregar bloque */}
      <form
        action={addSlot}
        className="bg-cream rounded-xl p-4 border border-ink/5 mb-6 flex flex-wrap items-end gap-3"
      >
        <input type="hidden" name="city_id" value={cityId} />
        <input type="hidden" name="modality" value={modality} />
        <div>
          <label className="block text-xs uppercase tracking-wide text-clay mb-1">
            Fecha
          </label>
          <input type="date" name="slot_date" required className="input" />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wide text-clay mb-1">
            Desde
          </label>
          <input type="time" name="start_time" required className="input" />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wide text-clay mb-1">
            Hasta
          </label>
          <input type="time" name="end_time" required className="input" />
        </div>
        <button
          type="submit"
          className="flex items-center gap-2 bg-ink text-cream px-4 py-2.5 rounded-lg text-sm font-500 hover:bg-ink/90"
        >
          <Plus size={16} /> Agregar
        </button>
      </form>

      <p className="text-sm text-clay mb-3">
        Mostrando {cityName(cityId)} · {modality}
      </p>

      {/* Lista de bloques */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <p className="text-clay text-sm">
            No hay bloques para esta combinación. Agrega uno arriba.
          </p>
        )}
        {filtered.map((slot) => (
          <div
            key={slot.id}
            className="bg-cream rounded-lg p-3 border border-ink/5 flex items-center justify-between gap-4"
          >
            <div>
              <span className="text-ink capitalize">
                {formatDate(slot.slot_date)}
              </span>
              <span className="text-clay ml-3">
                {formatTime(slot.start_time)} – {formatTime(slot.end_time)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <form action={updateSlotStatus}>
                <input type="hidden" name="id" value={slot.id} />
                <select
                  name="status"
                  defaultValue={slot.status}
                  onChange={(e) => e.currentTarget.form?.requestSubmit()}
                  className={`text-xs rounded-full px-3 py-1 border-0 cursor-pointer ${
                    slot.status === 'disponible'
                      ? 'bg-sage/15 text-sage-dark'
                      : slot.status === 'reservado'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-ink/10 text-clay'
                  }`}
                >
                  <option value="disponible">Disponible</option>
                  <option value="reservado">Reservado</option>
                  <option value="bloqueado">Bloqueado</option>
                </select>
              </form>
              <form action={deleteSlot}>
                <input type="hidden" name="id" value={slot.id} />
                <button
                  type="submit"
                  className="p-1.5 rounded-lg hover:bg-red-50 text-clay hover:text-red-600"
                  aria-label="Eliminar"
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
