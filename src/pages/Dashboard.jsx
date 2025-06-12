import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  FileText, 
  DollarSign,
  Target,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  Plus,
  Filter,
  Download
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Sample data
  const metrics = [
    {
      title: 'Total Leads',
      value: '2,847',
      change: '+12.5%',
      trend: 'up',
      icon: Target,
      color: 'success'
    },
    {
      title: 'Conversion Rate',
      value: '24.8%',
      change: '+3.2%',
      trend: 'up',
      icon: TrendingUp,
      color: 'info'
    },
    {
      title: 'Active Customers',
      value: '1,429',
      change: '+8.1%',
      trend: 'up',
      icon: Users,
      color: 'warning'
    },
    {
      title: 'Revenue',
      value: '$89,247',
      change: '-2.4%',
      trend: 'down',
      icon: DollarSign,
      color: 'error'
    }
  ];

  const chartData = [
    { name: 'Mon', leads: 45, revenue: 2400, conversions: 12 },
    { name: 'Tue', leads: 52, revenue: 3200, conversions: 15 },
    { name: 'Wed', leads: 38, revenue: 1800, conversions: 8 },
    { name: 'Thu', leads: 67, revenue: 4100, conversions: 18 },
    { name: 'Fri', leads: 71, revenue: 4800, conversions: 22 },
    { name: 'Sat', leads: 43, revenue: 2900, conversions: 11 },
    { name: 'Sun', leads: 29, revenue: 1600, conversions: 7 }
  ];

  const serviceData = [
    { name: 'Plumbing', value: 35, color: 'var(--figma-blue)' },
    { name: 'Electrical', value: 28, color: 'var(--figma-purple)' },
    { name: 'HVAC', value: 22, color: 'var(--figma-orange)' },
    { name: 'Roofing', value: 15, color: 'var(--figma-green)' }
  ];

  const recentLeads = [
    {
      id: 1,
      name: 'John Smith',
      service: 'Emergency Plumbing',
      value: '$450',
      status: 'new',
      time: '5 min ago'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      service: 'AC Repair',
      value: '$320',
      status: 'contacted',
      time: '12 min ago'
    },
    {
      id: 3,
      name: 'Mike Wilson',
      service: 'Roof Inspection',
      value: '$180',
      status: 'quoted',
      time: '1 hour ago'
    },
    {
      id: 4,
      name: 'Lisa Brown',
      service: 'Electrical Wiring',
      value: '$890',
      status: 'won',
      time: '2 hours ago'
    }
  ];

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="skeleton h-8 w-48"></div>
          <div className="skeleton h-10 w-32"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card">
              <div className="skeleton h-6 w-24 mb-4"></div>
              <div className="skeleton h-8 w-20 mb-2"></div>
              <div className="skeleton h-4 w-16"></div>
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
          <h1 className="text-4xl font-bold text-primary mb-2">Dashboard</h1>
          <p className="text-secondary">Welcome back! Here's what's happening with your business.</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="form-input w-auto"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <button className="btn-secondary">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className="card hover-lift">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-${metric.color}/10`}>
                  <Icon className={`w-6 h-6 text-${metric.color}`} />
                </div>
                <button className="p-1 hover:bg-elevated rounded">
                  <MoreVertical className="w-4 h-4 text-muted" />
                </button>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-primary mb-1">{metric.value}</h3>
                <p className="text-sm text-secondary mb-2">{metric.title}</p>
                <div className="flex items-center">
                  {metric.trend === 'up' ? (
                    <ArrowUpRight className="w-4 h-4 text-success mr-1" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-error mr-1" />
                  )}
                  <span className={`text-sm font-medium ${
                    metric.trend === 'up' ? 'text-success' : 'text-error'
                  }`}>
                    {metric.change}
                  </span>
                  <span className="text-sm text-muted ml-1">vs last period</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leads Chart */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-primary">Lead Generation</h3>
            <div className="flex items-center space-x-2">
              <button className="btn-ghost btn-sm">
                <Filter className="w-4 h-4 mr-1" />
                Filter
              </button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="leadGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" />
              <XAxis dataKey="name" stroke="var(--text-secondary)" />
              <YAxis stroke="var(--text-secondary)" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'var(--bg-elevated)',
                  border: 'var(--border-primary)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="leads" 
                stroke="var(--accent-primary)" 
                fillOpacity={1} 
                fill="url(#leadGradient)" 
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Service Distribution */}
        <div className="card">
          <h3 className="text-xl font-semibold text-primary mb-6">Service Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={serviceData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {serviceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'var(--bg-elevated)',
                  border: 'var(--border-primary)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-4">
            {serviceData.map((service, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: service.color }}
                  ></div>
                  <span className="text-sm text-secondary">{service.name}</span>
                </div>
                <span className="text-sm font-medium text-primary">{service.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Leads */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-primary">Recent Leads</h3>
            <button className="btn-ghost btn-sm">View All</button>
          </div>
          <div className="space-y-4">
            {recentLeads.map((lead) => (
              <div key={lead.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-elevated transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {lead.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-primary">{lead.name}</p>
                    <p className="text-sm text-secondary">{lead.service}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-primary">{lead.value}</p>
                  <div className="flex items-center space-x-2">
                    <span className={`badge badge-${
                      lead.status === 'new' ? 'info' :
                      lead.status === 'contacted' ? 'warning' :
                      lead.status === 'quoted' ? 'primary' : 'success'
                    }`}>
                      {lead.status}
                    </span>
                    <span className="text-xs text-muted">{lead.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3 className="text-xl font-semibold text-primary mb-6">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 border border-primary rounded-lg hover:bg-elevated transition-colors text-left">
              <Plus className="w-6 h-6 text-accent mb-2" />
              <h4 className="font-medium text-primary">New Landing Page</h4>
              <p className="text-sm text-secondary">Create a new lead capture page</p>
            </button>
            <button className="p-4 border border-primary rounded-lg hover:bg-elevated transition-colors text-left">
              <Target className="w-6 h-6 text-cool mb-2" />
              <h4 className="font-medium text-primary">Add Lead</h4>
              <p className="text-sm text-secondary">Manually add a new lead</p>
            </button>
            <button className="p-4 border border-primary rounded-lg hover:bg-elevated transition-colors text-left">
              <FileText className="w-6 h-6 text-warning mb-2" />
              <h4 className="font-medium text-primary">Generate Report</h4>
              <p className="text-sm text-secondary">Create performance report</p>
            </button>
            <button className="p-4 border border-primary rounded-lg hover:bg-elevated transition-colors text-left">
              <Calendar className="w-6 h-6 text-success mb-2" />
              <h4 className="font-medium text-primary">Schedule Follow-up</h4>
              <p className="text-sm text-secondary">Set reminder for leads</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

