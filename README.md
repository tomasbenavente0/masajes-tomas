# Masajes Tomás

Sitio web y panel de administración para un servicio de masoterapia en
Concepción y Parral, Chile.

Las reservas se cierran por **WhatsApp** o por **Cal.com** (reserva online
sincronizada con Google Calendar). No hay pasarela de pago.

- **Sitio público:** https://masajes-tomas.vercel.app
- **Panel admin:** https://masajes-tomas.vercel.app/admin/login
- **Reserva online:** https://cal.com/masajes-tomas

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Next.js 14 (App Router) |
| Base de datos / Auth | Supabase (proyecto `masaje-tomas`, ref `tchmyqksguktwnygaiid`) |
| Hosting | Vercel (team `tomas-vercel`, proyecto `masajes-tomas`) |
| Estilos | Tailwind CSS |

Cada push a `main` dispara un deploy a producción en Vercel.

## Correr en local

Requiere Node 20+ (producción usa 24.x).

```bash
npm install
npm run dev
```

Necesitas un `.env.local` con:

```
NEXT_PUBLIC_SUPABASE_URL=https://tchmyqksguktwnygaiid.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key del proyecto>
```

La anon key se saca de Supabase → Project Settings → API. Está protegida por
Row Level Security: el público solo puede leer, y escribir requiere sesión.

## Estructura

```
src/app/page.tsx          Home (hero, servicios, agenda, blog, contacto)
src/app/blog/             Índice del blog y página de artículo
src/app/sitemap.ts        Sitemap dinámico (incluye los artículos)
src/app/robots.ts         robots.txt (bloquea /admin)
src/app/admin/            Panel: page.tsx + actions.ts (server actions)
src/app/admin/login/      Login con Supabase Auth
src/middleware.ts         Protege /admin/* y redirige a /admin/login
src/components/           Secciones públicas + Reveal, WhatsappFab, Markdown
src/components/admin/     Pestañas del panel
src/lib/                  Clientes de Supabase, tipos y utilidades
supabase-schema.sql       Esquema completo (6 tablas + RLS)
```

## Agenda

La agenda **vive en Cal.com**, no en la base de datos. Ahí se define la
disponibilidad una sola vez (horario semanal recurrente) y las reservas
llegan al Google Calendar de Tomás con confirmación automática.

El sitio incrusta el calendario en la sección Agenda leyendo
`site_settings.booking_url`. La tabla `availability_slots` quedó sin uso.

## Base de datos

Seis tablas: `cities`, `services`, `service_availability`, `site_settings`,
`posts` y `availability_slots` (esta última en desuso).

`site_settings` es un diccionario clave/valor que controla el contenido del
sitio sin tocar código. Claves que se usan:

| Clave | Para qué sirve |
|---|---|
| `business_name` | Nombre en el nav y el footer |
| `whatsapp_number` | Destino de todos los botones de reserva (formato `569XXXXXXXX`, sin `+`) |
| `hero_title` / `hero_subtitle` | Textos de la portada |
| `hero_image_url` | Foto de portada. Vacío = degradado |
| `about_text` / `about_image_url` | Sección "sobre mí" |
| `booking_url` | Link de Cal.com. Vacío = el bloque de reserva online no aparece |
| `email` / `instagram_url` | Contacto en el footer |

Todo esto se edita desde **panel admin → Ajustes**.

## Blog y SEO

Los artículos se administran en **panel admin → Blog** (crear, editar,
publicar/despublicar y eliminar). El cuerpo se escribe en Markdown liviano:
`##` y `###` para títulos, `- ` para viñetas y `**texto**` para negrita. Lo
renderiza `src/components/Markdown.tsx`, que parsea a elementos de React —
sin `dangerouslySetInnerHTML`, así el contenido no puede inyectar HTML.

Cada artículo tiene `meta_title` y `meta_description` propios; si quedan
vacíos se usan el título y el resumen. Además el sitio genera:

- Etiquetas OpenGraph y Twitter Card por artículo
- Datos estructurados `BlogPosting` (JSON-LD) para resultados enriquecidos
- URLs canónicas vía `metadataBase` en el layout
- `sitemap.xml` dinámico que incluye cada artículo publicado
- `robots.txt` que permite todo el sitio y bloquea `/admin`

## Notas de diseño

La paleta vive en `tailwind.config.ts`: terracota (`terra`) como color
principal, arena y crema de fondo, oliva (`sage`) como secundario — este
último también lo usa el panel admin.

Ojo con los pesos de fuente: el markup usa `font-500` / `font-600`, que no
son utilidades estándar de Tailwind. Están definidas a mano en
`tailwind.config.ts`; si se borran, los textos pierden el peso en silencio.

## Pendientes conocidos

- No hay fotos reales cargadas (`hero_image_url` y `about_image_url` vacíos).
- `availability_slots` está vacía, así que la lista de horarios propios
  muestra el mensaje de "escríbeme y coordinamos". La reserva online de
  Cal.com sí funciona.
- Los eventos de Cal.com están como "En persona (dirección del asistente)".
  Si se quiere ofrecer atención en local, hay que agregar esa ubicación con
  la dirección real.
