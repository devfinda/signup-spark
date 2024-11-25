import { useState } from 'react';
import { Users, Upload, Download, Plus, Search } from 'lucide-react';
import Button from '../components/Button';
import NewContactDialog from '../components/NewContactDialog';
import { useContactStore } from '../store/contactStore';
import { useCampaignStore } from '../store/campaignStore';
import type { Contact } from '../types/contact';

export default function Contacts() {
  const { contacts, addContact } = useContactStore();
  const campaigns = useCampaignStore((state) => state.campaigns);
  const [searchTerm, setSearchTerm] = useState('');
  const [showImport, setShowImport] = useState(false);
  const [showNewContact, setShowNewContact] = useState(false);
  const [csvContent, setCsvContent] = useState('');

  const handleImportCSV = () => {
    const rows = csvContent.trim().split('\n');
    const headers = rows[0].split(',');
    const nameIndex = headers.findIndex(h => h.toLowerCase().includes('name'));
    const emailIndex = headers.findIndex(h => h.toLowerCase().includes('email'));
    const phoneIndex = headers.findIndex(h => h.toLowerCase().includes('phone'));

    if (nameIndex === -1 || emailIndex === -1) {
      alert('CSV must contain "name" and "email" columns');
      return;
    }

    const newContacts = rows.slice(1).map(row => {
      const values = row.split(',');
      return {
        id: crypto.randomUUID(),
        name: values[nameIndex].trim(),
        email: values[emailIndex].trim(),
        phone: phoneIndex !== -1 ? values[phoneIndex].trim() : undefined,
        createdAt: new Date().toISOString(),
        campaigns: [],
      };
    });

    newContacts.forEach(contact => {
      if (contact.name && contact.email) {
        addContact(contact);
      }
    });

    setShowImport(false);
    setCsvContent('');
  };

  const handleExportCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Campaigns'];
    const rows = contacts.map(contact => [
      contact.name,
      contact.email,
      contact.phone || '',
      contact.campaigns
        .map(id => campaigns.find(c => c.id === id)?.name || '')
        .filter(Boolean)
        .join('; '),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'contacts.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900">My Contacts</h1>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Users className="w-4 h-4" />
            {contacts.length} total
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => setShowNewContact(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Contact
          </Button>
          <Button variant="outline" onClick={() => setShowImport(!showImport)}>
            <Upload className="w-4 h-4 mr-2" />
            Import CSV
          </Button>
          <Button variant="outline" onClick={handleExportCSV}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="mb-6">
        <div className="relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search contacts..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>
      </div>

      {/* Import CSV Dialog */}
      {showImport && (
        <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Import Contacts from CSV
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Paste your CSV content below. The CSV should include columns for name, email, and optionally phone.
          </p>
          <textarea
            value={csvContent}
            onChange={(e) => setCsvContent(e.target.value)}
            rows={5}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 mb-4"
            placeholder="name,email,phone&#10;John Doe,john@example.com,123-456-7890"
          />
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setShowImport(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleImportCSV}
              disabled={!csvContent.trim()}
            >
              Import Contacts
            </Button>
          </div>
        </div>
      )}

      {/* New Contact Dialog */}
      {showNewContact && (
        <NewContactDialog onClose={() => setShowNewContact(false)} />
      )}

      {/* Contacts Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Campaigns</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Added</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredContacts.map((contact) => (
              <tr key={contact.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  {contact.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {contact.email}
                  </a>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {contact.phone ? (
                    <a
                      href={`tel:${contact.phone}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {contact.phone}
                    </a>
                  ) : (
                    '-'
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    {contact.campaigns.map(campaignId => {
                      const campaign = campaigns.find(c => c.id === campaignId);
                      return campaign ? (
                        <span
                          key={campaignId}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                        >
                          {campaign.name}
                        </span>
                      ) : null;
                    })}
                    {contact.campaigns.length === 0 && '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(contact.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {filteredContacts.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  {contacts.length === 0 ? (
                    <div className="space-y-3">
                      <Users className="w-8 h-8 text-gray-400 mx-auto" />
                      <p>No contacts yet. Start by adding some contacts or import from CSV.</p>
                    </div>
                  ) : (
                    'No contacts match your search.'
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}