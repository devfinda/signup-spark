import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList } from 'lucide-react';
import Button from '../components/Button';
import { useCampaignStore } from '../store/campaignStore';
import { useAuthStore } from '../store/authStore';

interface CampaignForm {
  name: string;
  description: string;
}

export default function CampaignSetup() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const addCampaign = useCampaignStore((state) => state.addCampaign);
  const [form, setForm] = useState<CampaignForm>({
    name: '',
    description: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.name.trim()) {
      setError('Campaign name is required');
      return;
    }

    // Create a new campaign
    const campaign = {
      id: crypto.randomUUID(),
      name: form.name.trim(),
      description: form.description.trim(),
      createdAt: new Date().toISOString(),
      createdBy: user?.sub || 'anonymous',
    };

    // Add the campaign to the store
    addCampaign(campaign);

    // Navigate to task creation
    navigate('/campaigns/tasks');
  };

  return (
    <div className="container max-w-2xl pt-24">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center gap-3 mb-6">
          <ClipboardList className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Create New Campaign</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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
              placeholder="Summer Charity Event"
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
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Provide additional details about your campaign..."
            />
          </div>

          <div className="flex items-center justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/dashboard')}
            >
              Cancel
            </Button>
            <Button type="submit">
              Continue to Tasks
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}