import { useState, useEffect } from 'react';
import { DashboardLayout } from './DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { CheckCircle2, XCircle, ArrowRight, Sparkles, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export function JobMatchResult() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [matchedSkills, setmMtchedSkills] = useState([]);
  const [missingSkills, setMissingSkills] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [matchScore, setMatchScore] = useState(0);
  const [scoreBreakdown, setScoreBreakdown] = useState([]);
  

  useEffect(() => {
    try {
      const stored = localStorage.getItem("job_analysis_result");
      if (!stored) throw new Error("No job analysis data found.");

      const data = JSON.parse(stored);
      setmMtchedSkills(data.matched_skills || []);
      setMissingSkills(data.missing_skills || []);
      setRecommendations(data.recommendations || []);
      setMatchScore(data.match_score || 0);
      setScoreBreakdown(data.score_breakdown || {});
      setIsAnalyzing(true);
    } catch (err) {
      console.warn(err.message);
      setIsAnalyzing(false);
    }
  }, []);

  return (
    <DashboardLayout>
       {!isAnalyzing ? (
        <div className="flex flex-col items-center justify-center h-[70vh] text-center space-y-4">
          <h2 className="text-2xl font-semibold text-gray-700">
            No Job Analysis Found
          </h2>
          <p className="text-gray-500 max-w-md">
            It seems you haven’t analyzed any job description yet.  
            Please upload your resume and a job post to start your AI-powered match analysis.
          </p>
          <Link to="/job-analyzer">
            <Button className="bg-violet-600 hover:bg-violet-700 text-white">
              Analyze a Job
            </Button>
          </Link>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div>
            <h1 className="mb-2">Job Match Analysis</h1>
            <p className="text-gray-600">
              Here's how your resume matches the job requirements
            </p>
          </div>

          {/* Match Score */}
          <Card className="border-violet-200 bg-gradient-to-br from-violet-50 to-white">
            <CardContent className="pt-8 pb-8">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="relative">
                  <div className="w-40 h-40 rounded-full border-8 border-violet-200 flex items-center justify-center bg-white">
                    <div className="text-center">
                      <div className="text-violet-600">{matchScore}%</div>
                      <p className="text-gray-600">Match</p>
                    </div>
                  </div>
                  <div 
                    className="absolute inset-0 rounded-full border-8 border-violet-600"
                    style={{
                      clipPath: `polygon(0 0, 100% 0, 100% ${matchScore}%, 0 ${matchScore}%)`,
                    }}
                  />
                </div>

                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-violet-900 mb-2">Strong Match!</h2>
                  <p className="text-gray-700 mb-4">
                    Your profile aligns well with this position. With a few improvements, you could be an excellent candidate.
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                      {matchedSkills.length} Skills Matched
                    </Badge>
                    <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">
                      {missingSkills.length} Skills to Add
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills Comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Matched Skills */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <CardTitle>Matched Skills</CardTitle>
                </div>
                <CardDescription>
                  Skills from your resume that match the job description
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {matchedSkills.map((skill, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100"
                    >
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span className="text-gray-900">{skill}</span>
                      </div>
                      <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
                        Match
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Missing Skills */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-orange-600" />
                  <CardTitle>Skills to Add</CardTitle>
                </div>
                <CardDescription>
                  Key skills from the job description not found in your resume
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {missingSkills.map((skill, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-100"
                    >
                      <div className="flex items-center gap-3">
                        <XCircle className="w-4 h-4 text-orange-600 flex-shrink-0" />
                        <span className="text-gray-900">{skill}</span>
                      </div>
                      <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-200">
                        Missing
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-violet-600" />
                <CardTitle>AI Recommendations</CardTitle>
              </div>
              <CardDescription>
                Personalized suggestions to improve your match score
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendations.map((rec, index) => (
                  <div 
                    key={index}
                    className={`p-4 rounded-lg border-l-4 ${
                      rec.priority === 'high' 
                        ? 'bg-red-50 border-red-500' 
                        : 'bg-yellow-50 border-yellow-500'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-gray-900">{rec.title}</h4>
                          <Badge 
                            variant="outline" 
                            className={
                              rec.priority === 'high'
                                ? 'bg-red-100 text-red-700 border-red-200'
                                : 'bg-yellow-100 text-yellow-700 border-yellow-200'
                            }
                          >
                            {rec.priority === 'high' ? 'High Priority' : 'Medium Priority'}
                          </Badge>
                        </div>
                        <p className="text-gray-700">{rec.description}</p>
                      </div>
                      <TrendingUp className={`w-5 h-5 flex-shrink-0 ${
                        rec.priority === 'high' ? 'text-red-600' : 'text-yellow-600'
                      }`} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <Card className="bg-violet-600 text-white border-violet-600">
            <CardContent className="py-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-white mb-2">Ready to improve your resume?</h3>
                  <p className="text-violet-100">
                    Use our AI-powered Resume Builder to address the missing skills and boost your match score
                  </p>
                </div>
                <Link to="/resume-builder">
                  <Button size="lg" variant="secondary" className="whitespace-nowrap">
                    Improve Resume
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Match Progress */}
          {scoreBreakdown && Object.keys(scoreBreakdown).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Score Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(scoreBreakdown).map(([label, value]) => (
                  <div key={label} className="space-y-2">
                    <div className="flex justify-between text-gray-700">
                      <span>{label}</span>
                      <span>{value}%</span>
                    </div>
                    <Progress value={value} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      )}
      
    </DashboardLayout>
  );
}
