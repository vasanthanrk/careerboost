import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Sparkles, Shield } from 'lucide-react';
import { Header } from './header';
import { Footer } from './footer';

export function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-violet-50/30">
      {/* Navigation */}
      <Header/>

      {/* Hero Section */}
      <section className="py-20 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full mb-6">
            <Shield className="w-4 h-4 text-green-600" />
            <span className="text-green-700">Privacy Policy</span>
          </div>
          
          <h1 className="text-gray-900 mb-6">
            Your Privacy Matters to Us
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
              <h2 className="text-gray-900 mb-4">1. Information We Collect</h2>
              <p className="text-gray-600 mb-4">
                We collect information that you provide directly to us, including:
              </p>
              <ul className="text-gray-600 space-y-2 mb-4">
                <li>Account information (name, email address, password)</li>
                <li>Profile information (professional experience, skills, education)</li>
                <li>Resume and cover letter content</li>
                <li>Job preferences and career goals</li>
                <li>Payment information (processed securely through third-party providers)</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border-2 border-gray-100">
              <h2 className="text-gray-900 mb-4">2. How We Use Your Information</h2>
              <p className="text-gray-600 mb-4">
                We use the information we collect to:
              </p>
              <ul className="text-gray-600 space-y-2 mb-4">
                <li>Provide, maintain, and improve our services</li>
                <li>Generate AI-powered career documents and recommendations</li>
                <li>Process your transactions and send related information</li>
                <li>Send you technical notices, updates, and support messages</li>
                <li>Respond to your comments, questions, and customer service requests</li>
                <li>Monitor and analyze trends, usage, and activities</li>
                <li>Detect, prevent, and address technical issues and fraudulent activity</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border-2 border-gray-100">
              <h2 className="text-gray-900 mb-4">3. Information Sharing and Disclosure</h2>
              <p className="text-gray-600 mb-4">
                We do not sell your personal information. We may share your information only in the following circumstances:
              </p>
              <ul className="text-gray-600 space-y-2 mb-4">
                <li>With your consent or at your direction</li>
                <li>With service providers who perform services on our behalf</li>
                <li>To comply with legal obligations</li>
                <li>To protect the rights, property, and safety of CareerBoost and our users</li>
                <li>In connection with a merger, sale, or acquisition</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border-2 border-gray-100">
              <h2 className="text-gray-900 mb-4">4. Data Security</h2>
              <p className="text-gray-600 mb-4">
                We take reasonable measures to help protect your personal information from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction. We use industry-standard encryption and security practices.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border-2 border-gray-100">
              <h2 className="text-gray-900 mb-4">5. Data Retention</h2>
              <p className="text-gray-600 mb-4">
                We retain your personal information for as long as necessary to provide our services, comply with legal obligations, resolve disputes, and enforce our agreements. You may request deletion of your account and data at any time through your account settings.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border-2 border-gray-100">
              <h2 className="text-gray-900 mb-4">6. Your Rights</h2>
              <p className="text-gray-600 mb-4">
                Depending on your location, you may have the following rights:
              </p>
              <ul className="text-gray-600 space-y-2 mb-4">
                <li>Access to your personal information</li>
                <li>Correction of inaccurate data</li>
                <li>Deletion of your personal information</li>
                <li>Objection to processing of your data</li>
                <li>Data portability</li>
                <li>Withdrawal of consent</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border-2 border-gray-100">
              <h2 className="text-gray-900 mb-4">7. Cookies and Tracking</h2>
              <p className="text-gray-600 mb-4">
                We use cookies and similar tracking technologies to collect information about your browsing activities. You can control cookies through your browser settings. For more information, see our <Link to="/cookies" className="text-violet-600 hover:text-violet-700">Cookie Policy</Link>.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border-2 border-gray-100">
              <h2 className="text-gray-900 mb-4">8. Children's Privacy</h2>
              <p className="text-gray-600 mb-4">
                Our services are not directed to children under 16. We do not knowingly collect personal information from children under 16. If you become aware that a child has provided us with personal information, please contact us.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border-2 border-gray-100">
              <h2 className="text-gray-900 mb-4">9. Changes to This Policy</h2>
              <p className="text-gray-600 mb-4">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-100">
              <h2 className="text-gray-900 mb-4">10. Contact Us</h2>
              <p className="text-gray-600 mb-4">
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <p className="text-gray-600">
                Email: privacy@careerboost.com<br />
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
