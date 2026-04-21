export type OAuthProvider = "google" | "github";

const PUBLISHED_APP_ORIGIN = "https://powerkits12.lovable.app";

const isPreviewOrigin = (origin: string) =>
  origin.includes("lovableproject.com") || origin.includes("id-preview--");

export const getOAuthRedirectUrl = () => new URL("/auth", window.location.origin).toString();

export const getOAuthBootstrapUrl = (provider: OAuthProvider) => {
  if (!isPreviewOrigin(window.location.origin)) return null;

  const url = new URL("/auth", PUBLISHED_APP_ORIGIN);
  url.searchParams.set("oauth_provider", provider);

  return url.toString();
};

export const isOAuthProvider = (value: string | null): value is OAuthProvider =>
  value === "google" || value === "github";