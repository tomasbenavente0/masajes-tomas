'use client'

import { useState } from 'react'
import { Scissors, MapPin, CalendarDays, Grid3x3, Settings } from 'lucide-react'
import type {
  City,
  Service,
  ServiceAvailability,
  AvailabilitySlot,
  SiteSetting,
} from '@/lib/types'
import ServicesManager from './ServicesManager'
import AgendaManager from './AgendaManager'
import ServiceCityMatrix from './ServiceCityMatrix'
import { CitiesManager, SettingsManager } from './CitiesAndSettings'

const TABS = [
  { id: 'servicios', label: 'Servicios', icon: Scissors },
  { id: 'cobertura', label: 'Cobertura', icon: Grid3x3 },
  { id: 'agenda', label: 'Agenda', icon: CalendarDays },
  { id: 'ciudades', label: 'Ciudades', icon: MapPin },
  { id: 'ajustes', label: 'Ajustes', icon: Settings },
] as const

type TabId = (typeof TABS)[number]['id']

export default function AdminTabs({
  cities,
  services,
  availability,
  slots,
  settings,
}: {
  cities: City[]
  services: Service[]
  availability: ServiceAvailability[]
  slots: AvailabilitySlot[]
  settings: SiteSetting[]
}) {
  const [tab, setTab] = useState<TabId>('servicios')

  return (
    <div className="grid md:grid-cols-[220px_1fr] gap-8">
      {/* Sidebar */}
      <aside>
        <nav className="flex md:flex-col gap-1 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-500 whitespace-nowrap transition-colors ${
                tab === t.id
                  ? 'bg-ink text-cream'
                  : 'text-clay hover:bg-cream'
              }`}
            >
              <t.icon size={17} />
              {t.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Contenido */}
      <div className="min-w-0">
        {tab === 'servicios' && <ServicesManager services={services} />}
        {tab === 'cobertura' && (
          <ServiceCityMatrix
            cities={cities}
            services={services}
            availability={availability}
          />
        )}
        {tab === 'agenda' && (
          <AgendaManager cities={cities} slots={slots} />
        )}
        {tab === 'ciudades' && <CitiesManager cities={cities} />}
        {tab === 'ajustes' && <SettingsManager settings={settings} />}
      </div>
    </div>
  )
}
