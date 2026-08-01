export function formatCLP(amount: number): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('es-CL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

export function formatTime(timeStr: string): string {
  // "14:00:00" -> "14:00"
  return timeStr.slice(0, 5)
}

/** "2026-07-29T12:00:00Z" -> "29 de julio de 2026" */
export function formatPostDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-CL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/** Convierte un título en un slug apto para URL. */
export function slugify(text: string): string {
  return text
    .normalize('NFD') // separa la letra de su tilde para poder borrarla
    .replace(/[̀-ͯ]/g, '') // saca tildes
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 200)
}

export function whatsappLink(number: string, message: string): string {
  const clean = number.replace(/\D/g, '')
  return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`
}

export function parseBenefits(benefits: string | null): string[] {
  if (!benefits) return []
  return benefits.split('|').map((b) => b.trim()).filter(Boolean)
}
