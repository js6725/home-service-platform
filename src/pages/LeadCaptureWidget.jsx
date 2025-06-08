import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase/client';

export default function LeadCaptureWidget() {
  const { user } = useAuth();
  const [widgets, setWidgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newWidget, setNewWidget] = useState({
    name: '',
    type: 'popup',
    trigger: 'time',
    delay: 5,
    fields: ['name', 'email', 'phone', 'service'],
    styling: {
      primaryColor: '#3b82f6',
      backgroundColor: '#ffffff',
      textColor: '#1f2937',
      borderRadius: '8px'
    },
    content: {
      headline: 'Get Your Free Quote',
      description: 'Fill out this quick form and we\'ll get back to you within 24 hours',
      ctaText: 'Get Quote',
      thankYouMessage: 'Thank you! We\'ll be in touch soon.'
    }
  });

  const widgetTypes = [
    { id: 'popup', name: 'Popup Modal', description: 'Overlay popup that appears on trigger' },
    { id: 'inline', name: 'Inline Form', description: 'Embedded form within page content' },
    { id: 'slide-in', name: 'Slide-in', description: 'Slides in from corner of screen' },
    { id: 'sticky-bar', name: 'Sticky Bar', description: 'Fixed bar at top or bottom of page' }
  ];

  const triggerTypes = [
    { id: 'time', name: 'Time Delay', description: 'Show after X seconds' },
    { id: 'scroll', name: 'Scroll Percentage', description: 'Show after scrolling X%' },
    { id: 'exit-intent', name: 'Exit Intent', description: 'Show when user tries to leave' },
    { id: 'immediate', name: 'Immediate', description: 'Show immediately on page load' }
  ];

  const fieldOptions = [
    { id: 'name', label: 'Full Name', required: true },
    { id: 'email', label: 'Email Address', required: true },
    { id: 'phone', label: 'Phone Number', required: false },
    { id: 'service', label: 'Service Type', required: false },
    { id: 'message', label: 'Project Description', required: false },
    { id: 'address', label: 'Service Address', required: false },
    { id: 'budget', label: 'Budget Range', required: false }
  ];

  useEffect(() => {
    if (user) {
      fetchWidgets();
    }
  }, [user]);

  const fetchWidgets = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('lead_capture_widgets')
        .select('*')
        .eq('business_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching widgets:', error);
        setWidgets([]);
      } else {
        setWidgets(data || []);
      }
    } catch (error) {
      console.error('Error fetching widgets:', error);
      setWidgets([]);
    } finally {
      setLoading(false);
    }
  };

  const createWidget = async (e) => {
    e.preventDefault();
    try {
      const widgetData = {
        ...newWidget,
        business_id: user.id,
        is_active: true,
        embed_code: generateEmbedCode(newWidget)
      };

      const { data, error } = await supabase
        .from('lead_capture_widgets')
        .insert([widgetData])
        .select()
        .single();

      if (error) {
        console.error('Error creating widget:', error);
        alert('Error creating widget. Please try again.');
      } else {
        setWidgets([data, ...widgets]);
        setShowCreateModal(false);
        resetNewWidget();
      }
    } catch (error) {
      console.error('Error creating widget:', error);
      alert('Error creating widget. Please try again.');
    }
  };

  const toggleWidget = async (widgetId, currentStatus) => {
    try {
      const { error } = await supabase
        .from('lead_capture_widgets')
        .update({ is_active: !currentStatus })
        .eq('id', widgetId);

      if (error) {
        console.error('Error updating widget:', error);
        alert('Error updating widget. Please try again.');
      } else {
        setWidgets(widgets.map(widget => 
          widget.id === widgetId ? { ...widget, is_active: !currentStatus } : widget
        ));
      }
    } catch (error) {
      console.error('Error updating widget:', error);
      alert('Error updating widget. Please try again.');
    }
  };

  const deleteWidget = async (widgetId) => {
    if (!confirm('Are you sure you want to delete this widget? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('lead_capture_widgets')
        .delete()
        .eq('id', widgetId);

      if (error) {
        console.error('Error deleting widget:', error);
        alert('Error deleting widget. Please try again.');
      } else {
        setWidgets(widgets.filter(widget => widget.id !== widgetId));
      }
    } catch (error) {
      console.error('Error deleting widget:', error);
      alert('Error deleting widget. Please try again.');
    }
  };

  const generateEmbedCode = (widget) => {
    const baseUrl = window.location.origin;
    return `<script src="${baseUrl}/widget/${widget.id}.js"></script>`;
  };

  const copyEmbedCode = (embedCode) => {
    navigator.clipboard.writeText(embedCode);
    alert('Embed code copied to clipboard!');
  };

  const resetNewWidget = () => {
    setNewWidget({
      name: '',
      type: 'popup',
      trigger: 'time',
      delay: 5,
      fields: ['name', 'email', 'phone', 'service'],
      styling: {
        primaryColor: '#3b82f6',
        backgroundColor: '#ffffff',
        textColor: '#1f2937',
        borderRadius: '8px'
      },
      content: {
        headline: 'Get Your Free Quote',
        description: 'Fill out this quick form and we\'ll get back to you within 24 hours',
        ctaText: 'Get Quote',
        thankYouMessage: 'Thank you! We\'ll be in touch soon.'
      }
    });
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
              <h1 className="text-3xl font-bold text-gray-900">Lead Capture Widgets</h1>
              <p className="mt-1 text-sm text-gray-500">
                Create embeddable forms to capture leads on any website
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create Widget
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Widgets Grid */}
        {widgets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {widgets.map((widget) => (
              <div key={widget.id} className="bg-white shadow rounded-lg overflow-hidden">
                {/* Widget Preview */}
                <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center relative">
                  <div 
                    className="bg-white rounded-lg p-4 shadow-lg max-w-xs w-full mx-4"
                    style={{ 
                      borderRadius: widget.styling.borderRadius,
                      backgroundColor: widget.styling.backgroundColor,
                      color: widget.styling.textColor
                    }}
                  >
                    <h3 className="font-semibold mb-2">{widget.content.headline}</h3>
                    <p className="text-sm mb-3 opacity-75">{widget.content.description}</p>
                    <div className="space-y-2">
                      {widget.fields.slice(0, 2).map((field) => (
                        <div key={field} className="h-8 bg-gray-100 rounded"></div>
                      ))}
                    </div>
                    <button 
                      className="w-full mt-3 py-2 rounded text-white text-sm font-medium"
                      style={{ backgroundColor: widget.styling.primaryColor }}
                    >
                      {widget.content.ctaText}
                    </button>
                  </div>
                  
                  {/* Widget Type Badge */}
                  <div className="absolute top-2 left-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white text-gray-800">
                      {widgetTypes.find(t => t.id === widget.type)?.name}
                    </span>
                  </div>
                </div>

                {/* Widget Info */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{widget.name}</h3>
                      <p className="text-sm text-gray-500">Created {formatDate(widget.created_at)}</p>
                    </div>
                    <div className="flex items-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        widget.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {widget.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div>
                      <span className="font-medium">Trigger:</span> {triggerTypes.find(t => t.id === widget.trigger)?.name}
                    </div>
                    <div>
                      <span className="font-medium">Fields:</span> {widget.fields.length} fields
                    </div>
                  </div>

                  {/* Embed Code */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Embed Code</label>
                    <div className="flex">
                      <input
                        type="text"
                        value={widget.embed_code}
                        readOnly
                        className="flex-1 text-xs p-2 border border-gray-300 rounded-l-md bg-gray-50 font-mono"
                      />
                      <button
                        onClick={() => copyEmbedCode(widget.embed_code)}
                        className="px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 hover:bg-gray-100 text-sm"
                      >
                        Copy
                      </button>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <button className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={() => toggleWidget(widget.id, widget.is_active)}
                      className={`flex-1 inline-flex justify-center items-center px-3 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                        widget.is_active
                          ? 'bg-gray-600 hover:bg-gray-700'
                          : 'bg-green-600 hover:bg-green-700'
                      }`}
                    >
                      {widget.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => deleteWidget(widget.id)}
                      className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
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
            <h3 className="mt-2 text-sm font-medium text-gray-900">No widgets created</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating your first lead capture widget.
            </p>
            <div className="mt-6">
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Create Your First Widget
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create Widget Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">Create Lead Capture Widget</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={createWidget} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column - Configuration */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Widget Name</label>
                      <input
                        type="text"
                        required
                        value={newWidget.name}
                        onChange={(e) => setNewWidget({ ...newWidget, name: e.target.value })}
                        placeholder="e.g., Homepage Lead Form"
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Widget Type</label>
                      <div className="space-y-2">
                        {widgetTypes.map((type) => (
                          <label key={type.id} className="flex items-start">
                            <input
                              type="radio"
                              name="type"
                              value={type.id}
                              checked={newWidget.type === type.id}
                              onChange={(e) => setNewWidget({ ...newWidget, type: e.target.value })}
                              className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                            />
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">{type.name}</div>
                              <div className="text-sm text-gray-500">{type.description}</div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Trigger</label>
                      <select
                        value={newWidget.trigger}
                        onChange={(e) => setNewWidget({ ...newWidget, trigger: e.target.value })}
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      >
                        {triggerTypes.map(trigger => (
                          <option key={trigger.id} value={trigger.id}>{trigger.name}</option>
                        ))}
                      </select>
                    </div>

                    {newWidget.trigger === 'time' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Delay (seconds)</label>
                        <input
                          type="number"
                          min="1"
                          value={newWidget.delay}
                          onChange={(e) => setNewWidget({ ...newWidget, delay: parseInt(e.target.value) })}
                          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Form Fields</label>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {fieldOptions.map((field) => (
                          <label key={field.id} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={newWidget.fields.includes(field.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setNewWidget({ ...newWidget, fields: [...newWidget.fields, field.id] });
                                } else {
                                  setNewWidget({ ...newWidget, fields: newWidget.fields.filter(f => f !== field.id) });
                                }
                              }}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-900">
                              {field.label} {field.required && <span className="text-red-500">*</span>}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Content & Styling */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Headline</label>
                      <input
                        type="text"
                        value={newWidget.content.headline}
                        onChange={(e) => setNewWidget({ 
                          ...newWidget, 
                          content: { ...newWidget.content, headline: e.target.value }
                        })}
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        rows={3}
                        value={newWidget.content.description}
                        onChange={(e) => setNewWidget({ 
                          ...newWidget, 
                          content: { ...newWidget.content, description: e.target.value }
                        })}
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
                      <input
                        type="text"
                        value={newWidget.content.ctaText}
                        onChange={(e) => setNewWidget({ 
                          ...newWidget, 
                          content: { ...newWidget.content, ctaText: e.target.value }
                        })}
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Primary Color</label>
                        <input
                          type="color"
                          value={newWidget.styling.primaryColor}
                          onChange={(e) => setNewWidget({ 
                            ...newWidget, 
                            styling: { ...newWidget.styling, primaryColor: e.target.value }
                          })}
                          className="w-full h-10 border border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Background</label>
                        <input
                          type="color"
                          value={newWidget.styling.backgroundColor}
                          onChange={(e) => setNewWidget({ 
                            ...newWidget, 
                            styling: { ...newWidget.styling, backgroundColor: e.target.value }
                          })}
                          className="w-full h-10 border border-gray-300 rounded-md"
                        />
                      </div>
                    </div>

                    {/* Preview */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
                      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                        <div 
                          className="bg-white rounded-lg p-4 shadow-lg max-w-sm"
                          style={{ 
                            borderRadius: newWidget.styling.borderRadius,
                            backgroundColor: newWidget.styling.backgroundColor,
                            color: newWidget.styling.textColor
                          }}
                        >
                          <h3 className="font-semibold mb-2">{newWidget.content.headline}</h3>
                          <p className="text-sm mb-3 opacity-75">{newWidget.content.description}</p>
                          <div className="space-y-2">
                            {newWidget.fields.slice(0, 3).map((field) => (
                              <div key={field} className="h-8 bg-gray-100 rounded"></div>
                            ))}
                          </div>
                          <button 
                            className="w-full mt-3 py-2 rounded text-white text-sm font-medium"
                            style={{ backgroundColor: newWidget.styling.primaryColor }}
                          >
                            {newWidget.content.ctaText}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Create Widget
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

