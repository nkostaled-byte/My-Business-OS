import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useToast } from '../context/ToastContext';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  HelpCircle, 
  Building, 
  Users, 
  Handshake, 
  MessageSquare,
  Globe,
  Share2
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { addToast } = useToast();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    email: '',
    phone: '',
    subject: 'General Enquiry',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    addToast('Message sent successfully! Our team will get back to you within 2 hours.', 'success');
  };

  const contactCards = [
    {
      icon: Users,
      title: 'Sales & Growth',
      desc: 'Talk with our advisors about custom software, pricing, and scaling your business.',
      contact: 'sales@mygrafixmedia.co.za'
    },
    {
      icon: HelpCircle,
      title: 'Customer Support',
      desc: 'Need technical assistance with your website, orders, or POS? Reach out to our support team.',
      contact: 'support@mygrafixmedia.co.za'
    },
    {
      icon: Handshake,
      title: 'Partnerships',
      desc: 'Explore agency partnerships, integration collaborations, and affiliate opportunities.',
      contact: 'partners@mygrafixmedia.co.za'
    },
    {
      icon: MessageSquare,
      title: 'General Enquiries',
      desc: 'For media, press, and general questions regarding our platform.',
      contact: 'info@mygrafixmedia.co.za'
    }
  ];

  const faqs = [
    {
      q: 'How long does a website take to launch?',
      a: 'Your website is generated instantly when you sign up! You can customize your content, branding, and services in minutes, and publish immediately to your custom domain.'
    },
    {
      q: 'Can I migrate my current website?',
      a: 'Yes. Our team can assist with migrating your existing domain, customer records, and product inventory over to My Grafix OS seamlessly.'
    },
    {
      q: 'Do you offer secure hosting?',
      a: 'All websites hosted on My Grafix OS include enterprise-grade SSL certificates, automatic daily backups, and global edge delivery.'
    },
    {
      q: 'Do you build custom software features?',
      a: 'Our enterprise tier supports bespoke software additions, advanced API integrations, and dedicated account managers.'
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-20 lg:pt-32 lg:pb-28 border-b border-slate-200 dark:border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-purple-500/5 to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-100 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800/80 text-xs font-bold"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Get in Touch</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto"
          >
            Contact <span className="text-violet-600 dark:text-violet-400">My Grafix Media</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed"
          >
            We are here to help your business grow. Reach out to our team with any questions, partnership ideas, or support requests.
          </motion.p>
        </div>
      </section>

      {/* Department Cards */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactCards.map((c, idx) => {
              const Icon = c.icon;
              return (
                <div key={idx} className="glass-panel rounded-3xl p-6 space-y-3 hover:border-indigo-400/50 transition-colors flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-2xl bg-violet-100 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{c.title}</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{c.desc}</p>
                  </div>
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-xs font-mono font-bold text-violet-600 dark:text-violet-400">{c.contact}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Contact Form & Info */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Form */}
          <div className="lg:col-span-2 glass-panel rounded-3xl p-8 sm:p-10 space-y-6">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Send us a message</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Fill out the form below and our team will respond promptly.</p>
            </div>

            {!formSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl glass-subtle text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-violet-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Business Name</label>
                    <input
                      type="text"
                      placeholder="My Business"
                      value={formData.businessName}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl glass-subtle text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-violet-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="john@business.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl glass-subtle text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-violet-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                    <input
                      type="text"
                      placeholder="+27 82 555 0192"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl glass-subtle text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-violet-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Subject</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl glass-subtle text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-violet-500"
                  >
                    <option>General Enquiry</option>
                    <option>Sales & Pricing</option>
                    <option>Technical Support</option>
                    <option>Partnership</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Message</label>
                  <textarea
                    rows={5}
                    required
                    placeholder="Tell us how we can help you..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl glass-subtle text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-violet-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs shadow-lg shadow-violet-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" /> Send Message
                </button>
              </form>
            ) : (
              <div className="py-16 text-center space-y-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold">Message Received!</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">Thank you for getting in touch. A member of our team has received your enquiry and will reply shortly.</p>
                <button
                  onClick={() => setFormSubmitted(false)}
                  className="px-6 py-2.5 rounded-xl bg-violet-600 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            )}
          </div>

          {/* Office Details & Hours */}
          <div className="space-y-6">
            <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Headquarters</h3>
              
              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-violet-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-900 dark:text-slate-100">Cape Town Office</p>
                    <p className="text-slate-500 mt-0.5">124 Long Street, Cape Town City Centre, 8001, South Africa</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-violet-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-900 dark:text-slate-100">Business Hours</p>
                    <p className="text-slate-500 mt-0.5">Monday - Friday: 08:00 - 18:00 SAST<br />Saturday: 09:00 - 14:00 SAST</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-violet-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-900 dark:text-slate-100">Direct Line</p>
                    <p className="text-slate-500 mt-0.5">+27 82 555 0192</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Placeholder Card */}
            <div className="bg-slate-100 dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 text-center space-y-3">
              <div className="w-full h-40 rounded-2xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-400 font-semibold text-xs relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-violet-500/10 to-indigo-500/10" />
                <span className="relative z-10 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-violet-600" /> Cape Town, South Africa Map Grid
                </span>
              </div>
              <p className="text-xs text-slate-500">Global edge infrastructure deployed across South Africa & Europe.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Frequently Asked Questions</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">Quick answers to common questions about our services.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="glass-panel rounded-2xl p-6 space-y-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{faq.q}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
