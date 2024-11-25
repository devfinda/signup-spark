import { Book, MessageCircle, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Help() {
  const resources = [
    {
      icon: Book,
      title: 'Documentation',
      description: 'Learn how to use SignupSpark with our comprehensive guides.',
      link: '#',
    },
    {
      icon: MessageCircle,
      title: 'FAQ',
      description: 'Find answers to commonly asked questions.',
      link: '/faq',
    },
    {
      icon: Mail,
      title: 'Support',
      description: 'Need help? Contact our support team.',
      link: '/contact',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white pt-24">
      <div className="container max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Help Center</h1>
        
        <div className="grid md:grid-cols-3 gap-6">
          {resources.map((resource) => {
            const Icon = resource.icon;
            return (
              <Link
                key={resource.title}
                to={resource.link}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <Icon className="w-8 h-8 text-purple-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {resource.title}
                </h3>
                <p className="text-gray-600">{resource.description}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}