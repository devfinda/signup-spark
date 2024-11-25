import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Copy, Trash2, BarChart2, Share2, Pencil, CheckCircle } from 'lucide-react';
import Button from './Button';
import { useCampaignStore } from '../store/campaignStore';
import { useTaskStore } from '../store/taskStore';
import { useContactStore } from '../store/contactStore';
import ShareCampaignDialog from './ShareCampaignDialog';

export default function Sidebar() {
  const navigate = useNavigate();
  const campaigns = useCampaignStore((state) => state.campaigns);
  const { getTasksByCampaign } = useTaskStore();
  const { setCurrentCampaign, removeCampaign } = useCampaignStore();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [shareDialogCampaign, setShareDialogCampaign] = useState<string | null>(null);

  const handleCopyCode = async (e: React.MouseEvent, code: string) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(code);
    setCopiedId(code);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleEditCampaign = (e: React.MouseEvent, campaign: Campaign) => {
    e.stopPropagation();
    setCurrentCampaign(campaign);
    navigate('/campaigns/edit');
  };

  const handleDeleteCampaign = (e: React.MouseEvent, campaignId: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this campaign?')) {
      removeCampaign(campaignId);
    }
  };

  const handleViewReport = (e: React.MouseEvent, campaignId: string) => {
    e.stopPropagation();
    setCurrentCampaign(campaigns.find(c => c.id === campaignId)!);
    navigate('/dashboard');
  };

  const handleShare = (e: React.MouseEvent, campaignId: string) => {
    e.stopPropagation();
    setShareDialogCampaign(campaignId);
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-16 p-4 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">My Campaigns</h2>
        <Button
          size="sm"
          variant="outline"
          onClick={() => navigate('/campaigns/new')}
        >
          <PlusCircle className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-3">
        {campaigns.map((campaign) => {
          const tasks = getTasksByCampaign(campaign.id);
          const takenTasks = tasks.filter((task) => task.status === 'TAKEN').length;
          const progress = tasks.length > 0 ? Math.round((takenTasks / tasks.length) * 100) : 0;

          return (
            <div
              key={campaign.id}
              className="bg-white rounded-lg border border-gray-200 hover:border-purple-200 transition-all"
            >
              <div className="p-3">
                <div className="mb-2">
                  <div className="font-medium text-gray-900 truncate">
                    {campaign.name}
                  </div>
                  <button
                    onClick={(e) => handleCopyCode(e, campaign.code)}
                    className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
                  >
                    {copiedId === campaign.code ? (
                      <>
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        <span className="text-green-500">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>{campaign.code}</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Progress</span>
                    <span className="font-medium text-gray-900">
                      {progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div
                      className="bg-purple-600 h-1.5 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => handleEditCampaign(e, campaign)}
                    title="Edit Campaign"
                    className="flex-1"
                  >
                    <Pencil className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => handleViewReport(e, campaign.id)}
                    title="View Report"
                    className="flex-1"
                  >
                    <BarChart2 className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => handleShare(e, campaign.id)}
                    title="Share Campaign"
                    className="flex-1"
                  >
                    <Share2 className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => handleDeleteCampaign(e, campaign.id)}
                    title="Delete Campaign"
                    className="flex-1"
                  >
                    <Trash2 className="w-3 h-3 text-red-500" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}

        {campaigns.length === 0 && (
          <div className="text-center text-gray-500 text-sm py-4">
            No campaigns yet
          </div>
        )}
      </div>

      {shareDialogCampaign && (
        <ShareCampaignDialog
          campaignId={shareDialogCampaign}
          onClose={() => setShareDialogCampaign(null)}
        />
      )}
    </div>
  );
}