import { useState, useEffect } from 'react';
import { DashboardLayout } from './DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Check, Sparkles, Zap, Crown } from 'lucide-react';
import { SEO } from './SEO';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { toast } from 'sonner@2.0.3';
import SubscribeButton from "../components/SubscribeButton";
import api from '../api/axiosClient';
import { Link } from 'react-router-dom';

export function PricingPlans() {
  const [currentPlanStatus, setCurrentPlanStatus] = useState({});
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [cancelInProcess, setCancelInProcess] = useState(false);

  const fetchStatus = async () => {
    try {
      const res = await api.get('/subscription/status');

      // Handle case where backend returns nested resume_data
      const data = res.data?.resume_data ? res.data.resume_data : res.data;
      setCurrentPlanStatus(data)

    } catch (err: any) {
      
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleCancelSubscription = async () => {
    try {
      setCancelInProcess(true);

      const res = await api.post("/subscription/cancel");
      setShowCancelPopup(false);
      if (res.data.message) {
        toast.success(res.data.message);

        fetchStatus();
      } else {
        toast.error("Cancellation failed");
      }
    } catch (error) {
      console.error(error);
      setShowCancelPopup(false);
      toast.error("Something went wrong while cancelling.");
    }
  };

  const user = JSON.parse(localStorage.getItem("user"));
  const plans = [
    {
      name: 'Free',
      price: '0 Rs',
      period: 'forever',
      description: 'Perfect for getting started',
      icon: Sparkles,
      iconColor: 'text-gray-600',
      bgColor: 'bg-gray-50',
      buttonVariant: 'free' as const,
      buttonText: 'Current Plan',
      features: [
        '3 AI resume generations',
        '3 Basic resume templates download',
        '3 Job fit analysis',
        '1 ATS Resume review',
        '1 cover letter generation',
      ]
    },
    {
      name: 'Pro',
      price: '199 Rs',
      period: 'Month',
      description: 'For serious job seekers',
      icon: Zap,
      iconColor: 'text-violet-600',
      bgColor: 'bg-violet-50',
      buttonVariant: 'pro' as const,
      buttonText: 'Upgrade to Pro',
      popular: true,
      features: [
        'Unlimited AI resume generations',
        'Premium resume templates download',
        'Unlimited ATS Resume review',
        'Unlimited cover letters',
        'Unlimited job fit analysis',
        'LinkedIn optimization',
        'Priority email support',
      ]
    },
  ];

  return (
    <DashboardLayout>
      <SEO
        title="Pricing Plans"
        description="Choose the perfect plan for your career journey. Free and Pro options available."
      />
      <Dialog open={showCancelPopup} onOpenChange={setShowCancelPopup}>
        <DialogContent className='max-w-2xl'>
          <DialogHeader>
            <DialogTitle>Cancel Subscription?</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel your subscription? Your subscription will be cancelled, but you’ll keep plan access until your plan expires..
            </DialogDescription>
          </DialogHeader>

            {
              cancelInProcess ? (
                <div className="flex justify-end gap-3 p-4">
                  <span className="text-gray-600 mr-auto">Processing cancellation...</span>
                </div>
              ) : (
                <div className="flex justify-end gap-3 p-4">
                  <Button variant="outline" onClick={() => setShowCancelPopup(false)}>
                    Keep Subscription
                  </Button>

                  <Button className="bg-red-500 hover:bg-red-700 text-white" onClick={handleCancelSubscription}>
                    Yes, Cancel
                  </Button>
                </div>
            )}
        </DialogContent>
      </Dialog>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="mb-4">Choose Your Plan</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Unlock the full potential of AI-powered career tools. Upgrade anytime, cancel anytime.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                <div className="pt-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-gray-900">{plan.price}</span>
                    <span className="text-gray-600">/ {plan.period}</span>
                  </div>
                  { currentPlanStatus?.plan != 'free' && currentPlanStatus?.plan == plan.buttonVariant && currentPlanStatus?.status == 'active' ? (
                    <div className="flex items-baseline gap-1">
                      <span className="text-gray-900">Next Billing</span>
                      <span className="text-gray-600"> - {currentPlanStatus?.next_billing_date}</span>
                    </div>
                  ) : currentPlanStatus?.plan != 'free' && currentPlanStatus?.plan == plan.buttonVariant && currentPlanStatus?.status == 'canceled' ? (
                    <div className="flex items-baseline gap-1">
                      <span className="text-gray-900">Expires On</span>
                      <span className="text-gray-600"> - {currentPlanStatus?.expires_on}</span>
                    </div>
                  ) : null}
                </div>
              </CardHeader>

              <CardContent className="space-y-6"> 
                {currentPlanStatus?.plan === "pro" && plan.buttonVariant === "free" ? (
                  // ⭐ FREE card when user already has PRO → disable button
                  <Button disabled className="w-full bg-gray-300 text-gray-600 cursor-not-allowed">
                    
                  </Button>
                ) : currentPlanStatus?.plan === plan.buttonVariant && plan.buttonVariant === "pro" ? (
                  // ⭐ PRO card when user has PRO → show cancel button
                  <Button
                    onClick={() => { if(currentPlanStatus?.status == 'active') { setShowCancelPopup(true)}}}
                    className="w-full bg-red-500 hover:bg-red-900 text-white py-3 rounded-xl"
                  >
                    {currentPlanStatus?.status == 'active' ? 'Cancel Subscription' : 'Current Plan'}
                  </Button>
                ) : (
                  // ⭐ Normal Subscribe button for all other cases
                  <SubscribeButton
                    userId={user.id}
                    planId={plan.buttonVariant}
                    className={`w-full ${
                      plan.buttonVariant === "pro"
                        ? "bg-violet-600 hover:bg-violet-700"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                    planText={plan.buttonText}
                  />
                )}
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
                    <td className="text-center py-4 px-4">3</td>
                    <td className="text-center py-4 px-4">Unlimited</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-4 text-gray-700">Resume Templates</td>
                    <td className="text-center py-4 px-4">3 Basic Download</td>
                    <td className="text-center py-4 px-4">Unlimited Premium Download</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-4 text-gray-700">Job Fit Analysis</td>
                    <td className="text-center py-4 px-4">3</td>
                    <td className="text-center py-4 px-4">Unlimited</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-4 text-gray-700">ATS Resume Review</td>
                    <td className="text-center py-4 px-4">1</td>
                    <td className="text-center py-4 px-4">Unlimited</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-4 text-gray-700">Cover Letter Generation</td>
                    <td className="text-center py-4 px-4">1</td>
                    <td className="text-center py-4 px-4">Unlimited</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 text-gray-700">Support</td>
                    <td className="text-center py-4 px-4">No</td>
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
                  We accept all major cards, UPI, and Net Banking.
                </p>
              </div>
              <div>
                <h4 className="text-gray-900 mb-2">Is there a free trial for paid plans?</h4>
                <p className="text-gray-600">
                  Yes! All paid plans come with limited trial. No credit card required to start.
                </p>
              </div>
              {/* <div>
                <h4 className="text-gray-900 mb-2">Can I upgrade or downgrade my plan?</h4>
                <p className="text-gray-600">
                  Absolutely! You can change your plan at any time. Upgrades are prorated, and you'll get credit for unused time when downgrading.
                </p>
              </div> */}
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
            <Link to="/contact">
              <Button size="lg" variant="secondary">
                Contact Sales
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
