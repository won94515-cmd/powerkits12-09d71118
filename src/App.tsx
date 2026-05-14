import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { BrandingProvider } from "@/contexts/BrandingContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AppLayout from "@/components/layout/AppLayout";
import Auth from "@/pages/Auth";
import ResetPassword from "@/pages/ResetPassword";
import Dashboard from "@/pages/Dashboard";
import Branding from "@/pages/Branding";
import Plans from "@/pages/Plans";
import RetentionKit from "@/pages/RetentionKit";
import ContentCalendar from "@/pages/ContentCalendar";
import SEO from "@/pages/SEO";
import Ebooks from "@/pages/Ebooks";
import MediaLibrary from "@/pages/MediaLibrary";
import Analytics from "@/pages/Analytics";
import Help from "@/pages/Help";
import NotFound from "@/pages/NotFound";
import DiscordCallback from "@/pages/DiscordCallback";
import GmailCallback from "@/pages/GmailCallback";
import Campaigns from "@/pages/Campaigns";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <BrandingProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/discord/callback" element={<DiscordCallback />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/branding" element={<Branding />} />
              <Route path="/plans" element={<Plans />} />
              <Route path="/retention-kit" element={<RetentionKit />} />
              <Route path="/content-calendar" element={<ContentCalendar />} />
              <Route path="/seo" element={<SEO />} />
              <Route path="/ebooks" element={<Ebooks />} />
              <Route path="/media-library" element={<MediaLibrary />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/help" element={<Help />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
      </BrandingProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
