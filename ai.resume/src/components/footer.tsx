import { 
  FileText, 
  Mail, 
  Target, 
  Linkedin, 
  Sparkles,
  Users,
  TrendingUp,
  Shield,
  CheckCircle2,
  
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    
    <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
                <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span>SmartCV Maker</span>
                </div>
                <p className="text-gray-400">
                AI-powered tools to accelerate your career journey.
                </p>
            </div>
            
            <div>
                <h4 className="text-white mb-4">Features</h4>
                <div className="space-y-2">
                <Link to="/resume-builder" className="block text-gray-400 hover:text-white transition-colors">Resume Builder</Link>
                <Link to="/ats-checker" className="block text-gray-400 hover:text-white transition-colors">ATS Checker</Link>
                <Link to="/cover-letter" className="block text-gray-400 hover:text-white transition-colors">Cover Letter</Link>
                <Link to="/job-fit" className="block text-gray-400 hover:text-white transition-colors">Job Fit Analyzer</Link>
                <Link to="/linkedin-optimizer" className="block text-gray-400 hover:text-white transition-colors">LinkedIn Optimizer</Link>
                </div>
            </div>
            
            <div>
                <h4 className="text-white mb-4">Company</h4>
                <div className="space-y-2">
                {/* <Link to="/pricing" className="block text-gray-400 hover:text-white transition-colors">Pricing</Link> */}
                <Link to="/about" className="block text-gray-400 hover:text-white transition-colors">About Us</Link>
                <Link to="/contact" className="block text-gray-400 hover:text-white transition-colors">Contact</Link>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Blog</a>
                </div>
            </div>
            
            <div>
                <h4 className="text-white mb-4">Legal</h4>
                <div className="space-y-2">
                <Link to="/privacy" className="block text-gray-400 hover:text-white transition-colors">Privacy Policy</Link>
                <Link to="/terms" className="block text-gray-400 hover:text-white transition-colors">Terms of Service</Link>
                <Link to="/cookies" className="block text-gray-400 hover:text-white transition-colors">Cookie Policy</Link>
                </div>
            </div>
            </div>
            
            <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2025 SmartCV Maker. All rights reserved. Powered by Inspira</p>
            </div>
        </div>
    </footer>
  );
}
