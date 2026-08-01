import type { MetadataRoute } from 'next'

const SITE_URL = 'https://masajes-tomas.vercel.app'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // El panel no tiene por qué aparecer en buscadores
      disallow: ['/admin', '/admin/'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
