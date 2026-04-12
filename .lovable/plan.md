

# powerKits - Full Build Plan

This is a large application. To build it properly and avoid overwhelming complexity, I'll break it into phases. Here's the complete plan.

---

## What You Need to Provide

Before or during implementation, I'll need these credentials set up:

| Service | What I Need | Where to Get It |
|---------|------------|-----------------|
| **Supabase** | Will use Lovable Cloud (built-in) | No action needed - I'll enable it |
| **Stripe** | Secret Key (test mode) | Stripe Dashboard > Developers > API Keys |
| **Airtable** | API Key + Base ID + Table ID | Airtable > Account > Developer Hub |
| **Discord** | Bot Token + Bot Application ID | Discord Developer Portal > Bot section |
| **AI** | Will use Lovable AI (built-in) | No action needed |

---

## Phase 1: Foundation & Auth

1. **Design system** - Update CSS variables to match your brand colors (#0062FF primary, #1B263B secondary, #00897B tertiary, #607D8B neutral), Inter font
2. **App layout** - Sidebar navigation with all 9 pages, responsive
3. **Auth pages** - Sign up (email+password, Google, Microsoft, GitHub), Sign in, email verification flow
4. **Supabase setup** - Enable Lovable Cloud, create profiles table, configure auth providers
5. **Airtable sync** - Edge function to sync new signups (name, email, phone) to Airtable on registration

## Phase 2: Dashboard & Branding

6. **Dashboard page** - Quick-start wizard, engagement summary cards, upcoming tasks list, activity feed, links to all sections
7. **Branding & Customization page** - Logo upload, color palette picker, typography selector, brand voice settings, live preview of posts/reels
8. **Branding data storage** - Supabase tables for brand settings per studio

## Phase 3: Plans & Stripe

9. **Enable Stripe** - Connect Stripe integration
10. **Plan & Billing page** - Three tiers (Basic €50, Pro €99, Pro Max €119), annual toggle with discounts (10% Pro, 30% Pro Max), checkout flow
11. **Subscription management** - Upgrade/downgrade, billing history

## Phase 4: Retention Kit & Discord

12. **Discord integration** - Edge function: accept invite link, fetch server channels via Discord API, return channel list
13. **Retention Kit page** - Invite link input, channel dropdown selector, welcome message composer using branding data
14. **Send-to-Discord** - Global "send to Discord" action across all pages that posts content to selected channel

## Phase 5: Content & AI

15. **Content Calendar page** - Weekly view with pre-made posts, 1 reel, 2 challenges; drag-and-drop scheduling
16. **AI content engine** - Edge function using Lovable AI to generate/customize post captions, with toggle to skip AI
17. **Publishing** - One-click publish to Discord channel with AI-modified content
18. **Personal AI Assistant** - Sidebar chat assistant using Lovable AI

## Phase 6: Content Library & SEO

19. **SEO toolkit** - Keyword suggestions for fitness studios, caption optimizer, audit view
20. **Ebooks & Pamphlets library** - Browsable library with download, customizable metadata, send-to-Discord option
21. **Branding Assets & Media Library** - Template gallery for posts/reels/stories, upload capability

## Phase 7: Analytics & Support

22. **Analytics page** - Engagement metrics, content performance charts, channel health, date/channel filters, recommendations
23. **Help & Support page** - Onboarding tours, FAQs, best-practice guides, community channel

---

## Database Tables (Supabase)

- `profiles` - User profile data
- `brand_settings` - Logo, colors, typography, voice per studio
- `content_items` - Posts, reels, challenges with schedule
- `content_calendar` - Weekly content assignments
- `discord_connections` - Server ID, channel ID, invite link per studio
- `ebooks` - Library of ebooks/pamphlets
- `media_assets` - Uploaded brand assets
- `analytics_events` - Engagement tracking
- `subscriptions` - Plan status (synced with Stripe)

---

## Technical Approach

- All API keys referenced via environment variables (works on Vercel deployment)
- Discord, Airtable, Stripe calls go through Supabase Edge Functions (server-side, secrets never exposed)
- AI powered by Lovable AI gateway (already available)
- Auth via Supabase with Google, Microsoft, GitHub providers
- Real-time data via Supabase subscriptions on dashboard

---

## Recommended Build Order

I suggest starting with **Phase 1** (foundation, auth, design system) since everything else depends on it. Shall I proceed?

