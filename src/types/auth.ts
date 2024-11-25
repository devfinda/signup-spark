export interface UserProfile {
  email: string;
  name: string;
  picture: string;
  sub: string;
  fullName?: string;
  phone?: string;
  emailPreferences?: {
    taskSignups: boolean;
    comments: boolean;
    campaignUpdates: boolean;
  };
}