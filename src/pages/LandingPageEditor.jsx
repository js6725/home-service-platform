import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase/client';

export default function LandingPageEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    if (user && id) {
      fetchPage();
    }
  }, [user, id]);

  const fetchPage = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('landing_pages')
        .select('*')
        .eq('id', id)
        .eq('business_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching page:', error);
        navigate('/landing-pages');
      } else {
        setPage(data);
      }
    } catch (error) {
      console.error('Error fetching page:', error);
      navigate('/landing-pages');
    } finally {
      setLoading(false);
    }
  };

  const savePage = async () => {
    try {
      setSaving(true);
      const { error } = await supabase
        .from('landing_pages')
        .update({
          title: page.title,
          content: page.content,
          seo_title: page.seo_title,
          seo_description: page.seo_description
        })
        .eq('id', page.id);

      if (error) {
        console.error('Error saving page:', error);
        alert('Error saving page. Please try again.');
      } else {
        alert('Page saved successfully!');
      }
    } catch (error) {
      console.error('Error saving page:', error);
      alert('Error saving page. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const updateContent = (section, field, value) => {
    setPage(prev => ({
      ...prev,
      content: {
        ...prev.content,
        [section]: {
          ...prev.content[section],
          [field]: value
        }
      }
    }));
  };

  const updateArrayContent = (section, index, field, value) => {
    setPage(prev => ({
      ...prev,
      content: {
        ...prev.content,
        [section]: prev.content[section].map((item, i) => 
          i === index ? { ...item, [field]: value } : item
        )
      }
    }));
  };

  const addArrayItem = (section, newItem) => {
    setPage(prev => ({
      ...prev,
      content: {
        ...prev.content,
        [section]: [...(prev.content[section] || []), newItem]
      }
    }));
  };

  const removeArrayItem = (section, index) => {
    setPage(prev => ({
      ...prev,
      content: {
        ...prev.content,
        [section]: prev.content[section].filter((_, i) => i !== index)
      }
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Page not found</h2>
          <p className="mt-2 text-gray-600">The landing page you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/landing-pages')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Back to Landing Pages
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 flex justify-between items-center">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/landing-pages')}
                className="mr-4 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Edit Landing Page</h1>
                <p className="text-sm text-gray-500">{page.title}</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => window.open(`/preview/${page.slug}`, '_blank')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Preview
              </button>
              <button
                onClick={savePage}
                disabled={saving}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Page Sections</h3>
              <nav className="space-y-2">
                {[
                  { id: 'hero', name: 'Hero Section', icon: '🎯' },
                  { id: 'services', name: 'Services', icon: '🔧' },
                  { id: 'features', name: 'Features', icon: '⭐' },
                  { id: 'testimonials', name: 'Testimonials', icon: '💬' },
                  { id: 'seo', name: 'SEO Settings', icon: '🔍' }
                ].map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeSection === section.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <span className="mr-2">{section.icon}</span>
                    {section.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Editor */}
          <div className="lg:col-span-3">
            <div className="bg-white shadow rounded-lg p-6">
              {/* Hero Section */}
              {activeSection === 'hero' && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-6">Hero Section</h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Headline</label>
                      <input
                        type="text"
                        value={page.content.hero?.headline || ''}
                        onChange={(e) => updateContent('hero', 'headline', e.target.value)}
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Your main headline"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Subheadline</label>
                      <textarea
                        rows={3}
                        value={page.content.hero?.subheadline || ''}
                        onChange={(e) => updateContent('hero', 'subheadline', e.target.value)}
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Supporting text that explains your value proposition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Call-to-Action Button Text</label>
                      <input
                        type="text"
                        value={page.content.hero?.cta || ''}
                        onChange={(e) => updateContent('hero', 'cta', e.target.value)}
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Get Free Quote"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Services Section */}
              {activeSection === 'services' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-medium text-gray-900">Services</h3>
                    <button
                      onClick={() => addArrayItem('services', 'New Service')}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add Service
                    </button>
                  </div>
                  <div className="space-y-4">
                    {(page.content.services || []).map((service, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <input
                          type="text"
                          value={service}
                          onChange={(e) => updateArrayContent('services', index, null, e.target.value)}
                          className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Service name"
                        />
                        <button
                          onClick={() => removeArrayItem('services', index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Features Section */}
              {activeSection === 'features' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-medium text-gray-900">Features</h3>
                    <button
                      onClick={() => addArrayItem('features', 'New Feature')}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add Feature
                    </button>
                  </div>
                  <div className="space-y-4">
                    {(page.content.features || []).map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => updateArrayContent('features', index, null, e.target.value)}
                          className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Feature description"
                        />
                        <button
                          onClick={() => removeArrayItem('features', index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Testimonials Section */}
              {activeSection === 'testimonials' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-medium text-gray-900">Testimonials</h3>
                    <button
                      onClick={() => addArrayItem('testimonials', { name: '', text: '', rating: 5 })}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add Testimonial
                    </button>
                  </div>
                  <div className="space-y-6">
                    {(page.content.testimonials || []).map((testimonial, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="text-sm font-medium text-gray-900">Testimonial {index + 1}</h4>
                          <button
                            onClick={() => removeArrayItem('testimonials', index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                            <input
                              type="text"
                              value={testimonial.name || ''}
                              onChange={(e) => updateArrayContent('testimonials', index, 'name', e.target.value)}
                              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Customer name"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Testimonial Text</label>
                            <textarea
                              rows={3}
                              value={testimonial.text || ''}
                              onChange={(e) => updateArrayContent('testimonials', index, 'text', e.target.value)}
                              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                              placeholder="What the customer said..."
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                            <select
                              value={testimonial.rating || 5}
                              onChange={(e) => updateArrayContent('testimonials', index, 'rating', parseInt(e.target.value))}
                              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            >
                              {[1, 2, 3, 4, 5].map(rating => (
                                <option key={rating} value={rating}>{rating} Star{rating !== 1 ? 's' : ''}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SEO Section */}
              {activeSection === 'seo' && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-6">SEO Settings</h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Page Title</label>
                      <input
                        type="text"
                        value={page.seo_title || ''}
                        onChange={(e) => setPage({ ...page, seo_title: e.target.value })}
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="SEO title for search engines"
                      />
                      <p className="text-xs text-gray-500 mt-1">Recommended: 50-60 characters</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Meta Description</label>
                      <textarea
                        rows={3}
                        value={page.seo_description || ''}
                        onChange={(e) => setPage({ ...page, seo_description: e.target.value })}
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Brief description for search engine results"
                      />
                      <p className="text-xs text-gray-500 mt-1">Recommended: 150-160 characters</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">URL Slug</label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                          yoursite.com/
                        </span>
                        <input
                          type="text"
                          value={page.slug || ''}
                          onChange={(e) => setPage({ ...page, slug: e.target.value })}
                          className="flex-1 border-gray-300 rounded-none rounded-r-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          placeholder="page-url"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

