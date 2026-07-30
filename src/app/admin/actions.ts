'use server'

import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

async function requireAuth() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('No autorizado')
  return supabase
}

function refresh() {
  revalidatePath('/admin')
  revalidatePath('/')
}

// ---------- SERVICIOS ----------
export async function saveService(formData: FormData) {
  const supabase = await requireAuth()
  const id = formData.get('id') as string | null

  const promoPriceRaw = formData.get('promo_price') as string
  const payload = {
    name: formData.get('name') as string,
    description: (formData.get('description') as string) || null,
    benefits: (formData.get('benefits') as string) || null,
    duration_minutes: parseInt(formData.get('duration_minutes') as string) || 60,
    price: parseInt(formData.get('price') as string) || 0,
    promo_price: promoPriceRaw ? parseInt(promoPriceRaw) : null,
    promo_label: (formData.get('promo_label') as string) || null,
    image_url: (formData.get('image_url') as string) || null,
    is_active: formData.get('is_active') === 'on',
    display_order: parseInt(formData.get('display_order') as string) || 0,
    updated_at: new Date().toISOString(),
  }

  if (id) {
    await supabase.from('services').update(payload).eq('id', id)
  } else {
    await supabase.from('services').insert(payload)
  }
  refresh()
}

export async function deleteService(formData: FormData) {
  const supabase = await requireAuth()
  const id = formData.get('id') as string
  await supabase.from('services').delete().eq('id', id)
  refresh()
}

// ---------- DISPONIBILIDAD SERVICIO x CIUDAD x MODALIDAD ----------
export async function toggleServiceAvailability(formData: FormData) {
  const supabase = await requireAuth()
  const serviceId = formData.get('service_id') as string
  const cityId = formData.get('city_id') as string
  const modality = formData.get('modality') as string
  const enable = formData.get('enable') === 'true'
  const surcharge = parseInt(formData.get('surcharge') as string) || 0

  const { data: existing } = await supabase
    .from('service_availability')
    .select('id')
    .eq('service_id', serviceId)
    .eq('city_id', cityId)
    .eq('modality', modality)
    .maybeSingle()

  if (existing) {
    await supabase
      .from('service_availability')
      .update({ is_active: enable, surcharge })
      .eq('id', existing.id)
  } else {
    await supabase.from('service_availability').insert({
      service_id: serviceId,
      city_id: cityId,
      modality,
      surcharge,
      is_active: enable,
    })
  }
  refresh()
}

// ---------- CIUDADES ----------
export async function toggleCity(formData: FormData) {
  const supabase = await requireAuth()
  const id = formData.get('id') as string
  const active = formData.get('active') === 'true'
  await supabase.from('cities').update({ is_active: active }).eq('id', id)
  refresh()
}

// ---------- AGENDA / SLOTS ----------
export async function addSlot(formData: FormData) {
  const supabase = await requireAuth()
  await supabase.from('availability_slots').insert({
    city_id: formData.get('city_id') as string,
    modality: formData.get('modality') as string,
    slot_date: formData.get('slot_date') as string,
    start_time: formData.get('start_time') as string,
    end_time: formData.get('end_time') as string,
    status: 'disponible',
  })
  refresh()
}

export async function deleteSlot(formData: FormData) {
  const supabase = await requireAuth()
  const id = formData.get('id') as string
  await supabase.from('availability_slots').delete().eq('id', id)
  refresh()
}

export async function updateSlotStatus(formData: FormData) {
  const supabase = await requireAuth()
  const id = formData.get('id') as string
  const status = formData.get('status') as string
  await supabase.from('availability_slots').update({ status }).eq('id', id)
  refresh()
}

// ---------- CONFIGURACIÓN DEL SITIO ----------
export async function saveSettings(formData: FormData) {
  const supabase = await requireAuth()
  const keys = [
    'business_name',
    'whatsapp_number',
    'coming_soon_title',
    'coming_soon_text',
    'hero_title',
    'hero_subtitle',
    'about_text',
    'email',
    'instagram_url',
  ]
  for (const key of keys) {
    const value = formData.get(key) as string
    await supabase
      .from('site_settings')
      .upsert({ key, value }, { onConflict: 'key' })
  }
  refresh()
}

// ---------- LOGOUT ----------
export async function signOut() {
  const supabase = createClient()
  await supabase.auth.signOut()
  revalidatePath('/admin')
}
