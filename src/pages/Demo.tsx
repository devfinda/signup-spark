import { useState } from 'react';
import { CalendarCheck, Users, MessageSquare } from 'lucide-react';
import Button from '../components/Button';

const DEMO_CAMPAIGNS = [
  {
    id: 'demo-1',
    name: 'Community Garden Project',
    description: 'Help us create a beautiful community garden for everyone to enjoy.',
    progress: 75,
    tasks: [
      {
        id: 't1',
        name: 'Plant Flowers',
        status: 'TAKEN',
        assignedTo: 'Sarah Johnson',
        dueDate: '2024-04-15',
        comments: ['Bringing my gardening tools!', 'Happy to help with this!'],
      },
      {
        id: 't2',
        name: 'Build Benches',
        status: 'TAKEN',
        assignedTo: 'Mike Chen',
        dueDate: '2024-04-20',
        comments: ['I have experience with woodworking'],
      },
      {
        id: 't3',
        name: 'Install Water System',
        status: 'OPEN',
        dueDate: '2024-04-25',
      },
    ],
  },
  {
    id: 'demo-2',
    name: 'School Fundraiser Bake Sale',
    description: 'Annual bake sale to raise funds for school supplies.',
    progress: 40,
    tasks: [
      {
        id: 't4',
        name: 'Bake Cookies (2 dozen)',
        status: 'TAKEN',
        assignedTo: 'Emily Parker',
        dueDate: '2024-04-10',
        comments: ['Making chocolate chip and oatmeal raisin'],
      },
      {
        id: 't5',
        name: 'Set Up Tables',
        status: 'OPEN',
        dueDate: '2024-04-12',
      },
      {
        id: 't6',
        name: 'Create Price Signs',
        status: 'OPEN',
        dueDate: '2024-04-11',
      },
    ],
  },
];

export default function Demo() {
  const [selectedCampaign, setSelectedCampaign] = useState(DEMO_CAMPAIGNS[0]);
  const [showComments, setShowComments] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white pt-24">
      <div className="container max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Demo Dashboard
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore how SignupSpark works with these sample campaigns. 
            See how tasks are organized, tracked, and completed.
          </p>
        </div>

        {/* Campaign List */}
        <div className="grid gap-6 mb-8">
          {DEMO_CAMPAIGNS.map((campaign) => (
            <div
              key={campaign.id}
              className={`bg-white rounded-xl shadow-sm border p-6 cursor-pointer transition-all ${
                selectedCampaign.id === campaign.id
                  ? 'border-purple-500 shadow-md'
                  : 'border-gray-200 hover:border-purple-200'
              }`}
              onClick={() => setSelectedCampaign(campaign)}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">
                    {campaign.name}
                  </h2>
                  <p className="text-gray-600">{campaign.description}</p>
                </div>
                <CalendarCheck className={`w-6 h-6 ${
                  selectedCampaign.id === campaign.id
                    ? 'text-purple-600'
                    : 'text-gray-400'
                }`} />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium text-gray-900">
                    {campaign.progress}%
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full transition-all"
                    style={{ width: `${campaign.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Campaign Tasks */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              Tasks & Comments
            </h3>
            <div className="flex items-center text-sm text-gray-500">
              <Users className="w-4 h-4 mr-2" />
              {selectedCampaign.tasks.filter(t => t.status === 'TAKEN').length} of {selectedCampaign.tasks.length} tasks taken
            </div>
          </div>

          <div className="space-y-4">
            {selectedCampaign.tasks.map((task) => (
              <div
                key={task.id}
                className="border rounded-lg p-4 hover:border-purple-200 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-gray-900">{task.name}</h4>
                    <p className="text-sm text-gray-500">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center">
                    {task.status === 'TAKEN' ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Taken by {task.assignedTo}
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Open
                      </span>
                    )}
                  </div>
                </div>

                {task.comments && (
                  <div className="mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowComments(showComments === task.id ? null : task.id)}
                      className="gap-2"
                    >
                      <MessageSquare className="w-4 h-4" />
                      {task.comments.length} Comments
                    </Button>

                    {showComments === task.id && (
                      <div className="mt-3 space-y-2">
                        {task.comments.map((comment, i) => (
                          <div
                            key={i}
                            className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600"
                          >
                            {comment}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}