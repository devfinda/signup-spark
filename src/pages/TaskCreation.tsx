import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Eye } from 'lucide-react';
import Button from '../components/Button';
import TaskPreview from '../components/TaskPreview';
import { useTaskStore } from '../store/taskStore';
import { useCampaignStore } from '../store/campaignStore';
import type { Task } from '../types/task';

export default function TaskCreation() {
  const navigate = useNavigate();
  const campaign = useCampaignStore((state) => state.currentCampaign);
  const { getTasksByCampaign, addTask, removeTask } = useTaskStore();
  const tasks = campaign ? getTasksByCampaign(campaign.id) : [];
  const [showPreview, setShowPreview] = useState(false);
  const [newTask, setNewTask] = useState<Partial<Task>>({
    name: '',
    quantity: undefined,
    dueDate: '',
    description: '',
  });

  if (!campaign) {
    navigate('/campaigns/new');
    return null;
  }

  const handleAddTask = () => {
    if (!newTask.name) return;

    const task: Task = {
      id: crypto.randomUUID(),
      name: newTask.name,
      quantity: newTask.quantity,
      dueDate: newTask.dueDate || undefined,
      description: newTask.description,
      status: 'OPEN',
    };

    addTask(campaign.id, task);
    setNewTask({
      name: '',
      quantity: undefined,
      dueDate: '',
      description: '',
    });
  };

  const handlePublish = () => {
    if (tasks.length === 0) return;
    navigate('/campaigns/publish');
  };

  return (
    <div className="container max-w-4xl pt-24">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create Tasks</h1>
            <p className="text-gray-600">Campaign: {campaign.name}</p>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowPreview(!showPreview)}
          >
            <Eye className="w-4 h-4 mr-2" />
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </Button>
        </div>

        <div className="space-y-6">
          {/* Task Input Form */}
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {tasks.map((task) => (
                  <tr key={task.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{task.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{task.quantity || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4">{task.description || '-'}</td>
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

          <div className="flex items-center justify-end gap-4 pt-4">
            <Button
              variant="outline"
              onClick={() => navigate('/campaigns/new')}
            >
              Back
            </Button>
            <Button
              onClick={handlePublish}
              disabled={tasks.length === 0}
            >
              Continue to Publish
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}