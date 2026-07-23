'use client'

import { useState, useMemo } from 'react'
import { Clock, MapPin, Home, Check } from 'lucide-react'
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
    <section id="servicios" className="py-20 bg-cream">
      <div className="container-tight">
        <p className="text-sm uppercase tracking-widest text-sage font-500 mb-3">
          Servicios
        </p>
        <h2 className="font-display text-4xl md:text-5xl text-ink mb-8 max-w-2xl">
          Elige tu masaje, tu ciudad y modalidad
        </h2>

        {/* Filtros */}
        <div className="flex flex-wrap gap-6 mb-12">
          <div>
            <label className="block text-xs uppercase tracking-wide text-clay mb-2">
              Ciudad
            </label>
            <div className="flex gap-2">
              {activeCities.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCityId(c.id)}
                  className={`px-5 py-2.5 rounded-full text-sm font-500 transition-colors ${
                    cityId === c.id
                      ? 'bg-sage text-cream'
                      : 'bg-sand text-clay hover:bg-sage-light/30'
                  }`}
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
            <label className="block text-xs uppercase tracking-wide text-clay mb-2">
              Modalidad
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setModality('local')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-500 transition-colors ${
                  modality === 'local'
                    ? 'bg-sage text-cream'
                    : 'bg-sand text-clay hover:bg-sage-light/30'
                }`}
              >
                <MapPin size={16} /> En local
              </button>
              <button
                onClick={() => setModality('domicilio')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-500 transition-colors ${
                  modality === 'domicilio'
                    ? 'bg-sage text-cream'
                    : 'bg-sand text-clay hover:bg-sage-light/30'
                }`}
              >
                <Home size={16} /> A domicilio
              </button>
            </div>
          </div>
        </div>

        {/* Grilla de servicios */}
        {visibleServices.length === 0 ? (
          <div className="bg-sand rounded-2xl p-12 text-center">
            <p className="text-clay">
              No hay servicios disponibles en {selectedCity?.name} bajo esta
              modalidad por ahora. Prueba otra opción o escríbeme por WhatsApp.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleServices.map(({ service, surcharge }) => {
              const basePrice = service.promo_price ?? service.price
              const finalPrice = basePrice + surcharge
              const hasPromo = service.promo_price != null
              const benefits = parseBenefits(service.benefits)
              const msg = `Hola! Me interesa reservar un ${service.name} en ${selectedCity?.name} (${modality}). ¿Qué disponibilidad tienes?`

              return (
                <article
                  key={service.id}
                  className="bg-sand rounded-2xl overflow-hidden border border-ink/5 flex flex-col"
                >
                  {service.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={service.image_url}
                      alt={service.name}
                      className="h-40 w-full object-cover"
                    />
                  ) : (
                    <div className="h-40 w-full bg-gradient-to-br from-sage-light/40 to-sage/30" />
                  )}

                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-display text-xl text-ink">
                        {service.name}
                      </h3>
                      {hasPromo && service.promo_label && (
                        <span className="shrink-0 text-xs bg-sage text-cream px-2 py-1 rounded-full">
                          {service.promo_label}
                        </span>
                      )}
                    </div>

                    {service.description && (
                      <p className="text-sm text-clay mb-4">
                        {service.description}
                      </p>
                    )}

                    {benefits.length > 0 && (
                      <ul className="space-y-1.5 mb-5">
                        {benefits.slice(0, 4).map((b, i) => (
                          <li
                            key={i}
                            className="flex items-center gap-2 text-sm text-ink/80"
                          >
                            <Check size={15} className="text-sage shrink-0" />
                            {b}
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="mt-auto">
                      <div className="flex items-center gap-2 text-sm text-clay mb-3">
                        <Clock size={15} />
                        {service.duration_minutes} min
                        {surcharge > 0 && (
                          <span className="text-xs">
                            · incluye traslado
                          </span>
                        )}
                      </div>

                      <div className="flex items-baseline gap-2 mb-4">
                        {hasPromo && (
                          <span className="text-sm text-clay line-through">
                            {formatCLP(service.price + surcharge)}
                          </span>
                        )}
                        <span className="font-display text-2xl text-ink">
                          {formatCLP(finalPrice)}
                        </span>
                      </div>

                      <a
                        href={whatsappLink(whatsappNumber, msg)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-center bg-ink text-cream py-3 rounded-xl text-sm font-500 hover:bg-ink/90 transition-colors"
                      >
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
