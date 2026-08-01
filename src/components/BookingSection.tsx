'use client'

import { CalendarCheck, ExternalLink, MessageCircle } from 'lucide-react'
import { whatsappLink } from '@/lib/utils'

interface Props {
  /** Link de la página de reservas (Cal.com). Vacío = se muestra el fallback. */
  bookingUrl?: string
  whatsappNumber: string
}

/**
 * Calendario de reservas incrustado desde Cal.com. Es la única agenda del
 * sitio: la disponibilidad se administra en Cal.com y las citas caen
 * directo en el Google Calendar de Tomás.
 */
export default function BookingSection({
  bookingUrl = '',
  whatsappNumber,
}: Props) {
  // Cal.com sirve una vista sin su barra de navegación en /embed.
  // layout=month_view fuerza el calendario mensual completo.
  const embedSrc = (() => {
    if (!bookingUrl) return ''
    const [base, query] = bookingUrl.split('?')
    const path = base.replace(/\/+$/, '')
    const withEmbed = path.endsWith('/embed') ? path : `${path}/embed`
    const params = new URLSearchParams(query)
    params.set('layout', 'month_view')
    return `${withEmbed}?${params.toString()}`
  })()

  const msg = 'Hola! Quiero agendar un masaje. ¿Qué horarios tienes?'

  return (
    <section id="disponibilidad" className="relative py-24 bg-sand overflow-hidden">
      <div className="blob w-[26rem] h-[26rem] bg-sage/15 top-20 -right-24" />

      <div className="container-tight relative">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <div>
            <p className="eyebrow mb-4">
              <span className="w-6 h-px bg-terra" />
              Agenda
            </p>
            <h2 className="font-display text-4xl md:text-5xl text-ink mb-4 leading-tight">
              Reserva tu hora
            </h2>
            <p className="text-clay max-w-xl leading-relaxed">
              Elige el masaje, el día y la hora que te acomoden. Solo verás los
              horarios realmente disponibles y recibirás la confirmación al
              instante.
            </p>
          </div>

          {embedSrc && (
            <a
              href={bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost shrink-0 whitespace-nowrap"
            >
              Abrir en pantalla completa
              <ExternalLink size={16} />
            </a>
          )}
        </div>

        {embedSrc ? (
          <div className="rounded-4xl overflow-hidden border border-ink/5 bg-cream shadow-soft">
            <iframe
              src={embedSrc}
              title="Calendario de reservas"
              loading="lazy"
              className="w-full block h-[42rem] md:h-[48rem]"
            />
          </div>
        ) : (
          /* Sin link configurado el sitio no queda cojo: se ofrece WhatsApp. */
          <div className="card p-14 text-center">
            <CalendarCheck className="mx-auto text-terra mb-4" size={32} />
            <p className="text-clay max-w-md mx-auto mb-6">
              La reserva online todavía no está configurada. Escríbeme por
              WhatsApp y coordinamos tu sesión.
            </p>
            <a
              href={whatsappLink(whatsappNumber, msg)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              <MessageCircle size={18} />
              Escribir por WhatsApp
            </a>
          </div>
        )}
      </div>
    </section>
  )
}
