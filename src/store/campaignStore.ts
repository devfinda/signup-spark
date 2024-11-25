import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Campaign {
  id: string;
  code: string;
  name: string;
  description: string;
  createdAt: string;
  createdBy: string;
}

function generateCampaignCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    if (i === 4) code += '-';
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

interface CampaignState {
  currentCampaign: Campaign | null;
  campaigns: Campaign[];
  setCurrentCampaign: (campaign: Campaign) => void;
  addCampaign: (campaign: Omit<Campaign, 'code'>) => void;
  updateCampaign: (id: string, updates: Partial<Campaign>) => void;
  removeCampaign: (id: string) => void;
  getCampaignByCode: (code: string) => Campaign | undefined;
  clearCampaigns: () => void;
}

export const useCampaignStore = create<CampaignState>()(
  persist(
    (set, get) => ({
      currentCampaign: null,
      campaigns: [],
      setCurrentCampaign: (campaign) => set({ currentCampaign: campaign }),
      addCampaign: (campaign) => {
        const newCampaign = {
          ...campaign,
          code: generateCampaignCode(),
        };
        set((state) => ({
          campaigns: [...state.campaigns, newCampaign],
          currentCampaign: newCampaign,
        }));
      },
      updateCampaign: (id, updates) =>
        set((state) => ({
          campaigns: state.campaigns.map((campaign) =>
            campaign.id === id ? { ...campaign, ...updates } : campaign
          ),
        })),
      removeCampaign: (id) =>
        set((state) => ({
          campaigns: state.campaigns.filter((campaign) => campaign.id !== id),
          currentCampaign: state.currentCampaign?.id === id ? null : state.currentCampaign,
        })),
      getCampaignByCode: (code) =>
        get().campaigns.find((c) => c.code === code),
      clearCampaigns: () => set({ campaigns: [], currentCampaign: null }),
    }),
    {
      name: 'campaign-storage',
    }
  )
);