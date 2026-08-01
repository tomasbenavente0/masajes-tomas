export type Modality = 'local' | 'domicilio'
export type SlotStatus = 'disponible' | 'reservado' | 'bloqueado'

export interface City {
  id: string
  name: string
  slug: string
  is_active: boolean
  display_order: number
  created_at: string
}

export interface Service {
  id: string
  name: string
  description: string | null
  benefits: string | null
  duration_minutes: number
  price: number
  promo_price: number | null
  promo_label: string | null
  image_url: string | null
  is_active: boolean
  display_order: number
  created_at: string
  updated_at: string
}

export interface ServiceAvailability {
  id: string
  service_id: string
  city_id: string
  modality: Modality
  surcharge: number
  is_active: boolean
}

export interface AvailabilitySlot {
  id: string
  city_id: string
  modality: Modality
  slot_date: string
  start_time: string
  end_time: string
  status: SlotStatus
  notes: string | null
  created_at: string
}

export interface Post {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  cover_image_url: string | null
  meta_title: string | null
  meta_description: string | null
  is_published: boolean
  published_at: string
  reading_minutes: number
  created_at: string
  updated_at: string
}

export interface SiteSetting {
  id: string
  key: string
  value: string | null
  updated_at: string
}
