import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Button from './Button';
import { useCampaignStore } from '../store/campaignStore';

interface EditCampaignDialogProps {
  campaignId: string;
  onClose: () => void;
}

export default function EditCampaignDialog({ campaignId, onClose }: EditCampaignDialogProps) {
  const campaigns = useCampaignStore((state) => state.campaigns);
  const updateCampaign = useCampaignStore((state) => state.updateCampaign);
  const campaign = campaigns.find((c) => c.id === campaignId);
  
  const [form, setForm] = useState({
    name: '',
    description: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (campaign) {
      setForm({
        name: campaign.name,
        description: campaign.description,
      });
    }
  }, [campaign]);

  if (!campaign) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.name.trim()) {
      setError('Campaign name is required');
      return;
    }

    updateCampaign(campaignId, {
      name: form.name.trim(),
      description: form.description.trim(),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg max-w-lg w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Edit Campaign</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button type="submit">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}