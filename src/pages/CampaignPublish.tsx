import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link2, Mail, Copy, CheckCircle } from 'lucide-react';
import Button from '../components/Button';
import ContactList from '../components/ContactList';
import { useCampaignStore } from '../store/campaignStore';
import { useTaskStore } from '../store/taskStore';
import { useAuthStore } from '../store/authStore';
import type { Contact } from '../types/contact';

export default function CampaignPublish() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const campaign = useCampaignStore((state) => state.currentCampaign);
  const tasks = campaign ? useTaskStore((state) => state.getTasksByCampaign(campaign.id)) : [];
  
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'link' | 'email'>('link');

  if (!campaign) {
    navigate('/campaigns/new');
    return null;
  }

  const campaignUrl = `/campaign/${campaign.id}`;

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.origin + campaignUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePreviewLink = () => {
    navigate(campaignUrl);
  };

  const handleSendEmails = () => {
    if (selectedContacts.length === 0) {
      alert('Please select at least one contact');
      return;
    }

    // In a real app, we would send emails here
    alert('Invitations sent successfully!');
    navigate('/dashboard');
  };

  return (
    <div className="container max-w-2xl pt-24">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Publish Campaign
        </h1>

        <div className="space-y-8">
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200">
            <button
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === 'link'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('link')}
            >
              Share Link
            </button>
            <button
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === 'email'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('email')}
            >
              Send Emails
            </button>
          </div>

          {/* Share Link Tab */}
          {activeTab === 'link' && (
            <div className="space-y-4">
              <p className="text-gray-600">
                Share this link with participants to let them sign up for tasks:
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={window.location.origin + campaignUrl}
                  readOnly
                  className="flex-1 px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-600"
                />
                <Button onClick={handleCopyLink}>
                  {copied ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
              <div className="flex justify-end">
                <Button variant="outline" onClick={handlePreviewLink}>
                  <Link2 className="w-4 h-4 mr-2" />
                  Preview Link
                </Button>
              </div>
            </div>
          )}

          {/* Send Emails Tab */}
          {activeTab === 'email' && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Select Contacts
                </h2>
                <ContactList
                  campaignId={campaign.id}
                  onSelect={setSelectedContacts}
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="text-sm text-gray-600">
                  {selectedContacts.length} contact(s) selected
                </div>
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={() => navigate('/dashboard')}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSendEmails}
                    disabled={selectedContacts.length === 0}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Send Invitations
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}