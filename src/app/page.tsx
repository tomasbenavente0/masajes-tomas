import { createClient } from '@/lib/supabase-server'
import PublicNav from '@/components/PublicNav'
import ServicesSection from '@/components/ServicesSection'
import AvailabilitySection from '@/components/AvailabilitySection'
import ComingSoon from '@/components/ComingSoon'
import { whatsappLink, parseBenefits } from '@/lib/utils'
import { MapPin, MessageCircle, Sparkles, HeartPulse, Moon, Activity } from 'lucide-react'
import type { City, Service, ServiceAvailability, AvailabilitySlot, SiteSetting } from '@/lib/types'

export const revalidate = 60 // refresca datos cada 60s

function settingsMap(settings: SiteSetting[]): Record<string, string> {
  const m: Record<string, string> = {}
  for (const s of settings) m[s.key] = s.value ?? ''
  return m
}

export default async function HomePage() {
  const supabase = createClient()

  const [
    { data: cities },
    { data: services },
    { data: availability },
    { data: slots },
    { data: settings },
    { data: { user } },
  ] = await Promise.all([
    supabase.from('cities').select('*').order('display_order'),
    supabase.from('services').select('*').order('display_order'),
    supabase.from('service_availability').select('*'),
    supabase.from('availability_slots').select('*').gte('slot_date', new Date().toISOString().slice(0, 10)),
    supabase.from('site_settings').select('*'),
    supabase.auth.getUser(),
  ])

  const cfg = settingsMap((settings as SiteSetting[]) ?? [])
  const whatsapp = cfg.whatsapp_number || '56900000000'
  const businessName = cfg.business_name || 'Masajes Tomás'
  const isPublished = cfg.site_published === 'true'

  // Si el sitio no está publicado y quien mira no está autenticado (no eres tú),
  // se muestra la página "próximamente".
  if (!isPublished && !user) {
    return (
      <ComingSoon
        businessName={businessName}
        title={cfg.coming_soon_title || 'Muy pronto'}
        text={
          cfg.coming_soon_text ||
          'Estamos preparando algo especial para tu bienestar.'
        }
        whatsappNumber={whatsapp}
      />
    )
  }

  const heroMsg = 'Hola! Vengo desde tu sitio web y quiero agendar un masaje.'

  const benefitCards = [
    { icon: HeartPulse, title: 'Alivia el estrés', text: 'Reduce cortisol y tensión acumulada, dejándote en calma.' },
    { icon: Activity, title: 'Libera músculos', text: 'Deshace contracturas y mejora tu rango de movimiento.' },
    { icon: Moon, title: 'Mejora el sueño', text: 'Un cuerpo relajado descansa mejor y se recupera más rápido.' },
    { icon: Sparkles, title: 'Renueva energía', text: 'Activa la circulación y te devuelve la vitalidad.' },
  ]

  return (
    <main id="top">
      {!isPublished && user && (
        <div className="bg-amber-100 text-amber-900 text-sm text-center py-2 px-4">
          Modo privado: el público ve la página “próximamente”. Publica el sitio
          desde el panel cuando estés listo.
        </div>
      )}
      <PublicNav businessName={businessName} />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="container-tight py-24 md:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-cream border border-ink/10 rounded-full px-4 py-1.5 mb-6">
              <MapPin size={15} className="text-sage" />
              <span className="text-sm text-clay">Concepción y Parral</span>
            </div>
            <h1 className="font-display text-5xl md:text-7xl leading-[1.05] text-ink mb-6">
              {cfg.hero_title || 'Bienestar y relajación a tu alcance'}
            </h1>
            <p className="text-lg md:text-xl text-clay mb-10 max-w-2xl">
              {cfg.hero_subtitle ||
                'Masajes terapéuticos profesionales, en tu hogar o en mi local.'}
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#servicios"
                className="bg-ink text-cream px-7 py-3.5 rounded-xl font-500 hover:bg-ink/90 transition-colors"
              >
                Ver servicios
              </a>
              <a
                href={whatsappLink(whatsapp, heroMsg)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-cream border border-ink/10 text-ink px-7 py-3.5 rounded-xl font-500 hover:border-sage transition-colors"
              >
                <MessageCircle size={18} className="text-sage" />
                Escribir por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICIOS */}
      <ServicesSection
        cities={(cities as City[]) ?? []}
        services={(services as Service[]) ?? []}
        availability={(availability as ServiceAvailability[]) ?? []}
        whatsappNumber={whatsapp}
      />

      {/* BENEFICIOS */}
      <section id="beneficios" className="py-20 bg-sand">
        <div className="container-tight">
          <p className="text-sm uppercase tracking-widest text-sage font-500 mb-3">
            Por qué un masaje
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-ink mb-12 max-w-2xl">
            Beneficios que sientes desde la primera sesión
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefitCards.map((b) => (
              <div
                key={b.title}
                className="bg-cream rounded-2xl p-6 border border-ink/5"
              >
                <div className="w-11 h-11 rounded-xl bg-sage/15 flex items-center justify-center mb-4">
                  <b.icon size={22} className="text-sage-dark" />
                </div>
                <h3 className="font-display text-lg text-ink mb-2">
                  {b.title}
                </h3>
                <p className="text-sm text-clay">{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOBRE MÍ */}
      <section className="py-20 bg-cream">
        <div className="container-tight grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-sm uppercase tracking-widest text-sage font-500 mb-3">
              Sobre mí
            </p>
            <h2 className="font-display text-4xl text-ink mb-6">
              Cuidado profesional y cercano
            </h2>
            <p className="text-clay leading-relaxed">
              {cfg.about_text ||
                'Con años de experiencia, ofrezco masajes personalizados que combinan técnica y cuidado para tu bienestar físico y mental.'}
            </p>
          </div>
          <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-sage-light/40 to-sage/30" />
        </div>
      </section>

      {/* DISPONIBILIDAD */}
      <AvailabilitySection
        cities={(cities as City[]) ?? []}
        slots={(slots as AvailabilitySlot[]) ?? []}
        whatsappNumber={whatsapp}
      />

      {/* CONTACTO / FOOTER */}
      <footer id="contacto" className="bg-ink text-cream py-16">
        <div className="container-tight">
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <h2 className="font-display text-3xl mb-4">{businessName}</h2>
              <p className="text-cream/70 max-w-md mb-6">
                Reserva tu sesión por WhatsApp. Atención en Concepción y Parral,
                en local o a domicilio.
              </p>
              <a
                href={whatsappLink(whatsapp, heroMsg)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-sage text-cream px-6 py-3 rounded-xl font-500 hover:bg-sage-dark transition-colors"
              >
                <MessageCircle size={18} />
                Escribir por WhatsApp
              </a>
            </div>
            <div className="md:text-right">
              {cfg.email && (
                <p className="text-cream/70 mb-2">{cfg.email}</p>
              )}
              {cfg.instagram_url && (
                <a
                  href={cfg.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cream/70 hover:text-cream"
                >
                  Instagram
                </a>
              )}
            </div>
          </div>
          <div className="border-t border-cream/10 mt-12 pt-6 text-sm text-cream/50">
            © {new Date().getFullYear()} {businessName}. Todos los derechos
            reservados.
          </div>
        </div>
      </footer>
    </main>
  )
}
