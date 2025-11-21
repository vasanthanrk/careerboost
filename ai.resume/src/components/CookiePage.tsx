import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Sparkles, Cookie } from 'lucide-react';
import { Footer } from './footer';

export function CookiePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-violet-50/30">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-gray-900">SmartCV Maker</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700">
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 rounded-full mb-6">
            <Cookie className="w-4 h-4 text-orange-600" />
            <span className="text-orange-700">Cookie Policy</span>
          </div>
          
          <h1 className="text-gray-900 mb-6">
            Cookie Policy
          </h1>
          
          <p className="text-gray-600 max-w-2xl mx-auto mb-4">
            Last Updated: November 12, 2025
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-gray max-w-none">
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border-2 border-gray-100">
              <h2 className="text-gray-900 mb-4">What Are Cookies?</h2>
              <p className="text-gray-600 mb-4">
                Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and understanding how you use our services.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border-2 border-gray-100">
              <h2 className="text-gray-900 mb-4">How We Use Cookies</h2>
              <p className="text-gray-600 mb-4">
                We use cookies for various purposes:
              </p>
              <ul className="text-gray-600 space-y-2 mb-4">
                <li><strong>Essential Cookies:</strong> Required for the website to function properly</li>
                <li><strong>Performance Cookies:</strong> Help us understand how visitors interact with our website</li>
                <li><strong>Functionality Cookies:</strong> Remember your preferences and settings</li>
                <li><strong>Analytics Cookies:</strong> Collect information about how you use our website</li>
                <li><strong>Marketing Cookies:</strong> Track your browsing habits to show relevant advertisements</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border-2 border-gray-100">
              <h2 className="text-gray-900 mb-4">Types of Cookies We Use</h2>
              
              <div className="mb-6">
                <h3 className="text-gray-900 mb-3">1. Strictly Necessary Cookies</h3>
                <p className="text-gray-600 mb-2">
                  These cookies are essential for you to browse the website and use its features. Without these cookies, services you have asked for cannot be provided.
                </p>
                <ul className="text-gray-600 space-y-1">
                  <li>• Authentication cookies</li>
                  <li>• Security cookies</li>
                  <li>• Session management cookies</li>
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-gray-900 mb-3">2. Performance Cookies</h3>
                <p className="text-gray-600 mb-2">
                  These cookies collect information about how visitors use our website, such as which pages are visited most often.
                </p>
                <ul className="text-gray-600 space-y-1">
                  <li>• Google Analytics</li>
                  <li>• Error tracking cookies</li>
                  <li>• Load time measurement cookies</li>
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-gray-900 mb-3">3. Functionality Cookies</h3>
                <p className="text-gray-600 mb-2">
                  These cookies allow the website to remember choices you make and provide enhanced features.
                </p>
                <ul className="text-gray-600 space-y-1">
                  <li>• Language preference cookies</li>
                  <li>• User interface customization cookies</li>
                  <li>• Remember me cookies</li>
                </ul>
              </div>

              <div>
                <h3 className="text-gray-900 mb-3">4. Targeting Cookies</h3>
                <p className="text-gray-600 mb-2">
                  These cookies are used to deliver advertisements more relevant to you and your interests.
                </p>
                <ul className="text-gray-600 space-y-1">
                  <li>• Advertising platform cookies</li>
                  <li>• Social media cookies</li>
                  <li>• Retargeting cookies</li>
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border-2 border-gray-100">
              <h2 className="text-gray-900 mb-4">Third-Party Cookies</h2>
              <p className="text-gray-600 mb-4">
                We use services from third-party providers that may set their own cookies:
              </p>
              <ul className="text-gray-600 space-y-2 mb-4">
                <li><strong>Google Analytics:</strong> To understand website usage and improve our services</li>
                <li><strong>Payment Processors:</strong> To process secure payments</li>
                <li><strong>Social Media Platforms:</strong> To enable social sharing features</li>
                <li><strong>Customer Support Tools:</strong> To provide help and support</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border-2 border-gray-100">
              <h2 className="text-gray-900 mb-4">How to Control Cookies</h2>
              <p className="text-gray-600 mb-4">
                You have several options to control or limit how cookies are used:
              </p>
              
              <div className="mb-4">
                <h3 className="text-gray-900 mb-3">Browser Settings</h3>
                <p className="text-gray-600 mb-2">
                  Most web browsers allow you to control cookies through their settings:
                </p>
                <ul className="text-gray-600 space-y-1">
                  <li>• Block all cookies</li>
                  <li>• Allow only first-party cookies</li>
                  <li>• Delete cookies when you close your browser</li>
                  <li>• View and delete individual cookies</li>
                </ul>
              </div>

              <div className="mb-4">
                <h3 className="text-gray-900 mb-3">Cookie Consent Tool</h3>
                <p className="text-gray-600 mb-2">
                  When you first visit our website, we present a cookie consent banner where you can choose which types of cookies to accept.
                </p>
              </div>

              <div>
                <h3 className="text-gray-900 mb-3">Opt-Out Links</h3>
                <p className="text-gray-600 mb-2">
                  You can opt out of specific third-party cookies:
                </p>
                <ul className="text-gray-600 space-y-1">
                  <li>• Google Analytics: <a href="https://tools.google.com/dlpage/gaoptout" className="text-violet-600 hover:text-violet-700">Opt-out</a></li>
                  <li>• Network Advertising Initiative: <a href="http://optout.networkadvertising.org/" className="text-violet-600 hover:text-violet-700">Opt-out</a></li>
                  <li>• Digital Advertising Alliance: <a href="http://optout.aboutads.info/" className="text-violet-600 hover:text-violet-700">Opt-out</a></li>
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border-2 border-gray-100">
              <h2 className="text-gray-900 mb-4">Impact of Disabling Cookies</h2>
              <p className="text-gray-600 mb-4">
                If you choose to disable cookies, some features of our website may not function properly:
              </p>
              <ul className="text-gray-600 space-y-2 mb-4">
                <li>You may not be able to stay logged in</li>
                <li>Your preferences may not be saved</li>
                <li>Some interactive features may not work</li>
                <li>You may see less relevant content and advertisements</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border-2 border-gray-100">
              <h2 className="text-gray-900 mb-4">Cookie Retention</h2>
              <p className="text-gray-600 mb-4">
                Different cookies have different lifespans:
              </p>
              <ul className="text-gray-600 space-y-2 mb-4">
                <li><strong>Session Cookies:</strong> Deleted when you close your browser</li>
                <li><strong>Persistent Cookies:</strong> Remain on your device for a set period or until manually deleted</li>
                <li><strong>Third-Party Cookies:</strong> Managed by third-party providers with their own retention policies</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border-2 border-gray-100">
              <h2 className="text-gray-900 mb-4">Updates to This Policy</h2>
              <p className="text-gray-600 mb-4">
                We may update this Cookie Policy from time to time to reflect changes in our practices or for legal, regulatory, or operational reasons. We will notify you of any significant changes by posting the updated policy on this page.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-100">
              <h2 className="text-gray-900 mb-4">Contact Us</h2>
              <p className="text-gray-600 mb-4">
                If you have questions about our use of cookies, please contact us at:
              </p>
              <p className="text-gray-600">
                Email: privacy@smartcvmaker.com<br />
                Address: 123 Career Street, San Francisco, CA 94102
              </p>
              <p className="text-gray-600 mt-4">
                For more information about privacy, please see our <Link to="/privacy" className="text-violet-600 hover:text-violet-700">Privacy Policy</Link>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer/>
    </div>
  );
}
