import { useState, useEffect } from 'react';
import { DashboardLayout } from './DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ScrollArea } from './ui/scroll-area';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Sparkles, Download, Save, Plus, Trash2, FileText, Eye, Wand2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import api from '../api/axiosClient';

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

  const [isOpen, setIsOpen] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const res = await api.get('/resume');
        setResumeData(res.data);
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
            projects: []
          });
        } else {
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

    setIsGenerating(true);
    try {
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

      toast.success(`PDF downloaded: ${fileName}`);
    } catch (err) {
      console.error("Error downloading PDF:", err);
      toast.error("Failed to download PDF");
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

  const handleRemoveSkill = (index: number) => {
    setResumeData((prev: any) => ({
      ...prev,
      skills: prev.skills.filter((_: any, i: number) => i !== index)
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
                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 mb-6">
                  <TabsTrigger value="personal">Personal</TabsTrigger>
                  <TabsTrigger value="summary">Summary</TabsTrigger>
                  <TabsTrigger value="experience">Experience</TabsTrigger>
                  <TabsTrigger value="education">Education</TabsTrigger>
                  <TabsTrigger value="skills">Skills</TabsTrigger>
                  <TabsTrigger value="projects">Projects</TabsTrigger>
                </TabsList>

                <TabsContent value="personal" className="space-y-4">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input
                      value={resumeData.name}
                      onChange={(e) => setResumeData({ ...resumeData, name: e.target.value })}
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
                    <h2 className="text-violet-900">{resumeData.name}</h2>
                    <div className="flex flex-wrap gap-4 mt-2 text-gray-600">
                      <span>{resumeData.email}</span>
                      <span>{resumeData.phone}</span>
                      <span>{resumeData.location}</span>
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
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button onClick={handleSave} variant="outline" className="flex-1">
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Resume'}
              </Button>
              <Button onClick={() => setIsOpen(true)} className="flex-1 bg-violet-600 hover:bg-violet-700">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
              {/* <Button onClick={handleDownload} className="flex-1 bg-violet-600 hover:bg-violet-700">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button> */}
            </div>
          </div>):null}
        </div>
      </div>
    </DashboardLayout>
  );
}