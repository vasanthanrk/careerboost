import { useEffect, useState, useRef } from "react";
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
  Briefcase,
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
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Link } from "react-router-dom";
import { Header } from "./header";
import { Footer } from "./footer";
import api from '../api/axiosClient';
import { SEO } from "./SEO";

interface Template {
  name: string;
  thumbnail: string;
}

export function LandingPageOne() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [flipped, setFlipped] = useState(false);
  const [templates, setTemplates] = useState<Template[]>([]);

  useEffect(() => {
    api.get('/resume/templates').then(res => setTemplates(res.data));
  }, []);

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

  useEffect(() => {
    checkScrollPosition();
  }, []);

  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400; // Width of one card plus gap
      const newScrollLeft = direction === 'left'
        ? scrollContainerRef.current.scrollLeft - scrollAmount
        : scrollContainerRef.current.scrollLeft + scrollAmount;

      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });

      setTimeout(checkScrollPosition, 300);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-violet-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      <SEO
        title="AI Resume Builder & Career Tools"
        description="Create professional, ATS-friendly resumes in minutes with AI-powered suggestions. Get instant feedback, cover letters, and job match analysis."
      />
      <Header />
      {/* HERO SECTION */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* LEFT */}
          <div>
            <h2 className="pr_head lg:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
              Create a Job-Winning{" "}
              <br />
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
              <Button className="cursor-pointer bg-violet-600 hover:bg-violet-700 text-white px-8 py-6 rounded-xl">
                Get Started Now
              </Button>
            </Link>
          </div>
          {/* RIGHT IMAGE - React Flip Effect */}
          <div className="relative flex justify-center items-center">
            <div className={`flip-wrapper ${flipped ? "flipped" : ""}`}>
              <div className="side front">
                <img src="https://marketplace.canva.com/EAGcEPEtKxs/1/0/1131w/canva-modern-minimalist-professional-cv-resume-lunzGAiAG3o.jpg" alt="canva modern minimalist professional cv resume"/>
              </div>
              <div className="side back">
                <img src="https://i.pinimg.com/736x/c3/5f/5b/c35f5bc0a572f1aa3d236a8a311b3510.jpg" alt="canva modern minimalist professional cv resume back"/>
              </div>
            </div>
          </div>
        </div>
      </section>


      <section className="relative overflow-hidden py-12 sm:py-16 lg:py-24 bg-white dark:bg-gray-900">
        {/* Decorative Blurs */}
        <div className="absolute top-0 right-0 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-violet-300/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 left-0 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-purple-300/20 rounded-full blur-[120px]"></div>

        <div className="relative max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 lg:gap-24 items-center">

          {/* LEFT – RESPONSIVE CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* CARD 1 */}
            <div className="h3_bg bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all">
              <h3 className="myh3 text-4xl font-bold text-sky-500">15K+</h3>
              <p className="text-xl sm:text-lg text-gray-700 dark:text-gray-300 mt-2">
                Active Users
              </p>
            </div>

            {/* CARD 2 */}
            <div className="h3_bg bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all">
              <h3 className="myh3 text-4xl font-bold text-sky-500">10K+</h3>
              <p className="text-xl sm:text-lg text-gray-700 dark:text-gray-300 mt-2">
                Resume Created
              </p>
            </div>

            {/* CARD 3 */}
            <div className="h3_bg bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all">
              <h3 className="myh3 text-4xl font-bold text-sky-500">85%</h3>
              <p className="text-xl sm:text-lg text-gray-700 dark:text-gray-300 mt-2">
                Success Rate
              </p>
            </div>

            {/* CARD 4 */}
            <div className="h3_bg bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all">
              <h3 className="myh3 text-4xl font-bold text-sky-500">100%</h3>
              <p className="text-xl sm:text-lg text-gray-700 dark:text-gray-300 mt-2">
                Secure & Private
              </p>
            </div>

          </div>

          {/* RIGHT – TEXT CONTENT */}
          <div>

            <h2 className="pr_head sm:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight mb-8">
              Chosen by <span className="text-violet-600">10 million</span> job
              applicants around the world
            </h2>

            <p className="text-xl text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
              SmartCV Maker is a modern resume builder that helps you create applications
              with personality and professionalism. Our tools are trusted by millions.
            </p>

            <p className="text-xl text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
              We combine flexible, ATS-friendly templates with intuitive tools and
              tailored suggestions. The resume builder supports multiple languages
              and adds smart content recommendations.
            </p>

            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
              At SmartCV Maker, we help job seekers present a complete, polished story
              that increases interviews and job success.
            </p>


          </div>
        </div>
      </section>


      {/* Features Section */}

      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">

          {/* SECTION HEADER - MODIFIED */}
          <div className="text-center mb-20">
            <h2 className="pr_head lg:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
              Everything You Need to Succeed
            </h2>

            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed mb-10">
              Our comprehensive suite of AI-powered tools helps you at every stage of your job search journey.
            </p>
          </div>

          {/* FEATURES GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group relative overflow-hidden bg-white dark:bg-gray-800
                         border border-gray-200 dark:border-gray-700 rounded-3xl
                         hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
              >
                {/* HOVER GRADIENT */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 
                          group-hover:opacity-10 transition-opacity duration-300`}
                ></div>

                {/* ADJUSTED PADDING FOR BETTER SPACING ON MOBILE/TABLET */}
                <CardContent className="p-6 md:p-8 lg:p-10 relative">

                  {/* ICON */}
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex 
                            items-center justify-center shadow-md mb-8`}
                  >
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>

                  {/* TITLE */}
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    {feature.title}
                  </h3>

                  {/* DESCRIPTION */}
                  <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                    {feature.description}
                  </p>

                  {/* BUTTON */}
                  <Link to={feature.link}>
                    <Button
                      variant="ghost"
                      className="cursor-pointer gap-2 group/btn p-0 h-auto hover:bg-transparent"
                    >
                      <span className="text-lg font-medium text-violet-600 dark:text-violet-400">
                        Try it now
                      </span>

                      <ArrowRight
                        className="w-5 h-5 text-violet-600 dark:text-violet-400 
                              group-hover/btn:translate-x-1 transition-transform"
                      />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Resume Templates Showcase */}
      {
        templates.length > 0 ? (
          <section className="py-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
              <div className="text-center max-w-3xl mx-auto">
                <h2 className="pr_head lg:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
                  Choose from Premium Resume Templates
                </h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  Hand-crafted, ATS-friendly templates designed by career experts to help you stand out
                </p>
              </div>
            </div>

            {/* Slider Container */}
            <div className="relative max-w-[1400px] mx-auto px-4 sm:px-12">

              <div
                className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth py-6 px-4"
                ref={scrollContainerRef}
                onScroll={checkScrollPosition}
              >
                {templates.map((template, index) => (
                  <div key={index} className="flex-shrink-0 w-72 group relative">
                    {/* Card Container - Enforcing Fixed Height Here */}
                    <div className="h-[350px] bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1 overflow-hidden border border-gray-100 dark:border-gray-700">

                      {/* Image Area - Full Height of Parent */}
                      <div className="h-full w-full bg-gray-100 dark:bg-gray-700 relative overflow-hidden group">
                        <ImageWithFallback
                          src={template.thumbnail}
                          alt={`${template.name} Resume Template`}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />

                        {/* Overlay on Hover */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

                        {/* Use Template Button (appears on hover) */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Link to="/resume-builder">
                            <Button className="cursor-pointer bg-violet-600 hover:bg-violet-700 text-white rounded-full px-6 py-2 shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 font-medium">
                              Use Template
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation Buttons - Only show if more than 6 templates */}
              {templates.length > 6 && (
                <>
                  <button
                    className={`cursor-pointer absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 transition-all duration-200 ${canScrollLeft ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none'
                      }`}
                    onClick={() => scroll('left')}
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>

                  <button
                    className={`cursor-pointer absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 transition-all duration-200 ${canScrollRight ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'
                      }`}
                    onClick={() => scroll('right')}
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>



            <div className="text-center mt-12">
              <Link to="/resume-builder">
                <Button variant="outline" className="cursor-pointer border-violet-200 hover:border-violet-300 hover:bg-violet-50 text-violet-600 px-8 py-6 rounded-xl text-lg font-medium transition-all duration-300">
                  See All Resume Templates
                </Button>
              </Link>
            </div>
          </section>
        ) : null
      }


      {/* ATS Score Checker Section */}

      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            {/* <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-100 dark:bg-teal-900/30 rounded-full mb-4">
              <Scan className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span className="text-teal-700 dark:text-teal-300">
                ATS Compatibility
              </span>
            </div> */}

            <h2 className="pr_head lg:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
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
                    className="cursor-pointer bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 gap-2"
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

      {/* CTA Section */}

      <div className="mt-20">
        <Footer />
      </div>
    </div>
  );
}
