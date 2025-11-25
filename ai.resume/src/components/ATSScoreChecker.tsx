import { useState, useEffect } from 'react';
import { DashboardLayout } from './DashboardLayout';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import FeedbackPopup from "./FeedbackPopup";
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import {
  Upload,
  FileText,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Download,
  Sparkles,
  TrendingUp,
  Eye,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import api from '../api/axiosClient';
import { Link } from 'react-router-dom';
import { handleFeatureCheck } from '../utils/featureCheck'
import FeatureLimitPopup from "./FeatureLimitPopup"
import { SEO } from './SEO';

interface ScoreData {
  overall: number;
  breakdown: {
    formatting: number;
    keywords: number;
    experience: number;
    education: number;
    skills: number;
    contact: number;
  };
  missingData: {
    category: string;
    items: string[];
    severity: 'critical' | 'warning' | 'info';
  }[];
  suggestions: string[];
  improvedResume: string;
  atsId: number;
}

const RESUME_TEMPLATES = [];

interface Template {
  id: string;
  name: string;
  thumbnail: string;
}

export function ATSScoreChecker() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scoreData, setScoreData] = useState<ScoreData | null>(null);
  const [showLimitPopup, setShowLimitPopup] = useState(false);
  const [activeFeature, setActiveFeature] = useState("");

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please upload a PDF or DOC file');
        return;
      }
      setUploadedFile(file);
      setScoreData(null);
      toast.success('File uploaded successfully! Click "Analyze Resume" to start.');
    }
  };

  const analyzeResume = async () => {
    if (!uploadedFile) {
      toast.error('Please upload a resume first');
      return;
    }

    setIsAnalyzing(true);
    const formData = new FormData();
    formData.append("file", uploadedFile);

    try {

      const allowed = await handleFeatureCheck("ats_using");
      if (!allowed) {
        setActiveFeature("ai_resume_generate");
        setShowLimitPopup(true);
        return
      };

      const res = await api.post("/ats/check", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const raw = res.data.analysis;
      // 🧠 Normalize backend response
      const normalized = {
        overall: raw.overall || 0,
        breakdown:
          Array.isArray(raw.breakdown) && raw.breakdown.length > 0
            ? raw.breakdown[0]
            : {},
        missingData:
          Array.isArray(raw.missing_data) && raw.missing_data.length > 0
            ? raw.missing_data[0]
            : [],
        suggestions:
          Array.isArray(raw.suggestions) && raw.suggestions.length > 0
            ? raw.suggestions[0]
            : [],
        improvedResume:
          Array.isArray(raw.improvedResume) && raw.improvedResume.length > 0
            ? raw.improvedResume[0]
            : {},
        atsId: res.data.ats_id || null,
      };
      setScoreData(normalized);
      toast.success("Analysis complete!");
    } catch (err: any) {
      console.error("ATS analysis error:", err);
      toast.error("Failed to analyze resume");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Needs Improvement';
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <DashboardLayout>
      <SEO
        title="ATS Score Checker"
        description="Check your resume's compatibility with Applicant Tracking Systems (ATS) and get actionable feedback."
      />
      {showLimitPopup && (
        <FeatureLimitPopup
          featureName={activeFeature}
          onClose={() => setShowLimitPopup(false)}
        />
      )}
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              ATS Resume Checker
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Upload your resume and get instant ATS compatibility score
            </p>
          </div>
          {scoreData && (
            <Button
              onClick={() => {
                setUploadedFile(null);
                setScoreData(null);
              }}
              variant="outline"
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Check Another Resume
            </Button>
          )}
        </div>

        {/* Upload Section */}
        {!scoreData && (
          <Card className="border-2 border-dashed border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-20 h-20 bg-violet-100 dark:bg-violet-900/30 rounded-full flex items-center justify-center mb-4">
                  <Upload className="w-10 h-10 text-violet-600 dark:text-violet-400" />
                </div>
                <h3 className="mb-2 text-gray-900 dark:text-white">
                  Upload Your Resume
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 text-center max-w-md">
                  Upload your resume in PDF or DOC format to get an instant ATS score and recommendations
                </p>
                <label htmlFor="resume-upload">
                  <Button className="gap-2 bg-gradient-to-r from-violet-600 to-purple-600 cursor-pointer" asChild>
                    <span>
                      <FileText className="w-4 h-4" />
                      Choose File
                    </span>
                  </Button>
                </label>
                <input
                  id="resume-upload"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                {uploadedFile && (
                  <div className="mt-4 flex items-center gap-2 text-green-600 dark:text-green-400">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>{uploadedFile.name}</span>
                  </div>
                )}
              </div>
              {uploadedFile && (
                <div className="flex justify-center pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    onClick={analyzeResume}
                    disabled={isAnalyzing}
                    className="gap-2 bg-gradient-to-r from-violet-600 to-purple-600"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Analyze Resume
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Results Section */}
        {scoreData && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Score & Breakdown */}
            <div className="lg:col-span-1 space-y-6">
              {/* Overall Score */}
              <Card className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30 border-violet-200 dark:border-violet-800">
                <CardHeader>
                  <CardTitle className="text-center">ATS Score</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col items-center">
                    <div className="relative w-40 h-40">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="80"
                          cy="80"
                          r="70"
                          stroke="currentColor"
                          strokeWidth="12"
                          fill="none"
                          className="text-gray-200 dark:text-gray-700"
                        />
                        <circle
                          cx="80"
                          cy="80"
                          r="70"
                          stroke="currentColor"
                          strokeWidth="12"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 70}`}
                          strokeDashoffset={`${2 * Math.PI * 70 * (1 - scoreData.overall / 100)}`}
                          className={`${getScoreColor(scoreData.overall)} transition-all duration-1000`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className={`${getScoreColor(scoreData.overall)}`}>
                          {scoreData.overall}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">out of 100</span>
                      </div>
                    </div>
                    <Badge
                      variant={scoreData.overall >= 80 ? 'default' : 'secondary'}
                      className="mt-4"
                    >
                      {getScoreLabel(scoreData.overall)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Score Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Score Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(scoreData.breakdown || {}).map(([key, value]) => (
                    <div key={key}>
                      <div className="flex justify-between mb-2">
                        <span className="capitalize text-gray-700 dark:text-gray-300">{key}</span>
                        <span className={`${getScoreColor(value)}`}>{value}%</span>
                      </div>
                      <Progress value={value} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardContent className="pt-6 space-y-3">
                  <Link to="/resume-builder">
                    <Button className="w-full gap-2 bg-gradient-to-r from-violet-600 to-purple-600">
                      <Eye className="w-4 h-4" />
                      View AI-Enhanced Resume
                    </Button>
                  </Link>
                  {/* <Button variant="outline" className="w-full gap-2">
                    
                    Preview Changes
                  </Button> */}
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Issues & Preview */}
            <div className="lg:col-span-2 space-y-6">
              {/* Missing Data */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-violet-600" />
                    Issues Found
                  </CardTitle>
                  <CardDescription>
                    Here's what needs improvement to boost your ATS score
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {scoreData?.missingData?.map((issue, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex items-start gap-3">
                        {getSeverityIcon(issue.severity)}
                        <div className="flex-1">
                          <h4 className="text-gray-900 dark:text-white mb-2">
                            {issue.category}
                          </h4>
                          <ul className="space-y-1">
                            {issue?.items?.map((item, idx) => (
                              <li key={idx} className="text-gray-600 dark:text-gray-400 flex items-start gap-2">
                                <span className="text-violet-600 dark:text-violet-400 mt-1">•</span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* AI Suggestions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-violet-600" />
                    AI Suggestions
                  </CardTitle>
                  <CardDescription>
                    Recommendations to improve your resume's ATS compatibility
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {scoreData.suggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-violet-50 dark:hover:bg-violet-950/30 transition-colors"
                      >
                        <TrendingUp className="w-5 h-5 text-violet-600 dark:text-violet-400 mt-0.5 flex-shrink-0" />
                        <p className="text-gray-700 dark:text-gray-300">{suggestion}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
