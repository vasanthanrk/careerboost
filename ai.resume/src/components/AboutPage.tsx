import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Sparkles, Target, Users, Zap, Award, Heart } from 'lucide-react';
import { Header } from './header';
import { Footer } from './footer';

export function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-violet-50/30">
      {/* Navigation */}
      <Header/>

      {/* Hero Section */}
      <section className="py-20 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-100 rounded-full mb-6">
            <Heart className="w-4 h-4 text-violet-600" />
            <span className="text-violet-700">About CareerBoost</span>
          </div>
          
          <h1 className="text-gray-900 mb-6">
            Empowering Careers Through AI Innovation
          </h1>
          
          <p className="text-gray-600 max-w-2xl mx-auto">
            CareerBoost is on a mission to democratize access to professional career development tools. We believe everyone deserves a fair shot at landing their dream job, regardless of their background or resources.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="p-8 rounded-2xl bg-gradient-to-br from-violet-50 to-purple-50 border-2 border-violet-100">
              <Target className="w-12 h-12 text-violet-600 mb-4" />
              <h2 className="text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-600">
                To empower job seekers worldwide with AI-powered tools that level the playing field and maximize their chances of career success. We're committed to making professional-grade career resources accessible to everyone.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-100">
              <Zap className="w-12 h-12 text-blue-600 mb-4" />
              <h2 className="text-gray-900 mb-4">Our Vision</h2>
              <p className="text-gray-600">
                To become the world's most trusted AI career platform, helping millions of people land their dream jobs by providing intelligent, personalized guidance at every step of their career journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              These principles guide everything we do at CareerBoost
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-white border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-gradient-to-br from-violet-100 to-purple-100 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-violet-600" />
              </div>
              <h3 className="text-gray-900 mb-3">User-Centric</h3>
              <p className="text-gray-600">
                Every feature we build starts with understanding our users' needs and challenges. Your success is our success.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center mb-6">
                <Sparkles className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-gray-900 mb-3">Innovation</h3>
              <p className="text-gray-600">
                We leverage cutting-edge AI technology to continuously improve and deliver tools that truly make a difference.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center mb-6">
                <Award className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-gray-900 mb-3">Excellence</h3>
              <p className="text-gray-600">
                We're committed to delivering the highest quality tools and support to help you achieve your career goals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-violet-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-white mb-6">
            Ready to Transform Your Career?
          </h2>
          <p className="text-violet-100 mb-8">
            Join thousands of professionals who have already boosted their careers with CareerBoost.
          </p>
          <Link to="/signup">
            <Button size="lg" className="bg-white text-violet-600 hover:bg-gray-100">
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <Footer/>
    </div>
  );
}
