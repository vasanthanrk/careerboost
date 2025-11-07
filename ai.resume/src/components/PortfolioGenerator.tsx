import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from './DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Sparkles, Plus, X, Eye, Briefcase, GraduationCap, Code, User } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import api from '../api/axiosClient';

export function PortfolioGenerator() {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    bio: '',
    theme: 'modern'
  });

  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [projects, setProjects] = useState([]);
  const [experience, setExperience] = useState([]);

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleAddProject = () => {
    setProjects([
      ...projects,
      { name: '', description: '', tech: '' }
    ]);
  };

  const handleRemoveProject = (index: number) => {
    setProjects(projects.filter((_, i) => i !== index));
  };

  const handleUpdateProject = (index: number, field: string, value: string) => {
    const updated = [...projects];
    updated[index] = { ...updated[index], [field]: value };
    setProjects(updated);
  };

  const handleAddExperience = () => {
    setExperience([
      ...experience,
      { title: '', company: '', duration: '', description: '' }
    ]);
  };

  const handleRemoveExperience = (index: number) => {
    setExperience(experience.filter((_, i) => i !== index));
  };

  const handleUpdateExperience = (index: number, field: string, value: string) => {
    const updated = [...experience];
    updated[index] = { ...updated[index], [field]: value };
    setExperience(updated);
  };

  useEffect(() => {
    const loadPortfolio = async () => {
      setLoading(true);
      try {
        const res = await api.get('/portfolio/load');
        const data = res.data;

        setFormData({
          name: data.name,
          role: data.role,
          bio: data.bio,
          theme: data.theme || 'modern'
        });
        setSkills(data.skills || []);
        setProjects(data.projects || []);
        setExperience(data.experience || []);

        if (data.source === 'resume') {
          toast.info('Portfolio prefilled from your resume!');
        } else {
          toast.success('Loaded your saved portfolio!');
        }
      } catch (err) {
        toast.error('No portfolio or resume found. Please create one.');
      } finally {
        setLoading(false);
      }
    };

    loadPortfolio();
  }, []);

  const handleGenerate = async () => {
    if (!formData.name || !formData.role) {
      toast.error('Please fill in your name and role');
      return;
    }

    setIsGenerating(true);
    
    try {
      const payload = {
        ...formData,
        skills,
        projects,
        experience
      };

      const res = await api.post('/portfolio/generate', payload);
      const data = res.data;

      toast.success('Portfolio generated successfully!');
      localStorage.setItem('portfolio_data', JSON.stringify(data));
      navigate('/portfolio/preview');
    } catch (error) {
      toast.error('Failed to generate portfolio. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 -m-6 p-6">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Hero Header */}
          <div className="text-center space-y-4 py-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-100 text-violet-700 rounded-full mb-4">
              <Sparkles className="w-4 h-4" />
              <span>AI-Powered Portfolio Builder</span>
            </div>
            <h1 className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              Create Your Dream Portfolio
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Build a stunning, professional portfolio website in minutes. Showcase your work, skills, and experience with our intelligent builder.
            </p>
            <div className="flex justify-center gap-4 pt-4">
              <Button
                onClick={() => navigate('/portfolio/preview')}
                variant="outline"
                className="gap-2"
              >
                <Eye className="w-4 h-4" />
                Preview Portfolio
              </Button>
            </div>
          </div>

          {/* About You Section */}
          <div className="bg-white rounded-2xl shadow-xl border border-violet-100 overflow-hidden">
            <div className="bg-gradient-to-r from-violet-600 to-purple-600 p-6">
              <div className="flex items-center gap-3 text-white">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-white">About You</h2>
                  <p className="text-violet-100">Tell us who you are</p>
                </div>
              </div>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-700">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    className="border-gray-300 focus:border-violet-500 focus:ring-violet-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-gray-700">Professional Title *</Label>
                  <Input
                    id="role"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="Full Stack Developer"
                    className="border-gray-300 focus:border-violet-500 focus:ring-violet-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio" className="text-gray-700">Professional Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Share your story, passion, and what makes you unique..."
                  rows={4}
                  className="border-gray-300 focus:border-violet-500 focus:ring-violet-500 resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="theme" className="text-gray-700">Portfolio Theme</Label>
                <Select
                  value={formData.theme}
                  onValueChange={(value) => setFormData({ ...formData, theme: value })}
                >
                  <SelectTrigger id="theme" className="border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Minimal Light</SelectItem>
                    <SelectItem value="dark">Dark & Bold</SelectItem>
                    <SelectItem value="modern">Modern Gradient</SelectItem>
                    <SelectItem value="classic">Classic Professional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <div className="bg-white rounded-2xl shadow-xl border border-violet-100 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
              <div className="flex items-center gap-3 text-white">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Code className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-white">Skills & Technologies</h2>
                  <p className="text-purple-100">Highlight your expertise</p>
                </div>
              </div>
            </div>
            <div className="p-8 space-y-6">
              <div className="flex flex-wrap gap-2 min-h-[80px] p-4 bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl border-2 border-dashed border-violet-200">
                {skills.length === 0 ? (
                  <p className="text-gray-400 w-full text-center py-4">Add your first skill below</p>
                ) : (
                  skills.map((skill) => (
                    <Badge
                      key={skill}
                      className="bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-700 hover:to-purple-700 px-4 py-2 cursor-pointer group"
                    >
                      {skill}
                      <button
                        onClick={() => handleRemoveSkill(skill)}
                        className="ml-2 hover:text-violet-200"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))
                )}
              </div>

              <div className="flex gap-3">
                <Input
                  placeholder="e.g., JavaScript, React, Python..."
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                  className="border-gray-300 focus:border-violet-500 focus:ring-violet-500"
                />
                <Button onClick={handleAddSkill} className="bg-violet-600 hover:bg-violet-700 gap-2 whitespace-nowrap">
                  <Plus className="w-4 h-4" />
                  Add Skill
                </Button>
              </div>
            </div>
          </div>

          {/* Experience Section */}
          <div className="bg-white rounded-2xl shadow-xl border border-violet-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-violet-600 p-6">
              <div className="flex items-center gap-3 text-white">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-white">Work Experience</h2>
                  <p className="text-blue-100">Share your professional journey</p>
                </div>
              </div>
            </div>
            <div className="p-8 space-y-6">
              {experience.map((exp, index) => (
                <div key={index} className="relative p-6 bg-gradient-to-br from-blue-50 to-violet-50 rounded-xl border border-blue-100 space-y-4">
                  {experience.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveExperience(index)}
                      className="absolute top-4 right-4 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      placeholder="Job Title"
                      value={exp.title}
                      onChange={(e) => handleUpdateExperience(index, 'title', e.target.value)}
                      className="bg-white border-blue-200 focus:border-violet-500"
                    />
                    <Input
                      placeholder="Company Name"
                      value={exp.company}
                      onChange={(e) => handleUpdateExperience(index, 'company', e.target.value)}
                      className="bg-white border-blue-200 focus:border-violet-500"
                    />
                  </div>
                  <Input
                    placeholder="Duration (e.g., Jan 2020 - Present)"
                    value={exp.duration}
                    onChange={(e) => handleUpdateExperience(index, 'duration', e.target.value)}
                    className="bg-white border-blue-200 focus:border-violet-500"
                  />
                  <Textarea
                    placeholder="Describe your role, achievements, and impact..."
                    value={exp.description}
                    onChange={(e) => handleUpdateExperience(index, 'description', e.target.value)}
                    rows={3}
                    className="bg-white border-blue-200 focus:border-violet-500 resize-none"
                  />
                </div>
              ))}

              <Button onClick={handleAddExperience} variant="outline" className="w-full border-2 border-dashed border-violet-300 hover:border-violet-500 hover:bg-violet-50 gap-2 py-6">
                <Plus className="w-5 h-5" />
                Add Experience
              </Button>
            </div>
          </div>

          {/* Projects Section */}
          <div className="bg-white rounded-2xl shadow-xl border border-violet-100 overflow-hidden">
            <div className="bg-gradient-to-r from-pink-600 to-orange-600 p-6">
              <div className="flex items-center gap-3 text-white">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-white">Featured Projects</h2>
                  <p className="text-pink-100">Showcase your best work</p>
                </div>
              </div>
            </div>
            <div className="p-8 space-y-6">
              {projects.map((project, index) => (
                <div key={index} className="relative p-6 bg-gradient-to-br from-pink-50 to-orange-50 rounded-xl border border-pink-100 space-y-4">
                  {projects.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveProject(index)}
                      className="absolute top-4 right-4 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}

                  <Input
                    placeholder="Project Name"
                    value={project.name}
                    onChange={(e) => handleUpdateProject(index, 'name', e.target.value)}
                    className="bg-white border-pink-200 focus:border-orange-500"
                  />
                  <Textarea
                    placeholder="Describe what you built and the impact it had..."
                    value={project.description}
                    onChange={(e) => handleUpdateProject(index, 'description', e.target.value)}
                    rows={3}
                    className="bg-white border-pink-200 focus:border-orange-500 resize-none"
                  />
                  <Input
                    placeholder="Technologies Used (e.g., React, Node.js, AWS)"
                    value={project.tech}
                    onChange={(e) => handleUpdateProject(index, 'tech', e.target.value)}
                    className="bg-white border-pink-200 focus:border-orange-500"
                  />
                </div>
              ))}

              <Button onClick={handleAddProject} variant="outline" className="w-full border-2 border-dashed border-pink-300 hover:border-pink-500 hover:bg-pink-50 gap-2 py-6">
                <Plus className="w-5 h-5" />
                Add Project
              </Button>
            </div>
          </div>

          {/* Generate CTA */}
          <div className="bottom-6 bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 rounded-2xl shadow-2xl p-8 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <h3 className="text-white mb-2">Ready to Launch Your Portfolio?</h3>
                <p className="text-violet-100">
                  Generate a beautiful, responsive website that showcases your unique story
                </p>
              </div>
              <Button
                size="lg"
                onClick={handleGenerate}
                disabled={isGenerating}
                className="bg-white text-violet-600 hover:bg-violet-50 gap-2 px-8 py-6 whitespace-nowrap shadow-lg"
              >
                {isGenerating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Portfolio
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}