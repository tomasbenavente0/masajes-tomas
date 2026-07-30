'use client'

import { useEffect, useState } from 'react'
import { MessageCircle } from 'lucide-react'
import { whatsappLink } from '@/lib/utils'

/**
 * Botón flotante de WhatsApp. Aparece después de bajar un poco
 * para no competir con el CTA del hero.
 */
export default function WhatsappFab({
  whatsappNumber,
}: {
  whatsappNumber: string
}) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const msg = 'Hola! Vengo desde tu sitio web y quiero agendar un masaje.'

  return (
    <a
      href={whatsappLink(whatsappNumber, msg)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Reservar por WhatsApp"
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-terra text-cream pl-4 pr-5 py-3.5 rounded-full shadow-lift
        hover:bg-terra-dark transition-all duration-300 ${
          show
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
    >
      <MessageCircle size={20} />
      <span className="text-sm font-500 hidden sm:inline">Reservar</span>
    </a>
  )
}
