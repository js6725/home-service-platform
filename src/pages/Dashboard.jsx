import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  MessageSquare, 
  Users, 
  TrendingUp, 
  Calendar,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase/client';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    leads: 0,
    customers: 0,
    landingPages: 0,
    appointments: 0,
  });
  const [recentLeads, setRecentLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // In a real app, these would be actual queries to your Supabase tables
        // For the starter kit, we'll use placeholder data
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Set placeholder stats
        setStats({
          leads: 12,
          customers: 5,
          landingPages: 2,
          appointments: 3,
        });
        
        // Set placeholder recent leads
        setRecentLeads([
          {
            id: '1',
            name: 'John Smith',
            email: 'john@example.com',
            phone: '(555) 123-4567',
            service: 'Plumbing Repair',
            created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            status: 'new',
          },
          {
            id: '2',
            name: 'Sarah Johnson',
            email: 'sarah@example.com',
            phone: '(555) 987-6543',
            service: 'HVAC Installation',
            created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'contacted',
          },
          {
            id: '3',
            name: 'Michael Brown',
            email: 'michael@example.com',
            phone: '(555) 456-7890',
            service: 'Carpentry Work',
            created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'qualified',
          },
        ]);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };
  
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'new':
        return 'badge-blue';
      case 'contacted':
        return 'badge-yellow';
      case 'qualified':
        return 'badge-green';
      case 'lost':
        return 'badge-gray';
      default:
        return 'badge-gray';
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-dark">Dashboard</h1>
        <div className="text-sm text-gray-medium">
          Welcome back, {user?.email || 'User'}
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card flex items-center">
          <div className="rounded-full bg-primary-light p-3 mr-4">
            <MessageSquare className="h-6 w-6 text-primary" />
          </div>
          <div>
            <div className="text-sm text-gray-medium">Total Leads</div>
            <div className="text-2xl font-semibold">{stats.leads}</div>
          </div>
        </div>
        
        <div className="card flex items-center">
          <div className="rounded-full bg-secondary-light p-3 mr-4">
            <Users className="h-6 w-6 text-secondary" />
          </div>
          <div>
            <div className="text-sm text-gray-medium">Customers</div>
            <div className="text-2xl font-semibold">{stats.customers}</div>
          </div>
        </div>
        
        <div className="card flex items-center">
          <div className="rounded-full bg-primary-light p-3 mr-4">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <div>
            <div className="text-sm text-gray-medium">Landing Pages</div>
            <div className="text-2xl font-semibold">{stats.landingPages}</div>
          </div>
        </div>
        
        <div className="card flex items-center">
          <div className="rounded-full bg-secondary-light p-3 mr-4">
            <Calendar className="h-6 w-6 text-secondary" />
          </div>
          <div>
            <div className="text-sm text-gray-medium">Appointments</div>
            <div className="text-2xl font-semibold">{stats.appointments}</div>
          </div>
        </div>
      </div>
      
      {/* Recent Leads */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Leads</h2>
          <Link to="/leads" className="text-primary text-sm flex items-center hover:text-primary-dark">
            View all <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
        {recentLeads.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-light">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-medium uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-medium uppercase tracking-wider">Service</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-medium uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-medium uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-light">
                {recentLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-offwhite">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <Link to={`/leads/${lead.id}`} className="text-primary hover:text-primary-dark">
                        {lead.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">{lead.service}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{formatDate(lead.created_at)}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={getStatusBadgeClass(lead.status)}>
                        {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-medium">No leads yet</p>
            <Link to="/landing-pages" className="btn-primary mt-4">
              Create a landing page to get leads
            </Link>
          </div>
        )}
      </div>
      
      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/landing-pages/new" className="btn-primary text-center">
            Create Landing Page
          </Link>
          <Link to="/leads" className="btn-secondary text-center">
            Manage Leads
          </Link>
          <Link to="/customers" className="btn-secondary text-center">
            View Customers
          </Link>
        </div>
      </div>
    </div>
  );
}

