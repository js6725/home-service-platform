import { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical,
  Eye,
  Edit,
  Copy,
  Trash2,
  ExternalLink,
  BarChart3,
  Users,
  Calendar,
  Globe
} from 'lucide-react';

const LandingPages = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const templates = [
    {
      id: 1,
      name: 'Professional Service',
      description: 'Clean, professional design perfect for established businesses',
      preview: '/api/placeholder/300/200',
      category: 'professional'
    },
    {
      id: 2,
      name: 'Modern Minimal',
      description: 'Sleek, minimal design with focus on conversion',
      preview: '/api/placeholder/300/200',
      category: 'modern'
    },
    {
      id: 3,
      name: 'High-Convert',
      description: 'Optimized for maximum lead generation',
      preview: '/api/placeholder/300/200',
      category: 'conversion'
    },
    {
      id: 4,
      name: 'Emergency Service',
      description: 'Urgent, action-focused design for emergency services',
      preview: '/api/placeholder/300/200',
      category: 'emergency'
    }
  ];

  const landingPages = [
    {
      id: 1,
      name: 'Emergency Plumbing Services',
      url: 'emergency-plumbing',
      status: 'published',
      views: 2847,
      leads: 89,
      conversion: 3.1,
      lastModified: '2 hours ago',
      template: 'Emergency Service'
    },
    {
      id: 2,
      name: 'AC Repair & Installation',
      url: 'ac-repair',
      status: 'published',
      views: 1923,
      leads: 67,
      conversion: 3.5,
      lastModified: '1 day ago',
      template: 'Professional Service'
    },
    {
      id: 3,
      name: 'Electrical Services',
      url: 'electrical-services',
      status: 'draft',
      views: 0,
      leads: 0,
      conversion: 0,
      lastModified: '3 days ago',
      template: 'Modern Minimal'
    },
    {
      id: 4,
      name: 'Roofing Inspection',
      url: 'roofing-inspection',
      status: 'published',
      views: 1456,
      leads: 34,
      conversion: 2.3,
      lastModified: '5 days ago',
      template: 'High-Convert'
    }
  ];

  const filteredPages = landingPages.filter(page => {
    const matchesSearch = page.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || page.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      published: { class: 'badge-success', text: 'Published' },
      draft: { class: 'badge-warning', text: 'Draft' },
      archived: { class: 'badge-gray', text: 'Archived' }
    };
    const config = statusConfig[status] || statusConfig.draft;
    return <span className={`badge ${config.class}`}>{config.text}</span>;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-primary mb-2">Landing Pages</h1>
          <p className="text-secondary">Create and manage high-converting landing pages for your services.</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="btn-primary hover-lift"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Page
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary mb-1">Total Pages</p>
              <p className="text-2xl font-bold text-primary">{landingPages.length}</p>
            </div>
            <Globe className="w-8 h-8 text-cool" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary mb-1">Total Views</p>
              <p className="text-2xl font-bold text-primary">
                {landingPages.reduce((sum, page) => sum + page.views, 0).toLocaleString()}
              </p>
            </div>
            <Eye className="w-8 h-8 text-info" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary mb-1">Total Leads</p>
              <p className="text-2xl font-bold text-primary">
                {landingPages.reduce((sum, page) => sum + page.leads, 0)}
              </p>
            </div>
            <Users className="w-8 h-8 text-success" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary mb-1">Avg. Conversion</p>
              <p className="text-2xl font-bold text-primary">
                {(landingPages.reduce((sum, page) => sum + page.conversion, 0) / landingPages.length).toFixed(1)}%
              </p>
            </div>
            <BarChart3 className="w-8 h-8 text-warning" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              placeholder="Search pages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input pl-10 w-64"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="form-input w-auto"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <button className="btn-ghost">
          <Filter className="w-4 h-4 mr-2" />
          More Filters
        </button>
      </div>

      {/* Landing Pages Table */}
      <div className="card p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-primary">
              <tr>
                <th className="text-left p-4 font-semibold text-primary">Page</th>
                <th className="text-left p-4 font-semibold text-primary">Status</th>
                <th className="text-left p-4 font-semibold text-primary">Views</th>
                <th className="text-left p-4 font-semibold text-primary">Leads</th>
                <th className="text-left p-4 font-semibold text-primary">Conversion</th>
                <th className="text-left p-4 font-semibold text-primary">Modified</th>
                <th className="text-right p-4 font-semibold text-primary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPages.map((page) => (
                <tr key={page.id} className="border-b border-primary hover:bg-elevated transition-colors">
                  <td className="p-4">
                    <div>
                      <h4 className="font-medium text-primary">{page.name}</h4>
                      <p className="text-sm text-secondary">/{page.url}</p>
                      <p className="text-xs text-muted">{page.template}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    {getStatusBadge(page.status)}
                  </td>
                  <td className="p-4">
                    <span className="font-medium text-primary">{page.views.toLocaleString()}</span>
                  </td>
                  <td className="p-4">
                    <span className="font-medium text-primary">{page.leads}</span>
                  </td>
                  <td className="p-4">
                    <span className="font-medium text-primary">{page.conversion}%</span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-secondary">{page.lastModified}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="btn-icon hover:bg-elevated" title="View">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="btn-icon hover:bg-elevated" title="Edit">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="btn-icon hover:bg-elevated" title="Analytics">
                        <BarChart3 className="w-4 h-4" />
                      </button>
                      <button className="btn-icon hover:bg-elevated" title="More">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-primary rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-primary">Create New Landing Page</h2>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="btn-icon"
              >
                ×
              </button>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-primary mb-4">Choose a Template</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {templates.map((template) => (
                  <div 
                    key={template.id}
                    className="figma-component p-4 cursor-pointer hover-lift"
                  >
                    <div className="aspect-video bg-elevated rounded-lg mb-4 flex items-center justify-center">
                      <span className="text-muted">Template Preview</span>
                    </div>
                    <h4 className="font-semibold text-primary mb-2">{template.name}</h4>
                    <p className="text-sm text-secondary mb-4">{template.description}</p>
                    <button className="figma-tool w-full">
                      Use This Template
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-6 border-t border-primary">
              <button 
                onClick={() => setShowCreateModal(false)}
                className="btn-ghost"
              >
                Cancel
              </button>
              <button className="btn-primary">
                Start from Scratch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPages;

