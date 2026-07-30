'use client'

import { useState, useMemo } from 'react'
import { Calendar, CalendarCheck, ExternalLink } from 'lucide-react'
import type { City, AvailabilitySlot } from '@/lib/types'
import { formatDate, formatTime, whatsappLink } from '@/lib/utils'

interface Props {
  cities: City[]
  slots: AvailabilitySlot[]
  whatsappNumber: string
  /** Link de reservas online (Cal.com). Si está vacío, el bloque no se muestra. */
  bookingUrl?: string
}

export default function AvailabilitySection({
  cities,
  slots,
  whatsappNumber,
  bookingUrl = '',
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

  // Cal.com sirve una vista limpia (sin su barra) en /embed. El botón usa la
  // URL normal; el iframe usa la de embed.
  const embedSrc = bookingUrl
    ? bookingUrl.includes('/embed')
      ? bookingUrl
      : bookingUrl.replace(/\/+$/, '') + '/embed'
    : ''

  return (
    <section
      id="disponibilidad"
      className="relative py-24 bg-sand overflow-hidden"
    >
      <div className="blob w-[26rem] h-[26rem] bg-sage/15 top-20 -right-24" />

      <div className="container-tight relative">
        <p className="eyebrow mb-4">
          <span className="w-6 h-px bg-terra" />
          Agenda
        </p>
        <h2 className="font-display text-4xl md:text-5xl text-ink mb-4 max-w-2xl leading-tight">
          Horarios disponibles
        </h2>
        <p className="text-clay mb-12 max-w-xl leading-relaxed">
          Elige el bloque que te acomode y se abre WhatsApp con el detalle ya
          escrito.
        </p>

        {/* Reserva online (Cal.com) */}
        {bookingUrl && (
          <div className="card p-7 md:p-9 mb-12">
            <div className="flex flex-col sm:flex-row sm:items-center gap-5 justify-between mb-7">
              <div className="flex items-start gap-4">
                <span className="w-12 h-12 rounded-2xl bg-terra-soft flex items-center justify-center shrink-0">
                  <CalendarCheck size={22} className="text-terra-dark" />
                </span>
                <div>
                  <h3 className="font-display text-2xl text-ink mb-1">
                    Reserva online
                  </h3>
                  <p className="text-sm text-clay leading-relaxed">
                    Elige día y hora y queda confirmado en el calendario, sin
                    esperar respuesta.
                  </p>
                </div>
              </div>
              <a
                href={bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary shrink-0 whitespace-nowrap"
              >
                Agendar ahora
                <ExternalLink size={16} />
              </a>
            </div>

            <div className="rounded-3xl overflow-hidden border border-ink/5 bg-cream">
              <iframe
                src={embedSrc}
                title="Reserva online"
                loading="lazy"
                className="w-full h-[38rem] block"
              />
            </div>
          </div>
        )}

        {/* Filtros */}
        <div className="flex flex-wrap items-center gap-2 mb-10">
          {activeCities.map((c) => (
            <button
              key={c.id}
              onClick={() => setCityId(c.id)}
              className={`pill ${cityId === c.id ? 'pill-on' : 'pill-off'}`}
            >
              {c.name}
            </button>
          ))}
          <div className="w-px h-7 bg-ink/10 mx-2 hidden sm:block" />
          <button
            onClick={() => setModality('local')}
            className={`pill ${modality === 'local' ? 'pill-on' : 'pill-off'}`}
          >
            En local
          </button>
          <button
            onClick={() => setModality('domicilio')}
            className={`pill ${
              modality === 'domicilio' ? 'pill-on' : 'pill-off'
            }`}
          >
            A domicilio
          </button>
        </div>

        {dates.length === 0 ? (
          <div className="card p-14 text-center">
            <Calendar className="mx-auto text-terra mb-4" size={32} />
            <p className="text-clay max-w-md mx-auto">
              No hay horarios publicados para {selectedCity?.name} ({modality})
              por ahora. Escríbeme por WhatsApp y coordinamos.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {dates.map((date) => (
              <div key={date} className="card p-7">
                <h3 className="font-display text-xl text-ink capitalize mb-5">
                  {formatDate(date)}
                </h3>
                <div className="flex flex-wrap gap-2.5">
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
                        className="px-5 py-2.5 rounded-full bg-sand hover:bg-terra hover:text-cream text-sm font-500 text-ink transition-colors border border-ink/5"
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
