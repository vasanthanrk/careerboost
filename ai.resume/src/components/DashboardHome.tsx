import { DashboardLayout } from './DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import {
  FileText,
  Target,
  Linkedin,
  Sparkles,
  Mail,
  Briefcase,
  Zap,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEO } from './SEO';

export function DashboardHome() {
  const tools = [
    {
      icon: FileText,
      title: 'Resume Builder',
      description: 'Create professional, ATS-friendly resumes with AI assistance',
      link: '/resume-templates',
      gradient: 'from-violet-500 to-purple-500',
      bgColor: 'bg-violet-50',
      iconBg: 'bg-violet-100',
      iconColor: 'text-violet-600'
    },
    {
      icon: Mail,
      title: 'Cover Letter Generator',
      description: 'Generate personalized cover letters for any job',
      link: '/cover-letter',
      gradient: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      icon: Target,
      title: 'Job Fit Analyzer',
      description: 'Analyze how well you match job requirements',
      link: '/job-fit',
      gradient: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600'
    },
    {
      icon: Linkedin,
      title: 'LinkedIn Optimizer',
      description: 'Optimize your LinkedIn profile to attract recruiters',
      link: '/linkedin-optimizer',
      gradient: 'from-blue-600 to-indigo-600',
      bgColor: 'bg-blue-50',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    // { 
    //   icon: Briefcase, 
    //   title: 'Portfolio Builder', 
    //   description: 'Create a stunning portfolio website',
    //   link: '/portfolio', 
    //   gradient: 'from-pink-500 to-rose-500',
    //   bgColor: 'bg-pink-50',
    //   iconBg: 'bg-pink-100',
    //   iconColor: 'text-pink-600'
    // },
  ];

  return (
    <DashboardLayout>
      <SEO
        title="Dashboard"
        description="Manage your resumes, cover letters, and career tools from your SmartCV Maker dashboard."
      />
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-purple-600 to-pink-600 p-8 md:p-12 text-white shadow-xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-300/20 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <h1 className="text-white mb-3">Welcome to SmartCV Maker! 👋</h1>
            <p className="text-violet-100 mb-8 max-w-3xl">
              Your all-in-one platform for career success. Use our AI-powered tools to create professional resumes, cover letters, and more.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link to="/resume-templates">
                <Button className="bg-white text-violet-600 hover:bg-violet-50 gap-2 shadow-lg">
                  <Sparkles className="w-4 h-4" />
                  Start Building Resume
                </Button>
              </Link>
              <Link to="/pricing">
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm gap-2">
                  <Zap className="w-4 h-4" />
                  View Pricing Plans
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Tools Grid */}
        <div>
          <div className="mb-6">
            <h2 className="text-gray-900 mb-2">Your Career Tools</h2>
            <p className="text-gray-600">
              Choose a tool to get started with building your career profile
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <Link key={tool.title} to={tool.link}>
                <Card className="group relative overflow-hidden border-2 border-gray-100 hover:border-violet-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer h-full">
                  <div className={`absolute inset-0 bg-gradient-to-br ${tool.gradient} opacity-0 group-hover:opacity-5 transition-opacity`}></div>

                  <CardHeader className="pb-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                      <tool.icon className="w-7 h-7 text-white" />
                    </div>
                    <CardTitle className="group-hover:text-violet-700 transition-colors">
                      {tool.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{tool.description}</p>
                    <div className="flex items-center gap-2 text-violet-600 group-hover:gap-3 transition-all">
                      <span>Get Started</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Tips */}
        <Card className="border-2 border-violet-100 bg-gradient-to-br from-white to-violet-50/30 shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <CardTitle>Quick Tips for Success</CardTitle>
            </div>
            <CardDescription>Best practices to enhance your job search</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-xl bg-white border-2 border-violet-100 hover:border-violet-300 transition-colors">
                <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-purple-600 rounded-xl flex items-center justify-center mb-3">
                  <span className="text-white">1</span>
                </div>
                <h4 className="text-gray-900 mb-2">Tailor Your Resume</h4>
                <p className="text-gray-600">
                  Customize your resume for each job application to match specific requirements
                </p>
              </div>

              <div className="p-5 rounded-xl bg-white border-2 border-violet-100 hover:border-violet-300 transition-colors">
                <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-purple-600 rounded-xl flex items-center justify-center mb-3">
                  <span className="text-white">2</span>
                </div>
                <h4 className="text-gray-900 mb-2">Use Keywords</h4>
                <p className="text-gray-600">
                  Include relevant keywords from job descriptions to pass ATS systems
                </p>
              </div>

              <div className="p-5 rounded-xl bg-white border-2 border-violet-100 hover:border-violet-300 transition-colors">
                <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-purple-600 rounded-xl flex items-center justify-center mb-3">
                  <span className="text-white">3</span>
                </div>
                <h4 className="text-gray-900 mb-2">Quantify Achievements</h4>
                <p className="text-gray-600">
                  Use numbers and metrics to demonstrate your impact and results
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upgrade Banner */}
        <Card className="border-2 border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50 shadow-lg overflow-hidden">
          <CardContent className="py-6">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Zap className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-orange-900 mb-2">Unlock Premium Features</h3>
                <p className="text-orange-700 mb-4">
                  Get unlimited AI generations, advanced analytics, priority support, and exclusive templates with our Pro plan.
                </p>
                <Link to="/pricing">
                  <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white gap-2">
                    <Sparkles className="w-4 h-4" />
                    Upgrade to Pro
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
