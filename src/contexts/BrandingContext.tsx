import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";

export interface BrandSettings {
  logo_url: string | null;
  primary_color: string | null;
  secondary_color: string | null;
  accent_color: string | null;
  font_heading: string | null;
  font_body: string | null;
  tagline: string | null;
  website_url: string | null;
  brand_voice: string | null;
  branding_enabled: boolean;
  studio_name: string | null;
}

interface BrandingContextValue {
  brand: BrandSettings | null;
  loading: boolean;
  reload: () => Promise<void>;
}

const BrandingContext = createContext<BrandingContextValue>({
  brand: null,
  loading: true,
  reload: async () => {},
});

export const useBranding = () => useContext(BrandingContext);

// Branding settings are stored and made available to content generation
// (ebooks, pamphlets, AI content) but DO NOT alter the powerKits app UI itself.
// The app keeps its own consistent "Architect Ledger" design system.
const applyBrandToDocument = (_brand: BrandSettings | null) => {
  // Intentionally a no-op: the studio's brand colors/fonts must not override
  // the platform UI. They are only used inside generated assets and previews.
  return;
};

export const BrandingProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [brand, setBrand] = useState<BrandSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) {
      setBrand(null);
      applyBrandToDocument(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    const [{ data: bs }, { data: profile }] = await Promise.all([
      supabase.from("brand_settings").select("*").eq("user_id", user.id).maybeSingle(),
      supabase.from("profiles").select("business_name").eq("user_id", user.id).maybeSingle(),
    ]);

    const next: BrandSettings = {
      logo_url: bs?.logo_url ?? null,
      primary_color: bs?.primary_color ?? null,
      secondary_color: bs?.secondary_color ?? null,
      accent_color: bs?.accent_color ?? null,
      font_heading: bs?.font_heading ?? null,
      font_body: bs?.font_body ?? null,
      tagline: bs?.tagline ?? null,
      website_url: bs?.website_url ?? null,
      brand_voice: (bs as any)?.brand_voice ?? "motivational",
      branding_enabled: (bs as any)?.branding_enabled ?? true,
      studio_name: profile?.business_name ?? null,
    };
    setBrand(next);
    applyBrandToDocument(next);
    setLoading(false);
  }, [user]);

  useEffect(() => { load(); }, [load]);

  return (
    <BrandingContext.Provider value={{ brand, loading, reload: load }}>
      {children}
    </BrandingContext.Provider>
  );
};
