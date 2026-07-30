'use client'

import { useState, useMemo } from 'react'
import { Clock, MapPin, Home, Check, MessageCircle, Sparkles } from 'lucide-react'
import type { City, Service, ServiceAvailability } from '@/lib/types'
import { formatCLP, parseBenefits, whatsappLink } from '@/lib/utils'

interface Props {
  cities: City[]
  services: Service[]
  availability: ServiceAvailability[]
  whatsappNumber: string
}

export default function ServicesSection({
  cities,
  services,
  availability,
  whatsappNumber,
}: Props) {
  const activeCities = cities.filter((c) => c.is_active)
  const [cityId, setCityId] = useState<string>(activeCities[0]?.id ?? '')
  const [modality, setModality] = useState<'local' | 'domicilio'>('local')

  const visibleServices = useMemo(() => {
    return services
      .filter((s) => s.is_active)
      .map((s) => {
        const avail = availability.find(
          (a) =>
            a.service_id === s.id &&
            a.city_id === cityId &&
            a.modality === modality &&
            a.is_active
        )
        return avail ? { service: s, surcharge: avail.surcharge } : null
      })
      .filter((x): x is { service: Service; surcharge: number } => x !== null)
  }, [services, availability, cityId, modality])

  const selectedCity = cities.find((c) => c.id === cityId)

  return (
    <section id="servicios" className="relative py-24 bg-cream overflow-hidden">
      <div className="blob w-[28rem] h-[28rem] bg-honey/15 -top-32 -right-24" />

      <div className="container-tight relative">
        <p className="eyebrow mb-4">
          <span className="w-6 h-px bg-terra" />
          Servicios
        </p>
        <h2 className="font-display text-4xl md:text-5xl text-ink mb-4 max-w-2xl leading-tight">
          Elige tu masaje, tu ciudad y tu modalidad
        </h2>
        <p className="text-clay mb-12 max-w-xl leading-relaxed">
          Los precios ya incluyen el traslado cuando eliges atención a
          domicilio.
        </p>

        {/* Filtros */}
        <div className="flex flex-wrap gap-8 mb-14">
          <div>
            <label className="block text-xs uppercase tracking-[0.15em] text-clay mb-3 font-500">
              Ciudad
            </label>
            <div className="flex flex-wrap gap-2">
              {activeCities.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCityId(c.id)}
                  className={`pill ${cityId === c.id ? 'pill-on' : 'pill-off'}`}
                >
                  {c.name}
                </button>
              ))}
              {activeCities.length === 0 && (
                <span className="text-clay text-sm">
                  No hay ciudades disponibles ahora mismo.
                </span>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-[0.15em] text-clay mb-3 font-500">
              Modalidad
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setModality('local')}
                className={`pill ${
                  modality === 'local' ? 'pill-on' : 'pill-off'
                }`}
              >
                <MapPin size={16} /> En local
              </button>
              <button
                onClick={() => setModality('domicilio')}
                className={`pill ${
                  modality === 'domicilio' ? 'pill-on' : 'pill-off'
                }`}
              >
                <Home size={16} /> A domicilio
              </button>
            </div>
          </div>
        </div>

        {/* Grilla de servicios */}
        {visibleServices.length === 0 ? (
          <div className="card p-14 text-center">
            <Sparkles className="mx-auto text-terra mb-4" size={32} />
            <p className="text-clay max-w-md mx-auto">
              No hay servicios disponibles en {selectedCity?.name} bajo esta
              modalidad por ahora. Prueba otra opción o escríbeme por WhatsApp.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
            {visibleServices.map(({ service, surcharge }) => {
              const basePrice = service.promo_price ?? service.price
              const finalPrice = basePrice + surcharge
              const hasPromo = service.promo_price != null
              const benefits = parseBenefits(service.benefits)
              const msg = `Hola! Me interesa reservar un ${service.name} en ${selectedCity?.name} (${modality}). ¿Qué disponibilidad tienes?`

              return (
                <article
                  key={service.id}
                  className="group card overflow-hidden flex flex-col hover:shadow-lift hover:-translate-y-1.5 transition-all duration-300"
                >
                  <div className="relative h-44 overflow-hidden">
                    {service.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={service.image_url}
                        alt={service.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-terra-light via-honey to-sage-light transition-transform duration-500 group-hover:scale-105" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/25 to-transparent" />

                    {hasPromo && service.promo_label && (
                      <span className="absolute top-4 left-4 text-xs font-600 bg-cream text-terra-dark px-3 py-1.5 rounded-full shadow-soft">
                        {service.promo_label}
                      </span>
                    )}

                    <span className="absolute bottom-4 right-4 flex items-center gap-1.5 text-xs text-cream bg-ink/45 backdrop-blur px-3 py-1.5 rounded-full">
                      <Clock size={13} />
                      {service.duration_minutes} min
                    </span>
                  </div>

                  <div className="p-7 flex flex-col flex-1">
                    <h3 className="font-display text-2xl text-ink mb-2.5">
                      {service.name}
                    </h3>

                    {service.description && (
                      <p className="text-sm text-clay mb-5 leading-relaxed">
                        {service.description}
                      </p>
                    )}

                    {benefits.length > 0 && (
                      <ul className="space-y-2 mb-6">
                        {benefits.slice(0, 4).map((b, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2.5 text-sm text-ink/75"
                          >
                            <span className="w-4 h-4 rounded-full bg-terra-soft flex items-center justify-center shrink-0 mt-0.5">
                              <Check size={11} className="text-terra-dark" />
                            </span>
                            {b}
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="mt-auto pt-5 border-t border-ink/5">
                      <div className="flex items-baseline gap-2.5 mb-5">
                        <span className="font-display text-3xl text-ink">
                          {formatCLP(finalPrice)}
                        </span>
                        {hasPromo && (
                          <span className="text-sm text-clay line-through">
                            {formatCLP(service.price + surcharge)}
                          </span>
                        )}
                      </div>

                      <a
                        href={whatsappLink(whatsappNumber, msg)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 bg-ink text-cream py-3.5 rounded-full text-sm font-500 hover:bg-terra transition-colors"
                      >
                        <MessageCircle size={16} />
                        Reservar por WhatsApp
                      </a>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
