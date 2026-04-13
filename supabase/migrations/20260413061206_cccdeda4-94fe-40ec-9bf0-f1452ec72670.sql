-- CRITICAL: Remove INSERT and UPDATE policies from subscriptions table
-- Users should NOT be able to create or modify their own subscription records
-- This must be done server-side via webhooks/edge functions with service role
DROP POLICY IF EXISTS "Users can insert own subscription" ON public.subscriptions;
DROP POLICY IF EXISTS "Users can update own subscription" ON public.subscriptions;

-- Add DELETE policy for profiles (GDPR data deletion rights)
CREATE POLICY "Users can delete their own profile"
ON public.profiles
FOR DELETE
USING (auth.uid() = user_id);