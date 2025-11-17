import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import "../styles/flip.css";

import {
  FileText,
  Mail,
  Target,
  Linkedin,
  Sparkles,
  ArrowRight,
  Check,
  Zap,
  Users,
  TrendingUp,
  Shield,
  CheckCircle2,
  Upload,
  BarChart3,
  AlertCircle,
  Download,
  Eye,
  Scan,
} from "lucide-react";

import { Link } from "react-router-dom";
import { Header } from "./header";
import { Footer } from "./footer";

export function LandingPageOne() {
  const [flipped, setFlipped] = useState(false);

  // Flip animation without jQuery
useEffect(() => {
  const timer = setInterval(() => {
    setFlipped((prev) => !prev);
  }, 2000);

  return () => clearInterval(timer);
}, []);

  const features = [
    {
      icon: FileText,
      title: "AI Resume Builder",
      description:
        "Create professional, ATS-friendly resumes in minutes with AI-powered suggestions and real-time optimization.",
      gradient: "from-violet-500 to-purple-500",
      link: "/resume-builder",
    },
    {
      icon: CheckCircle2,
      title: "ATS Score Checker",
      description:
        "Upload your resume and get instant ATS compatibility score with detailed improvement recommendations.",
      gradient: "from-teal-500 to-cyan-500",
      link: "/ats-checker",
    },
    {
      icon: Mail,
      title: "Cover Letter Generator",
      description:
        "Generate compelling, personalized cover letters tailored to each job application instantly.",
      gradient: "from-green-500 to-emerald-500",
      link: "/cover-letter",
    },
    {
      icon: Target,
      title: "Job Fit Analyzer",
      description:
        "Analyze how well your profile matches job requirements and get actionable improvement tips.",
      gradient: "from-orange-500 to-red-500",
      link: "/job-fit",
    },
    {
      icon: Linkedin,

      title: "LinkedIn Optimizer",

      description:
        "Boost your LinkedIn profile visibility with AI-enhanced content that attracts recruiters.",

      gradient: "from-blue-600 to-indigo-600",

      link: "/linkedin-optimizer",
    },
  ];
  const benefits = [
    "AI-powered career optimization",

    "ATS-friendly resume templates",

    "Unlimited document generations",

    "Real-time preview & editing",

    "Professional templates",

    "Export to PDF instantly",
  ];

  const stats = [
    { icon: Users, value: "50K+", label: "Active Users" },
    { icon: FileText, value: "100K+", label: "Resumes Created" },
    { icon: TrendingUp, value: "85%", label: "Success Rate" },
    { icon: Shield, value: "100%", label: "Secure & Private" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-violet-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      <Header />

      {/* HERO SECTION */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* LEFT */}
          <div>
            <h2 className="text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
              Create a Job-Winning{" "}
              <span className="text-violet-600">AI-Powered Resume</span>
            </h2>

            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              Professional, modern, and ATS-friendly resumes generated with AI
              in seconds.
            </p>

            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-violet-600" />
                <span className="text-gray-700 dark:text-gray-300">
                  ATS-friendly templates
                </span>
              </li>

              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-violet-600" />
                <span className="text-gray-700 dark:text-gray-300">
                  One-click PDF download
                </span>
              </li>

              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-violet-600" />
                <span className="text-gray-700 dark:text-gray-300">
                  AI-powered formatting & suggestions
                </span>
              </li>
            </ul>

            <Link to="/resume-builder">
              <Button className="bg-violet-600 hover:bg-violet-700 text-white px-8 py-6 rounded-xl">
                Get Started Free
              </Button>
            </Link>
          </div>
          {/* RIGHT IMAGE - React Flip Effect */}
          <div className="relative flex justify-center items-center">
           <div className={`flip-wrapper ${flipped ? "flipped" : ""}`}>
            <div className="side front">
              <img src="https://marketplace.canva.com/EAGcEPEtKxs/1/0/1131w/canva-modern-minimalist-professional-cv-resume-lunzGAiAG3o.jpg" />
            </div>
            <div className="side back">
              <img src="https://i.pinimg.com/736x/c3/5f/5b/c35f5bc0a572f1aa3d236a8a311b3510.jpg" />
            </div>
          </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden pt-20 pb-28">
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-300/20 rounded-full blur-3xl"></div>

        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-100 dark:bg-violet-900/30 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-violet-600 dark:text-violet-400" />

            <span className="text-violet-700 dark:text-violet-300">
              AI-Powered Career Platform
            </span>
          </div>

          <h1 className="text-gray-900 dark:text-white mb-6 max-w-4xl mx-auto">
            Transform Your Career with AI-Powered Tools
          </h1>

          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10">
            Build professional resumes, generate cover letters, analyze job
            matches, optimize your LinkedIn profile, and create stunning
            portfolios — all powered by advanced AI technology.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup">
              <Button
                size="lg"
                className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 gap-2 px-8 py-6"
              >
                <Sparkles className="w-5 h-5" />
                Start Building for Free
              </Button>
            </Link>

            {/* <Link to="/pricing">

              <Button size="lg" variant="outline" className="gap-2 px-8 py-6">

                <Zap className="w-5 h-5" />

                View Pricing

              </Button>

            </Link> */}
          </div>

          {/* Stats */}

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-20 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow"
              >
                <stat.icon className="w-8 h-8 text-violet-600 dark:text-violet-400 mb-3 mx-auto" />

                <div className="text-gray-900 dark:text-white mb-1">
                  {stat.value}
                </div>

                <p className="text-gray-600 dark:text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}

      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-100 dark:bg-violet-900/30 rounded-full mb-4">
              <Zap className="w-4 h-4 text-violet-600 dark:text-violet-400" />

              <span className="text-violet-700 dark:text-violet-300">
                Powerful Features
              </span>
            </div>

            <h2 className="text-gray-900 dark:text-white mb-4">
              Everything You Need to Succeed
            </h2>

            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Our comprehensive suite of AI-powered tools helps you at every
              stage of your job search journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group relative overflow-hidden border-2 border-gray-100 dark:border-gray-700 hover:border-violet-200 dark:hover:border-violet-600 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity`}
                ></div>

                <CardContent className="p-8 relative">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg`}
                  >
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>

                  <h3 className="text-gray-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {feature.description}
                  </p>

                  <Link to={feature.link}>
                    <Button
                      variant="ghost"
                      className="gap-2 group/btn p-0 h-auto hover:bg-transparent"
                    >
                      <span className="text-violet-600 dark:text-violet-400">
                        Try it now
                      </span>

                      <ArrowRight className="w-4 h-4 text-violet-600 dark:text-violet-400 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ATS Score Checker Section */}

      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-100 dark:bg-teal-900/30 rounded-full mb-4">
              <Scan className="w-4 h-4 text-teal-600 dark:text-teal-400" />

              <span className="text-teal-700 dark:text-teal-300">
                ATS Compatibility
              </span>
            </div>

            <h2 className="text-gray-900 dark:text-white mb-4">
              Beat the Applicant Tracking System
            </h2>

            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              75% of resumes are rejected by ATS before reaching human eyes. Our
              AI-powered ATS Score Checker ensures yours gets through.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            {/* Left Side - ATS Score Visual */}

            <div className="relative">
              <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/30 dark:to-cyan-950/30 rounded-3xl p-8 border-2 border-teal-200 dark:border-teal-800 shadow-xl">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-gray-900 dark:text-white">
                      Your ATS Score
                    </h3>

                    <Badge className="bg-gradient-to-r from-teal-600 to-cyan-600">
                      Excellent
                    </Badge>
                  </div>

                  <div className="flex items-end gap-2 mb-4">
                    <span className="text-5xl font-bold text-teal-600 dark:text-teal-400">
                      87
                    </span>

                    <span className="text-2xl text-gray-500 dark:text-gray-400 mb-1">
                      /100
                    </span>
                  </div>

                  <Progress value={87} className="h-3 mb-4" />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />

                      <span className="text-gray-700 dark:text-gray-300">
                        Formatting
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Progress value={92} className="h-2 w-20" />

                      <span className="text-gray-900 dark:text-white">92%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />

                      <span className="text-gray-700 dark:text-gray-300">
                        Keywords
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Progress value={85} className="h-2 w-20" />

                      <span className="text-gray-900 dark:text-white">85%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />

                      <span className="text-gray-700 dark:text-gray-300">
                        Experience
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Progress value={78} className="h-2 w-20" />

                      <span className="text-gray-900 dark:text-white">78%</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-teal-100 dark:bg-teal-900/50 rounded-lg border border-teal-200 dark:border-teal-800">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-teal-600 dark:text-teal-400 mt-0.5" />

                    <div>
                      <h4 className="text-gray-900 dark:text-white mb-1">
                        Top Suggestion
                      </h4>

                      <p className="text-gray-700 dark:text-gray-300">
                        Add 3-5 more industry-specific keywords to boost your
                        score to 90+
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Badge */}

              <div className="absolute -top-4 -right-4 bg-gradient-to-br from-teal-600 to-cyan-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                <Sparkles className="w-4 h-4" />

                <span>AI-Powered Analysis</span>
              </div>
            </div>

            {/* Right Side - How It Works */}

            <div>
              <h3 className="text-gray-900 dark:text-white mb-6">
                How Our ATS Checker Works
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-teal-900/50 dark:to-cyan-900/50 rounded-xl flex items-center justify-center border-2 border-teal-200 dark:border-teal-800">
                    <Upload className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                  </div>

                  <div className="flex-1">
                    <h4 className="text-gray-900 dark:text-white mb-2">
                      1. Upload Your Resume
                    </h4>

                    <p className="text-gray-600 dark:text-gray-400">
                      Simply upload your resume in PDF or DOC format. Our AI
                      instantly begins analyzing.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-teal-900/50 dark:to-cyan-900/50 rounded-xl flex items-center justify-center border-2 border-teal-200 dark:border-teal-800">
                    <Scan className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                  </div>

                  <div className="flex-1">
                    <h4 className="text-gray-900 dark:text-white mb-2">
                      2. AI Deep Scan
                    </h4>

                    <p className="text-gray-600 dark:text-gray-400">
                      Our advanced AI analyzes formatting, keywords, structure,
                      and compatibility with major ATS systems.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-teal-900/50 dark:to-cyan-900/50 rounded-xl flex items-center justify-center border-2 border-teal-200 dark:border-teal-800">
                    <BarChart3 className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                  </div>

                  <div className="flex-1">
                    <h4 className="text-gray-900 dark:text-white mb-2">
                      3. Get Detailed Report
                    </h4>

                    <p className="text-gray-600 dark:text-gray-400">
                      Receive a comprehensive score breakdown with specific
                      issues and actionable recommendations.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-teal-900/50 dark:to-cyan-900/50 rounded-xl flex items-center justify-center border-2 border-teal-200 dark:border-teal-800">
                    <Download className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                  </div>

                  <div className="flex-1">
                    <h4 className="text-gray-900 dark:text-white mb-2">
                      4. Download Optimized Resume
                    </h4>

                    <p className="text-gray-600 dark:text-gray-400">
                      Apply fixes and download your ATS-optimized resume in
                      professional templates.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Link to="/ats-checker">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 gap-2"
                  >
                    <Scan className="w-5 h-5" />
                    Check Your ATS Score Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* ATS Statistics */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-2 border-teal-100 dark:border-teal-800">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-teal-900/50 dark:to-cyan-900/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Eye className="w-8 h-8 text-teal-600 dark:text-teal-400" />
                </div>

                <h3 className="text-gray-900 dark:text-white mb-2">75%</h3>

                <p className="text-gray-600 dark:text-gray-400">
                  of resumes never reach human recruiters due to ATS rejection
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-cyan-100 dark:border-cyan-800">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-cyan-900/50 dark:to-blue-900/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-cyan-600 dark:text-cyan-400" />
                </div>

                <h3 className="text-gray-900 dark:text-white mb-2">98%</h3>

                <p className="text-gray-600 dark:text-gray-400">
                  of Fortune 500 companies use ATS to filter applications
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-100 dark:border-blue-800">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>

                <h3 className="text-gray-900 dark:text-white mb-2">
                  3x Higher
                </h3>

                <p className="text-gray-600 dark:text-gray-400">
                  callback rate with ATS-optimized resumes vs standard ones
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}

      <section className="py-20 bg-gradient-to-br from-violet-50 to-purple-50/30 dark:from-gray-900 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-full mb-6 shadow-sm">
                <Check className="w-4 h-4 text-green-600 dark:text-green-400" />

                <span className="text-gray-700 dark:text-gray-300">
                  Why Choose CareerBoost
                </span>
              </div>

              <h2 className="text-gray-900 dark:text-white mb-6">
                Your All-in-One Career Platform
              </h2>

              <p className="text-gray-600 dark:text-gray-400 mb-8">
                CareerBoost combines cutting-edge AI technology with intuitive
                design to help you create professional career documents and
                stand out in the job market.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>

                    <span className="text-gray-700 dark:text-gray-300">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>

              <Link to="/signup">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  Get Started Today
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 border-violet-100 dark:border-violet-800">
                  <FileText className="w-8 h-8 text-violet-600 dark:text-violet-400 mb-3" />

                  <h4 className="text-gray-900 dark:text-white mb-2">
                    Smart Templates
                  </h4>

                  <p className="text-gray-600 dark:text-gray-400">
                    Professional designs that get noticed
                  </p>
                </div>

                <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 border-blue-100 dark:border-blue-800">
                  <Sparkles className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-3" />

                  <h4 className="text-gray-900 dark:text-white mb-2">
                    AI-Powered
                  </h4>

                  <p className="text-gray-600 dark:text-gray-400">
                    Intelligent suggestions and optimization
                  </p>
                </div>
              </div>

              <div className="space-y-4 pt-8">
                <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 border-green-100 dark:border-green-800">
                  <Shield className="w-8 h-8 text-green-600 dark:text-green-400 mb-3" />

                  <h4 className="text-gray-900 dark:text-white mb-2">
                    Secure & Private
                  </h4>

                  <p className="text-gray-600 dark:text-gray-400">
                    Your data is safe with us
                  </p>
                </div>

                <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 border-orange-100 dark:border-orange-800">
                  <TrendingUp className="w-8 h-8 text-orange-600 dark:text-orange-400 mb-3" />

                  <h4 className="text-gray-900 dark:text-white mb-2">
                    Proven Results
                  </h4>

                  <p className="text-gray-600 dark:text-gray-400">
                    85% success rate with users
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-purple-600 to-pink-600 p-12 md:p-16 text-center">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>

            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl"></div>

            <div className="relative z-10">
              <h2 className="text-white mb-6 max-w-3xl mx-auto">
                Ready to Accelerate Your Career?
              </h2>

              <p className="text-violet-100 mb-8 max-w-2xl mx-auto">
                Join thousands of professionals who have successfully landed
                their dream jobs using CareerBoost.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/signup">
                  <Button
                    size="lg"
                    className="bg-white text-violet-600 hover:bg-violet-50 gap-2 px-8 py-6 shadow-xl"
                  >
                    <Sparkles className="w-5 h-5" />
                    Start Free Trial
                  </Button>
                </Link>

                {/* <Link to="/pricing">

                  <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm gap-2 px-8 py-6">

                    View Pricing Plans

                    <ArrowRight className="w-5 h-5" />

                  </Button>

                </Link> */}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
