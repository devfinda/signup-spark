import { useState } from 'react';
import { X, Users, Copy, CheckCircle } from 'lucide-react';
import Button from './Button';
import { useContactStore } from '../store/contactStore';
import { useCampaignStore } from '../store/campaignStore';
import type { Contact } from '../types/contact';

interface ShareCampaignDialogProps {
  campaignId: string;
  onClose: () => void;
}

export default function ShareCampaignDialog({ campaignId, onClose }: ShareCampaignDialogProps) {
  const campaign = useCampaignStore((state) => 
    state.campaigns.find(c => c.id === campaignId)
  );
  const contacts = useContactStore((state) => state.contacts);
  const { addContactToCampaign, removeContactFromCampaign } = useContactStore();
  const [copied, setCopied] = useState(false);

  if (!campaign) return null;

  const assignedContacts = contacts.filter(contact => 
    contact.campaigns.includes(campaignId)
  );

  const unassignedContacts = contacts.filter(contact => 
    !contact.campaigns.includes(campaignId)
  );

  const handleToggleContact = (contact: Contact) => {
    if (contact.campaigns.includes(campaignId)) {
      removeContactFromCampaign(contact.id, campaignId);
    } else {
      addContactToCampaign(contact.id, campaignId);
    }
  };

  const handleCopyLink = async () => {
    const url = `${window.location.origin}/campaign/${campaign.code}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold">Share Campaign</h2>
            <p className="text-sm text-gray-500 mt-1">{campaign.name}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Shareable Link */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Campaign Link
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={`${window.location.origin}/campaign/${campaign.code}`}
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
          </div>

          {/* Assigned Contacts */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-700">
                Assigned Contacts
              </h3>
              <span className="text-sm text-gray-500">
                {assignedContacts.length} contacts
              </span>
            </div>
            <div className="border rounded-lg divide-y">
              {assignedContacts.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No contacts assigned yet
                </div>
              ) : (
                assignedContacts.map(contact => (
                  <div
                    key={contact.id}
                    className="flex items-center justify-between p-3 hover:bg-gray-50"
                  >
                    <div>
                      <div className="font-medium">{contact.name}</div>
                      <div className="text-sm text-gray-500">{contact.email}</div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleContact(contact)}
                    >
                      Remove
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Available Contacts */}
          {unassignedContacts.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-700">
                  Available Contacts
                </h3>
                <span className="text-sm text-gray-500">
                  {unassignedContacts.length} contacts
                </span>
              </div>
              <div className="border rounded-lg divide-y">
                {unassignedContacts.map(contact => (
                  <div
                    key={contact.id}
                    className="flex items-center justify-between p-3 hover:bg-gray-50"
                  >
                    <div>
                      <div className="font-medium">{contact.name}</div>
                      <div className="text-sm text-gray-500">{contact.email}</div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleToggleContact(contact)}
                    >
                      Assign
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-4 p-6 border-t">
          <Button onClick={onClose}>Done</Button>
        </div>
      </div>
    </div>
  );
}