import type { Metadata } from 'next'
import './globals.css'

const SITE_URL = 'https://masajes-tomas.vercel.app'

export const metadata: Metadata = {
  // Base para que las URLs canónicas y de OpenGraph salgan absolutas
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Masajes Tomás | Bienestar en Concepción y Parral',
    template: '%s | Masajes Tomás',
  },
  description:
    'Masajes terapéuticos profesionales en Concepción y Parral. Relajante, descontracturante y deportivo. A domicilio o en local. Reserva online o por WhatsApp.',
  keywords: [
    'masajes Concepción',
    'masajes Parral',
    'masaje descontracturante',
    'masaje relajante',
    'masaje deportivo',
    'masaje a domicilio',
    'masoterapia',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Masajes Tomás',
    description:
      'Masajes terapéuticos profesionales en Concepción y Parral. Reserva online o por WhatsApp.',
    type: 'website',
    locale: 'es_CL',
    siteName: 'Masajes Tomás',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
