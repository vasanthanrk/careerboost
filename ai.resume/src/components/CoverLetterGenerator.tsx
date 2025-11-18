import "react-quill/dist/quill.snow.css";
import { useState } from 'react';
import { DashboardLayout } from './DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Sparkles, Copy, RefreshCw, Download, Mail, Wand2, FileText } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import api from '../api/axiosClient';
import ReactQuill from "react-quill";
import FeatureLimitPopup from "./FeatureLimitPopup" 
import { handleFeatureCheck } from '../utils/featureCheck'


export function CoverLetterGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    jobRole: '',
    companyName: '',
    jobDescription: '',
    tone:''
  });
  const [generatedLetter, setGeneratedLetter] = useState('');

  const [showLimitPopup, setShowLimitPopup] = useState(false);
  const [activeFeature, setActiveFeature] = useState("");

  const handleGenerate = async () => {
    if (!formData.jobRole || !formData.companyName) {
      toast.error('Please fill in Job Role and Company Name');
      return;
    }

    try {
      const allowed = await handleFeatureCheck("ai_cover_letter_generate");
      if (!allowed) {
        setActiveFeature("ai_cover_letter_generate");
        setShowLimitPopup(true);
        return
      };

      setIsGenerating(true);
      const res = await api.post('/ai/cover-letter', formData);
      const cover = res.data.cover_letter.split("\n").map(line => line.trim() ? `<p>${line}</p>` : "<p><br/></p>").join("");

      setGeneratedLetter(cover);
      toast.success('Cover letter generated successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to generate cover letter');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLetter);
    toast.success('Cover letter copied to clipboard!');
  };

  const handleRegenerate = () => {
    toast.info("Regenerating your cover letter...");
    handleGenerate();
  };

  const handleDownload = async () => {
    try {
      if (!formData.jobRole || !formData.companyName) {
        toast.error("Please fill job role and company name first");
        return;
      }
      const data = {
        ...formData,
        coverLetter: generatedLetter
      }

      const allowed = await handleFeatureCheck("cover_letter_download");
      if (!allowed) {
        setActiveFeature("cover_letter_download");
        setShowLimitPopup(true);
        return
      };

      toast.info("Preparing your PDF...");
      const res = await api.post("/ai/cover-letter/pdf", data, {
        responseType: "blob",
      });

      const fileName = `CoverLetter_${formData.jobRole.replace(/\s+/g, "_")}.pdf`;

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Cover letter downloaded successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Error generating cover letter PDF");
    }
  };

  return (
    <DashboardLayout>
      {showLimitPopup && (
        <FeatureLimitPopup
          featureName={activeFeature}
          onClose={() => setShowLimitPopup(false)}
        />
      )}
      
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Modern Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 p-8 text-white shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-300/20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full mb-3">
              <Mail className="w-4 h-4" />
              <span>AI Cover Letter Writer</span>
            </div>
            <h1 className="text-white mb-2">Cover Letter Generator</h1>
            <p className="text-emerald-100 max-w-3xl">
              Create personalized, compelling cover letters in seconds. Stand out from the crowd with AI-powered content tailored to each job opportunity.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Form */}
          <div className="space-y-6">
            <Card className="border-2 border-green-100 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-white" />
                  </div>
                  <CardTitle>Job Details</CardTitle>
                </div>
                <p className="text-gray-600">Tell us about the position you're applying for</p>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="jobRole" className="text-gray-700">Job Role / Position *</Label>
                  <Input
                    id="jobRole"
                    placeholder="e.g., Senior Software Engineer"
                    value={formData.jobRole}
                    onChange={(e) => setFormData({ ...formData, jobRole: e.target.value })}
                    className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyName" className="text-gray-700">Company Name *</Label>
                  <Input
                    id="companyName"
                    placeholder="e.g., TechCorp Inc."
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jobDescription" className="text-gray-700">Job Description (Optional)</Label>
                  <Textarea
                    id="jobDescription"
                    placeholder="Paste the job description here to generate a more tailored cover letter..."
                    rows={8}
                    value={formData.jobDescription}
                    onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
                    className="border-gray-300 focus:border-green-500 focus:ring-green-500 resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tone" className="text-gray-700">Tone Preference</Label>
                  <Select
                    value={formData.tone}
                    onValueChange={(value) => setFormData({ ...formData, tone: value })}
                  >
                    <SelectTrigger id="tone">
                      <SelectValue placeholder="Select a tone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                      <SelectItem value="confident">Confident</SelectItem>
                      <SelectItem value="friendly">Friendly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 gap-2 py-6 shadow-lg"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Generating Your Letter...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generate Cover Letter
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Tips Card */}
            <Card className="border-2 border-emerald-100 bg-gradient-to-br from-white to-emerald-50/30 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center">
                    <Wand2 className="w-4 h-4 text-white" />
                  </div>
                  <CardTitle>Pro Tips</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex gap-3 p-3 rounded-xl bg-white border border-emerald-100">
                    <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-green-600 to-emerald-600 text-white rounded-full flex items-center justify-center text-sm">
                      1
                    </div>
                    <p className="text-gray-700">Include specific job requirements to get a more targeted letter</p>
                  </div>
                  <div className="flex gap-3 p-3 rounded-xl bg-white border border-emerald-100">
                    <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-green-600 to-emerald-600 text-white rounded-full flex items-center justify-center text-sm">
                      2
                    </div>
                    <p className="text-gray-700">Always personalize the generated content before sending</p>
                  </div>
                  <div className="flex gap-3 p-3 rounded-xl bg-white border border-emerald-100">
                    <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-green-600 to-emerald-600 text-white rounded-full flex items-center justify-center text-sm">
                      3
                    </div>
                    <p className="text-gray-700">Highlight achievements and metrics that match the job</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Generated Letter */}
          <div className="space-y-6">
            <Card className="border-2 border-gray-200 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-purple-600 rounded-lg flex items-center justify-center">
                        <Mail className="w-4 h-4 text-white" />
                      </div>
                      <CardTitle>Generated Cover Letter</CardTitle>
                    </div>
                    <p className="text-gray-600">Your AI-powered cover letter</p>
                  </div>
                  {generatedLetter && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopy}
                        className="gap-2 border-violet-300 hover:bg-violet-50"
                      >
                        <Copy className="w-4 h-4" />
                        Copy
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRegenerate}
                        className="gap-2 border-green-300 hover:bg-green-50"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {generatedLetter ? (
                  <div className="space-y-4">
                    <div className="bg-white border-2 border-gray-200 rounded-xl p-6 min-h-[500px]">
                      <ReactQuill theme="snow" value={generatedLetter} onChange={setGeneratedLetter} className="h-[400px]" placeholder="Edit your cover letter here..."
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button
                        onClick={handleDownload}
                        className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download as PDF
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleCopy}
                        className="flex-1 gap-2 border-2 border-violet-300 hover:bg-violet-50"
                      >
                        <Copy className="w-4 h-4" />
                        Copy to Clipboard
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mb-4">
                      <Mail className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-gray-900 mb-2">No Cover Letter Yet</h3>
                    <p className="text-gray-600 max-w-sm">
                      Fill in the job details and click "Generate" to create your personalized cover letter
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Pro Tip Banner */}
        {/* <Card className="border-2 border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50 shadow-lg">
          <CardContent className="py-6">
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="text-orange-900 mb-2">Upgrade for Advanced Features</h4>
                <p className="text-orange-700 mb-4">
                  Get access to multiple cover letter templates, tone customization, and unlimited generations with our Pro plan.
                </p>
                <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white">
                  Upgrade Now
                </Button>
              </div>
            </div>
          </CardContent>
        </Card> */}
      </div>
    </DashboardLayout>
  );
}
