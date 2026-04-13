import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Check, Zap, Star, Crown, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const plans = [
  {
    id: "basic", name: "Basic", icon: Zap, monthlyPrice: 50, annualPrice: 50, annualDiscount: 0,
    description: "Perfect for getting started",
    features: ["Brand customization", "Content calendar (basic)", "5 pre-made posts/week", "1 ebook download/month", "Email support"],
    notIncluded: ["AI content generation", "Discord integration", "SEO toolkit", "Analytics dashboard", "Priority support"],
    popular: false,
  },
  {
    id: "pro", name: "Pro", icon: Star, monthlyPrice: 99, annualPrice: 89.10, annualDiscount: 10,
    description: "For growing studios",
    features: ["Everything in Basic", "AI content generation", "Discord integration", "10 pre-made posts/week", "SEO toolkit", "5 ebook downloads/month", "Analytics dashboard", "Email + chat support"],
    notIncluded: ["Unlimited ebooks", "White-label branding", "Priority support"],
    popular: true,
  },
  {
    id: "promax", name: "Pro Max", icon: Crown, monthlyPrice: 119, annualPrice: 83.30, annualDiscount: 30,
    description: "Ultimate studio toolkit",
    features: ["Everything in Pro", "Unlimited ebook downloads", "White-label branding", "Custom AI assistant", "Advanced analytics", "Media library access", "Priority support", "Dedicated onboarding"],
    notIncluded: [],
    popular: false,
  },
];

const Plans = () => {
  const [annual, setAnnual] = useState(false);

  const handleSubscribe = (planId: string) => {
    toast.info("Stripe checkout will be connected in the next phase. Plan: " + planId);
  };

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-foreground">Plans & Billing</h1>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Choose the right plan for your studio. All plans include a 14-day free trial.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Label className={`text-sm ${!annual ? "font-semibold" : "text-muted-foreground"}`}>Monthly</Label>
          <Switch checked={annual} onCheckedChange={setAnnual} />
          <Label className={`text-sm ${annual ? "font-semibold" : "text-muted-foreground"}`}>
            Annual
            <Badge variant="secondary" className="ml-2 text-[10px]">Save up to 30%</Badge>
          </Label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((plan) => {
          const price = annual ? plan.annualPrice : plan.monthlyPrice;
          return (
            <Card
              key={plan.id}
              className={`relative flex flex-col border-border/60 shadow-sm ${
                plan.popular ? "border-primary shadow-md ring-1 ring-primary" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground px-3 text-xs">Most Popular</Badge>
                </div>
              )}
              <CardHeader className="text-center pb-2">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-2">
                  <plan.icon className="w-5 h-5 text-primary" />
                </div>
                <CardTitle className="text-lg">{plan.name}</CardTitle>
                <CardDescription className="text-xs">{plan.description}</CardDescription>
                <div className="pt-2">
                  <span className="text-3xl font-bold">€{price.toFixed(0)}</span>
                  <span className="text-muted-foreground text-sm">/mo</span>
                  {annual && plan.annualDiscount > 0 && (
                    <div className="mt-1">
                      <Badge variant="outline" className="text-[10px] text-success border-success">Save {plan.annualDiscount}%</Badge>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <ul className="space-y-2 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="w-3.5 h-3.5 text-success shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={() => handleSubscribe(plan.id)}
                  className={`w-full mt-5 gap-1.5 ${plan.popular ? "" : ""}`}
                  variant={plan.popular ? "default" : "outline"}
                  size="sm"
                >
                  Get Started <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-muted/30 border-border/60 shadow-sm">
        <CardContent className="p-5 text-center">
          <p className="text-xs text-muted-foreground">
            All plans include a 14-day free trial. No credit card required to start. Cancel anytime.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Plans;
