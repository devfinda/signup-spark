import { useState } from 'react';
import { Sparkles, Users, CheckCircle, Search, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { useAuthStore } from '../store/authStore';
import { useCampaignStore } from '../store/campaignStore';

const features = [
  {
    icon: Sparkles,
    title: 'Easy Campaign Creation',
    description: 'Create and manage event campaigns with a simple, intuitive interface.',
  },
  {
    icon: Users,
    title: 'Seamless Collaboration',
    description: 'Invite participants and track progress in real-time.',
  },
  {
    icon: CheckCircle,
    title: 'Task Management',
    description: 'Organize tasks, assign responsibilities, and monitor completion.',
  },
];

export default function Home() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const campaigns = useCampaignStore((state) => state.campaigns);
  const [campaignCode, setCampaignCode] = useState('');
  const [error, setError] = useState('');

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/campaigns/new');
    } else {
      // Show sign in prompt
      const confirmed = window.confirm('You need to sign in to create a campaign. Would you like to sign in now?');
      if (confirmed) {
        // This will trigger the Google Sign In
        const signInButton = document.querySelector('[data-signin-button]') as HTMLButtonElement;
        if (signInButton) {
          signInButton.click();
        }
      }
    }
  };

  const handleRetrieveCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const code = campaignCode.trim().toUpperCase();
    if (!code) return;

    // Find campaign by code
    const campaign = campaigns.find(c => c.code === code);
    if (campaign) {
      navigate(`/campaign/${campaign.id}`);
    } else {
      setError('Campaign not found. Please check the code and try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <main className="pt-24">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 text-center">
          <div className="flex justify-center items-center mb-8">
            <div className="relative">
              <Sparkles className="w-20 h-20 text-purple-600" />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-400 rounded-full animate-pulse" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-amber-500 bg-clip-text text-transparent">
            Organize Your Next Event with Ease!
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Create task lists, invite participants, and track progress—all in one place.
            The simplest way to coordinate your events and keep everyone in sync.
          </p>
          
          <div className="max-w-md mx-auto space-y-4">
            <form 
              onSubmit={handleRetrieveCampaign}
              className="flex gap-2"
            >
              <input
                type="text"
                value={campaignCode}
                onChange={(e) => {
                  const value = e.target.value.toUpperCase();
                  if (value.length <= 9) { // XXXX-XXXX format
                    setCampaignCode(value);
                  }
                }}
                placeholder="Enter campaign code (e.g., A234-SSD4)"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                pattern="[A-Z0-9]{4}-[A-Z0-9]{4}"
                maxLength={9}
              />
              <Button type="submit" disabled={!campaignCode.trim()}>
                <Search className="w-5 h-5 mr-2" />
                Retrieve
              </Button>
            </form>
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
            <div className="text-center">
              <span className="text-gray-500">or</span>
            </div>
            <Button
              size="lg"
              onClick={handleGetStarted}
              className="w-full bg-gradient-to-r from-purple-600 to-amber-500 hover:from-purple-700 hover:to-amber-600"
            >
              Create Your Campaign
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <Icon className="w-12 h-12 text-purple-600 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Demo Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                See It in Action
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Explore how SignupSpark works with our interactive demo. No sign-in required!
              </p>
            </div>
            <div className="flex justify-center">
              <Button
                size="lg"
                onClick={() => navigate('/demo')}
                className="bg-gradient-to-r from-purple-600 to-amber-500 hover:from-purple-700 hover:to-amber-600"
              >
                Try the Demo
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}