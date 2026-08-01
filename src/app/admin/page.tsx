import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import AdminTabs from '@/components/admin/AdminTabs'
import { signOut } from './actions'
import { LogOut, ExternalLink } from 'lucide-react'
import type {
  City,
  Service,
  ServiceAvailability,
  SiteSetting,
  Post,
} from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

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
      .order('published_at', { ascending: false }),
  ])

  return (
    <div className="min-h-screen bg-sand">
      <header className="border-b border-ink/10 bg-cream">
        <div className="container-tight py-4 flex items-center justify-between">
          <h1 className="font-display text-xl text-ink">Panel · Masajes Tomás</h1>
          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              className="flex items-center gap-1.5 text-sm text-clay hover:text-ink"
            >
              <ExternalLink size={15} /> Ver sitio
            </a>
            <form action={signOut}>
              <button className="flex items-center gap-1.5 text-sm text-clay hover:text-ink">
                <LogOut size={15} /> Salir
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="container-tight py-8">
        <AdminTabs
          cities={(cities as City[]) ?? []}
          services={(services as Service[]) ?? []}
          availability={(availability as ServiceAvailability[]) ?? []}
          settings={(settings as SiteSetting[]) ?? []}
          posts={(posts as Post[]) ?? []}
        />
      </div>
    </div>
  )
}
