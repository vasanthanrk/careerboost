import { useState, useEffect } from 'react';
import { DashboardLayout } from './DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ScrollArea } from './ui/scroll-area';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import FeedbackPopup from "./FeedbackPopup";
import FeatureLimitPopup from "./FeatureLimitPopup" 
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Sparkles, Download, Save, Plus, Trash2, FileText, Eye, Wand2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import api from '../api/axiosClient';
import { handleFeatureCheck } from '../utils/featureCheck'

export function ResumeEditor() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiPrompt, setAiPrompt] = useState({
    jobRole: '',
    experienceLevel: '',
    additionalInfo: ''
  });
  const [resumeData, setResumeData] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [newSkill, setNewSkill] = useState('');
  const [newKeyword, setNewKeyword] = useState('');

  const [isOpen, setIsOpen] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showFeedbackOnDownload, setShowFeedbackOnDownload] = useState(false);
  const [showFeedbackOnResumeAi, setShowFeedbackOnResumeAi] = useState(false);

  const [showLimitPopup, setShowLimitPopup] = useState(false);
  const [activeFeature, setActiveFeature] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  
  useEffect(() => {
    const fetchResume = async () => {
      try {
        const res = await api.get('/resume');

        // Handle case where backend returns nested resume_data
        const data = res.data?.resume_data ? res.data.resume_data : res.data;

        // Validate structure and set default fields
        setResumeData({
          name: data?.name || '',
          email: data?.email || '',
          phone: data?.phone || '',
          location: data?.location || '',
          jobrole: data?.jobrole || '',
          linkedin_url: data?.linkedin_url || '',
          git_url: data?.git_url || '',
          portfolio_url: data?.portfolio_url || '',
          summary: data?.summary || '',
          experiences: Array.isArray(data?.experiences) ? data.experiences : [],
          educations: Array.isArray(data?.educations) ? data.educations : [],
          skills: Array.isArray(data?.skills) ? data.skills : [],
          projects: Array.isArray(data?.projects) ? data.projects : [],
          certifications: Array.isArray(data?.certifications) ? data.certifications : [],
          languages: Array.isArray(data?.languages) ? data.languages : [],
          achievements: Array.isArray(data?.achievements) ? data.achievements : [],
          keywords: Array.isArray(data?.keywords) ? data.keywords : []
        });
      } catch (err: any) {
        if (err.response?.status === 404) {
          // No resume yet — initialize empty
          setResumeData({
            name: '',
            email: '',
            phone: '',
            location: '',
            summary: '',
            experiences: [],
            educations: [],
            skills: [],
            projects: [],
            keywords:[]
          });
        } else {
          console.error("Resume fetch error:", err);
          toast.error('Failed to load resume data');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchResume();
  }, []);


  useEffect(() => {
    if (isOpen) {
      api.get('/resume/templates').then(res => setTemplates(res.data));
    }
  }, [isOpen]);

  const handleAIGenerate = async () => {
    if (!aiPrompt.jobRole || !aiPrompt.experienceLevel) {
      toast.error('Please fill in all required fields');
      return;
    }
    try {
      const allowed = await handleFeatureCheck("ai_resume_generate");
      if (!allowed) {
        setShowAIModal(false);
        setActiveFeature("ai_resume_generate");
        setShowLimitPopup(true);
        return
      };

      setIsGenerating(true);
      const res = await api.post("/ai/generate", aiPrompt);

      // Update resumeData with generated content
      setResumeData((prev) => ({
        ...prev,
        ...res.data,
        experiences: res.data.experiences || [],
        educations: res.data.educations || [],
        skills: res.data.skills || [],
        projects: res.data.projects || [],
      }));

      // setTimeout(() => setShowFeedbackOnResumeAi(true), 500);
      
      toast.success("AI Resume generated successfully!");
      setShowAIModal(false);
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to generate resume with AI");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!resumeData) return;
    setIsSaving(true);
    try {
      const cleanData = {
        ...resumeData,
        experiences: resumeData.experiences.filter(exp => exp.title.trim() !== ''),
        educations: resumeData.educations.filter(edu => edu.degree.trim() !== ''),
        projects: resumeData.projects.filter(pro => pro.name.trim() !== '')
      };
      
      const res = await api.post('/resume', cleanData);
      setResumeData(res.data);
      toast.success('Resume saved successfully!');
      setIsOpen(true)
    } catch (err) {
      toast.error('Error saving resume');
    } finally {
      setIsSaving(false);
    }
  };

  // Add a new blank experience entry
  const handleAddExperience = () => {
    setResumeData((prev: any) => ({
      ...prev,
      experiences: [
        ...(prev.experiences || []),
        { title: '', company: '', duration: '', description: '' },
      ],
    }));
  };

  // Update a specific experience field
  const handleExperienceChange = (index: number, field: string, value: string) => {
    const updated = [...resumeData.experiences];
    updated[index][field] = value;
    setResumeData({ ...resumeData, experiences: updated });
  };

  // Remove a specific experience entry
  const handleRemoveExperience = (index: number) => {
    const updated = resumeData.experiences.filter((_, i) => i !== index);
    setResumeData({ ...resumeData, experiences: updated });
  };

  const handleDownload = async () => {
    try {
      const allowed = await handleFeatureCheck("resume_download");
      if (!allowed) {
        setIsOpen(false)
        setActiveFeature("resume_download");
        setShowLimitPopup(true);
        return
      };
      
      // Make API call to generate PDF
      const response = await api.get("/resume/download/" + selectedTemplate, {
        responseType: "blob", // Important for binary data
      });

      // Extract file name from Content-Disposition header (if available)
      const contentDisposition = response.headers["content-disposition"];
      let fileName = "resume.pdf";
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?([^"]+)"?/);
        if (match && match[1]) {
          fileName = match[1];
        }
      }

      // Create Blob from response data
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      // Create a temporary <a> element and trigger download
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();

      // Clean up memory
      window.URL.revokeObjectURL(url);
      setIsOpen(false)

      const showFeedback = response.headers["x-show-feedback"] === "true";
      console.log(response.headers);
      console.log(showFeedback);
      if (showFeedback) {
        setTimeout(() => setShowFeedbackOnDownload(true), 500);
      }
    
      toast.success(`PDF downloaded: ${fileName}`);
    } catch (err) {
      console.error("Error downloading PDF:", err);

      if (err.response) {
        const status = err.response.status;
        const detail = err.response.data?.detail;

        if (status === 404) {
          toast.error(detail || "Resume not found. Please create a resume first.");
          return;
        }

        toast.error(detail || "Failed to download PDF");
        return;
      }
      toast.error("Network error. Please try again.");
    }
  };

  // When user presses Enter
  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const skillName = newSkill.trim();

      if (!skillName) return;

      // Avoid duplicates
      if (resumeData.skills.some((s) => s.skill.toLowerCase() === skillName.toLowerCase())) {
        toast.warning('Skill already added!');
        setNewSkill('');
        return;
      }

      const updatedSkills = [...(resumeData.skills || []), { skill: skillName }];
      setResumeData((prev) => ({ ...prev, skills: updatedSkills }));
      setNewSkill('');
    }
  };

  // When user presses Enter
  const handleKeywordKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const keyword = newKeyword.trim();

      if (!keyword) return;

      // Avoid duplicates (case-insensitive)
      if (
        resumeData.keywords &&
        resumeData.keywords.some(
          (k) => k.toLowerCase() === keyword.toLowerCase()
        )
      ) {
        toast.warning("Keyword already added!");
        setNewKeyword("");
        return;
      }

      const updatedKeywords = [...(resumeData.keywords || []), keyword];

      setResumeData((prev) => ({...prev,keywords: updatedKeywords,}));
      setNewKeyword("");
    }
  };

  const handleRemoveSkill = (index: number) => {
    setResumeData((prev: any) => ({
      ...prev,
      skills: prev.skills.filter((_: any, i: number) => i !== index)
    }));
  };

  const handleRemoveKeyword = (keyword) => {
    setResumeData((prev) => ({
      ...prev,
      keywords: prev.keywords.filter((k) => k !== keyword)
    }));
  };

  // Add new education block
  const handleAddEducation = () => {
    const newEdu = { degree: '', school: '', year: '' };
    setResumeData((prev) => ({
      ...prev,
      educations: [...(prev.educations || []), newEdu],
    }));
  };

  // Update a specific education field
  const handleEducationChange = (index, field, value) => {
    const updated = [...resumeData.educations];
    updated[index][field] = value;
    setResumeData((prev) => ({ ...prev, educations: updated }));
  };

  // Remove a specific education block
  const handleRemoveEducation = (index) => {
    const updated = [...resumeData.educations];
    updated.splice(index, 1);
    setResumeData((prev) => ({ ...prev, educations: updated }));
  };

  // Add new project
  const handleAddProject = () => {
    const newProject = { name: '', description: '' };
    setResumeData((prev) => ({
      ...prev,
      projects: [...(prev.projects || []), newProject],
    }));
  };

  // Update a project field
  const handleProjectChange = (index, field, value) => {
    const updated = [...resumeData.projects];
    updated[index][field] = value;
    setResumeData((prev) => ({ ...prev, projects: updated }));
  };

  // Remove a project
  const handleRemoveProject = (index) => {
    const updated = [...resumeData.projects];
    updated.splice(index, 1);
    setResumeData((prev) => ({ ...prev, projects: updated }));
  };


  if (isLoading) return <div className="p-8 text-center text-gray-600">Loading resume...</div>;
  return (
    <DashboardLayout>
      {showLimitPopup && (
        <FeatureLimitPopup
          featureName={activeFeature}
          onClose={() => setShowLimitPopup(false)}
        />
      )}

      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent
            className="max-w-6xl max-h-[90vh] flex flex-col p-0"
          >
            <div className="flex-1 overflow-y-auto bg-gray-50" style={{ maxHeight: "80vh" }}>
                {/* Sticky Header */}
              <div className="px-6 pt-6 pb-4 border-b bg-white shrink-0">
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold">
                    Select Resume Template
                  </DialogTitle>
                  <DialogDescription>
                    Preview available resume layouts and select one to download.
                  </DialogDescription>
                </DialogHeader>
              </div>

              {/* ✅ Scrollable Main Content */}
              <div className="px-6 py-4">
                {/* This will scroll because DialogContent wraps an inner div with overflow-y-auto */}
                <div className="space-y-4">
                  <ScrollArea className="h-[70vh] px-6 py-4 bg-gray-50">
                    <div className="flex-1 bg-gray-50">
                    {templates.length === 0 ? (
                        <div className="flex items-center justify-center h-64 text-gray-500">
                            Loading templates...
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                          {templates.map((t) => (
                            <div
                              key={t.id}
                              onClick={() => setSelectedTemplate(t.id)}
                              className={`border rounded-lg cursor-pointer bg-white shadow-sm hover:shadow-md transition-all ${
                                selectedTemplate === t.id
                                  ? "border-violet-600 ring-2 ring-violet-400"
                                  : "border-gray-200"
                              }`}
                            >
                              <div className="relative w-full h-72 ">
                                <img
                                  src={t.thumbnail}
                                  alt={t.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="p-3 text-center">
                                <p className="font-medium text-gray-900">{t.name}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </div>
              
              {/* Sticky Footer */}
              <div className="p-4 border-t bg-white flex justify-end gap-3 shrink-0">
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button
                  className="bg-violet-600 hover:bg-violet-700"
                  disabled={!selectedTemplate}
                  onClick={handleDownload}
                >
                  Download Selected Template
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {showFeedbackOnDownload && (
        <FeedbackPopup userId={user.id} typeUsed="resume_download" onClose={() => setShowFeedbackOnDownload(false)}/>
      )}

      {/* {showFeedbackOnResumeAi && (
        <FeedbackPopup userId={user.id} typeUsed="resume_ai" onClose={() => setShowFeedbackOnResumeAi(false)}/>
      )} */}

      <div className="space-y-6">
        {/* Modern Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-600 p-8 text-white shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-300/20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full mb-3">
                <FileText className="w-4 h-4" />
                <span>AI-Powered Resume Builder</span>
              </div>
              <h1 className="text-white mb-2">Resume Builder</h1>
              <p className="text-cyan-100">Create a professional resume that stands out to employers</p>
            </div>
            <Dialog open={showAIModal} onOpenChange={setShowAIModal}>
              <DialogTrigger asChild>
                <Button className="bg-white text-blue-600 hover:bg-cyan-50 shadow-lg gap-2">
                  <Sparkles className="w-4 h-4" />
                  Generate with AI
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg p-6">
                <DialogHeader>
                  <DialogTitle>AI Resume Generator</DialogTitle>
                  <DialogDescription>
                    Tell us about your desired role and we'll generate a tailored resume
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4 overflow-y-auto" style={{ maxHeight: "80vh" }}>
                  <div className="space-y-2">
                    <Label htmlFor="jobRole">Job Role *</Label>
                    <Input
                      id="jobRole"
                      placeholder="e.g., Software Engineer"
                      value={aiPrompt.jobRole}
                      onChange={(e) => setAiPrompt({ ...aiPrompt, jobRole: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experienceLevel">Experience Level *</Label>
                    <Select
                      value={aiPrompt.experienceLevel}
                      onValueChange={(value) => setAiPrompt({ ...aiPrompt, experienceLevel: value })}
                    >
                      <SelectTrigger id="experienceLevel">
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
                        <SelectItem value="mid">Mid Level (2-5 years)</SelectItem>
                        <SelectItem value="senior">Senior (5+ years)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="additionalInfo">Additional Information</Label>
                    <Textarea
                      id="additionalInfo"
                      placeholder="Key skills, achievements, or preferences..."
                      rows={4}
                      value={aiPrompt.additionalInfo}
                      onChange={(e) => setAiPrompt({ ...aiPrompt, additionalInfo: e.target.value })}
                    />
                  </div>
                  <Button
                    onClick={handleAIGenerate}
                    disabled={isGenerating}
                    className="w-full bg-violet-600 hover:bg-violet-700"
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate Resume
                      </>
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - Editor */}
          {resumeData!=null?(
            <Card>
            <CardHeader>
              <CardTitle>Edit Resume</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="personal" className="w-full">
                <div className="relative -mx-4 sm:-mx-6">
                  <div className="overflow-x-auto scrollbar-hide">
                    <TabsList className="flex gap-4 min-w-max border-b border-gray-200 dark:border-gray-700">
                      {[
                        { value: "personal", label: "Personal" },
                        { value: "summary", label: "Summary" },
                        { value: "experience", label: "Experience" },
                        { value: "education", label: "Education" },
                        { value: "skills", label: "Skills" },
                        { value: "projects", label: "Projects" },
                        { value: "certifications", label: "Certifications" },
                        { value: "languages", label: "Languages" },
                        { value: "achievements", label: "Achievements" },
                        { value: "keywords", label: "Keywords" },
                      ].map((tab) => (
                        <TabsTrigger
                          key={tab.value}
                          value={tab.value}
                          className="relative px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 
                                    data-[state=active]:text-violet-600 dark:data-[state=active]:text-violet-400
                                    after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px]
                                    after:bg-violet-600 dark:after:bg-violet-400 after:scale-x-0
                                    data-[state=active]:after:scale-x-100 after:transition-transform after:duration-300
                                    hover:text-violet-600 dark:hover:text-violet-400"
                        >
                          {tab.label}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </div>
                </div>

                <TabsContent value="personal" className="space-y-4">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input
                      value={resumeData.name}
                      onChange={(e) => setResumeData({ ...resumeData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Job Role</Label>
                    <Input
                      placeholder="e.g., Senior Software Engineer"
                      value={resumeData.jobrole}
                      onChange={(e) => setResumeData({ ...resumeData, jobrole: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={resumeData.email}
                      onChange={(e) => setResumeData({ ...resumeData, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input
                      value={resumeData.phone}
                      onChange={(e) => setResumeData({ ...resumeData, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input
                      value={resumeData.location}
                      onChange={(e) => setResumeData({ ...resumeData, location: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>LinkedIn URL</Label>
                    <Input
                      value={resumeData.linkedin_url}
                      onChange={(e) => setResumeData({ ...resumeData, linkedin_url: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>GitHub URL</Label>
                    <Input
                      value={resumeData.git_url}
                      onChange={(e) => setResumeData({ ...resumeData, git_url: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Portfolio URL</Label>
                    <Input
                      value={resumeData.portfolio_url}
                      onChange={(e) => setResumeData({ ...resumeData, portfolio_url: e.target.value })}
                    />
                  </div>
                </TabsContent>


                <TabsContent value="summary" className="space-y-4">
                  <div className="space-y-2">
                    <Label>Professional Summary</Label>
                    <Textarea
                      rows={8}
                      value={resumeData.summary}
                      onChange={(e) => setResumeData({ ...resumeData, summary: e.target.value })}
                      placeholder="Write a compelling summary of your professional background..."
                    />
                  </div>
                </TabsContent>

                <TabsContent value="experience" className="space-y-4">
                  {resumeData?.experiences?.map((exp, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-3">
                      <Input placeholder="Job Title" value={exp.title} onChange={(e) => handleExperienceChange(index, 'title', e.target.value)}/>
                      <Input placeholder="Company" value={exp.company} onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}/>
                      <Input placeholder="Duration" value={exp.duration} onChange={(e) => handleExperienceChange(index, 'duration', e.target.value)}/>
                      <Textarea placeholder="Description" value={exp.description} rows={3} onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}/>
                      {resumeData.experiences.length > 1 && (
                        <Button variant="ghost" size="sm" className="text-red-600" onClick={() => handleRemoveExperience(index)}>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button variant="outline" className="w-full" onClick={handleAddExperience}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Experience
                  </Button>
                </TabsContent>

                <TabsContent value="education" className="space-y-4">
                  {resumeData?.educations?.map((edu, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-3">
                      <Input placeholder="Degree" value={edu.degree} onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}/>
                      <Input placeholder="School" value={edu.school} onChange={(e) => handleEducationChange(index, 'school', e.target.value)}/>
                      <Input placeholder="Year" value={edu.year} onChange={(e) => handleEducationChange(index, 'year', e.target.value)}/>
                      {resumeData.educations.length > 1 && (
                        <Button variant="ghost" size="sm" className="text-red-600" onClick={() => handleRemoveEducation(index)}>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button variant="outline" className="w-full" onClick={handleAddEducation}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Education
                  </Button>
                </TabsContent>

                <TabsContent value="skills" className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {resumeData?.skills?.map((skill, index) => (
                      <div key={index} className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full flex items-center gap-2">
                        {skill.skill}
                        <button className="hover:text-violet-900" onClick={() => handleRemoveSkill(index)}>×</button>
                      </div>
                    ))}
                  </div>
                  <Input placeholder="Add a skill and press Enter" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} onKeyDown={handleSkillKeyDown}/>
                </TabsContent>

                <TabsContent value="projects" className="space-y-4">
                  {resumeData.projects.map((project, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-3">
                      <Input placeholder="Project Name" value={project.name} onChange={(e) => handleProjectChange(index, 'name', e.target.value)}/>
                      <Textarea placeholder="Description" value={project.description} rows={3} onChange={(e) => handleProjectChange(index, 'description', e.target.value)}/>

                      {resumeData.projects.length > 1 && (
                        <Button variant="ghost" size="sm" className="text-red-600" onClick={() => handleRemoveProject(index)}>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button variant="outline" className="w-full" onClick={handleAddProject}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Project
                  </Button>
                </TabsContent>
                {/* Certifications */}
                <TabsContent value="certifications" className="space-y-4">
                  {resumeData.certifications.map((cert, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-3">
                      <Input placeholder="Certification Name" value={cert.name} onChange={(e) => {
                        const updated = [...resumeData.certifications];
                        updated[index].name = e.target.value;
                        setResumeData({ ...resumeData, certifications: updated });
                      }} />
                      <Input placeholder="Issuer" value={cert.issuer} onChange={(e) => {
                        const updated = [...resumeData.certifications];
                        updated[index].issuer = e.target.value;
                        setResumeData({ ...resumeData, certifications: updated });
                      }} />
                      <Input placeholder="Year" value={cert.year} onChange={(e) => {
                        const updated = [...resumeData.certifications];
                        updated[index].year = e.target.value;
                        setResumeData({ ...resumeData, certifications: updated });
                      }} />
                      <Button variant="ghost" size="sm" className="text-red-600" onClick={() => {
                        const updated = resumeData.certifications.filter((_, i) => i !== index);
                        setResumeData({ ...resumeData, certifications: updated });
                      }}>
                        <Trash2 className="w-4 h-4 mr-2" /> Remove
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full" onClick={() => setResumeData({ ...resumeData, certifications: [...resumeData.certifications, { name: '', issuer: '', year: '' }] })}>
                    <Plus className="w-4 h-4 mr-2" /> Add Certification
                  </Button>
                </TabsContent>

                {/* Languages */}
                <TabsContent value="languages" className="space-y-4">
                  {resumeData.languages.map((lang, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-3">
                      <Input placeholder="Language" value={lang.language} onChange={(e) => {
                        const updated = [...resumeData.languages];
                        updated[index].language = e.target.value;
                        setResumeData({ ...resumeData, languages: updated });
                      }} />
                      <Input placeholder="Proficiency (e.g. Fluent, Intermediate)" value={lang.proficiency} onChange={(e) => {
                        const updated = [...resumeData.languages];
                        updated[index].proficiency = e.target.value;
                        setResumeData({ ...resumeData, languages: updated });
                      }} />
                      <Button variant="ghost" size="sm" className="text-red-600" onClick={() => {
                        const updated = resumeData.languages.filter((_, i) => i !== index);
                        setResumeData({ ...resumeData, languages: updated });
                      }}>
                        <Trash2 className="w-4 h-4 mr-2" /> Remove
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full" onClick={() => setResumeData({ ...resumeData, languages: [...resumeData.languages, { language: '', proficiency: '' }] })}>
                    <Plus className="w-4 h-4 mr-2" /> Add Language
                  </Button>
                </TabsContent>

                {/* Achievements */}
                <TabsContent value="achievements" className="space-y-4">
                  {resumeData.achievements.map((ach, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-3">
                      <Input placeholder="Achievement Title" value={ach.title} onChange={(e) => {
                        const updated = [...resumeData.achievements];
                        updated[index].title = e.target.value;
                        setResumeData({ ...resumeData, achievements: updated });
                      }} />
                      <Textarea placeholder="Description" value={ach.description} rows={2} onChange={(e) => {
                        const updated = [...resumeData.achievements];
                        updated[index].description = e.target.value;
                        setResumeData({ ...resumeData, achievements: updated });
                      }} />
                      <Button variant="ghost" size="sm" className="text-red-600" onClick={() => {
                        const updated = resumeData.achievements.filter((_, i) => i !== index);
                        setResumeData({ ...resumeData, achievements: updated });
                      }}>
                        <Trash2 className="w-4 h-4 mr-2" /> Remove
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full" onClick={() => setResumeData({ ...resumeData, achievements: [...resumeData.achievements, { title: '', description: '' }] })}>
                    <Plus className="w-4 h-4 mr-2" /> Add Achievement
                  </Button>
                </TabsContent>

                <TabsContent value="keywords" className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {resumeData?.keywords?.map((keyword, index) => (
                      <div key={index} className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full flex items-center gap-2">
                        {keyword}
                        <button className="hover:text-violet-900" onClick={() => handleRemoveKeyword(keyword)}>×</button>
                      </div>
                    ))}
                  </div>
                  <Input placeholder="Add a keyword and press Enter" value={newKeyword} onChange={(e) => setNewKeyword(e.target.value)} onKeyDown={handleKeywordKeyDown}/>
                </TabsContent>

              </Tabs>
            </CardContent>
          </Card>
          ): null}
          

          {/* Right Panel - Preview */}
          {resumeData != null ? (<div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-white border-2 border-gray-200 rounded-lg p-8 space-y-6 min-h-[600px]">
                  {/* Header */}
                  <div className="border-b-2 border-violet-600 pb-4">
                    <h2 className="text-violet-900">{resumeData.name||"Your Name"}</h2>
                    <div className="flex flex-wrap gap-4 mt-2 text-gray-600">
                      <span>{resumeData.email || 'Email'}</span> |
                      <span>{resumeData.phone || 'Phone'}</span> |
                      <span>{resumeData.location || "Location"}</span>
                    </div>
                    <div className="flex flex-wrap gap-4 mt-2 text-gray-600">
                      <span>{resumeData.linkedin_url || 'LinkedIn'}</span> |
                      <span>{resumeData.git_url || 'Git'}</span> |
                      <span>{resumeData.portfolio_url || 'Portfolio'}</span>
                    </div>
                  </div>

                  {/* Summary */}
                  <div>
                    <h3 className="text-violet-900 mb-2">Professional Summary</h3>
                    <p className="text-gray-700">{resumeData.summary||"NA"}</p>
                  </div>

                  {/* Experience */}
                  <div>
                    <h3 className="text-violet-900 mb-3">Experience</h3>
                    <div className="space-y-4">
                      {
                        resumeData.experiences.length === 0 && (
                          <p className="text-gray-500">No experience added.</p>
                      )}
                      {resumeData?.experiences?.map((exp, index) => (
                        <div key={index}>
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="text-gray-900">{exp.title||'NA'}</h4>
                            <span className="text-gray-500">{exp.duration||'NA'}</span>
                          </div>
                          <p className="text-violet-600 mb-2">{exp.company||'NA'}</p>
                          <p className="text-gray-700">{exp.description||'NA'}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Education */}
                  <div>
                    <h3 className="text-violet-900 mb-3">Education</h3>
                      {
                        resumeData.educations.length === 0 && (
                          <p className="text-gray-500">No education added.</p>
                      )}
                    {resumeData?.educations?.map((edu, index) => (
                      <div key={index} className="mb-2">
                        <h4 className="text-gray-900">{edu.degree||'NA'}</h4>
                        <p className="text-gray-600">{edu.school||'NA'} • {edu.year||'NA'}</p>
                      </div>
                    ))}
                  </div>

                  {/* Skills */}
                  <div>
                    <h3 className="text-violet-900 mb-3">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {
                        resumeData.skills.length === 0 && (
                          <p className="text-gray-500">No skills added.</p>
                      )}
                      {resumeData?.skills?.map((skill, index) => (
                        <span key={index} className="px-3 py-1 bg-violet-100 text-violet-700 rounded">
                          {skill.skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Projects */}
                  <div>
                    <h3 className="text-violet-900 mb-3">Projects</h3>
                    {
                        resumeData.projects.length === 0 && (
                          <p className="text-gray-500">No projects added.</p>
                      )}
                    {resumeData.projects.map((project, index) => (
                      <div key={index} className="mb-3">
                        <h4 className="text-gray-900">{project.name||'NA'}</h4>
                        <p className="text-gray-700">{project.description||'NA'}</p>
                      </div>
                    ))}
                  </div>
                  {/* Certifications */}
                
                  <div>
                    <h3 className="text-violet-900 mb-3">Certifications</h3>
                    {
                      resumeData.certifications.length === 0 && (
                        <p className="text-gray-500">No Certifications added.</p>
                    )}
                    {resumeData.certifications.map((cert, index) => (
                      <p key={index} className="text-gray-700">{cert.name} — {cert.issuer} ({cert.year})</p>
                    ))}
                  </div>

                  {/* Languages */}
                  
                  <div>
                    <h3 className="text-violet-900 mb-3">Languages</h3>
                    {
                      resumeData.languages.length === 0 && (
                        <p className="text-gray-500">No Languages added.</p>
                    )}
                    {resumeData.languages.map((lang, index) => (
                      <p key={index} className="text-gray-700">{lang.language} — {lang.proficiency}</p>
                    ))}
                  </div>

                  {/* Achievements */}
                  <div>
                    <h3 className="text-violet-900 mb-3">Achievements</h3>
                    {
                      resumeData.achievements.length === 0 && (
                        <p className="text-gray-500">No Achievements added.</p>
                    )}
                    {resumeData.achievements.map((ach, index) => (
                      <p key={index} className="text-gray-700">{ach.title}: {ach.description}</p>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-3">
              {/* <Button onClick={handleSave} variant="outline" className="flex-1">
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Resume'}
              </Button> */}
              <Button onClick={handleSave} className="flex-1 bg-violet-600 hover:bg-violet-700">
                <Download className="w-4 h-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save and Download PDF'}
              </Button>
            </div>
          </div>):null}
        </div>
      </div>
    </DashboardLayout>
  );
}