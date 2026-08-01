'use client'

import { useEffect, useState } from 'react'
import { Menu, X, MessageCircle, Lock } from 'lucide-react'
import { whatsappLink } from '@/lib/utils'

export default function PublicNav({
  businessName,
  whatsappNumber,
}: {
  businessName: string
  whatsappNumber: string
}) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { href: '/#servicios', label: 'Servicios' },
    { href: '/#disponibilidad', label: 'Agenda' },
    { href: '/blog', label: 'Blog' },
    { href: '/#contacto', label: 'Contacto' },
  ]

  const navMsg = `Hola! Vengo desde tu sitio web y quiero agendar un masaje.`

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-sand/85 backdrop-blur-md border-b border-ink/10 shadow-soft'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <nav className="container-tight flex items-center justify-between py-4">
        <a href="/" className="flex items-center gap-2.5 group">
          <span className="w-9 h-9 rounded-full bg-terra flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105">
            <span className="font-display text-cream text-lg leading-none">
              {businessName.trim().charAt(0) || 'M'}
            </span>
          </span>
          <span className="font-display text-xl font-600 text-ink">
            {businessName}
          </span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="relative text-sm text-clay hover:text-ink transition-colors after:absolute after:left-0 after:-bottom-1.5 after:h-0.5 after:w-0 after:bg-terra after:transition-all after:duration-300 hover:after:w-full"
            >
              {l.label}
            </a>
          ))}
          <a
            href="/admin/login"
            className="flex items-center gap-1.5 text-sm text-clay hover:text-terra-dark transition-colors"
            title="Acceso del administrador"
          >
            <Lock size={14} />
            Admin
          </a>
          <a
            href={whatsappLink(whatsappNumber, navMsg)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-terra text-cream text-sm font-500 px-5 py-2.5 rounded-full hover:bg-terra-dark transition-colors"
          >
            <MessageCircle size={16} />
            Reservar
          </a>
        </div>

        <button
          className="md:hidden text-ink"
          onClick={() => setOpen(!open)}
          aria-label="Menú"
          aria-expanded={open}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden border-t border-ink/10 bg-sand/95 backdrop-blur-md">
          <div className="container-tight py-5 flex flex-col gap-4">
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
            <a
              href={whatsappLink(whatsappNumber, navMsg)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-terra text-cream font-500 px-5 py-3 rounded-full"
            >
              <MessageCircle size={16} />
              Reservar por WhatsApp
            </a>
            <a
              href="/admin/login"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-1.5 text-sm text-clay hover:text-terra-dark pt-1"
            >
              <Lock size={14} />
              Acceso administrador
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
