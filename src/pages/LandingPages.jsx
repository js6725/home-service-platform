import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase/client';

export default function LandingPages() {
  const { user } = useAuth();
  const [landingPages, setLandingPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPage, setNewPage] = useState({
    title: '',
    slug: '',
    template: 'professional',
    service_type: 'plumbing',
    description: ''
  });

  const templates = [
    {
      id: 'professional',
      name: 'Professional',
      description: 'Clean, professional design perfect for established businesses',
      preview: '/api/placeholder/300/200'
    },
    {
      id: 'modern',
      name: 'Modern',
      description: 'Contemporary design with bold visuals and animations',
      preview: '/api/placeholder/300/200'
    },
    {
      id: 'minimal',
      name: 'Minimal',
      description: 'Simple, focused design that highlights your services',
      preview: '/api/placeholder/300/200'
    },
    {
      id: 'conversion',
      name: 'High-Convert',
      description: 'Optimized for maximum lead generation and conversions',
      preview: '/api/placeholder/300/200'
    }
  ];

  const serviceTypes = ['plumbing', 'hvac', 'carpentry', 'electrical', 'landscaping'];

  useEffect(() => {
    if (user) {
      fetchLandingPages();
    }
  }, [user]);

  const fetchLandingPages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('landing_pages')
        .select('*')
        .eq('business_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching landing pages:', error);
        setLandingPages([]);
      } else {
        setLandingPages(data || []);
      }
    } catch (error) {
      console.error('Error fetching landing pages:', error);
      setLandingPages([]);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleCreatePage = async (e) => {
    e.preventDefault();
    try {
      const slug = newPage.slug || generateSlug(newPage.title);
      
      // Check if slug already exists
      const { data: existingPage } = await supabase
        .from('landing_pages')
        .select('id')
        .eq('business_id', user.id)
        .eq('slug', slug)
        .single();

      if (existingPage) {
        alert('A page with this URL already exists. Please choose a different title or URL.');
        return;
      }

      const pageData = {
        ...newPage,
        slug,
        business_id: user.id,
        is_published: false,
        content: getTemplateContent(newPage.template, newPage.service_type),
        seo_title: newPage.title,
        seo_description: newPage.description || `Professional ${newPage.service_type} services. Get a free quote today!`
      };

      const { data, error } = await supabase
        .from('landing_pages')
        .insert([pageData])
        .select()
        .single();

      if (error) {
        console.error('Error creating landing page:', error);
        alert('Error creating landing page. Please try again.');
      } else {
        setLandingPages([data, ...landingPages]);
        setShowCreateModal(false);
        setNewPage({
          title: '',
          slug: '',
          template: 'professional',
          service_type: 'plumbing',
          description: ''
        });
      }
    } catch (error) {
      console.error('Error creating landing page:', error);
      alert('Error creating landing page. Please try again.');
    }
  };

  const togglePublish = async (pageId, currentStatus) => {
    try {
      const { error } = await supabase
        .from('landing_pages')
        .update({ is_published: !currentStatus })
        .eq('id', pageId);

      if (error) {
        console.error('Error updating page status:', error);
        alert('Error updating page status. Please try again.');
      } else {
        setLandingPages(landingPages.map(page => 
          page.id === pageId ? { ...page, is_published: !currentStatus } : page
        ));
      }
    } catch (error) {
      console.error('Error updating page status:', error);
      alert('Error updating page status. Please try again.');
    }
  };

  const deletePage = async (pageId) => {
    if (!confirm('Are you sure you want to delete this landing page? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('landing_pages')
        .delete()
        .eq('id', pageId);

      if (error) {
        console.error('Error deleting page:', error);
        alert('Error deleting page. Please try again.');
      } else {
        setLandingPages(landingPages.filter(page => page.id !== pageId));
      }
    } catch (error) {
      console.error('Error deleting page:', error);
      alert('Error deleting page. Please try again.');
    }
  };

  const getTemplateContent = (template, serviceType) => {
    const serviceNames = {
      plumbing: 'Plumbing',
      hvac: 'HVAC',
      carpentry: 'Carpentry',
      electrical: 'Electrical',
      landscaping: 'Landscaping'
    };

    const serviceName = serviceNames[serviceType] || 'Home Service';

    return {
      hero: {
        headline: `Professional ${serviceName} Services`,
        subheadline: `Trusted ${serviceType} experts serving your local area. Get a free quote today!`,
        cta: 'Get Free Quote'
      },
      services: [
        `${serviceName} Installation`,
        `${serviceName} Repair`,
        `${serviceName} Maintenance`,
        'Emergency Services'
      ],
      features: [
        'Licensed & Insured',
        '24/7 Emergency Service',
        'Free Estimates',
        'Satisfaction Guaranteed'
      ],
      testimonials: [
        {
          name: 'John Smith',
          text: `Excellent ${serviceType} service! Professional, reliable, and affordable.`,
          rating: 5
        }
      ]
    };
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Landing Pages</h1>
              <p className="mt-1 text-sm text-gray-500">
                Create and manage your lead generation pages
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create Page
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Landing Pages Grid */}
        {landingPages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {landingPages.map((page) => (
              <div key={page.id} className="bg-white shadow rounded-lg overflow-hidden">
                {/* Page Preview */}
                <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <div className="text-center text-white">
                    <h3 className="text-lg font-semibold">{page.title}</h3>
                    <p className="text-sm opacity-90 mt-1">{page.template} template</p>
                  </div>
                </div>

                {/* Page Info */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{page.title}</h3>
                      <p className="text-sm text-gray-500">/{page.slug}</p>
                    </div>
                    <div className="flex items-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        page.is_published 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {page.is_published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div>
                      <span className="font-medium">Service:</span> {page.service_type}
                    </div>
                    <div>
                      <span className="font-medium">Template:</span> {page.template}
                    </div>
                    <div>
                      <span className="font-medium">Created:</span> {formatDate(page.created_at)}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <button className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={() => togglePublish(page.id, page.is_published)}
                      className={`flex-1 inline-flex justify-center items-center px-3 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        page.is_published
                          ? 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500'
                          : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                      }`}
                    >
                      {page.is_published ? 'Unpublish' : 'Publish'}
                    </button>
                    <button
                      onClick={() => deletePage(page.id)}
                      className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No landing pages</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating your first landing page to capture leads.
            </p>
            <div className="mt-6">
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Create Your First Page
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create Page Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">Create New Landing Page</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleCreatePage} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Page Title *</label>
                    <input
                      type="text"
                      required
                      value={newPage.title}
                      onChange={(e) => setNewPage({ ...newPage, title: e.target.value })}
                      placeholder="e.g., Emergency Plumbing Services"
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">URL Slug</label>
                    <input
                      type="text"
                      value={newPage.slug}
                      onChange={(e) => setNewPage({ ...newPage, slug: e.target.value })}
                      placeholder="Auto-generated from title"
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    <p className="text-xs text-gray-500 mt-1">Leave blank to auto-generate from title</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Service Type</label>
                  <select
                    value={newPage.service_type}
                    onChange={(e) => setNewPage({ ...newPage, service_type: e.target.value })}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    {serviceTypes.map(service => (
                      <option key={service} value={service}>
                        {service.charAt(0).toUpperCase() + service.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Choose Template</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {templates.map((template) => (
                      <div
                        key={template.id}
                        className={`relative border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                          newPage.template === template.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setNewPage({ ...newPage, template: template.id })}
                      >
                        <div className="flex items-center">
                          <input
                            type="radio"
                            name="template"
                            value={template.id}
                            checked={newPage.template === template.id}
                            onChange={() => setNewPage({ ...newPage, template: template.id })}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <div className="ml-3">
                            <h4 className="text-sm font-medium text-gray-900">{template.name}</h4>
                            <p className="text-xs text-gray-500">{template.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                  <textarea
                    rows={3}
                    value={newPage.description}
                    onChange={(e) => setNewPage({ ...newPage, description: e.target.value })}
                    placeholder="Brief description for SEO and internal reference"
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Create Page
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

