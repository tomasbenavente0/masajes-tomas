# 🚀 Guía de despliegue — Masajes Tomás

Sigue estos pasos en orden. Tiempo estimado: ~25 minutos.

Las partes donde ingresas contraseñas (crear cuentas, poner tu clave) las haces
**tú directamente** — yo no puedo hacerlas por seguridad.

---

## 1. Supabase (base de datos + tu login)

1. Entra a [supabase.com](https://supabase.com) y crea una cuenta o inicia sesión.
2. Haz clic en **New project**.
   - Name: `masajes-tomas`
   - Database password: **crea una contraseña segura y guárdala** (distinta a la de tu login de admin).
   - Region: elige **South America (São Paulo)** por cercanía.
3. Espera ~2 minutos a que se cree.

### 1.1 Crear las tablas
1. En el menú lateral, ve a **SQL Editor** → **New query**.
2. Abre el archivo `supabase-schema.sql` de este proyecto, copia **todo** su contenido.
3. Pégalo en el editor y haz clic en **Run**.
4. Verifica en **Table Editor** que aparezcan las tablas: `cities`, `services`,
   `service_availability`, `availability_slots`, `site_settings`.

### 1.2 Crear tu usuario de administrador
1. Ve a **Authentication** → **Users** → **Add user** → **Create new user**.
2. Ingresa:
   - Email: el correo con el que quieres entrar al panel (ej. tu correo real).
   - Password: **la contraseña que tú elijas** (te recomiendo una robusta, no `tomas1234`).
   - Marca **Auto Confirm User** para no tener que confirmar por correo.
3. Guarda. Con ese correo y contraseña entrarás a `/admin`.

> Nota: en la app, el login usa **correo + contraseña**. El "usuario tomas" que
> mencionaste sería tu correo. Si prefieres un correo tipo `tomas@masajestomas.cl`,
> úsalo aquí.

### 1.3 Copiar credenciales
1. Ve a **Project Settings** (engranaje) → **API**.
2. Copia estos dos valores, los necesitas en el paso 3:
   - **Project URL**
   - **anon public** (en "Project API keys")

---

## 2. GitHub (guardar el código)

1. Entra a [github.com/new](https://github.com/new).
2. Repository name: `masajes-tomas`
3. Déjalo en **Private** si no quieres que sea público.
4. **No** marques "Add a README".
5. Clic en **Create repository**.
6. En tu computador, dentro de la carpeta del proyecto, ejecuta:

```bash
git init
git add .
git commit -m "Sitio Masajes Tomás"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/masajes-tomas.git
git push -u origin main
```

(Reemplaza `TU_USUARIO` por tu usuario de GitHub.)

---

## 3. Vercel (publicar el sitio)

1. Entra a [vercel.com/new](https://vercel.com/new) e inicia sesión con GitHub.
2. Importa el repositorio `masajes-tomas`.
3. Antes de desplegar, abre **Environment Variables** y agrega las dos:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | (tu Project URL del paso 1.3) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | (tu anon public del paso 1.3) |

4. Clic en **Deploy**. En ~2 minutos tendrás tu sitio en vivo.
5. Tu sitio quedará en una URL como `https://masajes-tomas.vercel.app`.

---

## 4. Primeros pasos en tu sitio

1. Entra a `https://tu-sitio.vercel.app/admin/login`.
2. Ingresa con el correo y contraseña que creaste en el paso 1.2.
3. Desde el panel puedes:
   - **Servicios**: agregar, editar, eliminar, cambiar precios y promociones.
   - **Cobertura**: marcar en qué ciudad y modalidad (local/domicilio) ofreces cada servicio, con recargo de traslado opcional.
   - **Agenda**: publicar tus horarios disponibles por ciudad y modalidad.
   - **Ciudades**: activar Concepción o Parral según dónde estés.
   - **Ajustes**: cambiar tu número de WhatsApp, textos del sitio, correo e Instagram.

4. **Importante**: ve a **Ajustes** y pon tu número real de WhatsApp
   (formato `56912345678`, sin `+` ni espacios). Todos los botones de reserva
   abren un chat de WhatsApp contigo con un mensaje ya escrito.

---

## Cómo funciona cada requerimiento que pediste

- **Servicios editables** → pestaña Servicios (crear/editar/eliminar/precios).
- **Promociones como descuento** → en cada servicio, campo "Precio promo" + etiqueta (ej. "20% off"). El sitio muestra el precio tachado y el nuevo.
- **Dos ciudades** → pestaña Ciudades. Activas la que corresponda; al desactivar una, sus servicios y horarios desaparecen del sitio.
- **Servicios por ciudad** → pestaña Cobertura. Cada servicio puede estar activo en una ciudad y no en otra.
- **Local vs domicilio** → en Cobertura defines cada modalidad por separado, con recargo de traslado opcional para domicilio.
- **Agenda de disponibilidad** → pestaña Agenda. El cliente ve solo los bloques que marcas como "disponible", filtrados por ciudad y modalidad. Si elige domicilio, ve la disponibilidad de domicilio.
- **Reserva por WhatsApp** → cada servicio y cada horario tiene un botón que abre WhatsApp contigo con el detalle escrito.

---

## Actualizar el sitio después

Cada vez que cambies algo en el código:

```bash
git add .
git commit -m "descripción del cambio"
git push
```

Vercel se actualiza solo. Los cambios de **contenido** (servicios, precios,
agenda) NO requieren esto — los haces desde el panel `/admin` y se reflejan al
instante.

---

## Seguridad

- Usa una contraseña robusta y única para el usuario admin de Supabase.
- La base de datos tiene Row Level Security: el público solo puede **leer**;
  solo tú (autenticado) puedes modificar.
- Nunca compartas tu archivo `.env.local` ni subas credenciales a GitHub
  (el `.gitignore` ya lo evita).
