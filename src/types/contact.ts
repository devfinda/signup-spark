export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
  campaigns: string[]; // Array of campaign IDs
}