import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase/client';

export default function AutomationWorkflows() {
  const { user } = useAuth();
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newWorkflow, setNewWorkflow] = useState({
    name: '',
    trigger: 'new_lead',
    conditions: [],
    actions: [],
    is_active: true
  });

  const triggerTypes = [
    { id: 'new_lead', name: 'New Lead Created', description: 'When a new lead is captured' },
    { id: 'lead_status_change', name: 'Lead Status Changed', description: 'When lead status is updated' },
    { id: 'appointment_scheduled', name: 'Appointment Scheduled', description: 'When an appointment is booked' },
    { id: 'quote_requested', name: 'Quote Requested', description: 'When a quote is requested' },
    { id: 'time_delay', name: 'Time Delay', description: 'After a specific time period' }
  ];

  const actionTypes = [
    { 
      id: 'send_email', 
      name: 'Send Email', 
      description: 'Send automated email to lead or team',
      icon: '📧',
      fields: ['recipient', 'subject', 'template', 'delay']
    },
    { 
      id: 'send_sms', 
      name: 'Send SMS', 
      description: 'Send text message to lead or team',
      icon: '📱',
      fields: ['recipient', 'message', 'delay']
    },
    { 
      id: 'create_task', 
      name: 'Create Task', 
      description: 'Create follow-up task for team member',
      icon: '✅',
      fields: ['assignee', 'title', 'description', 'due_date']
    },
    { 
      id: 'update_lead_status', 
      name: 'Update Lead Status', 
      description: 'Automatically change lead status',
      icon: '🔄',
      fields: ['status']
    },
    { 
      id: 'add_to_sequence', 
      name: 'Add to Email Sequence', 
      description: 'Add lead to drip email campaign',
      icon: '📬',
      fields: ['sequence_id']
    }
  ];

  const emailTemplates = [
    { id: 'welcome', name: 'Welcome Email', subject: 'Thank you for your interest!' },
    { id: 'follow_up', name: 'Follow-up Email', subject: 'Following up on your request' },
    { id: 'quote_ready', name: 'Quote Ready', subject: 'Your quote is ready!' },
    { id: 'appointment_reminder', name: 'Appointment Reminder', subject: 'Reminder: Upcoming appointment' },
    { id: 'feedback_request', name: 'Feedback Request', subject: 'How did we do?' }
  ];

  const smsTemplates = [
    { id: 'welcome_sms', message: 'Thanks for your interest! We\'ll be in touch within 24 hours.' },
    { id: 'appointment_confirmation', message: 'Your appointment is confirmed for {date} at {time}.' },
    { id: 'on_the_way', message: 'Our technician is on the way! ETA: {eta}' },
    { id: 'quote_ready_sms', message: 'Your quote is ready! Check your email or call us at {phone}.' }
  ];

  useEffect(() => {
    if (user) {
      fetchWorkflows();
    }
  }, [user]);

  const fetchWorkflows = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('automation_workflows')
        .select('*')
        .eq('business_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching workflows:', error);
        setWorkflows([]);
      } else {
        setWorkflows(data || []);
      }
    } catch (error) {
      console.error('Error fetching workflows:', error);
      setWorkflows([]);
    } finally {
      setLoading(false);
    }
  };

  const createWorkflow = async (e) => {
    e.preventDefault();
    try {
      const workflowData = {
        ...newWorkflow,
        business_id: user.id
      };

      const { data, error } = await supabase
        .from('automation_workflows')
        .insert([workflowData])
        .select()
        .single();

      if (error) {
        console.error('Error creating workflow:', error);
        alert('Error creating workflow. Please try again.');
      } else {
        setWorkflows([data, ...workflows]);
        setShowCreateModal(false);
        resetNewWorkflow();
      }
    } catch (error) {
      console.error('Error creating workflow:', error);
      alert('Error creating workflow. Please try again.');
    }
  };

  const toggleWorkflow = async (workflowId, currentStatus) => {
    try {
      const { error } = await supabase
        .from('automation_workflows')
        .update({ is_active: !currentStatus })
        .eq('id', workflowId);

      if (error) {
        console.error('Error updating workflow:', error);
        alert('Error updating workflow. Please try again.');
      } else {
        setWorkflows(workflows.map(workflow => 
          workflow.id === workflowId ? { ...workflow, is_active: !currentStatus } : workflow
        ));
      }
    } catch (error) {
      console.error('Error updating workflow:', error);
      alert('Error updating workflow. Please try again.');
    }
  };

  const deleteWorkflow = async (workflowId) => {
    if (!confirm('Are you sure you want to delete this workflow? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('automation_workflows')
        .delete()
        .eq('id', workflowId);

      if (error) {
        console.error('Error deleting workflow:', error);
        alert('Error deleting workflow. Please try again.');
      } else {
        setWorkflows(workflows.filter(workflow => workflow.id !== workflowId));
      }
    } catch (error) {
      console.error('Error deleting workflow:', error);
      alert('Error deleting workflow. Please try again.');
    }
  };

  const addAction = () => {
    setNewWorkflow({
      ...newWorkflow,
      actions: [...newWorkflow.actions, {
        id: Date.now(),
        type: 'send_email',
        config: {
          recipient: 'lead',
          subject: '',
          template: 'welcome',
          delay: 0
        }
      }]
    });
  };

  const updateAction = (actionId, field, value) => {
    setNewWorkflow({
      ...newWorkflow,
      actions: newWorkflow.actions.map(action =>
        action.id === actionId
          ? { ...action, config: { ...action.config, [field]: value } }
          : action
      )
    });
  };

  const removeAction = (actionId) => {
    setNewWorkflow({
      ...newWorkflow,
      actions: newWorkflow.actions.filter(action => action.id !== actionId)
    });
  };

  const resetNewWorkflow = () => {
    setNewWorkflow({
      name: '',
      trigger: 'new_lead',
      conditions: [],
      actions: [],
      is_active: true
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
              <h1 className="text-3xl font-bold text-gray-900">Automation Workflows</h1>
              <p className="mt-1 text-sm text-gray-500">
                Automate your lead follow-up and customer communication
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create Workflow
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Setup Templates */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Setup Templates</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg border border-gray-200 hover:border-blue-300 cursor-pointer">
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-3">🚀</span>
                <h3 className="font-medium text-gray-900">New Lead Welcome</h3>
              </div>
              <p className="text-sm text-gray-500">Instantly welcome new leads with email and SMS</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200 hover:border-blue-300 cursor-pointer">
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-3">📅</span>
                <h3 className="font-medium text-gray-900">Appointment Reminders</h3>
              </div>
              <p className="text-sm text-gray-500">Send automatic appointment reminders</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200 hover:border-blue-300 cursor-pointer">
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-3">🔄</span>
                <h3 className="font-medium text-gray-900">Follow-up Sequence</h3>
              </div>
              <p className="text-sm text-gray-500">Multi-step follow-up for unresponsive leads</p>
            </div>
          </div>
        </div>

        {/* Workflows List */}
        {workflows.length > 0 ? (
          <div className="space-y-4">
            {workflows.map((workflow) => (
              <div key={workflow.id} className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">{workflow.name}</h3>
                      <p className="text-sm text-gray-500">
                        Trigger: {triggerTypes.find(t => t.id === workflow.trigger)?.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      workflow.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {workflow.is_active ? 'Active' : 'Inactive'}
                    </span>
                    <button
                      onClick={() => toggleWorkflow(workflow.id, workflow.is_active)}
                      className={`inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md ${
                        workflow.is_active
                          ? 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                          : 'text-green-700 bg-green-100 hover:bg-green-200'
                      }`}
                    >
                      {workflow.is_active ? 'Pause' : 'Activate'}
                    </button>
                    <button
                      onClick={() => deleteWorkflow(workflow.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Workflow Actions */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-700">Actions:</h4>
                  {workflow.actions && workflow.actions.length > 0 ? (
                    <div className="space-y-2">
                      {workflow.actions.map((action, index) => {
                        const actionType = actionTypes.find(t => t.id === action.type);
                        return (
                          <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                            <span className="text-xl mr-3">{actionType?.icon}</span>
                            <div className="flex-1">
                              <div className="text-sm font-medium text-gray-900">{actionType?.name}</div>
                              <div className="text-xs text-gray-500">
                                {action.type === 'send_email' && `To: ${action.config.recipient} | Subject: ${action.config.subject}`}
                                {action.type === 'send_sms' && `To: ${action.config.recipient} | Message: ${action.config.message?.substring(0, 50)}...`}
                                {action.type === 'update_lead_status' && `Status: ${action.config.status}`}
                              </div>
                            </div>
                            {action.config.delay > 0 && (
                              <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">
                                Delay: {action.config.delay}h
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No actions configured</p>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500">
                  Created {formatDate(workflow.created_at)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No workflows created</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating your first automation workflow.
            </p>
            <div className="mt-6">
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Create Your First Workflow
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create Workflow Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">Create Automation Workflow</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={createWorkflow} className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Workflow Name</label>
                    <input
                      type="text"
                      required
                      value={newWorkflow.name}
                      onChange={(e) => setNewWorkflow({ ...newWorkflow, name: e.target.value })}
                      placeholder="e.g., New Lead Welcome Sequence"
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Trigger</label>
                    <select
                      value={newWorkflow.trigger}
                      onChange={(e) => setNewWorkflow({ ...newWorkflow, trigger: e.target.value })}
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      {triggerTypes.map(trigger => (
                        <option key={trigger.id} value={trigger.id}>{trigger.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Actions */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-medium text-gray-900">Actions</h4>
                    <button
                      type="button"
                      onClick={addAction}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add Action
                    </button>
                  </div>

                  <div className="space-y-4">
                    {newWorkflow.actions.map((action, index) => (
                      <div key={action.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-4">
                          <h5 className="font-medium text-gray-900">Action {index + 1}</h5>
                          <button
                            type="button"
                            onClick={() => removeAction(action.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Action Type</label>
                            <select
                              value={action.type}
                              onChange={(e) => setNewWorkflow({
                                ...newWorkflow,
                                actions: newWorkflow.actions.map(a =>
                                  a.id === action.id ? { ...a, type: e.target.value } : a
                                )
                              })}
                              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            >
                              {actionTypes.map(type => (
                                <option key={type.id} value={type.id}>{type.name}</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Delay (hours)</label>
                            <input
                              type="number"
                              min="0"
                              value={action.config.delay || 0}
                              onChange={(e) => updateAction(action.id, 'delay', parseInt(e.target.value))}
                              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                        </div>

                        {/* Action-specific fields */}
                        {action.type === 'send_email' && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Recipient</label>
                              <select
                                value={action.config.recipient || 'lead'}
                                onChange={(e) => updateAction(action.id, 'recipient', e.target.value)}
                                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                              >
                                <option value="lead">Lead</option>
                                <option value="team">Team</option>
                                <option value="both">Both</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Template</label>
                              <select
                                value={action.config.template || 'welcome'}
                                onChange={(e) => updateAction(action.id, 'template', e.target.value)}
                                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                              >
                                {emailTemplates.map(template => (
                                  <option key={template.id} value={template.id}>{template.name}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        )}

                        {action.type === 'send_sms' && (
                          <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Message Template</label>
                            <select
                              value={action.config.template || 'welcome_sms'}
                              onChange={(e) => updateAction(action.id, 'template', e.target.value)}
                              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            >
                              {smsTemplates.map((template, idx) => (
                                <option key={idx} value={template.id}>{template.message.substring(0, 50)}...</option>
                              ))}
                            </select>
                          </div>
                        )}

                        {action.type === 'update_lead_status' && (
                          <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">New Status</label>
                            <select
                              value={action.config.status || 'contacted'}
                              onChange={(e) => updateAction(action.id, 'status', e.target.value)}
                              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="contacted">Contacted</option>
                              <option value="qualified">Qualified</option>
                              <option value="quoted">Quoted</option>
                              <option value="scheduled">Scheduled</option>
                            </select>
                          </div>
                        )}
                      </div>
                    ))}

                    {newWorkflow.actions.length === 0 && (
                      <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No actions added</h3>
                        <p className="mt-1 text-sm text-gray-500">Add actions to define what happens when this workflow triggers.</p>
                        <button
                          type="button"
                          onClick={addAction}
                          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                        >
                          Add First Action
                        </button>
                      </div>
                    )}
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
                    Create Workflow
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

