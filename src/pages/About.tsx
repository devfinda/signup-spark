import { Sparkles, Heart, Globe, Shield } from 'lucide-react';

export default function About() {
  const features = [
    {
      icon: Heart,
      title: 'Built with Love',
      description: 'SignupSpark was created to make event organization simple and enjoyable for everyone.',
    },
    {
      icon: Globe,
      title: 'Community Driven',
      description: 'Inspired by organizers and participants who make events successful through collaboration.',
    },
    {
      icon: Shield,
      title: 'Simple & Secure',
      description: 'Focus on what matters - organizing great events, while we handle the technical details.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white pt-24">
      <div className="container max-w-4xl">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <div className="flex justify-center items-center mb-8">
            <div className="relative">
              <Sparkles className="w-16 h-16 text-purple-600" />
              <div className="absolute -top-2 -right-2 w-5 h-5 bg-amber-400 rounded-full animate-pulse" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-amber-500 bg-clip-text text-transparent">
            About SignupSpark
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            We're revolutionizing how events are organized, making it easier than ever to coordinate tasks and bring people together.
          </p>
        </section>

        {/* Mission Section */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed">
            SignupSpark was born from a simple idea: event organization shouldn't be complicated. 
            Whether you're planning a community gathering, charity drive, or school event, 
            our platform makes it easy to coordinate tasks and keep everyone in sync.
          </p>
        </section>

        {/* Features Grid */}
        <section className="grid md:grid-cols-3 gap-8 mb-16">
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
        </section>

        {/* Team Section */}
        <section className="bg-gradient-to-r from-purple-600 to-amber-500 text-white rounded-2xl p-12 text-center mb-16">
          <h2 className="text-2xl font-bold mb-4">Join Our Community</h2>
          <p className="text-purple-50 mb-4 max-w-xl mx-auto">
            SignupSpark is used by thousands of organizers worldwide to create successful events 
            and bring communities together.
          </p>
          <p className="text-sm text-purple-100">
            Made with ♥️ by the SignupSpark team
          </p>
        </section>
      </div>
    </div>
  );
}