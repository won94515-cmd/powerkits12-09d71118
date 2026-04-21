// Discord OAuth Client ID is a PUBLIC identifier (safe in frontend, like a Google OAuth client ID).
// The Client SECRET and BOT TOKEN are stored as Supabase edge-function secrets only.
export const DISCORD_CLIENT_ID = "1491132759886794952";

// Bot install + identify scopes. `bot` + `applications.commands` triggers the
// bot install flow which returns the chosen guild in the OAuth response.
export const DISCORD_OAUTH_SCOPES = "bot applications.commands identify";

// Permissions integer for the bot:
// VIEW_CHANNEL (1024) + SEND_MESSAGES (2048) + EMBED_LINKS (16384)
// + READ_MESSAGE_HISTORY (65536) + MANAGE_MESSAGES (8192)
//   = 93184
export const DISCORD_BOT_PERMISSIONS = "93184";

export const buildDiscordOAuthUrl = (redirectUri: string) => {
  const u = new URL("https://discord.com/api/oauth2/authorize");
  u.searchParams.set("client_id", DISCORD_CLIENT_ID);
  u.searchParams.set("permissions", DISCORD_BOT_PERMISSIONS);
  u.searchParams.set("scope", DISCORD_OAUTH_SCOPES);
  u.searchParams.set("response_type", "code");
  u.searchParams.set("redirect_uri", redirectUri);
  return u.toString();
};
