'use client'

import type { City, Service, ServiceAvailability } from '@/lib/types'
import { toggleServiceAvailability } from '@/app/admin/actions'

export default function ServiceCityMatrix({
  cities,
  services,
  availability,
}: {
  cities: City[]
  services: Service[]
  availability: ServiceAvailability[]
}) {
  function isOn(serviceId: string, cityId: string, modality: string) {
    const a = availability.find(
      (x) =>
        x.service_id === serviceId &&
        x.city_id === cityId &&
        x.modality === modality
    )
    return a?.is_active ?? false
  }
  function surchargeOf(serviceId: string, cityId: string, modality: string) {
    const a = availability.find(
      (x) =>
        x.service_id === serviceId &&
        x.city_id === cityId &&
        x.modality === modality
    )
    return a?.surcharge ?? 0
  }

  return (
    <div>
      <h2 className="font-display text-2xl text-ink mb-2">
        Dónde ofreces cada servicio
      </h2>
      <p className="text-sm text-clay mb-6">
        Marca en qué ciudad y modalidad está disponible cada servicio. El
        recargo de domicilio es opcional (traslado).
      </p>

      <div className="space-y-6">
        {services.map((s) => (
          <div key={s.id} className="bg-cream rounded-xl p-5 border border-ink/5">
            <h3 className="font-500 text-ink mb-4">{s.name}</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {cities.map((c) => (
                <div key={c.id} className="border border-ink/5 rounded-lg p-3">
                  <p className="text-sm font-500 text-ink mb-3">{c.name}</p>
                  {(['local', 'domicilio'] as const).map((mod) => (
                    <div
                      key={mod}
                      className="flex items-center justify-between gap-2 py-1.5"
                    >
                      <span className="text-sm text-clay capitalize">{mod}</span>
                      <div className="flex items-center gap-2">
                        {mod === 'domicilio' && (
                          <form action={toggleServiceAvailability} className="flex items-center gap-1">
                            <input type="hidden" name="service_id" value={s.id} />
                            <input type="hidden" name="city_id" value={c.id} />
                            <input type="hidden" name="modality" value={mod} />
                            <input type="hidden" name="enable" value={isOn(s.id, c.id, mod).toString()} />
                            <span className="text-xs text-clay">+$</span>
                            <input
                              type="number"
                              name="surcharge"
                              defaultValue={surchargeOf(s.id, c.id, mod)}
                              onBlur={(e) => e.currentTarget.form?.requestSubmit()}
                              className="w-20 px-2 py-1 text-xs rounded border border-ink/10 bg-sand"
                            />
                          </form>
                        )}
                        <form action={toggleServiceAvailability}>
                          <input type="hidden" name="service_id" value={s.id} />
                          <input type="hidden" name="city_id" value={c.id} />
                          <input type="hidden" name="modality" value={mod} />
                          <input
                            type="hidden"
                            name="enable"
                            value={(!isOn(s.id, c.id, mod)).toString()}
                          />
                          <input
                            type="hidden"
                            name="surcharge"
                            value={surchargeOf(s.id, c.id, mod)}
                          />
                          <button
                            type="submit"
                            className={`relative w-11 h-6 rounded-full transition-colors ${
                              isOn(s.id, c.id, mod) ? 'bg-sage' : 'bg-ink/20'
                            }`}
                          >
                            <span
                              className={`absolute top-0.5 w-5 h-5 bg-cream rounded-full transition-transform ${
                                isOn(s.id, c.id, mod)
                                  ? 'translate-x-5'
                                  : 'translate-x-0.5'
                              }`}
                            />
                          </button>
                        </form>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
