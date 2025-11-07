import { useState } from 'react';
import { DashboardLayout } from './DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Sparkles, Copy, ArrowRight, TrendingUp } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import api from '../api/axiosClient';

export function LinkedInOptimizer() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasResult, setHasResult] = useState(false);
  const [formData, setFormData] = useState({
    aboutSection: '',
    targetRole: '',
    headline: '',
    currentPosition: '',
    skills: ''
  });

  const [optimizedText, setOptimizedText] = useState('');
  const [improvementScore, setImprovementScore] = useState(0);
  const [profileMetrics, setProfileMetrics] = useState(0);
  const [improvements, setImprovements] = useState([]);
  const [optimizedHeadline, setOptimizedHeadline] = useState('');
  // helper: chunk an array into N columns (here 2)
  function chunkArray(arr, n) {
    const cols = Array.from({ length: n }, () => []);
    arr.forEach((item, i) => {
      cols[i % n].push(item);
    });
    return cols;
  }

  const handleAnalyze = async () => {
    if (!formData.aboutSection || !formData.targetRole) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsAnalyzing(true);

    const fd = new FormData();
    fd.append('about_section', formData.aboutSection);
    fd.append('target_role', formData.targetRole);
    fd.append('headline', formData.headline);
    fd.append('current_position', formData.currentPosition);
    fd.append('skills', JSON.stringify(formData.skills.split(',').map(s => s.trim())));

    try {
      const res = await api.post('/linkedin/optimize', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const data = res.data;

      setOptimizedText(data.optimized_about);
      setImprovementScore(data.improvement_score);
      setProfileMetrics(data.metrics);
      setHasResult(true);
      setIsAnalyzing(false);
      setImprovements(chunkArray(data.recommendations, 2));
      setOptimizedHeadline(data.optimized_headline);

      toast.success('LinkedIn profile optimized successfully!');
    } catch (error) {
      setIsAnalyzing(false);
      toast.error('Failed to optimize LinkedIn profile. Please try again.');
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="mb-2">LinkedIn Optimizer</h1>
          <p className="text-gray-600">
            Enhance your LinkedIn profile with AI-powered suggestions
          </p>
        </div>

        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle>Your LinkedIn About Section</CardTitle>
            <CardDescription>
              Paste your current About section and target role for personalized optimization
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="targetRole">Target Role</Label>
              <Select
                value={formData.targetRole}
                onValueChange={(value) => setFormData({ ...formData, targetRole: value })}
              >
                <SelectTrigger id="targetRole">
                  <SelectValue placeholder="Select your target role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Software Engineer">Software Engineer</SelectItem>
                  <SelectItem value="Senior Software Engineer">Senior Software Engineer</SelectItem>
                  <SelectItem value="Full Stack Developer">Full Stack Developer</SelectItem>
                  <SelectItem value="Frontend Developer">Frontend Developer</SelectItem>
                  <SelectItem value="Backend Developer">Backend Developer</SelectItem>
                  <SelectItem value="DevOps Engineer">DevOps Engineer</SelectItem>
                  <SelectItem value="Product Manager">Product Manager</SelectItem>
                  <SelectItem value="Data Scientist">Data Scientist</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="headline">Headline</Label>
              <Textarea
                id="headline"
                placeholder="e.g., Full Stack Developer | Building Scalable Web Apps"
                rows={2}
                value={formData.headline}
                onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentPosition">Current Position</Label>
              <Textarea
                id="currentPosition"
                placeholder="e.g., Senior Software Engineer at TechCorp"
                rows={2}
                value={formData.currentPosition}
                onChange={(e) => setFormData({ ...formData, currentPosition: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="skills">Skills</Label>
              <Textarea
                id="skills"
                placeholder="e.g., JavaScript, React, Node.js, AWS, SQL"
                rows={2}
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="aboutSection">Current About Section</Label>
              <Textarea
                id="aboutSection"
                placeholder="Paste your current LinkedIn About section here..."
                rows={8}
                value={formData.aboutSection}
                onChange={(e) => setFormData({ ...formData, aboutSection: e.target.value })}
              />
            </div>

            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="w-full bg-violet-600 hover:bg-violet-700"
              size="lg"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Analyzing & Optimizing...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Analyze & Improve
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        {hasResult && (
          <>
            {/* Improvement Score */}
            <Card className="border-violet-200 bg-gradient-to-br from-violet-50 to-white">
              <CardContent className="pt-6">
                <div className="flex items-center gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 bg-white rounded-full border-4 border-violet-600 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-violet-600">+{improvementScore}%</div>
                        <p className="text-violet-700">Better</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-violet-900 mb-2">Profile Strength Improved!</h3>
                    <p className="text-gray-700 mb-3">
                      Your optimized profile is {improvementScore}% more likely to appear in recruiter searches
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                        Keywords Optimized
                      </Badge>
                      <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                        ATS Friendly
                      </Badge>
                      <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">
                        Engaging Format
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {optimizedHeadline && (
              <Card className="border-violet-200">
                <CardHeader>
                  <CardTitle>Optimized Headline</CardTitle>
                  <CardDescription>AI-enhanced version of your LinkedIn headline</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-violet-50 border border-violet-200 rounded-lg p-4">
                    {optimizedHeadline}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Comparison */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Original */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Original</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(formData.aboutSection)}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                  <CardDescription>Your current About section</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 min-h-[400px] whitespace-pre-wrap">
                    {formData.aboutSection}
                  </div>
                </CardContent>
              </Card>

              {/* Optimized */}
              <Card className="border-violet-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CardTitle>Optimized</CardTitle>
                      <Sparkles className="w-4 h-4 text-violet-600" />
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(optimizedText)}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                  <CardDescription>AI-enhanced version</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-violet-50 border border-violet-200 rounded-lg p-6 min-h-[400px] whitespace-pre-wrap">
                    {optimizedText}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Improvements */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-violet-600" />
                  <CardTitle>Key Improvements</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.isArray(improvements) && improvements.map((col, colIndex) => (
                  <div key={colIndex} className="space-y-3">
                    {col.map((imp, idx) => {
                      return (
                        <div key={idx} className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 text-green-700 font-bold">
                            ✓
                          </div>
                          <div>
                            <h4 className="text-gray-900 mb-1">{imp}</h4>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Strength Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Strength Comparison</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {profileMetrics && (
                  <>
                    {Object.entries(profileMetrics).map(([label, value]) => (
                      <div key={label} className="space-y-2">
                        <div className="flex justify-between text-gray-700 capitalize">
                          <span>{label.replace(/_/g, ' ')}</span>
                          <span>{value}%</span>
                        </div>
                        <Progress value={value} className="h-2" />
                      </div>
                    ))}
                  </>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {/* Tips */}
        <Card className="bg-violet-50 border-violet-200">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <Sparkles className="w-5 h-5 text-violet-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-violet-900 mb-2">LinkedIn Profile Tips</h4>
                <ul className="text-violet-700 space-y-1 list-disc list-inside">
                  <li>Update your headline to include your target role and key skills</li>
                  <li>Use a professional profile photo and custom background image</li>
                  <li>Request recommendations from colleagues and managers</li>
                  <li>Share industry insights and engage with your network regularly</li>
                  <li>Join relevant groups and participate in discussions</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
