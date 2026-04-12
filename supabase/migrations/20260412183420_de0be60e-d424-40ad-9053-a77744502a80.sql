
-- brand_settings table
CREATE TABLE public.brand_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  logo_url TEXT,
  primary_color TEXT DEFAULT '#0062FF',
  secondary_color TEXT DEFAULT '#1B263B',
  accent_color TEXT DEFAULT '#00897B',
  font_heading TEXT DEFAULT 'Inter',
  font_body TEXT DEFAULT 'Inter',
  tagline TEXT,
  website_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);
ALTER TABLE public.brand_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own brand" ON public.brand_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own brand" ON public.brand_settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own brand" ON public.brand_settings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own brand" ON public.brand_settings FOR DELETE USING (auth.uid() = user_id);
CREATE TRIGGER update_brand_settings_updated_at BEFORE UPDATE ON public.brand_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- content_items table
CREATE TABLE public.content_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  type TEXT NOT NULL DEFAULT 'post',
  status TEXT NOT NULL DEFAULT 'draft',
  scheduled_at TIMESTAMPTZ,
  platform TEXT DEFAULT 'instagram',
  ai_generated BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.content_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own content" ON public.content_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own content" ON public.content_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own content" ON public.content_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own content" ON public.content_items FOR DELETE USING (auth.uid() = user_id);
CREATE TRIGGER update_content_items_updated_at BEFORE UPDATE ON public.content_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- content_calendar table
CREATE TABLE public.content_calendar (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  content_item_id UUID REFERENCES public.content_items(id) ON DELETE CASCADE,
  calendar_date DATE NOT NULL,
  time_slot TEXT,
  day_of_week INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.content_calendar ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own calendar" ON public.content_calendar FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own calendar" ON public.content_calendar FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own calendar" ON public.content_calendar FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own calendar" ON public.content_calendar FOR DELETE USING (auth.uid() = user_id);
CREATE TRIGGER update_content_calendar_updated_at BEFORE UPDATE ON public.content_calendar FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- discord_connections table
CREATE TABLE public.discord_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  server_id TEXT,
  server_name TEXT,
  invite_link TEXT,
  welcome_channel_id TEXT,
  welcome_message TEXT DEFAULT 'Welcome to our community! 🎉',
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.discord_connections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own discord" ON public.discord_connections FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own discord" ON public.discord_connections FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own discord" ON public.discord_connections FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own discord" ON public.discord_connections FOR DELETE USING (auth.uid() = user_id);
CREATE TRIGGER update_discord_connections_updated_at BEFORE UPDATE ON public.discord_connections FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ebooks table
CREATE TABLE public.ebooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  cover_url TEXT,
  file_url TEXT,
  category TEXT DEFAULT 'general',
  pages_count INTEGER DEFAULT 0,
  download_count INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.ebooks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own ebooks" ON public.ebooks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own ebooks" ON public.ebooks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own ebooks" ON public.ebooks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own ebooks" ON public.ebooks FOR DELETE USING (auth.uid() = user_id);
CREATE TRIGGER update_ebooks_updated_at BEFORE UPDATE ON public.ebooks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- media_assets table
CREATE TABLE public.media_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT,
  file_size BIGINT DEFAULT 0,
  folder TEXT DEFAULT 'general',
  tags TEXT[] DEFAULT '{}',
  alt_text TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own media" ON public.media_assets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own media" ON public.media_assets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own media" ON public.media_assets FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own media" ON public.media_assets FOR DELETE USING (auth.uid() = user_id);
CREATE TRIGGER update_media_assets_updated_at BEFORE UPDATE ON public.media_assets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- analytics_events table
CREATE TABLE public.analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  page TEXT,
  referrer TEXT,
  device_type TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own analytics" ON public.analytics_events FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own analytics" ON public.analytics_events FOR INSERT WITH CHECK (auth.uid() = user_id);

-- subscriptions table
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  plan_tier TEXT NOT NULL DEFAULT 'free',
  status TEXT NOT NULL DEFAULT 'inactive',
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own subscription" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own subscription" ON public.subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own subscription" ON public.subscriptions FOR UPDATE USING (auth.uid() = user_id);
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('logos', 'logos', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('ebooks', 'ebooks', false) ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Logo images are public" ON storage.objects FOR SELECT USING (bucket_id = 'logos');
CREATE POLICY "Users can upload logos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'logos' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can update logos" ON storage.objects FOR UPDATE USING (bucket_id = 'logos' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete logos" ON storage.objects FOR DELETE USING (bucket_id = 'logos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Media files are public" ON storage.objects FOR SELECT USING (bucket_id = 'media');
CREATE POLICY "Users can upload media" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'media' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can update media" ON storage.objects FOR UPDATE USING (bucket_id = 'media' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete media" ON storage.objects FOR DELETE USING (bucket_id = 'media' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view own ebook files" ON storage.objects FOR SELECT USING (bucket_id = 'ebooks' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can upload ebook files" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'ebooks' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can update ebook files" ON storage.objects FOR UPDATE USING (bucket_id = 'ebooks' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete ebook files" ON storage.objects FOR DELETE USING (bucket_id = 'ebooks' AND auth.uid()::text = (storage.foldername(name))[1]);
