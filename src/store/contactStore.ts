import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Contact } from '../types/contact';

interface ContactState {
  contacts: Contact[];
  addContact: (contact: Contact) => void;
  removeContact: (id: string) => void;
  updateContact: (id: string, updates: Partial<Contact>) => void;
  addContactToCampaign: (contactId: string, campaignId: string) => void;
  removeContactFromCampaign: (contactId: string, campaignId: string) => void;
  getContactsByCampaign: (campaignId: string) => Contact[];
  clearContacts: () => void;
}

export const useContactStore = create<ContactState>()(
  persist(
    (set, get) => ({
      contacts: [],
      addContact: (contact) =>
        set((state) => ({
          contacts: [...state.contacts, contact],
        })),
      removeContact: (id) =>
        set((state) => ({
          contacts: state.contacts.filter((contact) => contact.id !== id),
        })),
      updateContact: (id, updates) =>
        set((state) => ({
          contacts: state.contacts.map((contact) =>
            contact.id === id ? { ...contact, ...updates } : contact
          ),
        })),
      addContactToCampaign: (contactId, campaignId) =>
        set((state) => ({
          contacts: state.contacts.map((contact) =>
            contact.id === contactId
              ? {
                  ...contact,
                  campaigns: [...new Set([...contact.campaigns, campaignId])],
                }
              : contact
          ),
        })),
      removeContactFromCampaign: (contactId, campaignId) =>
        set((state) => ({
          contacts: state.contacts.map((contact) =>
            contact.id === contactId
              ? {
                  ...contact,
                  campaigns: contact.campaigns.filter((id) => id !== campaignId),
                }
              : contact
          ),
        })),
      getContactsByCampaign: (campaignId) =>
        get().contacts.filter((contact) => contact.campaigns.includes(campaignId)),
      clearContacts: () => set({ contacts: [] }),
    }),
    {
      name: 'contact-storage',
    }
  )
);