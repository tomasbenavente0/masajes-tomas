'use server'

import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'
import { slugify } from '@/lib/utils'

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

// ---------- BLOG ----------
function refreshBlog(slug?: string) {
  revalidatePath('/admin')
  revalidatePath('/')
  revalidatePath('/blog')
  if (slug) revalidatePath(`/blog/${slug}`)
}

export async function savePost(formData: FormData) {
  const supabase = await requireAuth()
  const id = formData.get('id') as string | null

  const title = (formData.get('title') as string).trim()
  const rawSlug = (formData.get('slug') as string)?.trim()
  const slug = slugify(rawSlug || title)

  const payload = {
    title,
    slug,
    excerpt: (formData.get('excerpt') as string)?.trim() || null,
    content: (formData.get('content') as string) ?? '',
    cover_image_url: (formData.get('cover_image_url') as string)?.trim() || null,
    meta_title: (formData.get('meta_title') as string)?.trim() || null,
    meta_description:
      (formData.get('meta_description') as string)?.trim() || null,
    is_published: formData.get('is_published') === 'on',
    reading_minutes:
      parseInt(formData.get('reading_minutes') as string) || 3,
    updated_at: new Date().toISOString(),
  }

  if (id) {
    await supabase.from('posts').update(payload).eq('id', id)
  } else {
    await supabase.from('posts').insert(payload)
  }
  refreshBlog(slug)
}

export async function deletePost(formData: FormData) {
  const supabase = await requireAuth()
  const id = formData.get('id') as string
  const slug = formData.get('slug') as string
  await supabase.from('posts').delete().eq('id', id)
  refreshBlog(slug)
}

export async function togglePostPublished(formData: FormData) {
  const supabase = await requireAuth()
  const id = formData.get('id') as string
  const slug = formData.get('slug') as string
  const publish = formData.get('publish') === 'true'
  await supabase
    .from('posts')
    .update({ is_published: publish, updated_at: new Date().toISOString() })
    .eq('id', id)
  refreshBlog(slug)
}

// ---------- CONFIGURACIÓN DEL SITIO ----------
export async function saveSettings(formData: FormData) {
  const supabase = await requireAuth()
  const keys = [
    'business_name',
    'whatsapp_number',
    'hero_title',
    'hero_subtitle',
    'hero_image_url',
    'about_text',
    'about_image_url',
    'booking_url',
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
