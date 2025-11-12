import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner@2.0.3';
import { LandingPageOne } from './components/LandingPageOne';
import { LoginPage } from './components/LoginPage';
import { SignupPage } from './components/SignupPage';
import { ForgotPasswordPage } from './components/ForgotPasswordPage';
import { DashboardHome } from './components/DashboardHome';
import { ResumeEditor } from './components/ResumeEditor';
import { ATSScoreChecker}  from './components/ATSScoreChecker';
import { CoverLetterGenerator } from './components/CoverLetterGenerator';
import { JobFitAnalyzer } from './components/JobFitAnalyzer';
import { JobMatchResult } from './components/JobMatchResult';
import { LinkedInOptimizer } from './components/LinkedInOptimizer';
import { PortfolioGenerator } from './components/PortfolioGenerator';
import { PortfolioPreview } from './components/PortfolioPreview';
import { PricingPlans } from './components/PricingPlans';
import { SettingsPage } from './components/SettingsPage';
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<LandingPageOne />} />
          <Route element={<PublicRoute />}>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/preview_page.html" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardHome />} />
            <Route path="/resume-builder" element={<ResumeEditor />} />
            <Route path="/ats-checker" element={<ATSScoreChecker />} />
            <Route path="/cover-letter" element={<CoverLetterGenerator />} />
            <Route path="/job-fit" element={<JobFitAnalyzer />} />
            <Route path="/job-fit/result" element={<JobMatchResult />} />
            <Route path="/linkedin-optimizer" element={<LinkedInOptimizer />} />
            {/* <Route path="/portfolio" element={<PortfolioGenerator />} />
            <Route path="/portfolio/preview" element={<PortfolioPreview />} /> */}
            <Route path="/pricing" element={<PricingPlans />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        <Toaster position="top-right" richColors />
      </div>
    </Router>
  );
}