import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, FileText, Eye, Edit, Trash2 } from 'lucide-react';

export default function LandingPages() {
  const [landingPages] = useState([
    {
      id: '1',
      title: 'Emergency Plumbing Services',
      slug: 'emergency-plumbing',
      status: 'published',
      views: 245,
      leads: 12,
      created_at: '2024-01-15',
    },
    {
      id: '2',
      title: 'HVAC Installation & Repair',
      slug: 'hvac-services',
      status: 'draft',
      views: 0,
      leads: 0,
      created_at: '2024-01-20',
    },
  ]);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'published':
        return 'badge-green';
      case 'draft':
        return 'badge-gray';
      default:
        return 'badge-gray';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-dark">Landing Pages</h1>
        <Link to="/landing-pages/new" className="btn-primary">
          <Plus className="h-4 w-4 mr-2" />
          Create New Page
        </Link>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Your Landing Pages</h2>
          <div className="text-sm text-gray-medium">
            {landingPages.length} page{landingPages.length !== 1 ? 's' : ''}
          </div>
        </div>

        {landingPages.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-light">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-medium uppercase tracking-wider">
                    Page
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-medium uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-medium uppercase tracking-wider">
                    Views
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-medium uppercase tracking-wider">
                    Leads
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-medium uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-light">
                {landingPages.map((page) => (
                  <tr key={page.id} className="hover:bg-gray-offwhite">
                    <td className="px-4 py-3">
                      <div>
                        <div className="font-medium text-gray-dark">{page.title}</div>
                        <div className="text-sm text-gray-medium">/{page.slug}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={getStatusBadgeClass(page.status)}>
                        {page.status.charAt(0).toUpperCase() + page.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-dark">{page.views}</td>
                    <td className="px-4 py-3 text-gray-dark">{page.leads}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <button className="btn-icon" title="View">
                          <Eye className="h-4 w-4" />
                        </button>
                        <Link to={`/landing-pages/${page.id}`} className="btn-icon" title="Edit">
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button className="btn-icon text-error hover:bg-error/10" title="Delete">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-medium mx-auto mb-4" />
            <p className="text-gray-medium mb-4">No landing pages yet</p>
            <Link to="/landing-pages/new" className="btn-primary">
              Create Your First Landing Page
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

