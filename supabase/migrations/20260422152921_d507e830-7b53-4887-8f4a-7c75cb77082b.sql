ALTER TABLE public.brand_settings 
ADD COLUMN IF NOT EXISTS branding_enabled boolean NOT NULL DEFAULT true,
ADD COLUMN IF NOT EXISTS brand_voice text DEFAULT 'motivational';