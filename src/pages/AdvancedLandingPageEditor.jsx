import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase/client';

// Component Library for Drag & Drop
const ComponentLibrary = ({ onAddComponent }) => {
  const components = [
    {
      id: 'hero',
      name: 'Hero Section',
      icon: '🎯',
      description: 'Main banner with headline and CTA',
      defaultProps: {
        headline: 'Professional Home Services',
        subheadline: 'Get expert service from trusted professionals in your area',
        ctaText: 'Get Free Quote',
        backgroundImage: '',
        backgroundColor: '#1e40af'
      }
    },
    {
      id: 'services',
      name: 'Services Grid',
      icon: '🔧',
      description: 'Display your services in a grid layout',
      defaultProps: {
        title: 'Our Services',
        services: [
          { name: 'Emergency Repairs', description: '24/7 emergency service available', icon: '🚨' },
          { name: 'Installation', description: 'Professional installation services', icon: '🔧' },
          { name: 'Maintenance', description: 'Regular maintenance and checkups', icon: '⚙️' }
        ]
      }
    },
    {
      id: 'testimonials',
      name: 'Testimonials',
      icon: '💬',
      description: 'Customer reviews and testimonials',
      defaultProps: {
        title: 'What Our Customers Say',
        testimonials: [
          {
            name: 'John Smith',
            text: 'Excellent service! Professional, reliable, and affordable.',
            rating: 5,
            location: 'Local Customer'
          }
        ]
      }
    },
    {
      id: 'contact',
      name: 'Contact Form',
      icon: '📞',
      description: 'Lead capture form with contact details',
      defaultProps: {
        title: 'Get Your Free Quote',
        subtitle: 'Fill out the form below and we\'ll get back to you within 24 hours',
        fields: ['name', 'email', 'phone', 'service', 'message'],
        ctaText: 'Request Quote'
      }
    },
    {
      id: 'features',
      name: 'Features List',
      icon: '⭐',
      description: 'Highlight your key features and benefits',
      defaultProps: {
        title: 'Why Choose Us',
        features: [
          { title: 'Licensed & Insured', description: 'Fully licensed and insured for your peace of mind', icon: '🛡️' },
          { title: '24/7 Service', description: 'Emergency services available around the clock', icon: '🕐' },
          { title: 'Free Estimates', description: 'No obligation quotes for all services', icon: '💰' }
        ]
      }
    },
    {
      id: 'cta',
      name: 'Call to Action',
      icon: '📢',
      description: 'Prominent call-to-action section',
      defaultProps: {
        headline: 'Ready to Get Started?',
        subheadline: 'Contact us today for your free consultation',
        ctaText: 'Call Now',
        phone: '(555) 123-4567',
        backgroundColor: '#059669'
      }
    }
  ];

  return (
    <div className="bg-white border-r border-gray-200 w-80 h-full overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Components</h3>
        <p className="text-sm text-gray-500">Drag components to add them to your page</p>
      </div>
      <div className="p-4 space-y-3">
        {components.map((component) => (
          <div
            key={component.id}
            className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-colors"
            onClick={() => onAddComponent(component)}
          >
            <div className="flex items-start space-x-3">
              <span className="text-2xl">{component.icon}</span>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{component.name}</h4>
                <p className="text-sm text-gray-500 mt-1">{component.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Component Renderer
const ComponentRenderer = ({ component, isSelected, onSelect, onUpdate, onDelete }) => {
  const { type, props, id } = component;

  const handlePropUpdate = (key, value) => {
    onUpdate(id, { ...props, [key]: value });
  };

  const renderComponent = () => {
    switch (type) {
      case 'hero':
        return (
          <div 
            className="relative py-20 px-8 text-center text-white"
            style={{ backgroundColor: props.backgroundColor }}
          >
            <div className="max-w-4xl mx-auto">
              <h1 className="text-5xl font-bold mb-6">{props.headline}</h1>
              <p className="text-xl mb-8 opacity-90">{props.subheadline}</p>
              <button className="bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors">
                {props.ctaText}
              </button>
            </div>
          </div>
        );

      case 'services':
        return (
          <div className="py-16 px-8 bg-gray-50">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">{props.title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {props.services.map((service, index) => (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center">
                    <div className="text-4xl mb-4">{service.icon}</div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-900">{service.name}</h3>
                    <p className="text-gray-600">{service.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'testimonials':
        return (
          <div className="py-16 px-8 bg-white">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">{props.title}</h2>
              <div className="space-y-8">
                {props.testimonials.map((testimonial, index) => (
                  <div key={index} className="bg-gray-50 p-6 rounded-lg">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <span key={i} className="text-yellow-400 text-xl">⭐</span>
                      ))}
                    </div>
                    <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.location}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'contact':
        return (
          <div className="py-16 px-8 bg-blue-50">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-4 text-gray-900">{props.title}</h2>
              <p className="text-center text-gray-600 mb-8">{props.subtitle}</p>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" placeholder="Your Name" className="w-full p-3 border border-gray-300 rounded-lg" />
                  <input type="email" placeholder="Email Address" className="w-full p-3 border border-gray-300 rounded-lg" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="tel" placeholder="Phone Number" className="w-full p-3 border border-gray-300 rounded-lg" />
                  <select className="w-full p-3 border border-gray-300 rounded-lg">
                    <option>Select Service</option>
                    <option>Plumbing</option>
                    <option>HVAC</option>
                    <option>Electrical</option>
                  </select>
                </div>
                <textarea placeholder="Describe your project..." rows={4} className="w-full p-3 border border-gray-300 rounded-lg"></textarea>
                <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                  {props.ctaText}
                </button>
              </form>
            </div>
          </div>
        );

      case 'features':
        return (
          <div className="py-16 px-8 bg-white">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">{props.title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {props.features.map((feature, index) => (
                  <div key={index} className="text-center">
                    <div className="text-4xl mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-900">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'cta':
        return (
          <div 
            className="py-16 px-8 text-center text-white"
            style={{ backgroundColor: props.backgroundColor }}
          >
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-4">{props.headline}</h2>
              <p className="text-xl mb-8 opacity-90">{props.subheadline}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  {props.ctaText}
                </button>
                <a href={`tel:${props.phone}`} className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors">
                  {props.phone}
                </a>
              </div>
            </div>
          </div>
        );

      default:
        return <div className="p-8 bg-gray-100 text-center">Unknown component type: {type}</div>;
    }
  };

  return (
    <div 
      className={`relative group ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      onClick={() => onSelect(id)}
    >
      {renderComponent()}
      
      {/* Component Controls */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(id);
            }}
            className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors"
            title="Edit"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(id);
            }}
            className="bg-red-600 text-white p-2 rounded-md hover:bg-red-700 transition-colors"
            title="Delete"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

// Properties Panel
const PropertiesPanel = ({ selectedComponent, onUpdate }) => {
  if (!selectedComponent) {
    return (
      <div className="bg-white border-l border-gray-200 w-80 h-full p-4">
        <div className="text-center text-gray-500 mt-8">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No component selected</h3>
          <p className="mt-1 text-sm text-gray-500">Select a component to edit its properties</p>
        </div>
      </div>
    );
  }

  const { type, props } = selectedComponent;

  const handlePropChange = (key, value) => {
    onUpdate(selectedComponent.id, { ...props, [key]: value });
  };

  const renderPropertyEditor = () => {
    switch (type) {
      case 'hero':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Headline</label>
              <input
                type="text"
                value={props.headline}
                onChange={(e) => handlePropChange('headline', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subheadline</label>
              <textarea
                value={props.subheadline}
                onChange={(e) => handlePropChange('subheadline', e.target.value)}
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
              <input
                type="text"
                value={props.ctaText}
                onChange={(e) => handlePropChange('ctaText', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
              <input
                type="color"
                value={props.backgroundColor}
                onChange={(e) => handlePropChange('backgroundColor', e.target.value)}
                className="w-full h-10 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        );

      case 'services':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
              <input
                type="text"
                value={props.title}
                onChange={(e) => handlePropChange('title', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Services</label>
              {props.services.map((service, index) => (
                <div key={index} className="border border-gray-200 rounded-md p-3 mb-3">
                  <input
                    type="text"
                    placeholder="Service Name"
                    value={service.name}
                    onChange={(e) => {
                      const newServices = [...props.services];
                      newServices[index] = { ...service, name: e.target.value };
                      handlePropChange('services', newServices);
                    }}
                    className="w-full p-2 border border-gray-300 rounded-md mb-2"
                  />
                  <textarea
                    placeholder="Service Description"
                    value={service.description}
                    onChange={(e) => {
                      const newServices = [...props.services];
                      newServices[index] = { ...service, description: e.target.value };
                      handlePropChange('services', newServices);
                    }}
                    rows={2}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              ))}
            </div>
          </div>
        );

      case 'contact':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Form Title</label>
              <input
                type="text"
                value={props.title}
                onChange={(e) => handlePropChange('title', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
              <textarea
                value={props.subtitle}
                onChange={(e) => handlePropChange('subtitle', e.target.value)}
                rows={2}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
              <input
                type="text"
                value={props.ctaText}
                onChange={(e) => handlePropChange('ctaText', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        );

      default:
        return <div className="text-gray-500">No properties available for this component type.</div>;
    }
  };

  return (
    <div className="bg-white border-l border-gray-200 w-80 h-full overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Properties</h3>
        <p className="text-sm text-gray-500">{selectedComponent.type} component</p>
      </div>
      <div className="p-4">
        {renderPropertyEditor()}
      </div>
    </div>
  );
};

export default function AdvancedLandingPageEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [page, setPage] = useState(null);
  const [components, setComponents] = useState([]);
  const [selectedComponentId, setSelectedComponentId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
        // Initialize with existing components or default hero
        if (data.content && data.content.components) {
          setComponents(data.content.components);
        } else {
          setComponents([
            {
              id: 'hero-1',
              type: 'hero',
              props: {
                headline: 'Professional Home Services',
                subheadline: 'Get expert service from trusted professionals in your area',
                ctaText: 'Get Free Quote',
                backgroundColor: '#1e40af'
              }
            }
          ]);
        }
      }
    } catch (error) {
      console.error('Error fetching page:', error);
      navigate('/landing-pages');
    } finally {
      setLoading(false);
    }
  };

  const handleAddComponent = (componentTemplate) => {
    const newComponent = {
      id: `${componentTemplate.id}-${Date.now()}`,
      type: componentTemplate.id,
      props: componentTemplate.defaultProps
    };
    setComponents([...components, newComponent]);
  };

  const handleUpdateComponent = (componentId, newProps) => {
    setComponents(components.map(comp => 
      comp.id === componentId ? { ...comp, props: newProps } : comp
    ));
  };

  const handleDeleteComponent = (componentId) => {
    setComponents(components.filter(comp => comp.id !== componentId));
    if (selectedComponentId === componentId) {
      setSelectedComponentId(null);
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(components);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setComponents(items);
  };

  const savePage = async () => {
    try {
      setSaving(true);
      const { error } = await supabase
        .from('landing_pages')
        .update({
          content: {
            ...page.content,
            components: components
          }
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

  const selectedComponent = components.find(comp => comp.id === selectedComponentId);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4 flex justify-between items-center">
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
              <h1 className="text-xl font-bold text-gray-900">Advanced Page Builder</h1>
              <p className="text-sm text-gray-500">{page?.title}</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => window.open(`/preview/${page?.slug}`, '_blank')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
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
                  Save Page
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Editor */}
      <div className="flex-1 flex">
        {/* Component Library */}
        <ComponentLibrary onAddComponent={handleAddComponent} />

        {/* Canvas */}
        <div className="flex-1 overflow-y-auto bg-gray-100">
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="canvas">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="min-h-full"
                >
                  {components.map((component, index) => (
                    <Draggable key={component.id} draggableId={component.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <ComponentRenderer
                            component={component}
                            isSelected={selectedComponentId === component.id}
                            onSelect={setSelectedComponentId}
                            onUpdate={handleUpdateComponent}
                            onDelete={handleDeleteComponent}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>

        {/* Properties Panel */}
        <PropertiesPanel
          selectedComponent={selectedComponent}
          onUpdate={handleUpdateComponent}
        />
      </div>
    </div>
  );
}

