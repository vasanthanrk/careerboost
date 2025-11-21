import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Sparkles, FileText } from 'lucide-react';
import { Header } from './header';
import { Footer } from './footer';

export function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-violet-50/30">
      {/* Navigation */}
      <Header/>

      {/* Hero Section */}
      <section className="py-20 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-6">
            <FileText className="w-4 h-4 text-blue-600" />
            <span className="text-blue-700">Terms of Service</span>
          </div>
          
          <h1 className="text-gray-900 mb-6">
            Terms of Service
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
              <h2 className="text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-600 mb-4">
                By accessing or using SmartCV Maker's services, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not use our services.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border-2 border-gray-100">
              <h2 className="text-gray-900 mb-4">2. Description of Service</h2>
              <p className="text-gray-600 mb-4">
                SmartCV Maker provides AI-powered career development tools including:
              </p>
              <ul className="text-gray-600 space-y-2 mb-4">
                <li>Resume builder and optimization</li>
                <li>Cover letter generation</li>
                <li>ATS score checking</li>
                <li>Job fit analysis</li>
                <li>LinkedIn profile optimization</li>
                {/* <li>Portfolio creation</li> */}
              </ul>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border-2 border-gray-100">
              <h2 className="text-gray-900 mb-4">3. User Accounts</h2>
              <p className="text-gray-600 mb-4">
                To use certain features of our service, you must create an account. You agree to:
              </p>
              <ul className="text-gray-600 space-y-2 mb-4">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain the security of your password</li>
                <li>Notify us immediately of any unauthorized use</li>
                <li>Be responsible for all activities under your account</li>
                <li>Not share your account credentials with others</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border-2 border-gray-100">
              <h2 className="text-gray-900 mb-4">4. User Content</h2>
              <p className="text-gray-600 mb-4">
                You retain ownership of any content you submit to SmartCV Maker. By submitting content, you grant us a license to:
              </p>
              <ul className="text-gray-600 space-y-2 mb-4">
                <li>Use, modify, and process your content to provide our services</li>
                <li>Store your content securely in our systems</li>
                <li>Generate AI-powered recommendations based on your content</li>
              </ul>
              <p className="text-gray-600 mb-4">
                You are responsible for the accuracy and legality of your content. You must not submit content that:
              </p>
              <ul className="text-gray-600 space-y-2 mb-4">
                <li>Violates any laws or regulations</li>
                <li>Infringes on intellectual property rights</li>
                <li>Contains false or misleading information</li>
                <li>Contains viruses or malicious code</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border-2 border-gray-100">
              <h2 className="text-gray-900 mb-4">5. Subscription and Payment</h2>
              <p className="text-gray-600 mb-4">
                Certain features require a paid subscription:
              </p>
              <ul className="text-gray-600 space-y-2 mb-4">
                <li>Subscriptions are billed in advance on a monthly or annual basis</li>
                <li>You can cancel your subscription at any time</li>
                <li>Refunds are provided according to our refund policy</li>
                <li>We reserve the right to change pricing with 30 days notice</li>
                <li>All payments are processed securely through third-party providers</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border-2 border-gray-100">
              <h2 className="text-gray-900 mb-4">6. Prohibited Uses</h2>
              <p className="text-gray-600 mb-4">
                You agree not to:
              </p>
              <ul className="text-gray-600 space-y-2 mb-4">
                <li>Use the service for any illegal purpose</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Reverse engineer or attempt to extract source code</li>
                <li>Use automated systems to access the service</li>
                <li>Resell or redistribute our services without permission</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Transmit spam or unsolicited communications</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border-2 border-gray-100">
              <h2 className="text-gray-900 mb-4">7. Intellectual Property</h2>
              <p className="text-gray-600 mb-4">
                All content, features, and functionality of SmartCV Maker are owned by us and are protected by intellectual property laws. You may not:
              </p>
              <ul className="text-gray-600 space-y-2 mb-4">
                <li>Copy, modify, or create derivative works</li>
                <li>Remove any copyright or proprietary notices</li>
                <li>Use our trademarks without permission</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border-2 border-gray-100">
              <h2 className="text-gray-900 mb-4">8. AI-Generated Content</h2>
              <p className="text-gray-600 mb-4">
                Our AI-powered tools generate content based on your input. While we strive for accuracy:
              </p>
              <ul className="text-gray-600 space-y-2 mb-4">
                <li>You should review and edit all AI-generated content</li>
                <li>We do not guarantee the accuracy or effectiveness of AI suggestions</li>
                <li>You are responsible for the final content you submit to employers</li>
                <li>AI-generated content should be used as a starting point, not a final product</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border-2 border-gray-100">
              <h2 className="text-gray-900 mb-4">9. Disclaimers and Limitations</h2>
              <p className="text-gray-600 mb-4">
                THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. WE DO NOT GUARANTEE:
              </p>
              <ul className="text-gray-600 space-y-2 mb-4">
                <li>Job placement or interview opportunities</li>
                <li>Specific results or outcomes</li>
                <li>Uninterrupted or error-free service</li>
                <li>That defects will be corrected</li>
              </ul>
              <p className="text-gray-600 mb-4">
                WE ARE NOT LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES ARISING FROM YOUR USE OF THE SERVICE.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border-2 border-gray-100">
              <h2 className="text-gray-900 mb-4">10. Termination</h2>
              <p className="text-gray-600 mb-4">
                We may terminate or suspend your account immediately, without prior notice, for:
              </p>
              <ul className="text-gray-600 space-y-2 mb-4">
                <li>Violation of these Terms of Service</li>
                <li>Fraudulent, abusive, or illegal activity</li>
                <li>Extended periods of inactivity</li>
              </ul>
              <p className="text-gray-600 mb-4">
                You may cancel your account at any time through your account settings.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border-2 border-gray-100">
              <h2 className="text-gray-900 mb-4">11. Changes to Terms</h2>
              <p className="text-gray-600 mb-4">
                We reserve the right to modify these terms at any time. We will notify users of significant changes via email or through the service. Your continued use after changes constitutes acceptance of the new terms.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-100">
              <h2 className="text-gray-900 mb-4">12. Contact Information</h2>
              <p className="text-gray-600 mb-4">
                For questions about these Terms of Service, please contact us at:
              </p>
              <p className="text-gray-600">
                Email: legal@smartcvmaker.com<br />
                Address: 123 Career Street, San Francisco, CA 94102
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
