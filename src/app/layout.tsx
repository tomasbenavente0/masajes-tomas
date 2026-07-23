import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Masajes Tomás | Bienestar en Concepción y Parral',
  description:
    'Masajes terapéuticos profesionales en Concepción y Parral. Relajante, descontracturante y deportivo. A domicilio o en local. Reserva por WhatsApp.',
  openGraph: {
    title: 'Masajes Tomás',
    description: 'Masajes terapéuticos profesionales en Concepción y Parral.',
    type: 'website',
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
