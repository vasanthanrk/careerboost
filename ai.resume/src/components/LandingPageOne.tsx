import { useEffect, useState } from "react";
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { 
  FileText, 
  Mail, 
  Target, 
  Linkedin, 
  Briefcase,
  Sparkles,
  ArrowRight,
  Check,
  Zap,
  Users,
  TrendingUp,
  Shield
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function LandingPageOne() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    setIsLoggedIn(!!storedUser); // ✅ true if user exists
  }, []);

  const features = [
    {
      icon: FileText,
      title: 'AI Resume Builder',
      description: 'Create professional, ATS-friendly resumes in minutes with AI-powered suggestions and real-time optimization.',
      gradient: 'from-violet-500 to-purple-500',
      link: '/resume-builder'
    },
    {
      icon: Mail,
      title: 'Cover Letter Generator',
      description: 'Generate compelling, personalized cover letters tailored to each job application instantly.',
      gradient: 'from-green-500 to-emerald-500',
      link: '/cover-letter'
    },
    {
      icon: Target,
      title: 'Job Fit Analyzer',
      description: 'Analyze how well your profile matches job requirements and get actionable improvement tips.',
      gradient: 'from-orange-500 to-red-500',
      link: '/job-fit'
    },
    {
      icon: Linkedin,
      title: 'LinkedIn Optimizer',
      description: 'Boost your LinkedIn profile visibility with AI-enhanced content that attracts recruiters.',
      gradient: 'from-blue-600 to-indigo-600',
      link: '/linkedin-optimizer'
    },
    // {
    //   icon: Briefcase,
    //   title: 'Portfolio Builder',
    //   description: 'Create stunning portfolio websites to showcase your work and impress potential employers.',
    //   gradient: 'from-pink-500 to-rose-500',
    //   link: '/portfolio'
    // },
  ];

  const benefits = [
    'AI-powered career optimization',
    'ATS-friendly resume templates',
    'Unlimited document generations',
    'Real-time preview & editing',
    'Professional templates',
    'Export to PDF instantly'
  ];

  const stats = [
    { icon: Users, value: '50K+', label: 'Active Users' },
    { icon: FileText, value: '100K+', label: 'Resumes Created' },
    { icon: TrendingUp, value: '85%', label: 'Success Rate' },
    { icon: Shield, value: '100%', label: 'Secure & Private' }
  ];

  return (
    <div className="min-h-screen bg-white text-base">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-semibold text-gray-900">CareerBoost</span>
            </div>
            <div className="flex items-center gap-3">
              {isLoggedIn ? (
                <Link to="/dashboard">
                  <Button
                    variant="ghost"
                    className="text-base font-medium text-violet-600 hover:bg-violet-50"
                  >
                    View Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost" className="text-base font-medium">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700">
                      Get Started Free
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-28 bg-gradient-to-br from-gray-50 via-white to-violet-50/30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-300/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-100 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-violet-600" />
            <span className="text-sm font-medium text-violet-700">AI-Powered Career Platform</span>
          </div>
          
          <div className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 max-w-4xl mx-auto leading-tight">
            Transform Your Career with AI-Powered Tools
          </div>
          
          <div className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Build professional resumes, generate cover letters, analyze job matches, optimize your LinkedIn profile, and create stunning portfolios — all powered by advanced AI technology.
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <Link to="/signup">
              <Button size="lg" className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 gap-2 px-8 h-14 text-lg font-semibold">
                <Sparkles className="w-5 h-5" />
                Start Building for Free
              </Button>
            </Link>
            {/* <Link to="/pricing">
              <Button size="lg" variant="outline" className="gap-2 px-8 h-14 text-lg font-semibold border-2">
                <Zap className="w-5 h-5" />
                View Pricing
              </Button>
            </Link> */}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="p-6 rounded-2xl bg-white border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow">
                <stat.icon className="w-8 h-8 text-violet-600 mb-3 mx-auto" />
                <div className="text-4xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-base text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-100 rounded-full mb-4">
              <Zap className="w-4 h-4 text-violet-600" />
              <span className="text-sm font-medium text-violet-700">Powerful Features</span>
            </div>
            <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Everything You Need to Succeed</div>
            <div className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our comprehensive suite of AI-powered tools helps you at every stage of your job search journey.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="group relative overflow-hidden border-2 border-gray-100 hover:border-violet-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity`}></div>
                
                <CardContent className="p-8 relative">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  
                  <div className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</div>
                  <div className="text-base text-gray-600 mb-6 leading-relaxed">{feature.description}</div>
                  
                  <Link to={feature.link}>
                    <div className="inline-flex items-center gap-2 text-violet-600 font-medium hover:gap-3 transition-all">
                      <span className="text-base">Try it now</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-br from-violet-50 to-purple-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full mb-6 shadow-sm">
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-gray-700">Why Choose CareerBoost</span>
              </div>
              
              <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Your All-in-One Career Platform
              </div>
              
              <div className="text-xl text-gray-600 mb-8 leading-relaxed">
                CareerBoost combines cutting-edge AI technology with intuitive design to help you create professional career documents and stand out in the job market.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-base text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>

              <Link to="/signup">
                <Button size="lg" className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 gap-2 h-14 text-lg font-semibold">
                  <Sparkles className="w-5 h-5" />
                  Get Started Today
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="p-6 bg-white rounded-2xl shadow-lg border-2 border-violet-100">
                  <FileText className="w-8 h-8 text-violet-600 mb-3" />
                  <div className="text-lg font-semibold text-gray-900 mb-2">Smart Templates</div>
                  <div className="text-sm text-gray-600">Professional designs that get noticed</div>
                </div>
                <div className="p-6 bg-white rounded-2xl shadow-lg border-2 border-blue-100">
                  <Sparkles className="w-8 h-8 text-blue-600 mb-3" />
                  <div className="text-lg font-semibold text-gray-900 mb-2">AI-Powered</div>
                  <div className="text-sm text-gray-600">Intelligent suggestions and optimization</div>
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="p-6 bg-white rounded-2xl shadow-lg border-2 border-green-100">
                  <Shield className="w-8 h-8 text-green-600 mb-3" />
                  <div className="text-lg font-semibold text-gray-900 mb-2">Secure & Private</div>
                  <div className="text-sm text-gray-600">Your data is safe with us</div>
                </div>
                <div className="p-6 bg-white rounded-2xl shadow-lg border-2 border-orange-100">
                  <TrendingUp className="w-8 h-8 text-orange-600 mb-3" />
                  <div className="text-lg font-semibold text-gray-900 mb-2">Proven Results</div>
                  <div className="text-sm text-gray-600">85% success rate with users</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-purple-600 to-pink-600 p-12 md:p-16 text-center">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <div className="text-4xl md:text-5xl font-bold text-white mb-6 max-w-3xl mx-auto leading-tight">
                Ready to Accelerate Your Career?
              </div>
              <div className="text-xl text-violet-100 mb-8 max-w-2xl mx-auto leading-relaxed">
                Join thousands of professionals who have successfully landed their dream jobs using CareerBoost.
              </div>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/signup">
                  <Button size="lg" className="bg-white text-violet-600 hover:bg-violet-50 gap-2 px-8 h-14 text-lg font-semibold shadow-xl">
                    <Sparkles className="w-5 h-5" />
                    Start Free
                  </Button>
                </Link>
                {/* <Link to="/pricing">
                  <Button size="lg" variant="outline" className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm gap-2 px-8 h-14 text-lg font-semibold bg-transparent">
                    View Pricing Plans
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link> */}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-semibold">CareerBoost</span>
              </div>
              <div className="text-base text-gray-400">
                AI-powered tools to accelerate your career journey.
              </div>
            </div>
            
            <div>
              <div className="text-base font-semibold text-white mb-4">Features</div>
              <div className="space-y-2">
                <Link to="/resume-builder" className="block text-base text-gray-400 hover:text-white transition-colors">Resume Builder</Link>
                <Link to="/cover-letter" className="block text-base text-gray-400 hover:text-white transition-colors">Cover Letter</Link>
                <Link to="/job-fit" className="block text-base text-gray-400 hover:text-white transition-colors">Job Fit Analyzer</Link>
                <Link to="/linkedin-optimizer" className="block text-base text-gray-400 hover:text-white transition-colors">LinkedIn Optimizer</Link>
              </div>
            </div>
            
            <div>
              <div className="text-base font-semibold text-white mb-4">Company</div>
              <div className="space-y-2">
                <Link to="/pricing" className="block text-base text-gray-400 hover:text-white transition-colors">Pricing</Link>
                <a href="#" className="block text-base text-gray-400 hover:text-white transition-colors">About Us</a>
                <a href="#" className="block text-base text-gray-400 hover:text-white transition-colors">Contact</a>
                <a href="#" className="block text-base text-gray-400 hover:text-white transition-colors">Blog</a>
              </div>
            </div>
            
            <div>
              <div className="text-base font-semibold text-white mb-4">Legal</div>
              <div className="space-y-2">
                <a href="#" className="block text-base text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="block text-base text-gray-400 hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="block text-base text-gray-400 hover:text-white transition-colors">Cookie Policy</a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-base text-gray-400">
            &copy; 2025 CareerBoost. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
