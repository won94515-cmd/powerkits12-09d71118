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

// hex (#rrggbb) -> "h s% l%"
const hexToHsl = (hex: string): string | null => {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return null;
  const int = parseInt(m[1], 16);
  const r = ((int >> 16) & 255) / 255;
  const g = ((int >> 8) & 255) / 255;
  const b = (int & 255) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h *= 60;
  }
  return `${Math.round(h)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
};

const FONT_LINK_ID = "brand-google-font";
const ensureFontLoaded = (fonts: string[]) => {
  const families = Array.from(new Set(fonts.filter(Boolean)))
    .map(f => `family=${encodeURIComponent(f)}:wght@300;400;500;600;700;800`)
    .join("&");
  if (!families) return;
  const href = `https://fonts.googleapis.com/css2?${families}&display=swap`;
  let link = document.getElementById(FONT_LINK_ID) as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement("link");
    link.id = FONT_LINK_ID;
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }
  if (link.href !== href) link.href = href;
};

const STYLE_TAG_ID = "brand-overrides";
const applyBrandToDocument = (brand: BrandSettings | null) => {
  const root = document.documentElement;
  let style = document.getElementById(STYLE_TAG_ID) as HTMLStyleElement | null;
  if (!style) {
    style = document.createElement("style");
    style.id = STYLE_TAG_ID;
    document.head.appendChild(style);
  }

  if (!brand || !brand.branding_enabled) {
    style.textContent = "";
    root.style.removeProperty("--brand-heading");
    root.style.removeProperty("--brand-body");
    document.body.style.removeProperty("font-family");
    return;
  }

  const primary = brand.primary_color ? hexToHsl(brand.primary_color) : null;
  const secondary = brand.secondary_color ? hexToHsl(brand.secondary_color) : null;
  const accent = brand.accent_color ? hexToHsl(brand.accent_color) : null;

  const declarations: string[] = [];
  if (primary) {
    declarations.push(`--primary: ${primary};`);
    declarations.push(`--ring: ${primary};`);
    declarations.push(`--sidebar-primary-foreground: ${primary};`);
  }
  if (secondary) declarations.push(`--secondary: ${secondary};`);
  if (accent) declarations.push(`--tertiary: ${accent};`);

  style.textContent = `:root { ${declarations.join(" ")} }`;

  const heading = brand.font_heading || "Inter";
  const body = brand.font_body || "Inter";
  ensureFontLoaded([heading, body]);
  root.style.setProperty("--brand-heading", `'${heading}', system-ui, sans-serif`);
  root.style.setProperty("--brand-body", `'${body}', system-ui, sans-serif`);
  document.body.style.fontFamily = `'${body}', system-ui, sans-serif`;
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
