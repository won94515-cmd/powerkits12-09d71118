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
    id: "basic",
    name: "Basic",
    icon: Zap,
    monthlyPrice: 50,
    annualPrice: 50,
    annualDiscount: 0,
    description: "Perfect for getting started",
    features: [
      "Brand customization",
      "Content calendar (basic)",
      "5 pre-made posts/week",
      "1 ebook download/month",
      "Email support",
    ],
    notIncluded: [
      "AI content generation",
      "Discord integration",
      "SEO toolkit",
      "Analytics dashboard",
      "Priority support",
    ],
    popular: false,
  },
  {
    id: "pro",
    name: "Pro",
    icon: Star,
    monthlyPrice: 99,
    annualPrice: 89.10,
    annualDiscount: 10,
    description: "For growing studios",
    features: [
      "Everything in Basic",
      "AI content generation",
      "Discord integration",
      "10 pre-made posts/week",
      "SEO toolkit",
      "5 ebook downloads/month",
      "Analytics dashboard",
      "Email + chat support",
    ],
    notIncluded: [
      "Unlimited ebooks",
      "White-label branding",
      "Priority support",
    ],
    popular: true,
  },
  {
    id: "promax",
    name: "Pro Max",
    icon: Crown,
    monthlyPrice: 119,
    annualPrice: 83.30,
    annualDiscount: 30,
    description: "Ultimate studio toolkit",
    features: [
      "Everything in Pro",
      "Unlimited ebook downloads",
      "White-label branding",
      "Custom AI assistant",
      "Advanced analytics",
      "Media library access",
      "Priority support",
      "Dedicated onboarding",
    ],
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
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-8">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-bold text-foreground">Plans & Billing</h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Choose the right plan for your studio. All plans include a 14-day free trial.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Label className={`text-sm ${!annual ? "font-semibold" : "text-muted-foreground"}`}>Monthly</Label>
          <Switch checked={annual} onCheckedChange={setAnnual} />
          <Label className={`text-sm ${annual ? "font-semibold" : "text-muted-foreground"}`}>
            Annual
            <Badge variant="secondary" className="ml-2 text-xs">Save up to 30%</Badge>
          </Label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const price = annual ? plan.annualPrice : plan.monthlyPrice;
          return (
            <Card
              key={plan.id}
              className={`relative flex flex-col ${
                plan.popular ? "border-primary shadow-lg ring-1 ring-primary" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground px-3">Most Popular</Badge>
                </div>
              )}
              <CardHeader className="text-center pb-2">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <plan.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="pt-3">
                  <span className="text-4xl font-bold">€{price.toFixed(0)}</span>
                  <span className="text-muted-foreground text-sm">/month</span>
                  {annual && plan.annualDiscount > 0 && (
                    <div className="mt-1">
                      <Badge variant="outline" className="text-xs text-success border-success">
                        Save {plan.annualDiscount}%
                      </Badge>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <ul className="space-y-2.5 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-success shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={() => handleSubscribe(plan.id)}
                  className={`w-full mt-6 gap-2 ${plan.popular ? "" : "variant-outline"}`}
                  variant={plan.popular ? "default" : "outline"}
                >
                  Get Started <ArrowRight className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-muted/30">
        <CardContent className="p-6 text-center">
          <p className="text-sm text-muted-foreground">
            All plans include a 14-day free trial. No credit card required to start. Cancel anytime.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Plans;
