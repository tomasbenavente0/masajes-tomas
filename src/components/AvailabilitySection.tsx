'use client'

import { useState, useMemo } from 'react'
import { Calendar } from 'lucide-react'
import type { City, AvailabilitySlot } from '@/lib/types'
import { formatDate, formatTime, whatsappLink } from '@/lib/utils'

interface Props {
  cities: City[]
  slots: AvailabilitySlot[]
  whatsappNumber: string
}

export default function AvailabilitySection({
  cities,
  slots,
  whatsappNumber,
}: Props) {
  const activeCities = cities.filter((c) => c.is_active)
  const [cityId, setCityId] = useState<string>(activeCities[0]?.id ?? '')
  const [modality, setModality] = useState<'local' | 'domicilio'>('local')

  const grouped = useMemo(() => {
    const filtered = slots
      .filter(
        (s) =>
          s.city_id === cityId &&
          s.modality === modality &&
          s.status === 'disponible'
      )
      .sort((a, b) => {
        if (a.slot_date !== b.slot_date)
          return a.slot_date.localeCompare(b.slot_date)
        return a.start_time.localeCompare(b.start_time)
      })

    const byDate: Record<string, AvailabilitySlot[]> = {}
    for (const s of filtered) {
      byDate[s.slot_date] = byDate[s.slot_date] || []
      byDate[s.slot_date].push(s)
    }
    return byDate
  }, [slots, cityId, modality])

  const selectedCity = cities.find((c) => c.id === cityId)
  const dates = Object.keys(grouped)

  return (
    <section id="disponibilidad" className="py-20 bg-sand">
      <div className="container-tight">
        <p className="text-sm uppercase tracking-widest text-sage font-500 mb-3">
          Disponibilidad
        </p>
        <h2 className="font-display text-4xl md:text-5xl text-ink mb-8 max-w-2xl">
          Horarios disponibles
        </h2>

        <div className="flex flex-wrap gap-3 mb-10">
          {activeCities.map((c) => (
            <button
              key={c.id}
              onClick={() => setCityId(c.id)}
              className={`px-5 py-2.5 rounded-full text-sm font-500 transition-colors ${
                cityId === c.id
                  ? 'bg-sage text-cream'
                  : 'bg-cream text-clay hover:bg-sage-light/30'
              }`}
            >
              {c.name}
            </button>
          ))}
          <div className="w-px bg-ink/10 mx-2" />
          <button
            onClick={() => setModality('local')}
            className={`px-5 py-2.5 rounded-full text-sm font-500 transition-colors ${
              modality === 'local'
                ? 'bg-sage text-cream'
                : 'bg-cream text-clay hover:bg-sage-light/30'
            }`}
          >
            En local
          </button>
          <button
            onClick={() => setModality('domicilio')}
            className={`px-5 py-2.5 rounded-full text-sm font-500 transition-colors ${
              modality === 'domicilio'
                ? 'bg-sage text-cream'
                : 'bg-cream text-clay hover:bg-sage-light/30'
            }`}
          >
            A domicilio
          </button>
        </div>

        {dates.length === 0 ? (
          <div className="bg-cream rounded-2xl p-12 text-center">
            <Calendar className="mx-auto text-sage mb-3" size={32} />
            <p className="text-clay">
              No hay horarios publicados para {selectedCity?.name} (
              {modality}) por ahora. Escríbeme por WhatsApp y coordinamos.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {dates.map((date) => (
              <div key={date} className="bg-cream rounded-2xl p-6">
                <h3 className="font-display text-lg text-ink capitalize mb-4">
                  {formatDate(date)}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {grouped[date].map((slot) => {
                    const msg = `Hola! Quiero reservar el ${formatDate(
                      date
                    )} a las ${formatTime(slot.start_time)} en ${
                      selectedCity?.name
                    } (${modality}).`
                    return (
                      <a
                        key={slot.id}
                        href={whatsappLink(whatsappNumber, msg)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-lg bg-sand hover:bg-sage hover:text-cream text-sm text-ink transition-colors border border-ink/5"
                      >
                        {formatTime(slot.start_time)} –{' '}
                        {formatTime(slot.end_time)}
                      </a>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
