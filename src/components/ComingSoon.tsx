import { MessageCircle } from 'lucide-react'
import { whatsappLink } from '@/lib/utils'

export default function ComingSoon({
  businessName,
  title,
  text,
  whatsappNumber,
}: {
  businessName: string
  title: string
  text: string
  whatsappNumber: string
}) {
  const msg = 'Hola! Vi tu sitio y quiero saber más sobre tus masajes.'

  return (
    <main className="min-h-screen bg-sand flex flex-col items-center justify-center px-6 text-center">
      <div className="max-w-lg">
        <p className="text-sm uppercase tracking-widest text-sage font-500 mb-6">
          {businessName}
        </p>
        <h1 className="font-display text-5xl md:text-6xl text-ink mb-6 leading-tight">
          {title}
        </h1>
        <p className="text-lg text-clay mb-10">{text}</p>
        <a
          href={whatsappLink(whatsappNumber, msg)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-ink text-cream px-7 py-3.5 rounded-xl font-500 hover:bg-ink/90 transition-colors"
        >
          <MessageCircle size={18} className="text-sage-light" />
          Escríbeme por WhatsApp
        </a>
      </div>
      <div className="absolute bottom-8 text-xs text-clay/60">
        © {new Date().getFullYear()} {businessName}
      </div>
    </main>
  )
}
