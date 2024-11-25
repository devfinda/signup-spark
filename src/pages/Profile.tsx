import { useState } from 'react';
import { User, Bell, Phone, Mail } from 'lucide-react';
import Button from '../components/Button';
import { useAuthStore } from '../store/authStore';

export default function Profile() {
  const { user, setUser } = useAuthStore();
  const [form, setForm] = useState({
    fullName: user?.fullName || user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    emailPreferences: user?.emailPreferences || {
      taskSignups: true,
      comments: true,
      campaignUpdates: true,
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({
      ...user!,
      fullName: form.fullName,
      phone: form.phone,
      emailPreferences: form.emailPreferences,
    });
    alert('Profile updated successfully!');
  };

  return (
    <div className="container max-w-2xl pt-24">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center gap-3 mb-8">
          <User className="w-8 h-8 text-purple-600" />
          <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture */}
          <div className="flex items-center gap-4">
            <img
              src={user?.picture}
              alt={user?.name}
              className="w-20 h-20 rounded-full"
            />
            <div>
              <h3 className="font-medium text-gray-900">Profile Picture</h3>
              <p className="text-sm text-gray-500">
                Update your picture via Google Account
              </p>
            </div>
          </div>

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900 flex items-center gap-2">
              <User className="w-4 h-4" />
              Basic Information
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={form.email}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
              <p className="mt-1 text-sm text-gray-500">
                Email is managed through your Google Account
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Optional"
              />
            </div>
          </div>

          {/* Email Preferences */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900 flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Email Preferences
            </h3>

            <div className="space-y-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.emailPreferences.taskSignups}
                  onChange={(e) => setForm({
                    ...form,
                    emailPreferences: {
                      ...form.emailPreferences,
                      taskSignups: e.target.checked,
                    },
                  })}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-gray-700">Task signup notifications</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.emailPreferences.comments}
                  onChange={(e) => setForm({
                    ...form,
                    emailPreferences: {
                      ...form.emailPreferences,
                      comments: e.target.checked,
                    },
                  })}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-gray-700">Comment notifications</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.emailPreferences.campaignUpdates}
                  onChange={(e) => setForm({
                    ...form,
                    emailPreferences: {
                      ...form.emailPreferences,
                      campaignUpdates: e.target.checked,
                    },
                  })}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-gray-700">Campaign updates</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}