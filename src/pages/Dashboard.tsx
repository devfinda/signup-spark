import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Clock, MessageSquare, User } from 'lucide-react';
import CampaignReport from '../components/CampaignReport';
import { useCampaignStore } from '../store/campaignStore';
import { useTaskStore } from '../store/taskStore';

interface ActivityItem {
  id: string;
  campaignId: string;
  campaignName: string;
  taskName: string;
  type: 'signup' | 'comment';
  userName: string;
  userEmail?: string;
  content?: string;
  timestamp: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const campaigns = useCampaignStore((state) => state.campaigns);
  const getTasksByCampaign = useTaskStore((state) => state.getTasksByCampaign);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);

  // Get recent activities across all campaigns
  const recentActivities: ActivityItem[] = campaigns.flatMap(campaign => {
    const tasks = getTasksByCampaign(campaign.id);
    return tasks.flatMap(task => {
      const activities: ActivityItem[] = [];

      // Add task signups
      if (task.status === 'TAKEN' && task.assignedTo) {
        activities.push({
          id: `signup-${task.id}`,
          campaignId: campaign.id,
          campaignName: campaign.name,
          taskName: task.name,
          type: 'signup',
          userName: task.assignedTo,
          userEmail: task.assignedEmail,
          timestamp: new Date().toISOString(), // In real app, store actual signup time
        });
      }

      // Add comments
      task.comments?.forEach(comment => {
        activities.push({
          id: comment.id,
          campaignId: campaign.id,
          campaignName: campaign.name,
          taskName: task.name,
          type: 'comment',
          userName: comment.userName,
          content: comment.text,
          timestamp: comment.createdAt,
        });
      });

      return activities;
    });
  }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="container py-8">
      <div className="flex items-center gap-3 mb-8">
        <Home className="w-6 h-6 text-gray-600" />
        <h1 className="text-2xl font-bold text-gray-900">Activity Feed</h1>
      </div>

      {selectedCampaignId ? (
        <CampaignReport 
          campaignId={selectedCampaignId} 
          onClose={() => setSelectedCampaignId(null)}
        />
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Campaign</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Task</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Activity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentActivities.map((activity) => (
                <tr key={activity.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-900">
                      {activity.campaignName}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {activity.taskName}
                  </td>
                  <td className="px-6 py-4">
                    {activity.type === 'signup' ? (
                      <div className="flex items-center text-green-600">
                        <User className="w-4 h-4 mr-2" />
                        <span>Signed up for task</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-blue-600">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        <span>{activity.content}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">
                      {activity.userName}
                    </div>
                    {activity.userEmail && (
                      <div className="text-sm text-gray-500">
                        {activity.userEmail}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      {new Date(activity.timestamp).toLocaleString()}
                    </div>
                  </td>
                </tr>
              ))}
              {recentActivities.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    <div className="space-y-3">
                      <Home className="w-8 h-8 text-gray-400 mx-auto" />
                      <p>No recent activity. Create a campaign to get started!</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}