import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { DashboardLayout } from './DashboardLayout';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { ArrowLeft, ExternalLink, Github, Linkedin, Mail, Download, Globe, Sparkles, MapPin, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner@2.0.3';
import api from '../api/axiosClient';

export function PortfolioPreview() {
  const [htmlContent, setHtmlContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const fetchedRef = useRef(false);


  useEffect(() => {
    if (fetchedRef.current) return; // ✅ prevent duplicate API calls
    fetchedRef.current = true;

    const fetchPortfolio = async () => {
      try {
        const res = await api.get(`/portfolio/preview`, {
          headers: { Accept: 'text/html' },
          responseType: 'text', // 👈 important
        });
        setHtmlContent(res.data);
      } catch (err) {
        toast.error('Failed to load portfolio.');
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  });

  const handlePublish = () => {
    toast.success('Portfolio published! Available at johndoe.smartcvmaker.com');
  };

  const handleDownload = () => {
    toast.success('Downloading portfolio as HTML...');
  };

  return (
    <DashboardLayout>
      {htmlContent === null && loading && (
        <div className="flex items-center justify-center h-64">
          <p>Loading portfolio preview...</p>
        </div>
      )}
      {htmlContent !== null && !loading && (
        <div className="space-y-6">
          {/* Header Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white rounded-xl p-4 border border-gray-200">
            <Link to="/portfolio">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Editor
              </Button>
            </Link>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleDownload} className="gap-2">
                <Download className="w-4 h-4" />
                Download
              </Button>
              <Button className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 gap-2" onClick={handlePublish}>
                <Globe className="w-4 h-4" />
                Publish Site
              </Button>
            </div>
          </div>

          {/* Portfolio Preview */}
          <div className="flex flex-col h-[calc(100vh-80px)] rounded-xl overflow-hidden border border-gray-200 shadow-lg bg-white" style={{ minHeight: '600px' }}>
            {/* 👇 render the backend template directly */}
            <iframe
              srcDoc={htmlContent}
              className="w-full h-[90vh] border-0 h-[calc(100vh-80px)]"
              title="Portfolio Preview"
              style={{ minHeight: '600px' }}
            />
          </div>
        </div>
      )}
      
    </DashboardLayout>
  );
}