import { useState } from 'react';
import { Mail, MessageSquare, Loader2 } from 'lucide-react';
import Button from '../components/Button';

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');
    
    try {
      const response = await fetch('/.netlify/functions/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emails: [
            {
              to: 'support@signupspark.com',
              subject: `Contact Form: ${form.name}`,
              body: `Name: ${form.name}\nEmail: ${form.email}\nMessage: ${form.message}`,
            },
            {
              to: form.email,
              subject: 'Thank you for contacting SignupSpark',
              body: `Dear ${form.name},\n\nThank you for reaching out to SignupSpark! We've received your message and will get back to you within 24 hours.\n\nYour message:\n${form.message}\n\nBest regards,\nThe SignupSpark Team`,
            },
          ],
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Failed to send message');
      }

      setStatus('success');
      setForm({ name: '', email: '', message: '' });
      
      setTimeout(() => {
        setStatus('idle');
      }, 5000);
    } catch (error) {
      console.error('Error sending message:', error);
      setStatus('error');
      setErrorMessage(
        error instanceof Error 
          ? error.message 
          : 'Failed to send message. Please try again later.'
      );
      
      setTimeout(() => {
        setStatus('idle');
        setErrorMessage('');
      }, 5000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white pt-24">
      <div className="container max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-gray-600">
            Have questions or feedback? We'd love to hear from you.
          </p>
        </div>

        {/* Status Messages */}
        {status === 'success' && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
            Your message has been sent successfully! We'll get back to you soon.
          </div>
        )}
        {status === 'error' && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {errorMessage}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <MessageSquare className="w-6 h-6 text-purple-600" />
              <h2 className="text-xl font-semibold">Send us a message</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
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
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send Message'
                )}
              </Button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Mail className="w-6 h-6 text-purple-600" />
              <h2 className="text-xl font-semibold">Get in touch</h2>
            </div>

            <div className="space-y-6">
              <p className="text-gray-600">
                Our team is here to help you with any questions about SignupSpark.
                We typically respond within 24 hours.
              </p>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">Email</h3>
                <a
                  href="mailto:support@signupspark.com"
                  className="text-purple-600 hover:text-purple-700"
                >
                  support@signupspark.com
                </a>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">Office Hours</h3>
                <p className="text-gray-600">
                  Monday - Friday<br />
                  9:00 AM - 5:00 PM EST
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}