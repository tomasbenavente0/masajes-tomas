import { createClient } from '@/lib/supabase-server'
import PublicNav from '@/components/PublicNav'
import ServicesSection from '@/components/ServicesSection'
import BookingSection from '@/components/BookingSection'
import BlogSection from '@/components/BlogSection'
import Reveal from '@/components/Reveal'
import WhatsappFab from '@/components/WhatsappFab'
import { whatsappLink } from '@/lib/utils'
import {
  MapPin,
  MessageCircle,
  Sparkles,
  Home,
  Clock,
  Instagram,
  Mail,
} from 'lucide-react'
import type {
  City,
  Service,
  ServiceAvailability,
  SiteSetting,
  Post,
} from '@/lib/types'

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
    { data: settings },
    { data: posts },
  ] = await Promise.all([
    supabase.from('cities').select('*').order('display_order'),
    supabase.from('services').select('*').order('display_order'),
    supabase.from('service_availability').select('*'),
    supabase.from('site_settings').select('*'),
    supabase
      .from('posts')
      .select('*')
      .eq('is_published', true)
      .order('published_at', { ascending: false })
      .limit(3),
  ])

  const cfg = settingsMap((settings as SiteSetting[]) ?? [])
  const whatsapp = cfg.whatsapp_number || '56900000000'
  const businessName = cfg.business_name || 'Masajes Tomás'
  const heroImage = cfg.hero_image_url || ''
  const aboutImage = cfg.about_image_url || ''

  const activeCities = ((cities as City[]) ?? []).filter((c) => c.is_active)
  const cityNames = activeCities.map((c) => c.name).join(' y ')

  const heroMsg = 'Hola! Vengo desde tu sitio web y quiero agendar un masaje.'

  return (
    <main id="top" className="overflow-x-hidden">
      <PublicNav businessName={businessName} whatsappNumber={whatsapp} />

      {/* ---------------- HERO ---------------- */}
      <section className="relative -mt-[73px] pt-[73px] overflow-hidden">
        {/* Fondo cálido con manchas orgánicas */}
        <div className="absolute inset-0 bg-gradient-to-b from-terra-soft via-sand to-sand" />
        <div className="blob w-[38rem] h-[38rem] bg-terra/20 -top-40 -right-32 animate-float" />
        <div
          className="blob w-[26rem] h-[26rem] bg-honey/25 top-52 -left-24 animate-float"
          style={{ animationDelay: '2s' }}
        />
        <div
          className="blob w-[20rem] h-[20rem] bg-sage/20 bottom-0 right-1/4 animate-float"
          style={{ animationDelay: '4s' }}
        />

        <div className="container-tight relative py-20 md:py-28">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-14 items-center">
            {/* Texto */}
            <div className="animate-fade-up">
              <div className="inline-flex items-center gap-2 bg-cream/80 backdrop-blur border border-terra/20 rounded-full px-4 py-1.5 mb-7 shadow-soft">
                <MapPin size={15} className="text-terra" />
                <span className="text-sm text-ink/80">
                  {cityNames || 'Concepción y Parral'}
                </span>
              </div>

              <h1 className="font-display text-[2.75rem] leading-[1.05] sm:text-6xl md:text-7xl text-ink mb-6">
                {cfg.hero_title || 'Bienestar y relajación a tu alcance'}
              </h1>

              <p className="text-lg md:text-xl text-clay mb-10 max-w-xl leading-relaxed">
                {cfg.hero_subtitle ||
                  'Masajes terapéuticos profesionales, en tu hogar o en mi local.'}
              </p>

              <div className="flex flex-wrap gap-4 mb-12">
                <a
                  href={whatsappLink(whatsapp, heroMsg)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  <MessageCircle size={18} />
                  Reservar por WhatsApp
                </a>
                <a href="#servicios" className="btn-ghost">
                  Ver servicios
                </a>
              </div>

              {/* Fila de confianza */}
              <div className="flex flex-wrap gap-x-8 gap-y-4">
                {[
                  { icon: Home, label: 'En local o a domicilio' },
                  { icon: Clock, label: 'Sesiones de 60 a 75 min' },
                  { icon: Sparkles, label: 'Atención personalizada' },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-2.5 text-sm text-clay"
                  >
                    <span className="w-8 h-8 rounded-full bg-cream border border-ink/5 flex items-center justify-center shrink-0">
                      <item.icon size={15} className="text-terra" />
                    </span>
                    {item.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Imagen / composición visual */}
            <div className="animate-fade-up delay-2 relative">
              <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-lift">
                {heroImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={heroImage}
                    alt={`Masaje profesional en ${cityNames || 'Concepción'}`}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-terra-light via-honey to-sage-light">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles size={64} className="text-cream/60" />
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent" />
              </div>

              {/* Tarjeta flotante */}
              <div className="absolute -bottom-6 -left-4 sm:-left-8 bg-cream rounded-3xl shadow-lift px-6 py-5 border border-ink/5 max-w-[15rem]">
                <p className="font-display text-3xl text-terra leading-none mb-1">
                  {services?.length ?? 0}
                </p>
                <p className="text-sm text-clay leading-snug">
                  masajes distintos para elegir según lo que tu cuerpo necesita
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Curva orgánica de transición */}
        <div className="relative">
          <svg
            viewBox="0 0 1440 80"
            preserveAspectRatio="none"
            className="w-full h-12 md:h-20 block"
            aria-hidden="true"
          >
            <path
              d="M0,80 C240,10 480,10 720,42 C960,74 1200,74 1440,20 L1440,80 Z"
              fill="#FDFAF6"
            />
          </svg>
        </div>
      </section>

      {/* ---------------- SERVICIOS ---------------- */}
      <ServicesSection
        cities={(cities as City[]) ?? []}
        services={(services as Service[]) ?? []}
        availability={(availability as ServiceAvailability[]) ?? []}
        whatsappNumber={whatsapp}
      />

      {/* ---------------- BLOG ---------------- */}
      <BlogSection posts={(posts as Post[]) ?? []} />

      {/* ---------------- SOBRE MÍ ---------------- */}
      <section className="py-24 bg-cream">
        <div className="container-tight grid md:grid-cols-2 gap-14 items-center">
          <Reveal className="order-2 md:order-1">
            <p className="eyebrow mb-4">
              <span className="w-6 h-px bg-terra" />
              Sobre mí
            </p>
            <h2 className="font-display text-4xl md:text-5xl text-ink mb-6 leading-tight">
              Cuidado profesional y cercano
            </h2>
            <p className="text-clay leading-relaxed text-lg mb-8">
              {cfg.about_text ||
                'Con años de experiencia, ofrezco masajes personalizados que combinan técnica y cuidado para tu bienestar físico y mental.'}
            </p>
            <a
              href={whatsappLink(
                whatsapp,
                'Hola! Quiero hacerte una consulta sobre tus masajes.'
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              <MessageCircle size={18} />
              Conversemos
            </a>
          </Reveal>

          <Reveal delay={120} className="order-1 md:order-2">
            <div className="relative">
              <div className="absolute -top-5 -right-5 w-28 h-28 rounded-full bg-honey/30 blur-2xl" />
              <div className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-lift">
                {aboutImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={aboutImage}
                    alt={businessName}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-sage-light via-terra-soft to-honey/60" />
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------- AGENDA (Cal.com) ---------------- */}
      <BookingSection
        bookingUrl={cfg.booking_url || ''}
        whatsappNumber={whatsapp}
      />

      {/* ---------------- CONTACTO / FOOTER ---------------- */}
      <footer id="contacto" className="relative bg-ink text-cream overflow-hidden">
        <div className="blob w-[32rem] h-[32rem] bg-terra/25 -top-40 -right-32" />
        <div className="container-tight relative py-20">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="font-display text-4xl md:text-5xl mb-5 leading-tight">
                ¿Listo para relajarte?
              </h2>
              <p className="text-cream/70 max-w-md mb-8 leading-relaxed">
                Escríbeme por WhatsApp y coordinamos tu sesión. Atención en{' '}
                {cityNames || 'Concepción y Parral'}, en local o a domicilio.
              </p>
              <a
                href={whatsappLink(whatsapp, heroMsg)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-terra text-cream px-7 py-3.5 rounded-full font-500 hover:bg-terra-dark transition-colors shadow-lift"
              >
                <MessageCircle size={18} />
                Escribir por WhatsApp
              </a>
            </div>

            <div className="md:text-right space-y-4">
              <p className="font-display text-2xl">{businessName}</p>
              {cfg.email && (
                <a
                  href={`mailto:${cfg.email}`}
                  className="flex md:justify-end items-center gap-2 text-cream/70 hover:text-cream transition-colors"
                >
                  <Mail size={16} />
                  {cfg.email}
                </a>
              )}
              {cfg.instagram_url && (
                <a
                  href={cfg.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex md:justify-end items-center gap-2 text-cream/70 hover:text-cream transition-colors"
                >
                  <Instagram size={16} />
                  Instagram
                </a>
              )}
            </div>
          </div>

          <div className="border-t border-cream/10 mt-14 pt-6 text-sm text-cream/50">
            © {new Date().getFullYear()} {businessName}. Todos los derechos
            reservados.
          </div>
        </div>
      </footer>

      <WhatsappFab whatsappNumber={whatsapp} />
    </main>
  )
}
