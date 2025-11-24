import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from './DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Upload, FileText, Target } from 'lucide-react';
import { toast } from 'sonner';
import { Progress } from './ui/progress';
import api from '../api/axiosClient';
import FeatureLimitPopup from "./FeatureLimitPopup"
import { handleFeatureCheck } from '../utils/featureCheck'
import { SEO } from './SEO';

export function JobFitAnalyzer() {
  const navigate = useNavigate();
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  const [showLimitPopup, setShowLimitPopup] = useState(false);
  const [activeFeature, setActiveFeature] = useState("");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      processJD(formData);

      toast.success(`File "${file.name}" uploaded successfully`);
    }
  };

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      toast.error("Please upload a job description or paste text");
      return;
    }
    const formData = new FormData();
    formData.append("job_description", jobDescription);
    processJD(formData);
  };

  const processJD = async (formData: FormData) => {
    const allowed = await handleFeatureCheck("job_fit_analysis");
    if (!allowed) {
      setActiveFeature("job_fit_analysis");
      setShowLimitPopup(true);
      return
    };

    setIsAnalyzing(true);
    setAnalysisProgress(0);

    // Simulate progress while waiting for backend response
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 8) + 5; // +5–12% increments
      if (progress >= 95) progress = 95; // cap at 95% until API finishes
      setAnalysisProgress(progress);
    }, 300);

    try {
      const res = await api.post("/job/analyze", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Stop the progress interval and finish the bar
      clearInterval(interval);
      setAnalysisProgress(100);

      localStorage.setItem("job_analysis_result", JSON.stringify(res.data));
      toast.success("Analysis complete!");
      navigate("/job-fit/result");
    } catch (error) {
      toast.error("Job analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  }

  return (
    <DashboardLayout>
      <SEO
        title="Job Fit Analyzer"
        description="Analyze how well your resume matches a specific job description and get actionable improvement tips."
      />
      {showLimitPopup && (
        <FeatureLimitPopup
          featureName={activeFeature}
          onClose={() => setShowLimitPopup(false)}
        />
      )}

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="mb-2">Job Fit Analyzer</h1>
          <p className="text-gray-600">
            Upload or paste a job description to see how well your resume matches
          </p>
        </div>

        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle>Upload Job Description</CardTitle>
            <CardDescription>
              Upload a PDF or DOCX file, or paste the job description text
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* File Upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-violet-400 transition-colors">
              <label className="flex flex-col items-center justify-center cursor-pointer">
                <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mb-4">
                  <Upload className="w-8 h-8 text-violet-600" />
                </div>
                <p className="mb-2 text-gray-700">
                  Click to upload or drag and drop
                </p>
                <p className="text-gray-500">PDF or DOCX (Max 10MB)</p>
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.docx,.doc"
                  onChange={handleFileUpload}
                />
              </label>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-4 text-gray-500">OR</span>
              </div>
            </div>

            {/* Text Area */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-gray-700">
                <FileText className="w-4 h-4" />
                Paste Job Description
              </label>
              <Textarea
                placeholder="Paste the full job description here, including requirements, responsibilities, and qualifications..."
                rows={12}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>

            {/* Analyze Button */}
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="w-full bg-violet-600 hover:bg-violet-700"
              size="lg"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Target className="w-5 h-5 mr-2" />
                  Analyze Match
                </>
              )}
            </Button>

            {/* Progress Bar */}
            {isAnalyzing && (
              <div className="space-y-2">
                <Progress value={analysisProgress} className="h-2" />
                <p className="text-center text-violet-600">
                  Analyzing skills and experience... {analysisProgress}%
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Target className="w-5 h-5 text-violet-600" />
                </div>
                <div>
                  <h4 className="text-gray-900 mb-1">Match Score</h4>
                  <p className="text-gray-600">
                    See how well your resume aligns with the job requirements
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-gray-900 mb-1">Skills Analysis</h4>
                  <p className="text-gray-600">
                    Identify matched and missing skills for the role
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Upload className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h4 className="text-gray-900 mb-1">Recommendations</h4>
                  <p className="text-gray-600">
                    Get AI-powered suggestions to improve your match
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
