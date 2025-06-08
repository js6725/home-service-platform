import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

export default function AnalyticsDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30');
  const [analytics, setAnalytics] = useState({
    overview: {
      totalLeads: 0,
      conversionRate: 0,
      avgResponseTime: 0,
      totalRevenue: 0
    },
    leadTrends: [],
    conversionFunnel: [],
    sourceBreakdown: [],
    revenueByService: [],
    performanceMetrics: []
  });

  const dateRangeOptions = [
    { value: '7', label: 'Last 7 days' },
    { value: '30', label: 'Last 30 days' },
    { value: '90', label: 'Last 3 months' },
    { value: '365', label: 'Last year' }
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  useEffect(() => {
    if (user) {
      fetchAnalytics();
    }
  }, [user, dateRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      // Calculate date range
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - parseInt(dateRange));

      // Fetch leads data
      const { data: leads, error: leadsError } = await supabase
        .from('leads')
        .select('*')
        .eq('business_id', user.id)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());

      if (leadsError) {
        console.error('Error fetching leads:', leadsError);
        return;
      }

      // Fetch landing pages data
      const { data: landingPages, error: pagesError } = await supabase
        .from('landing_pages')
        .select('*')
        .eq('business_id', user.id);

      if (pagesError) {
        console.error('Error fetching landing pages:', pagesError);
      }

      // Process analytics data
      const processedAnalytics = processAnalyticsData(leads || [], landingPages || []);
      setAnalytics(processedAnalytics);

    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const processAnalyticsData = (leads, landingPages) => {
    // Overview metrics
    const totalLeads = leads.length;
    const convertedLeads = leads.filter(lead => lead.status === 'converted').length;
    const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;
    
    // Calculate average response time (mock data for now)
    const avgResponseTime = 2.5; // hours
    
    // Calculate total revenue (mock calculation)
    const totalRevenue = convertedLeads * 1250; // Average job value

    // Lead trends over time
    const leadTrends = generateLeadTrends(leads, parseInt(dateRange));

    // Conversion funnel
    const conversionFunnel = [
      { stage: 'Visitors', count: totalLeads * 5, percentage: 100 },
      { stage: 'Leads', count: totalLeads, percentage: 20 },
      { stage: 'Qualified', count: Math.floor(totalLeads * 0.6), percentage: 12 },
      { stage: 'Quoted', count: Math.floor(totalLeads * 0.4), percentage: 8 },
      { stage: 'Converted', count: convertedLeads, percentage: 4 }
    ];

    // Source breakdown
    const sourceBreakdown = [
      { source: 'Google Ads', leads: Math.floor(totalLeads * 0.4), value: Math.floor(totalLeads * 0.4) },
      { source: 'Organic Search', leads: Math.floor(totalLeads * 0.3), value: Math.floor(totalLeads * 0.3) },
      { source: 'Facebook Ads', leads: Math.floor(totalLeads * 0.15), value: Math.floor(totalLeads * 0.15) },
      { source: 'Referrals', leads: Math.floor(totalLeads * 0.1), value: Math.floor(totalLeads * 0.1) },
      { source: 'Direct', leads: Math.floor(totalLeads * 0.05), value: Math.floor(totalLeads * 0.05) }
    ];

    // Revenue by service
    const services = ['Plumbing', 'HVAC', 'Electrical', 'Handyman', 'Cleaning'];
    const revenueByService = services.map((service, index) => ({
      service,
      revenue: Math.floor((totalRevenue / services.length) * (1 + (Math.random() - 0.5) * 0.4)),
      leads: Math.floor((totalLeads / services.length) * (1 + (Math.random() - 0.5) * 0.4))
    }));

    // Performance metrics
    const performanceMetrics = generatePerformanceMetrics(parseInt(dateRange));

    return {
      overview: {
        totalLeads,
        conversionRate: Math.round(conversionRate * 10) / 10,
        avgResponseTime,
        totalRevenue
      },
      leadTrends,
      conversionFunnel,
      sourceBreakdown,
      revenueByService,
      performanceMetrics
    };
  };

  const generateLeadTrends = (leads, days) => {
    const trends = [];
    const endDate = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(endDate.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayLeads = leads.filter(lead => 
        lead.created_at.split('T')[0] === dateStr
      ).length;
      
      trends.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        leads: dayLeads,
        conversions: Math.floor(dayLeads * 0.2)
      });
    }
    
    return trends;
  };

  const generatePerformanceMetrics = (days) => {
    const metrics = [];
    const endDate = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(endDate.getDate() - i);
      
      metrics.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        responseTime: 1.5 + Math.random() * 2,
        satisfaction: 4.2 + Math.random() * 0.6,
        efficiency: 75 + Math.random() * 20
      });
    }
    
    return metrics;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${value.toFixed(1)}%`;
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
              <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">
                Track your business performance and lead generation metrics
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                {dateRangeOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export Report
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Leads</dt>
                    <dd className="text-lg font-medium text-gray-900">{analytics.overview.totalLeads}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Conversion Rate</dt>
                    <dd className="text-lg font-medium text-gray-900">{formatPercentage(analytics.overview.conversionRate)}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Avg Response Time</dt>
                    <dd className="text-lg font-medium text-gray-900">{analytics.overview.avgResponseTime}h</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                    <dd className="text-lg font-medium text-gray-900">{formatCurrency(analytics.overview.totalRevenue)}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Lead Trends */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Lead Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analytics.leadTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="leads" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                <Area type="monotone" dataKey="conversions" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Source Breakdown */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Lead Sources</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.sourceBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ source, percentage }) => `${source} (${percentage}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {analytics.sourceBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Conversion Funnel */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Conversion Funnel</h3>
          <div className="space-y-4">
            {analytics.conversionFunnel.map((stage, index) => (
              <div key={stage.stage} className="flex items-center">
                <div className="w-24 text-sm font-medium text-gray-700">{stage.stage}</div>
                <div className="flex-1 mx-4">
                  <div className="bg-gray-200 rounded-full h-6">
                    <div
                      className="bg-blue-600 h-6 rounded-full flex items-center justify-end pr-2"
                      style={{ width: `${stage.percentage}%` }}
                    >
                      <span className="text-white text-xs font-medium">{stage.count}</span>
                    </div>
                  </div>
                </div>
                <div className="w-16 text-sm text-gray-500 text-right">{formatPercentage(stage.percentage)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue by Service & Performance Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Revenue by Service */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue by Service</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.revenueByService}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="service" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Bar dataKey="revenue" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Performance Metrics */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.performanceMetrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="responseTime" stroke="#f59e0b" strokeWidth={2} name="Response Time (h)" />
                <Line type="monotone" dataKey="satisfaction" stroke="#10b981" strokeWidth={2} name="Satisfaction" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Insights & Recommendations */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">AI-Powered Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="border border-green-200 bg-green-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h4 className="font-medium text-green-900">Strong Performance</h4>
              </div>
              <p className="text-sm text-green-700">Your conversion rate is 15% above industry average. Keep up the great work!</p>
            </div>

            <div className="border border-yellow-200 bg-yellow-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <h4 className="font-medium text-yellow-900">Opportunity</h4>
              </div>
              <p className="text-sm text-yellow-700">Google Ads is your top source. Consider increasing budget by 20% for better ROI.</p>
            </div>

            <div className="border border-blue-200 bg-blue-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <h4 className="font-medium text-blue-900">Automation Tip</h4>
              </div>
              <p className="text-sm text-blue-700">Set up follow-up workflows to improve your response time and capture more leads.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

