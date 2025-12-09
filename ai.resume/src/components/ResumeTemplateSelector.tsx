import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from './DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { FileText, Briefcase, TrendingUp, Network, Code, Palette, GraduationCap, Sparkles } from 'lucide-react';
import api from '../api/axiosClient';

interface ResumeTemplate {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
  tier?: string; // optional if backend includes tier
}

export function ResumeTemplateSelector() {
  const navigate = useNavigate();

  const [templates, setTemplates] = useState<ResumeTemplate[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    api.get('/resume/templates').then((res) => {
      const data: ResumeTemplate[] = res.data;
      setTemplates(data);

      // Extract unique category list
      const uniqueCategories = Array.from(new Set(data.map(t => t.category)));

      // Build dynamic category list
      const formatted = [
        { id: "all", name: "All Templates", icon: Sparkles },
        ...uniqueCategories.map(cat => ({
          id: cat,
          name: cat.charAt(0).toUpperCase() + cat.slice(1),
        }))
      ];

      setCategories(formatted);
    });
  }, []);

  const filteredTemplates =
    activeCategory === 'all'
      ? templates
      : templates.filter((t) => t.category === activeCategory);

  const handleSelectTemplate = (templateId: string) => {
    navigate(`/resume-builder?template=${templateId}&category=${activeCategory}`);
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <h1 className="bg-gradient-to-r from-[#2cacd5] to-[#1e90b8] bg-clip-text text-transparent lg:text-6xl text-4xl font-bold">
            Choose Your Resume Template
          </h1>
          <p className="text-gray-600">
            Select a professional template that matches your industry and style
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
          <TabsList className="grid w-full grid-cols-7 mb-8 bg-white border border-gray-200 p-1">
            {categories.map((category) => {

              return (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#2cacd5] data-[state=active]:to-[#1e90b8] data-[state=active]:text-white"
                >
                  <span className="hidden lg:inline">{category.name}</span>
                  <span className="lg:hidden">{category.name.split(' ')[0]}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="space-y-6">
              {/* Template Count */}
              <div className="flex items-center justify-between mb-4">
                <p className="text-gray-600">
                  {filteredTemplates.length}{' '}
                  {filteredTemplates.length === 1 ? 'template' : 'templates'} available
                </p>
              </div>

              {/* Template Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredTemplates.map((template) => (
                  <Card
                    key={template.id}
                    className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-[#2cacd5] bg-white relative"
                  >
                    {/* Tier Badge */}
                    <div className="absolute top-2 left-2 z-10">
                      <span
                        className={template.tier === "free" ? "badge-free" : "badge-premium"}
                      >
                        {template.tier === "free" ? "FREE" : "PREMIUM"}
                      </span>
                    </div>

                    {/* Template Preview */}
                    <div className="relative w-full h-96">
                      <img
                        src={template.thumbnail}
                        alt={template.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>

                    {/* Template Info */}
                    <div className="p-4 flex justify-center items-center">
                      {/* {template.tier === "free" ? ( */}
                        <Button
                          onClick={() => handleSelectTemplate(template.id)}
                          variant="outline"
                          className="border-[#2cacd5] text-[#2cacd5] hover:bg-[#2cacd5] hover:text-white px-8 rounded-full"
                        >
                          Use Template
                        </Button>
                      {/* ) : null} */}

                    </div>
                  </Card>

                ))}
              </div>

              {/* Empty State */}
              {filteredTemplates.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-gray-900 mb-2">No templates found</h3>
                  <p className="text-gray-600">
                    Check back soon for more templates in this category.
                  </p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
