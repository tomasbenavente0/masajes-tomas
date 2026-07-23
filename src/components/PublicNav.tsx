'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function PublicNav({ businessName }: { businessName: string }) {
  const [open, setOpen] = useState(false)

  const links = [
    { href: '#servicios', label: 'Servicios' },
    { href: '#beneficios', label: 'Beneficios' },
    { href: '#disponibilidad', label: 'Disponibilidad' },
    { href: '#contacto', label: 'Contacto' },
  ]

  return (
    <header className="sticky top-0 z-50 bg-sand/90 backdrop-blur border-b border-ink/10">
      <nav className="container-tight flex items-center justify-between py-4">
        <a href="#top" className="font-display text-xl font-600 text-ink">
          {businessName}
        </a>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-clay hover:text-ink transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>

        <button
          className="md:hidden text-ink"
          onClick={() => setOpen(!open)}
          aria-label="Menú"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden border-t border-ink/10 bg-sand">
          <div className="container-tight py-4 flex flex-col gap-4">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-clay hover:text-ink"
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
