-- ============================================================
-- ESQUEMA DE BASE DE DATOS - Página de Masajes Tomás
-- ============================================================
-- Ejecuta este script completo en Supabase → SQL Editor
-- Cubre: ciudades, servicios, precios, promociones, agenda,
-- disponibilidad por ciudad y por modalidad (local/domicilio)
-- ============================================================

-- ----------------------------------------------------------
-- 1. CIUDADES (Concepción y Parral)
-- ----------------------------------------------------------
CREATE TABLE cities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  -- Si estás actualmente trabajando en esta ciudad
  is_active BOOLEAN DEFAULT false,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO cities (name, slug, is_active, display_order) VALUES
('Concepción', 'concepcion', true, 1),
('Parral', 'parral', false, 2);

-- ----------------------------------------------------------
-- 2. SERVICIOS (masajes)
-- ----------------------------------------------------------
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  description TEXT,
  -- Beneficios del masaje (lista separada, se muestra en el sitio)
  benefits TEXT,
  duration_minutes INT NOT NULL DEFAULT 60,
  price INT NOT NULL, -- en pesos chilenos, sin decimales
  -- Precio con descuento (si hay promoción activa). NULL = sin promo
  promo_price INT,
  promo_label VARCHAR(100), -- ej: "20% off", "Precio lanzamiento"
  image_url VARCHAR(500),
  -- Si el servicio está visible en el sitio
  is_active BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------
-- 3. DISPONIBILIDAD DE SERVICIO POR CIUDAD Y MODALIDAD
-- ----------------------------------------------------------
-- Permite: "este servicio lo ofrezco en Concepción a domicilio,
-- pero en Parral solo en local"
CREATE TABLE service_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  city_id UUID REFERENCES cities(id) ON DELETE CASCADE,
  -- modalidad: 'local' (en tu espacio) o 'domicilio' (vas al cliente)
  modality VARCHAR(20) NOT NULL CHECK (modality IN ('local', 'domicilio')),
  -- Recargo opcional para domicilio (ej: +5000 por traslado)
  surcharge INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  UNIQUE(service_id, city_id, modality)
);

-- ----------------------------------------------------------
-- 4. AGENDA / DISPONIBILIDAD HORARIA
-- ----------------------------------------------------------
-- Bloques de tiempo que marcas como disponibles.
-- Cada bloque pertenece a una ciudad y modalidad.
CREATE TABLE availability_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city_id UUID REFERENCES cities(id) ON DELETE CASCADE,
  modality VARCHAR(20) NOT NULL CHECK (modality IN ('local', 'domicilio')),
  -- Fecha y hora del bloque disponible
  slot_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  -- Estado: 'disponible', 'reservado', 'bloqueado'
  status VARCHAR(20) DEFAULT 'disponible' CHECK (status IN ('disponible', 'reservado', 'bloqueado')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_slots_date ON availability_slots(slot_date, city_id, modality);

-- ----------------------------------------------------------
-- 5. CONFIGURACIÓN DEL SITIO (textos, contacto, WhatsApp)
-- ----------------------------------------------------------
CREATE TABLE site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(100) NOT NULL UNIQUE,
  value TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO site_settings (key, value) VALUES
('whatsapp_number', '56900000000'),
('business_name', 'Masajes Tomás'),
('hero_title', 'Bienestar y relajación a tu alcance'),
('hero_subtitle', 'Masajes terapéuticos profesionales en Concepción y Parral'),
-- URL de la foto de portada. Vacío = se muestra un degradado.
('hero_image_url', ''),
('about_text', 'Con años de experiencia, ofrezco masajes personalizados que combinan técnica y cuidado para tu bienestar físico y mental.'),
('about_image_url', ''),
-- Link de reservas online (Cal.com). Vacío = el bloque no aparece en el sitio.
('booking_url', ''),
('instagram_url', ''),
('email', 'contacto@masajestomas.cl');

-- ----------------------------------------------------------
-- 6. DATOS DE EJEMPLO (servicios iniciales)
-- ----------------------------------------------------------
INSERT INTO services (name, description, benefits, duration_minutes, price, display_order) VALUES
('Masaje Relajante', 'Masaje suave de cuerpo completo para liberar tensión y estrés acumulado.', 'Reduce el estrés|Mejora el sueño|Alivia tensión muscular|Aumenta la sensación de bienestar', 60, 25000, 1),
('Masaje Descontracturante', 'Masaje de presión profunda enfocado en zonas con contracturas y dolor muscular.', 'Libera contracturas|Mejora la movilidad|Alivia dolor de espalda|Reduce inflamación muscular', 60, 30000, 2),
('Masaje Deportivo', 'Ideal antes o después del ejercicio, mejora el rendimiento y la recuperación.', 'Acelera recuperación|Previene lesiones|Mejora flexibilidad|Optimiza rendimiento', 75, 35000, 3);

-- Disponibilidad de ejemplo: todos activos en Concepción, local y domicilio
INSERT INTO service_availability (service_id, city_id, modality, surcharge)
SELECT s.id, c.id, 'local', 0
FROM services s CROSS JOIN cities c WHERE c.slug = 'concepcion';

INSERT INTO service_availability (service_id, city_id, modality, surcharge)
SELECT s.id, c.id, 'domicilio', 5000
FROM services s CROSS JOIN cities c WHERE c.slug = 'concepcion';

-- ----------------------------------------------------------
-- 7. ROW LEVEL SECURITY (RLS)
-- ----------------------------------------------------------
-- El público solo puede LEER datos activos.
-- Las modificaciones requieren estar autenticado (tú, el admin).

ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Lectura pública
CREATE POLICY "Public read cities" ON cities FOR SELECT USING (true);
CREATE POLICY "Public read services" ON services FOR SELECT USING (true);
CREATE POLICY "Public read availability" ON service_availability FOR SELECT USING (true);
CREATE POLICY "Public read slots" ON availability_slots FOR SELECT USING (true);
CREATE POLICY "Public read settings" ON site_settings FOR SELECT USING (true);

-- Escritura solo para usuarios autenticados (admin)
CREATE POLICY "Auth write cities" ON cities FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write services" ON services FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write availability" ON service_availability FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write slots" ON availability_slots FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write settings" ON site_settings FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================
-- FIN DEL ESQUEMA
-- ============================================================
