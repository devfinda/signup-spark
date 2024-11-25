import { useState } from 'react';
import { Plus, Trash2, Mail } from 'lucide-react';
import Button from './Button';
import { useContactStore } from '../store/contactStore';
import type { Contact } from '../types/contact';

interface ContactListProps {
  campaignId?: string;
  onSelect?: (contacts: Contact[]) => void;
}

export default function ContactList({ campaignId, onSelect }: ContactListProps) {
  const { contacts, addContact, removeContact, addContactToCampaign } = useContactStore();
  const [newContact, setNewContact] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleAddContact = () => {
    setError('');

    if (!newContact.name.trim() || !newContact.email.trim()) {
      setError('Name and email are required');
      return;
    }

    if (!validateEmail(newContact.email)) {
      setError('Please enter a valid email address');
      return;
    }

    const contact: Contact = {
      id: crypto.randomUUID(),
      name: newContact.name.trim(),
      email: newContact.email.trim(),
      phone: newContact.phone.trim() || undefined,
      createdAt: new Date().toISOString(),
      campaigns: campaignId ? [campaignId] : [],
    };

    addContact(contact);
    if (campaignId) {
      addContactToCampaign(contact.id, campaignId);
    }

    setNewContact({ name: '', email: '', phone: '' });
  };

  const handleSelectContact = (contactId: string) => {
    const newSelection = selectedContacts.includes(contactId)
      ? selectedContacts.filter(id => id !== contactId)
      : [...selectedContacts, contactId];
    
    setSelectedContacts(newSelection);
    
    if (onSelect) {
      const selectedContactObjects = contacts.filter(contact => 
        newSelection.includes(contact.id)
      );
      onSelect(selectedContactObjects);
    }
  };

  return (
    <div className="space-y-6">
      {/* Add Contact Form */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-4">
          <input
            type="text"
            value={newContact.name}
            onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
            placeholder="Name *"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="col-span-4">
          <input
            type="email"
            value={newContact.email}
            onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
            placeholder="Email *"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="col-span-2">
          <input
            type="tel"
            value={newContact.phone}
            onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
            placeholder="Phone"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="col-span-2">
          <Button
            onClick={handleAddContact}
            disabled={!newContact.name || !newContact.email}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        </div>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}

      {/* Contacts List */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {onSelect && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Select
                </th>
              )}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {contacts.map((contact) => (
              <tr key={contact.id}>
                {onSelect && (
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedContacts.includes(contact.id)}
                      onChange={() => handleSelectContact(contact.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                )}
                <td className="px-6 py-4">{contact.name}</td>
                <td className="px-6 py-4">{contact.email}</td>
                <td className="px-6 py-4">{contact.phone || '-'}</td>
                <td className="px-6 py-4 text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeContact(contact.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
            {contacts.length === 0 && (
              <tr>
                <td
                  colSpan={onSelect ? 5 : 4}
                  className="px-6 py-4 text-center text-gray-500"
                >
                  No contacts added yet. Start by adding some contacts above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}