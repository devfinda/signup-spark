import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Circle, MessageSquare } from 'lucide-react';
import Button from '../components/Button';
import TaskComments from '../components/TaskComments';
import { useCampaignStore } from '../store/campaignStore';
import { useTaskStore } from '../store/taskStore';
import { useContactStore } from '../store/contactStore';

interface SignupForm {
  name: string;
  email: string;
  phone: string;
}

const validateEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export default function PublicCampaignView() {
  const { code } = useParams();
  const navigate = useNavigate();
  const campaign = useCampaignStore((state) => 
    state.campaigns.find(c => c.code === code)
  );
  const tasks = campaign ? useTaskStore((state) => state.getTasksByCampaign(campaign.id)) : [];
  const { addContact } = useContactStore();
  const updateTask = useTaskStore((state) => state.updateTask);

  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [showComments, setShowComments] = useState<string | null>(null);
  const [signupForm, setSignupForm] = useState<SignupForm>({
    name: '',
    email: '',
    phone: '',
  });
  const [error, setError] = useState('');

  if (!campaign) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Campaign Not Found</h1>
          <p className="text-gray-600 mb-6">
            The campaign you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate('/')}>
            Return Home
          </Button>
        </div>
      </div>
    );
  }

  const handleSignUp = (taskId: string) => {
    setSelectedTask(taskId);
    setSignupForm({ name: '', email: '', phone: '' });
    setError('');
  };

  const handleConfirmSignUp = async (taskId: string) => {
    if (!signupForm.name || !signupForm.email) {
      setError('Name and email are required');
      return;
    }

    if (!validateEmail(signupForm.email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Add contact to the store
    const contact = {
      id: crypto.randomUUID(),
      name: signupForm.name.trim(),
      email: signupForm.email.trim(),
      phone: signupForm.phone.trim() || undefined,
      createdAt: new Date().toISOString(),
      campaigns: [campaign.id],
    };
    addContact(contact);

    // Update task with participant's information
    updateTask(campaign.id, taskId, {
      status: 'TAKEN',
      assignedTo: signupForm.name.trim(),
      assignedEmail: signupForm.email.trim(),
      assignedPhone: signupForm.phone.trim() || undefined,
    });

    setSelectedTask(null);
    setSignupForm({ name: '', email: '', phone: '' });
    setError('');
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="container max-w-4xl">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {campaign.name}
            </h1>
            {campaign.description && (
              <p className="text-gray-600">{campaign.description}</p>
            )}
            <div className="mt-4 text-sm text-gray-500">
              Campaign ID: {campaign.code}
            </div>
          </div>

          <div className="space-y-6">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="border rounded-lg p-6 hover:border-purple-200 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {task.name}
                    </h3>
                    {task.description && (
                      <p className="text-gray-600 mt-1">{task.description}</p>
                    )}
                    <div className="flex flex-wrap gap-4 mt-2">
                      {task.quantity && (
                        <div className="text-sm text-gray-500">
                          Quantity needed: {task.quantity}
                        </div>
                      )}
                      {task.dueDate && (
                        <div className="text-sm text-gray-500">
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center">
                    {task.status === 'TAKEN' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        <CheckCircle className="w-4 h-4" />
                        Taken
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        <Circle className="w-4 h-4" />
                        Open
                      </span>
                    )}
                  </div>
                </div>

                {task.status === 'TAKEN' ? (
                  <div className="text-sm text-gray-500">
                    Taken by: {task.assignedTo}
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    {selectedTask === task.id ? (
                      <div className="w-full space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <input
                            type="text"
                            value={signupForm.name}
                            onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                            placeholder="Your Name *"
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          />
                          <input
                            type="email"
                            value={signupForm.email}
                            onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                            placeholder="Your Email *"
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          />
                          <input
                            type="tel"
                            value={signupForm.phone}
                            onChange={(e) => setSignupForm({ ...signupForm, phone: e.target.value })}
                            placeholder="Your Phone (Optional)"
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          />
                        </div>
                        {error && (
                          <p className="text-sm text-red-600">{error}</p>
                        )}
                        <div className="flex justify-end gap-3">
                          <Button
                            variant="outline"
                            onClick={() => setSelectedTask(null)}
                          >
                            Cancel
                          </Button>
                          <Button onClick={() => handleConfirmSignUp(task.id)}>
                            Confirm Sign Up
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button onClick={() => handleSignUp(task.id)}>
                        Sign Up
                      </Button>
                    )}
                  </div>
                )}

                {/* Comments Section */}
                <div className="mt-4 border-t pt-4">
                  <button
                    onClick={() => setShowComments(showComments === task.id ? null : task.id)}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
                  >
                    <MessageSquare className="w-4 h-4" />
                    {task.comments?.length || 0} Comments
                  </button>
                  {showComments === task.id && (
                    <TaskComments
                      campaignId={campaign.id}
                      taskId={task.id}
                    />
                  )}
                </div>
              </div>
            ))}

            {tasks.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No tasks available in this campaign.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}