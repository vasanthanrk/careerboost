import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Card, CardContent } from './ui/card';
import { Sparkles, Mail, MessageSquare, MapPin, Phone, Send } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';
import { Header } from './header';
import { Footer } from './footer';

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Message sent successfully! We\'ll get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-violet-50/30">
      {/* Navigation */}
      <Header/>

      {/* Hero Section */}
      <section className="py-20 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-100 rounded-full mb-6">
            <MessageSquare className="w-4 h-4 text-violet-600" />
            <span className="text-violet-700">Get in Touch</span>
          </div>
          
          <h1 className="text-gray-900 mb-6">
            We'd Love to Hear From You
          </h1>
          
          <p className="text-gray-600 max-w-2xl mx-auto">
            Have questions, feedback, or need support? Our team is here to help you succeed in your career journey.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <Card className="border-2 border-violet-100">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-violet-100 to-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-7 h-7 text-violet-600" />
                </div>
                <h3 className="text-gray-900 mb-2">Email Us</h3>
                <p className="text-gray-600 mb-2">support@careerboost.com</p>
                <p className="text-gray-500">We reply within 24 hours</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-100">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-gray-900 mb-2">Call Us</h3>
                <p className="text-gray-600 mb-2">+1 (555) 123-4567</p>
                <p className="text-gray-500">Mon-Fri, 9am-6pm EST</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-100">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-7 h-7 text-green-600" />
                </div>
                <h3 className="text-gray-900 mb-2">Visit Us</h3>
                <p className="text-gray-600 mb-2">123 Career Street</p>
                <p className="text-gray-500">San Francisco, CA 94102</p>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <Card className="max-w-3xl mx-auto border-2 border-gray-100 shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-gray-900 mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="John Doe"
                      required
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john@example.com"
                      required
                      className="mt-2"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="How can we help you?"
                    required
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us more about your inquiry..."
                    required
                    className="mt-2 min-h-[150px]"
                  />
                </div>

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
                >
                  <Send className="w-5 h-5 mr-2" />
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <Footer/>
    </div>
  );
}
