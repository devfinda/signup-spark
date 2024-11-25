import { CheckCircle, Circle, Download, Mail, Phone, X } from 'lucide-react';
import { useTaskStore } from '../store/taskStore';
import { useCampaignStore } from '../store/campaignStore';
import { useContactStore } from '../store/contactStore';
import Button from './Button';

interface CampaignReportProps {
  campaignId: string;
  onClose?: () => void;
}

export default function CampaignReport({ campaignId, onClose }: CampaignReportProps) {
  const tasks = useTaskStore((state) => state.getTasksByCampaign(campaignId));
  const campaign = useCampaignStore((state) => 
    state.campaigns.find((c) => c.id === campaignId)
  );
  const { contacts, addContact } = useContactStore();

  if (!campaign) return null;

  const openTasks = tasks.filter((task) => task.status === 'OPEN');
  const takenTasks = tasks.filter((task) => task.status === 'TAKEN');

  // Add any new participants to contacts if they're not already there
  takenTasks.forEach(task => {
    if (task.assignedTo && task.assignedEmail) {
      const existingContact = contacts.find(c => c.email === task.assignedEmail);
      if (!existingContact) {
        addContact({
          id: crypto.randomUUID(),
          name: task.assignedTo,
          email: task.assignedEmail,
          phone: task.assignedPhone,
          createdAt: new Date().toISOString(),
          campaigns: [campaignId],
        });
      }
    }
  });

  const handleExport = () => {
    // Create CSV content
    const headers = ['Task Name', 'Status', 'Assigned To', 'Contact Email', 'Contact Phone', 'Due Date', 'Quantity', 'Comments'];
    const rows = tasks.map(task => [
      task.name,
      task.status,
      task.assignedTo || '',
      task.assignedEmail || '',
      task.assignedPhone || '',
      task.dueDate || '',
      task.quantity || '',
      task.comments?.map(c => c.text).join('; ') || ''
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${campaign.name}-report.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Campaign Report: {campaign.name}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Campaign ID: {campaign.code}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          {onClose && (
            <Button variant="outline" onClick={onClose}>
              <X className="w-4 h-4 mr-2" />
              Close Report
            </Button>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm font-medium text-gray-500 mb-1">Total Tasks</div>
          <div className="text-2xl font-semibold text-gray-900">{tasks.length}</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm font-medium text-gray-500 mb-1">Open Tasks</div>
          <div className="text-2xl font-semibold text-green-600">{openTasks.length}</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm font-medium text-gray-500 mb-1">Taken Tasks</div>
          <div className="text-2xl font-semibold text-blue-600">{takenTasks.length}</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">Overall Progress</span>
          <span className="font-medium text-gray-900">
            {tasks.length > 0 ? Math.round((takenTasks.length / tasks.length) * 100) : 0}%
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3">
          <div
            className="bg-blue-600 h-3 rounded-full transition-all"
            style={{
              width: `${tasks.length > 0 ? (takenTasks.length / tasks.length) * 100 : 0}%`
            }}
          />
        </div>
      </div>

      {/* Detailed Task List */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Task</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned To</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact Info</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Comments</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {tasks.map((task) => (
              <tr key={task.id}>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{task.name}</div>
                  {task.quantity && (
                    <div className="text-sm text-gray-500">
                      Quantity: {task.quantity}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {task.status === 'TAKEN' ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-blue-600 mr-2" />
                        <span className="text-blue-600 font-medium">Taken</span>
                      </>
                    ) : (
                      <>
                        <Circle className="w-4 h-4 text-green-600 mr-2" />
                        <span className="text-green-600 font-medium">Open</span>
                      </>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {task.assignedTo || '-'}
                </td>
                <td className="px-6 py-4">
                  {task.status === 'TAKEN' && task.assignedEmail ? (
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                        <a href={`mailto:${task.assignedEmail}`} className="text-blue-600 hover:text-blue-800">
                          {task.assignedEmail}
                        </a>
                      </div>
                      {task.assignedPhone && (
                        <div className="flex items-center text-sm">
                          <Phone className="w-4 h-4 mr-2 text-gray-400" />
                          <a href={`tel:${task.assignedPhone}`} className="text-blue-600 hover:text-blue-800">
                            {task.assignedPhone}
                          </a>
                        </div>
                      )}
                    </div>
                  ) : (
                    '-'
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}
                </td>
                <td className="px-6 py-4">
                  {task.comments?.length ? (
                    <div className="text-sm text-gray-500">
                      {task.comments.length} comment(s)
                    </div>
                  ) : (
                    '-'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}