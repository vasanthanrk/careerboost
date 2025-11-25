import { DashboardLayout } from './DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Check, Sparkles, Zap, Crown } from 'lucide-react';
import { toast } from 'sonner';
import { SEO } from './SEO';

export function PricingPlans() {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for getting started',
      icon: Sparkles,
      iconColor: 'text-gray-600',
      bgColor: 'bg-gray-50',
      buttonVariant: 'outline' as const,
      buttonText: 'Current Plan',
      features: [
        '3 AI resume generations per month',
        'Basic resume templates',
        '1 cover letter per month',
        'Job fit analysis (5 per month)',
        'LinkedIn profile review',
        'Basic portfolio builder',
        'Community support'
      ]
    },
    {
      name: 'Pro',
      price: '$19',
      period: 'per month',
      description: 'For serious job seekers',
      icon: Zap,
      iconColor: 'text-violet-600',
      bgColor: 'bg-violet-50',
      buttonVariant: 'default' as const,
      buttonText: 'Upgrade to Pro',
      popular: true,
      features: [
        'Unlimited AI resume generations',
        'Premium resume templates',
        'Unlimited cover letters',
        'Unlimited job fit analysis',
        'Advanced LinkedIn optimization',
        'Pro portfolio themes',
        'Custom domain support',
        'Priority email support',
        'Resume download in multiple formats',
        'AI-powered interview prep'
      ]
    },
  ];

  const handleUpgrade = (planName: string) => {
    if (planName === 'Free') {
      toast.info('You are currently on the Free plan');
    } else {
      toast.success(`Redirecting to checkout for ${planName} plan...`);
    }
  };

  return (
    <DashboardLayout>
      <SEO
        title="Pricing Plans"
        description="Choose the perfect plan for your career journey. Free and Pro options available."
      />
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="mb-4">Choose Your Plan</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Unlock the full potential of AI-powered career tools. Upgrade anytime, cancel anytime.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative ${plan.popular ? 'border-violet-600 border-2 shadow-xl' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-violet-600 hover:bg-violet-600 px-4 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader>
                <div className={`w-12 h-12 rounded-lg ${plan.bgColor} flex items-center justify-center mb-4`}>
                  <plan.icon className={`w-6 h-6 ${plan.iconColor}`} />
                </div>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="pt-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-gray-900">{plan.price}</span>
                    <span className="text-gray-600">/{plan.period}</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <Button
                  variant={plan.buttonVariant}
                  className={`w-full ${plan.buttonVariant === 'default' ? 'bg-violet-600 hover:bg-violet-700' : ''}`}
                  onClick={() => handleUpgrade(plan.name)}
                >
                  {plan.buttonText}
                </Button>

                <div className="space-y-3">
                  <p className="text-gray-900">Features included:</p>
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-violet-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Feature Comparison Table */}
        <Card>
          <CardHeader>
            <CardTitle>Detailed Feature Comparison</CardTitle>
            <CardDescription>See exactly what's included in each plan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-4 px-4">Feature</th>
                    <th className="text-center py-4 px-4">Free</th>
                    <th className="text-center py-4 px-4">Pro</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-4 px-4 text-gray-700">AI Resume Generations</td>
                    <td className="text-center py-4 px-4">3/month</td>
                    <td className="text-center py-4 px-4">Unlimited</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-4 text-gray-700">Resume Templates</td>
                    <td className="text-center py-4 px-4">Basic</td>
                    <td className="text-center py-4 px-4">Premium</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-4 text-gray-700">Cover Letter Generation</td>
                    <td className="text-center py-4 px-4">1/month</td>
                    <td className="text-center py-4 px-4">Unlimited</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-4 text-gray-700">Job Fit Analysis</td>
                    <td className="text-center py-4 px-4">5/month</td>
                    <td className="text-center py-4 px-4">Unlimited</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-4 text-gray-700">Portfolio Builder</td>
                    <td className="text-center py-4 px-4"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                    <td className="text-center py-4 px-4"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-4 text-gray-700">Custom Domain</td>
                    <td className="text-center py-4 px-4">-</td>
                    <td className="text-center py-4 px-4"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 text-gray-700">Support</td>
                    <td className="text-center py-4 px-4">Community</td>
                    <td className="text-center py-4 px-4">Priority Email</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* FAQ */}
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h4 className="text-gray-900 mb-2">Can I cancel anytime?</h4>
                <p className="text-gray-600">
                  Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.
                </p>
              </div>
              <div>
                <h4 className="text-gray-900 mb-2">What payment methods do you accept?</h4>
                <p className="text-gray-600">
                  We accept all major credit cards, PayPal, and offer annual billing for additional savings.
                </p>
              </div>
              <div>
                <h4 className="text-gray-900 mb-2">Is there a free trial for paid plans?</h4>
                <p className="text-gray-600">
                  Yes! All paid plans come with a 7-day free trial. No credit card required to start.
                </p>
              </div>
              <div>
                <h4 className="text-gray-900 mb-2">Can I upgrade or downgrade my plan?</h4>
                <p className="text-gray-600">
                  Absolutely! You can change your plan at any time. Upgrades are prorated, and you'll get credit for unused time when downgrading.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <Card className="bg-gradient-to-r from-violet-600 to-purple-600 text-white border-violet-600">
          <CardContent className="py-8 text-center">
            <h2 className="text-white mb-4">Still have questions?</h2>
            <p className="text-violet-100 mb-6 max-w-2xl mx-auto">
              Our team is here to help you choose the right plan for your career goals
            </p>
            <Button size="lg" variant="secondary">
              Contact Sales
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
