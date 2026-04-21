import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getOAuthBootstrapUrl, getOAuthRedirectUrl, isOAuthProvider, type OAuthProvider } from "@/lib/oauth";
import { toast } from "sonner";
import { Zap, Mail, Github } from "lucide-react";

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [oauthLoadingProvider, setOauthLoadingProvider] = useState<OAuthProvider | null>(null);
  const [oauthBootstrapped, setOauthBootstrapped] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [businessName, setBusinessName] = useState("");

  useEffect(() => {
    if (!authLoading && user) {
      navigate("/dashboard", { replace: true });
    }
  }, [authLoading, navigate, user]);

  useEffect(() => {
    if (authLoading || user || oauthBootstrapped) return;

    const provider = searchParams.get("oauth_provider");
    if (!isOAuthProvider(provider)) return;

    setOauthBootstrapped(true);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete("oauth_provider");
      return next;
    }, { replace: true });

    void handleOAuth(provider);
  }, [authLoading, oauthBootstrapped, searchParams, setSearchParams, user]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      navigate("/dashboard", { replace: true });
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: {
          full_name: fullName,
          phone,
          business_name: businessName,
        },
      },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else if (data.user && data.user.identities && data.user.identities.length === 0) {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) {
        toast.error("Account already exists. Please sign in.");
      } else {
        navigate("/dashboard", { replace: true });
      }
    } else {
      toast.success("Account created successfully!");
      navigate("/dashboard", { replace: true });
    }
  };

  const handleOAuth = async (provider: OAuthProvider) => {
    const bootstrapUrl = getOAuthBootstrapUrl(provider);
    if (bootstrapUrl) {
      window.location.replace(bootstrapUrl);
      return;
    }

    setOauthLoadingProvider(provider);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: getOAuthRedirectUrl() },
    });
    setOauthLoadingProvider(null);
    if (error) toast.error(error.message);
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left branding panel */}
      <div className="hidden lg:flex flex-col justify-between w-[480px] bg-secondary text-secondary-foreground p-10">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Zap className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">powerKits</span>
        </div>
        <div className="space-y-4">
          <h1 className="text-3xl font-bold leading-tight">
            The all-in-one platform for fitness studio growth.
          </h1>
          <p className="text-secondary-foreground/70 text-sm leading-relaxed">
            Manage your brand, content calendar, community retention, and analytics — all from a single dashboard built for European fitness studios.
          </p>
        </div>
        <p className="text-xs text-secondary-foreground/40">© 2026 powerKits. All rights reserved.</p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-[400px]">
          {/* Mobile logo */}
          <div className="flex items-center justify-center gap-2 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Zap className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">powerKits</span>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground">Welcome back</h2>
            <p className="text-sm text-muted-foreground mt-1">Sign in to your studio dashboard</p>
          </div>

          <Card className="border-border shadow-sm">
            <Tabs defaultValue="signin">
              <div className="px-5 pt-5">
                <TabsList className="grid w-full grid-cols-2 h-10">
                  <TabsTrigger value="signin" className="text-sm">Sign In</TabsTrigger>
                  <TabsTrigger value="signup" className="text-sm">Sign Up</TabsTrigger>
                </TabsList>
              </div>

              <CardContent className="p-5 space-y-4">
                {/* OAuth */}
                <div className="grid grid-cols-2 gap-2.5">
                  <Button variant="outline" onClick={() => handleOAuth("google")} type="button" className="w-full h-10 text-sm" disabled={loading || oauthLoadingProvider !== null}>
                    <Mail className="w-4 h-4 mr-2" />
                    {oauthLoadingProvider === "google" ? "Opening…" : "Google"}
                  </Button>
                  <Button variant="outline" onClick={() => handleOAuth("github")} type="button" className="w-full h-10 text-sm" disabled={loading || oauthLoadingProvider !== null}>
                    <Github className="w-4 h-4 mr-2" />
                    {oauthLoadingProvider === "github" ? "Opening…" : "GitHub"}
                  </Button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">or continue with email</span>
                  </div>
                </div>

                {/* Sign In */}
                <TabsContent value="signin" className="mt-0 space-y-3">
                  <form onSubmit={handleSignIn} className="space-y-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="signin-email" className="text-sm">Email</Label>
                      <Input id="signin-email" type="email" placeholder="you@studio.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-10" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="signin-password" className="text-sm">Password</Label>
                      <Input id="signin-password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required className="h-10" />
                    </div>
                    <Button type="submit" className="w-full h-10" disabled={loading}>
                      {loading ? "Signing in…" : "Sign In"}
                    </Button>
                  </form>
                </TabsContent>

                {/* Sign Up */}
                <TabsContent value="signup" className="mt-0 space-y-3">
                  <form onSubmit={handleSignUp} className="space-y-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="signup-name" className="text-sm">Full Name</Label>
                      <Input id="signup-name" placeholder="Jane Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} required className="h-10" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="signup-business" className="text-sm">Studio / Business Name</Label>
                      <Input id="signup-business" placeholder="FitStudio Berlin" value={businessName} onChange={(e) => setBusinessName(e.target.value)} className="h-10" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="signup-phone" className="text-sm">Phone</Label>
                      <Input id="signup-phone" type="tel" placeholder="+49 170 1234567" value={phone} onChange={(e) => setPhone(e.target.value)} className="h-10" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="signup-email" className="text-sm">Email</Label>
                      <Input id="signup-email" type="email" placeholder="you@studio.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-10" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="signup-password" className="text-sm">Password</Label>
                      <Input id="signup-password" type="password" placeholder="Min 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="h-10" />
                    </div>
                    <Button type="submit" className="w-full h-10" disabled={loading}>
                      {loading ? "Creating account…" : "Create Account"}
                    </Button>
                  </form>
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>

          <p className="text-center text-xs text-muted-foreground mt-5">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
