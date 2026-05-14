
CREATE TABLE public.gmail_connections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  email TEXT NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  token_expires_at TIMESTAMPTZ NOT NULL,
  scope TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.gmail_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own gmail connection" ON public.gmail_connections
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own gmail connection" ON public.gmail_connections
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own gmail connection" ON public.gmail_connections
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own gmail connection" ON public.gmail_connections
  FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_gmail_connections_updated_at
  BEFORE UPDATE ON public.gmail_connections
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.email_send_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  from_email TEXT NOT NULL,
  to_emails TEXT[] NOT NULL,
  cc_emails TEXT[],
  bcc_emails TEXT[],
  subject TEXT NOT NULL,
  body_preview TEXT,
  is_html BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'sent',
  gmail_message_id TEXT,
  error_message TEXT,
  content_item_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.email_send_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own email logs" ON public.email_send_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE INDEX idx_email_send_logs_user_created ON public.email_send_logs(user_id, created_at DESC);
