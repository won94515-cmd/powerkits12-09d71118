ALTER TABLE public.discord_connections
  ADD COLUMN IF NOT EXISTS guild_icon text,
  ADD COLUMN IF NOT EXISTS bot_installed boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS channels_cache jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS channels_cached_at timestamp with time zone,
  ADD COLUMN IF NOT EXISTS selected_channel_name text;

CREATE UNIQUE INDEX IF NOT EXISTS discord_connections_user_id_key ON public.discord_connections(user_id);