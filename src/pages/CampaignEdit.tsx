import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Eye, Save, Copy, CheckCircle } from 'lucide-react';
import Button from '../components/Button';
import TaskPreview from '../components/TaskPreview';
import { useTaskStore } from '../store/taskStore';
import { useCampaignStore } from '../store/campaignStore';
import type { Task } from '../types/task';

export default function CampaignEdit() {
  const navigate = useNavigate();
  const campaign = useCampaignStore((state) => state.currentCampaign);
  const updateCampaign = useCampaignStore((state) => state.updateCampaign);
  const { getTasksByCampaign, addTask, removeTask, updateTask } = useTaskStore();
  
  const [form, setForm] = useState({
    name: '',
    description: '',
  });
  const [error, setError] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [copied, setCopied] = useState(false);
  const [newTask, setNewTask] = useState<Partial<Task>>({
    name: '',
    quantity: undefined,
    dueDate: '',
    description: '',
  });

  useEffect(() => {
    if (campaign) {
      setForm({
        name: campaign.name,
        description: campaign.description,
      });
    } else {
      navigate('/dashboard');
    }
  }, [campaign, navigate]);

  if (!campaign) return null;

  const tasks = getTasksByCampaign(campaign.id);

  const handleSave = () => {
    if (!form.name.trim()) {
      setError('Campaign name is required');
      return;
    }

    updateCampaign(campaign.id, {
      name: form.name.trim(),
      description: form.description.trim(),
    });

    navigate('/dashboard');
  };

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(campaign.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddTask = () => {
    if (!newTask.name) return;

    const task: Task = {
      id: crypto.randomUUID(),
      name: newTask.name,
      quantity: newTask.quantity,
      dueDate: newTask.dueDate || undefined,
      description: newTask.description,
      status: 'OPEN',
      comments: [],
    };

    addTask(campaign.id, task);
    setNewTask({
      name: '',
      quantity: undefined,
      dueDate: '',
      description: '',
    });
  };

  return (
    <div className="container max-w-4xl pt-24">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Edit Campaign</h1>
          <div className="flex items-center gap-4">
            <div 
              className="flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-lg border border-purple-100 cursor-pointer hover:bg-purple-100 transition-colors"
              onClick={handleCopyCode}
            >
              {copied ? (
                <>
                  <CheckCircle className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-700">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-700">ID: {campaign.code}</span>
                </>
              )}
            </div>
            <Button
              variant="outline"
              onClick={() => setShowPreview(!showPreview)}
            >
              <Eye className="w-4 h-4 mr-2" />
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </Button>
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>

        <div className="space-y-8">
          {/* Campaign Details */}
          <div className="space-y-4">
            <div>
              <label 
                htmlFor="name" 
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Campaign Name *
              </label>
              <input
                type="text"
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
              )}
            </div>

            <div>
              <label 
                htmlFor="description" 
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description (Optional)
              </label>
              <textarea
                id="description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Task Management */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Tasks</h2>

            {/* New Task Form */}
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-4">
                <input
                  type="text"
                  value={newTask.name}
                  onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                  placeholder="Task Name *"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="col-span-2">
                <input
                  type="number"
                  value={newTask.quantity || ''}
                  onChange={(e) => setNewTask({ ...newTask, quantity: parseInt(e.target.value) || undefined })}
                  placeholder="Quantity"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="col-span-3">
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="col-span-3">
                <Button
                  onClick={handleAddTask}
                  disabled={!newTask.name}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Task
                </Button>
              </div>
              <div className="col-span-12">
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Task Description (optional)"
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Task List */}
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Task</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {tasks.map((task) => (
                    <tr key={task.id}>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          value={task.name}
                          onChange={(e) => updateTask(campaign.id, task.id, { name: e.target.value })}
                          className="w-full bg-transparent border-none focus:ring-0 p-0"
                        />
                        {task.description && (
                          <input
                            type="text"
                            value={task.description}
                            onChange={(e) => updateTask(campaign.id, task.id, { description: e.target.value })}
                            className="w-full bg-transparent border-none focus:ring-0 p-0 text-sm text-gray-500 mt-1"
                          />
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          value={task.quantity || ''}
                          onChange={(e) => updateTask(campaign.id, task.id, { quantity: parseInt(e.target.value) || undefined })}
                          className="w-24 bg-transparent border-none focus:ring-0 p-0"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="date"
                          value={task.dueDate || ''}
                          onChange={(e) => updateTask(campaign.id, task.id, { dueDate: e.target.value })}
                          className="bg-transparent border-none focus:ring-0 p-0"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={task.status}
                          onChange={(e) => updateTask(campaign.id, task.id, { status: e.target.value as 'OPEN' | 'TAKEN' })}
                          className="bg-transparent border-none focus:ring-0 p-0"
                        >
                          <option value="OPEN">Open</option>
                          <option value="TAKEN">Taken</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeTask(campaign.id, task.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {tasks.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                        No tasks added yet. Start by adding some tasks above.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {showPreview && <TaskPreview campaignId={campaign.id} />}
          </div>
        </div>
      </div>
    </div>
  );
}