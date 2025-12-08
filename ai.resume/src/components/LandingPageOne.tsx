import { useEffect, useState, useRef } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import "../styles/flip.css";
import { Dialog, DialogContent } from "./ui/dialog";
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
  ChevronRight,
  ZoomIn,
  X
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
  fullImage?: string;
}

export function LandingPageOne() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [flipped, setFlipped] = useState(false);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);

  useEffect(() => {
    api.get('/resume/templates').then(res => setTemplates(res.data.reverse()));
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
      link: "/resume-templates",
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
    window.addEventListener('resize', checkScrollPosition);
    return () => window.removeEventListener('resize', checkScrollPosition);
  }, [templates]);

  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 312; // Width of one card (288px) plus gap (24px)
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

            <Link to="/resume-templates">
              <Button className="cursor-pointer bg-violet-600 hover:bg-violet-700 text-white px-8 py-6 rounded-xl">
                Get Started Now
              </Button>
            </Link>
          </div>
          {/* RIGHT IMAGE - React Flip Effect */}
          <div className="relative flex justify-center items-center">
            <div className={`flip-wrapper ${flipped ? "flipped" : ""}`}>
              <div className="side front">
                <img src="https://marketplace.canva.com/EAGcEPEtKxs/1/0/1131w/canva-modern-minimalist-professional-cv-resume-lunzGAiAG3o.jpg" alt="canva modern minimalist professional cv resume" fetchPriority="high" />
              </div>
              <div className="side back">
                <img src="https://i.pinimg.com/736x/c3/5f/5b/c35f5bc0a572f1aa3d236a8a311b3510.jpg" alt="canva modern minimalist professional cv resume back" fetchPriority="high" />
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
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Hand-crafted, ATS-friendly templates designed by career experts to help you stand out
          </p>
        </div>
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="pr_head lg:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
            Choose from Premium Resume Templates
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Hand-crafted, ATS-friendly templates designed by career experts to help you stand out
          </p>
        </div>
        <div className="relative max-w-[1400px] mx-auto px-4 sm:px-12">
          {/* Navigation Buttons */}
          <button
            className="cursor-pointer absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400"
            onClick={() => scroll('left')}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            className="cursor-pointer absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400"
            onClick={() => scroll('right')}
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div
            ref={scrollContainerRef}
            onScroll={checkScrollPosition}
            className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth py-6 px-4"
          >
            {templates.map((template, index) => (
              <div key={index} className="flex-shrink-0 h-[537px] group relative">
                <div className="h-full bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1 overflow-hidden border border-gray-100 dark:border-gray-700">
                  <div className="h-full w-full bg-gray-100 dark:bg-gray-700 relative overflow-hidden group">
                    <img
                      src={template.thumbnail}
                      alt={`${template.name} Resume Template`}
                      className="w-auto h-full object-contain transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Link to="/resume-templates">
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
        </div>

        {previewTemplate && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[999] p-4">
            <div className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
              {/* Header */}
              <div className="flex justify-between items-center p-4 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">{previewTemplate.name}</h3>
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              {/* Image Scroll Area */}
              <div className="flex-1 overflow-y-auto p-6 bg-gray-50 flex justify-center">
                <img
                  src={previewTemplate.fullImage ?? previewTemplate.thumbnail}
                  alt="Preview"
                  className="max-w-full h-auto shadow-lg object-contain"
                />
              </div>
              {/* Footer with Action */}
              <div className="p-4 border-t border-gray-100 flex justify-end bg-white">
                <Link to="/resume-templates">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium shadow-sm transition-colors cursor-pointer">
                    Use This Template
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </section>


      {/* ... existing ATS Score Checker ... */}
      <Footer />
    </div>
  );
}
