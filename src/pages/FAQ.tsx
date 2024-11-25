import { useState } from 'react';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  {
    category: 'Getting Started',
    question: 'What is SignupSpark?',
    answer: 'SignupSpark is a platform that helps organizers create and manage event campaigns, coordinate tasks, and track participant signups. It\'s perfect for community events, fundraisers, and any activity that requires coordinating multiple volunteers or participants.',
  },
  {
    category: 'Getting Started',
    question: 'How do I create a campaign?',
    answer: 'To create a campaign, sign in with your Google account and click the "Create Campaign" button. You\'ll be guided through a simple process to name your campaign, add tasks, and share it with participants.',
  },
  {
    category: 'Getting Started',
    question: 'Is SignupSpark free to use?',
    answer: 'Yes, SignupSpark is currently free to use for all users. Create campaigns, manage tasks, and coordinate participants at no cost.',
  },
  {
    category: 'Tasks & Signups',
    question: 'How do participants sign up for tasks?',
    answer: 'Participants can access your campaign through a unique link or campaign code. They can browse available tasks and sign up by providing their name and contact information. No account is required for participants.',
  },
  {
    category: 'Tasks & Signups',
    question: 'Can I edit tasks after creating them?',
    answer: 'Yes, as a campaign organizer, you can edit task details, add new tasks, or remove existing ones at any time. Changes will be reflected immediately for all participants.',
  },
  {
    category: 'Tasks & Signups',
    question: 'What happens when someone signs up for a task?',
    answer: 'When a participant signs up, both you and the participant receive email notifications. The task status changes to "Taken" and displays the participant\'s name. You can view all signups in your campaign dashboard.',
  },
  {
    category: 'Managing Contacts',
    question: 'How do I manage my contact list?',
    answer: 'Use the "My Contacts" page to add, edit, or remove contacts. You can manually add contacts, import them via CSV, or they\'ll be automatically added when they sign up for tasks.',
  },
  {
    category: 'Managing Contacts',
    question: 'Can I import contacts from a spreadsheet?',
    answer: 'Yes, you can import contacts using a CSV file. Go to the "My Contacts" page and click "Import CSV". Your file should include columns for name, email, and optionally phone numbers.',
  },
  {
    category: 'Campaign Management',
    question: 'How do I share my campaign?',
    answer: 'Each campaign has a unique link and code that you can share. You can also assign contacts directly from your contact list, and they\'ll receive email invitations to participate.',
  },
  {
    category: 'Campaign Management',
    question: 'Can I see who has signed up for tasks?',
    answer: 'Yes, the campaign dashboard shows all tasks and their status. For taken tasks, you can see participant details including name, email, and any comments they\'ve added.',
  },
  {
    category: 'Campaign Management',
    question: 'How do I track campaign progress?',
    answer: 'The campaign dashboard provides real-time progress tracking, showing open and taken tasks. You can also generate reports and export them as CSV files.',
  },
  {
    category: 'Technical Support',
    question: 'What browsers are supported?',
    answer: 'SignupSpark works on all modern browsers including Chrome, Firefox, Safari, and Edge. For the best experience, we recommend keeping your browser updated to the latest version.',
  },
];

export default function FAQ() {
  const [searchTerm, setSearchTerm] = useState('');
  const [openItems, setOpenItems] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(faqs.map(faq => faq.category)));

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = searchTerm === '' || 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !selectedCategory || faq.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white pt-24">
      <div className="container max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about using SignupSpark. Can't find what you're looking for? 
            <a href="/contact" className="text-purple-600 hover:text-purple-700 ml-1">
              Contact our support team
            </a>.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search questions..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                !selectedCategory
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {filteredFaqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50"
              >
                <span className="font-medium text-gray-900">{faq.question}</span>
                {openItems.includes(index) ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>
              {openItems.includes(index) && (
                <div className="px-6 py-4 border-t border-gray-100">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}

          {filteredFaqs.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
              <p className="text-gray-500">
                No questions found matching your search. Try different keywords or
                {' '}
                <a href="/contact" className="text-purple-600 hover:text-purple-700">
                  contact support
                </a>.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}