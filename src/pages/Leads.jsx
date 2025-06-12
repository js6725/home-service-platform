import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  User,
  MapPin,
  Clock,
  Star,
  TrendingUp,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterService, setFilterService] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // Sample data
  useEffect(() => {
    const sampleLeads = [
      {
        id: 1,
        name: 'John Smith',
        email: 'john.smith@email.com',
        phone: '(555) 123-4567',
        service: 'Emergency Plumbing',
        status: 'new',
        value: 450,
        priority: 'high',
        source: 'Landing Page',
        location: 'Downtown',
        createdAt: '2024-01-15T10:30:00Z',
        notes: 'Burst pipe in basement, needs immediate attention'
      },
      {
        id: 2,
        name: 'Sarah Johnson',
        email: 'sarah.j@email.com',
        phone: '(555) 234-5678',
        service: 'AC Repair',
        status: 'contacted',
        value: 320,
        priority: 'medium',
        source: 'Google Ads',
        location: 'Suburbs',
        createdAt: '2024-01-15T09:15:00Z',
        notes: 'AC not cooling properly, scheduled for tomorrow'
      },
      {
        id: 3,
        name: 'Mike Wilson',
        email: 'mike.wilson@email.com',
        phone: '(555) 345-6789',
        service: 'Roof Inspection',
        status: 'quoted',
        value: 180,
        priority: 'low',
        source: 'Referral',
        location: 'Uptown',
        createdAt: '2024-01-14T16:45:00Z',
        notes: 'Annual inspection, flexible timing'
      },
      {
        id: 4,
        name: 'Lisa Brown',
        email: 'lisa.brown@email.com',
        phone: '(555) 456-7890',
        service: 'Electrical Wiring',
        status: 'won',
        value: 890,
        priority: 'high',
        source: 'Website',
        location: 'Downtown',
        createdAt: '2024-01-14T14:20:00Z',
        notes: 'Kitchen renovation wiring, project completed'
      },
      {
        id: 5,
        name: 'David Garcia',
        email: 'david.garcia@email.com',
        phone: '(555) 567-8901',
        service: 'HVAC Installation',
        status: 'lost',
        value: 1200,
        priority: 'medium',
        source: 'Social Media',
        location: 'Westside',
        createdAt: '2024-01-13T11:10:00Z',
        notes: 'Went with competitor, price was too high'
      }
    ];

    setTimeout(() => {
      setLeads(sampleLeads);
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.service.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || lead.status === filterStatus;
    const matchesService = filterService === 'all' || lead.service.toLowerCase().includes(filterService.toLowerCase());
    return matchesSearch && matchesStatus && matchesService;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      new: { class: 'badge-info', text: 'New' },
      contacted: { class: 'badge-warning', text: 'Contacted' },
      quoted: { class: 'badge-primary', text: 'Quoted' },
      won: { class: 'badge-success', text: 'Won' },
      lost: { class: 'badge-error', text: 'Lost' }
    };
    const config = statusConfig[status] || statusConfig.new;
    return <span className={`badge ${config.class}`}>{config.text}</span>;
  };

  const getPriorityIcon = (priority) => {
    const priorityConfig = {
      high: { color: 'text-error', icon: '🔴' },
      medium: { color: 'text-warning', icon: '🟡' },
      low: { color: 'text-success', icon: '🟢' }
    };
    const config = priorityConfig[priority] || priorityConfig.medium;
    return <span className={config.color}>{config.icon}</span>;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return date.toLocaleDateString();
  };

  const totalValue = filteredLeads.reduce((sum, lead) => sum + lead.value, 0);
  const conversionRate = leads.length > 0 ? (leads.filter(l => l.status === 'won').length / leads.length * 100).toFixed(1) : 0;

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="skeleton h-8 w-48"></div>
          <div className="skeleton h-10 w-32"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card">
              <div className="skeleton h-6 w-24 mb-4"></div>
              <div className="skeleton h-8 w-20 mb-2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-primary mb-2">Leads</h1>
          <p className="text-secondary">Manage and track your potential customers.</p>
        </div>
        <button className="btn-primary hover-lift">
          <Plus className="w-4 h-4 mr-2" />
          Add Lead
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary mb-1">Total Leads</p>
              <p className="text-2xl font-bold text-primary">{leads.length}</p>
            </div>
            <User className="w-8 h-8 text-cool" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary mb-1">Pipeline Value</p>
              <p className="text-2xl font-bold text-primary">${totalValue.toLocaleString()}</p>
            </div>
            <DollarSign className="w-8 h-8 text-success" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary mb-1">Conversion Rate</p>
              <p className="text-2xl font-bold text-primary">{conversionRate}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-warning" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary mb-1">New Today</p>
              <p className="text-2xl font-bold text-primary">
                {leads.filter(l => {
                  const today = new Date().toDateString();
                  const leadDate = new Date(l.createdAt).toDateString();
                  return today === leadDate;
                }).length}
              </p>
            </div>
            <Star className="w-8 h-8 text-info" />
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
              placeholder="Search leads..."
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
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="quoted">Quoted</option>
            <option value="won">Won</option>
            <option value="lost">Lost</option>
          </select>
          <select
            value={filterService}
            onChange={(e) => setFilterService(e.target.value)}
            className="form-input w-auto"
          >
            <option value="all">All Services</option>
            <option value="plumbing">Plumbing</option>
            <option value="electrical">Electrical</option>
            <option value="hvac">HVAC</option>
            <option value="roofing">Roofing</option>
          </select>
        </div>
        <button className="btn-ghost">
          <Filter className="w-4 h-4 mr-2" />
          More Filters
        </button>
      </div>

      {/* Leads Table */}
      <div className="card p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-primary">
              <tr>
                <th className="text-left p-4 font-semibold text-primary">Lead</th>
                <th className="text-left p-4 font-semibold text-primary">Service</th>
                <th className="text-left p-4 font-semibold text-primary">Status</th>
                <th className="text-left p-4 font-semibold text-primary">Value</th>
                <th className="text-left p-4 font-semibold text-primary">Source</th>
                <th className="text-left p-4 font-semibold text-primary">Created</th>
                <th className="text-right p-4 font-semibold text-primary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="border-b border-primary hover:bg-elevated transition-colors">
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      {getPriorityIcon(lead.priority)}
                      <div>
                        <h4 className="font-medium text-primary">{lead.name}</h4>
                        <div className="flex items-center space-x-4 text-sm text-secondary">
                          <div className="flex items-center">
                            <Mail className="w-3 h-3 mr-1" />
                            {lead.email}
                          </div>
                          <div className="flex items-center">
                            <Phone className="w-3 h-3 mr-1" />
                            {lead.phone}
                          </div>
                        </div>
                        <div className="flex items-center text-xs text-muted mt-1">
                          <MapPin className="w-3 h-3 mr-1" />
                          {lead.location}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="font-medium text-primary">{lead.service}</span>
                    {lead.notes && (
                      <p className="text-sm text-secondary mt-1 max-w-xs truncate">
                        {lead.notes}
                      </p>
                    )}
                  </td>
                  <td className="p-4">
                    {getStatusBadge(lead.status)}
                  </td>
                  <td className="p-4">
                    <span className="font-semibold text-primary">${lead.value}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-secondary">{lead.source}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center text-sm text-secondary">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatDate(lead.createdAt)}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="btn-icon hover:bg-elevated" title="View">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="btn-icon hover:bg-elevated" title="Edit">
                        <Edit className="w-4 h-4" />
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

        {filteredLeads.length === 0 && (
          <div className="text-center py-12">
            <User className="w-12 h-12 text-muted mx-auto mb-4" />
            <h3 className="text-lg font-medium text-primary mb-2">No leads found</h3>
            <p className="text-secondary mb-4">
              {searchTerm || filterStatus !== 'all' || filterService !== 'all'
                ? 'Try adjusting your filters'
                : 'Start by adding your first lead'}
            </p>
            <button className="btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              Add Lead
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leads;

