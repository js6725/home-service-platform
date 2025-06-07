import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Phone, Mail, Calendar } from 'lucide-react';

export default function Leads() {
  const [leads] = useState([
    {
      id: '1',
      name: 'John Smith',
      email: 'john@example.com',
      phone: '(555) 123-4567',
      service: 'Emergency Plumbing',
      message: 'Need urgent help with a burst pipe in my basement.',
      status: 'new',
      source: 'Landing Page',
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '(555) 987-6543',
      service: 'HVAC Installation',
      message: 'Looking for a quote on central air installation.',
      status: 'contacted',
      source: 'Landing Page',
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '3',
      name: 'Michael Brown',
      email: 'michael@example.com',
      phone: '(555) 456-7890',
      service: 'Kitchen Remodel',
      message: 'Need custom cabinets for kitchen renovation.',
      status: 'qualified',
      source: 'Landing Page',
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'new':
        return 'badge-blue';
      case 'contacted':
        return 'badge-yellow';
      case 'qualified':
        return 'badge-green';
      case 'converted':
        return 'badge-green';
      case 'lost':
        return 'badge-gray';
      default:
        return 'badge-gray';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-dark">Leads</h1>
        <div className="text-sm text-gray-medium">
          {leads.length} lead{leads.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center">
            <div className="rounded-full bg-blue-100 p-3 mr-3">
              <MessageSquare className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="text-sm text-gray-medium">New Leads</div>
              <div className="text-xl font-semibold">
                {leads.filter(lead => lead.status === 'new').length}
              </div>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="rounded-full bg-yellow-100 p-3 mr-3">
              <Phone className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <div className="text-sm text-gray-medium">Contacted</div>
              <div className="text-xl font-semibold">
                {leads.filter(lead => lead.status === 'contacted').length}
              </div>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="rounded-full bg-green-100 p-3 mr-3">
              <Calendar className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <div className="text-sm text-gray-medium">Qualified</div>
              <div className="text-xl font-semibold">
                {leads.filter(lead => lead.status === 'qualified').length}
              </div>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="rounded-full bg-primary-light p-3 mr-3">
              <MessageSquare className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="text-sm text-gray-medium">Total</div>
              <div className="text-xl font-semibold">{leads.length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Leads Table */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Leads</h2>
        </div>

        {leads.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-light">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-medium uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-medium uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-medium uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-medium uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-medium uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-light">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-offwhite">
                    <td className="px-4 py-3">
                      <div>
                        <Link 
                          to={`/leads/${lead.id}`} 
                          className="font-medium text-primary hover:text-primary-dark"
                        >
                          {lead.name}
                        </Link>
                        <div className="text-sm text-gray-medium">{lead.email}</div>
                        <div className="text-sm text-gray-medium">{lead.phone}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-gray-dark">{lead.service}</div>
                      <div className="text-sm text-gray-medium truncate max-w-xs">
                        {lead.message}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={getStatusBadgeClass(lead.status)}>
                        {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-dark">
                      {formatDate(lead.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <a href={`tel:${lead.phone}`} className="btn-icon" title="Call">
                          <Phone className="h-4 w-4" />
                        </a>
                        <a href={`mailto:${lead.email}`} className="btn-icon" title="Email">
                          <Mail className="h-4 w-4" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <MessageSquare className="h-12 w-12 text-gray-medium mx-auto mb-4" />
            <p className="text-gray-medium mb-4">No leads yet</p>
            <Link to="/landing-pages" className="btn-primary">
              Create a landing page to get leads
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

