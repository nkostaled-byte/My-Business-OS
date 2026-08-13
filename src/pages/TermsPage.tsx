import React from 'react';
import { motion } from 'motion/react';
import { FileText, Shield } from 'lucide-react';

export const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Hero */}
      <section className="relative overflow-hidden pt-24 pb-16 lg:pt-32 lg:pb-20 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">Terms of Service</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Last Updated: August 13, 2026</p>
          <div className="flex flex-wrap justify-center gap-3 pt-4">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">POPIA Compliant</span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-200 dark:border-blue-800">GDPR Compliant</span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400 border border-purple-200 dark:border-purple-800">International</span>
          </div>
        </div>
      </section>

      {/* Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Table of Contents */}
        <div className="hidden lg:block lg:col-span-1 space-y-3 sticky top-24 self-start">
          <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-4">Table of Contents</h4>
          <ul className="space-y-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
            <li><a href="#acceptance" className="hover:text-indigo-600">1. Acceptance of Terms</a></li>
            <li><a href="#accounts" className="hover:text-indigo-600">2. Accounts & Security</a></li>
            <li><a href="#subscriptions" className="hover:text-indigo-600">3. Subscriptions & Billing</a></li>
            <li><a href="#cancellations" className="hover:text-indigo-600">4. Cancellations & Refunds</a></li>
            <li><a href="#acceptable" className="hover:text-indigo-600">5. Acceptable Use</a></li>
            <li><a href="#ip" className="hover:text-indigo-600">6. Intellectual Property</a></li>
            <li><a href="#data" className="hover:text-indigo-600">7. Data Protection & Privacy</a></li>
            <li><a href="#breach" className="hover:text-indigo-600">8. Data Breach Notification</a></li>
            <li><a href="#liability" className="hover:text-indigo-600">9. Limitation of Liability</a></li>
            <li><a href="#indemnity" className="hover:text-indigo-600">10. Indemnification</a></li>
            <li><a href="#termination" className="hover:text-indigo-600">11. Termination</a></li>
            <li><a href="#force-majeure" className="hover:text-indigo-600">12. Force Majeure</a></li>
            <li><a href="#disputes" className="hover:text-indigo-600">13. Dispute Resolution</a></li>
            <li><a href="#governing" className="hover:text-indigo-600">14. Governing Law</a></li>
            <li><a href="#general" className="hover:text-indigo-600">15. General Provisions</a></li>
          </ul>
        </div>

        {/* Main Body */}
        <div className="lg:col-span-3 space-y-12 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          <div className="p-6 rounded-3xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 text-xs text-indigo-900 dark:text-indigo-200 space-y-2">
            <p className="font-bold">Important Notice</p>
            <p>These Terms of Service govern your use of My Grafix OS. By accessing or using our platform, you agree to be bound by these terms. Please read them carefully. These terms comply with the Protection of Personal Information Act (POPIA) of South Africa, the General Data Protection Regulation (GDPR) of the European Union, and other applicable international laws.</p>
          </div>

          <section id="acceptance" className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">1. Acceptance of Terms</h2>
            <p>By accessing or using My Grafix OS, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to all terms, you may not access our platform or publish websites through our service.</p>
            <p>These terms constitute a legally binding agreement between you ("User", "Customer", or "you") and My Grafix Media ("Company", "we", "us", or "our"). If you are entering into these terms on behalf of a business entity, you represent that you have authority to bind that entity.</p>
          </section>

          <section id="accounts" className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">2. Accounts & Security</h2>
            <p>You must provide accurate, current, and complete information when creating your business account. You are responsible for:</p>
            <ul className="list-disc pl-5 space-y-2 text-xs">
              <li>Maintaining the confidentiality of your login credentials</li>
              <li>All activities conducted under your account</li>
              <li>Notifying us immediately of any unauthorized access</li>
              <li>Ensuring your account information remains accurate and up-to-date</li>
            </ul>
            <p>We reserve the right to suspend accounts that pose a security risk or violate these terms.</p>
          </section>

          <section id="subscriptions" className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">3. Subscriptions & Billing</h2>
            <p>Paid plans are billed in advance on a monthly or annual basis. By subscribing, you agree to:</p>
            <ul className="list-disc pl-5 space-y-2 text-xs">
              <li><strong>Automatic Renewal:</strong> Subscriptions automatically renew unless canceled prior to the billing renewal date.</li>
              <li><strong>Payment Method:</strong> You authorize us to charge your payment method for all fees incurred.</li>
              <li><strong>Price Changes:</strong> We may adjust pricing with 30 days' notice. Continued use constitutes acceptance of new pricing.</li>
              <li><strong>Taxes:</strong> All fees are exclusive of applicable taxes, which you are responsible for paying.</li>
            </ul>
            <p>Payment processing is handled by Paystack, a PCI DSS compliant payment provider. We do not store your payment card details.</p>
          </section>

          <section id="cancellations" className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">4. Cancellations & Refund Policy</h2>
            <p>You may cancel your subscription at any time from your account billing settings. Our refund policy:</p>
            <ul className="list-disc pl-5 space-y-2 text-xs">
              <li><strong>Within 14 Days:</strong> Full refund available within 14 days of initial purchase (Consumer Protection Act compliance).</li>
              <li><strong>After 14 Days:</strong> Refunds are evaluated on a case-by-case basis.</li>
              <li><strong>Prorated Refunds:</strong> Annual subscriptions may be eligible for prorated refunds.</li>
              <li><strong>No Refund:</strong> No refund for partial months of service.</li>
            </ul>
            <p>To request a refund, contact support@mygrafixmedia.co.za with your account details and reason for cancellation.</p>
          </section>

          <section id="acceptable" className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">5. Acceptable Use</h2>
            <p>You agree not to use My Grafix OS to:</p>
            <ul className="list-disc pl-5 space-y-2 text-xs">
              <li>Transmit malicious code, viruses, or any harmful components</li>
              <li>Engage in spam, phishing, or fraudulent activities</li>
              <li>Infringe upon the intellectual property rights of others</li>
              <li>Violate any applicable local, national, or international law</li>
              <li>Process personal information without proper consent or legal basis</li>
              <li>Attempt to gain unauthorized access to our systems or other users' data</li>
              <li>Use the platform for illegal gambling, adult content, or prohibited substances</li>
            </ul>
            <p>Violation of these terms may result in immediate account termination and legal action.</p>
          </section>

          <section id="ip" className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">6. Intellectual Property</h2>
            <p><strong>Our Property:</strong> All software, design templates, platform branding, and underlying technology remain the intellectual property of My Grafix Media. You receive a limited, non-exclusive, non-transferable license to use our platform for your business operations.</p>
            <p><strong>Your Content:</strong> Your custom business content, website text, product images, and customer data remain entirely yours. We claim no ownership over your content.</p>
            <p><strong>License to Us:</strong> By uploading content, you grant us a limited license to host, display, and process your content solely for the purpose of providing our services.</p>
          </section>

          <section id="data" className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">7. Data Protection & Privacy</h2>
            <p>We are committed to protecting your personal information in accordance with POPIA, GDPR, and other applicable data protection laws. Key obligations:</p>
            
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 mt-4">7.1 Our Responsibilities</h3>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li>Process personal information lawfully, reasonably, and transparently</li>
              <li>Implement appropriate technical and organizational security measures</li>
              <li>Notify you of data breaches within required timeframes</li>
              <li>Respond to data subject requests within 30 days (POPIA) or one month (GDPR)</li>
              <li>Maintain records of processing activities</li>
              <li>Ensure cross-border transfers comply with applicable laws</li>
            </ul>

            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 mt-4">7.2 Your Responsibilities</h3>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li>Obtain proper consent from your customers before collecting their data</li>
              <li>Provide accurate privacy notices to your end users</li>
              <li>Comply with all applicable data protection laws in your jurisdiction</li>
              <li>Notify us if you become aware of any data breach involving your account</li>
            </ul>

            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 mt-4">7.3 Data Processing Agreement</h3>
            <p>For EU users, we act as a data processor under GDPR Article 28. A Data Processing Agreement (DPA) is available upon request and forms part of these terms.</p>
          </section>

          <section id="breach" className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">8. Data Breach Notification</h2>
            <p>In the event of a data breach affecting your personal information, we will:</p>
            <ul className="list-disc pl-5 space-y-2 text-xs">
              <li>Investigate the breach and take immediate remedial action</li>
              <li>Notify the Information Regulator (South Africa) as required by POPIA</li>
              <li>Notify the relevant supervisory authority (GDPR) within 72 hours where required</li>
              <li>Notify affected users without undue delay if the breach poses a high risk</li>
              <li>Provide details of the breach, potential consequences, and measures taken</li>
              <li>Cooperate with authorities and provide all necessary information</li>
            </ul>
          </section>

          <section id="liability" className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">9. Limitation of Liability</h2>
            <p><strong>Service Availability:</strong> We strive for 99.9% uptime but do not guarantee uninterrupted service. We shall not be liable for service interruptions beyond our reasonable control.</p>
            <p><strong>Indirect Damages:</strong> My Grafix Media shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, business opportunities, or goodwill.</p>
            <p><strong>Direct Damages:</strong> Our total liability for direct damages shall not exceed the amount you paid us in the 12 months preceding the claim.</p>
            <p><strong>Exclusions:</strong> These limitations do not apply to damages arising from gross negligence, willful misconduct, or breach of data protection obligations.</p>
          </section>

          <section id="indemnity" className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">10. Indemnification</h2>
            <p>You agree to indemnify, defend, and hold harmless My Grafix Media, its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from:</p>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li>Your use of the platform</li>
              <li>Your violation of these terms</li>
              <li>Your violation of any third-party rights</li>
              <li>Your processing of personal information in violation of data protection laws</li>
              <li>Any claims by your customers or end users related to your use of our services</li>
            </ul>
          </section>

          <section id="termination" className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">11. Termination</h2>
            <p><strong>By You:</strong> You may terminate your account at any time by deleting it through the platform settings or contacting support.</p>
            <p><strong>By Us:</strong> We reserve the right to suspend or terminate accounts that violate these terms, pose a security risk, or remain inactive for 12+ months. We will provide reasonable notice where possible.</p>
            <p><strong>Effect of Termination:</strong> Upon termination, your right to use the platform ceases immediately. We will retain your data for 30 days to allow for export, after which it will be permanently deleted (subject to legal retention requirements).</p>
          </section>

          <section id="force-majeure" className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">12. Force Majeure</h2>
            <p>Neither party shall be liable for failure to perform obligations due to circumstances beyond reasonable control, including but not limited to: natural disasters, war, terrorism, pandemic, government actions, internet outages, or third-party service failures. The affected party must notify the other promptly and use reasonable efforts to resume performance.</p>
          </section>

          <section id="disputes" className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">13. Dispute Resolution</h2>
            <p><strong>Informal Resolution:</strong> We encourage you to contact us first to resolve any disputes informally.</p>
            <p><strong>Mediation:</strong> If informal resolution fails, parties agree to attempt mediation through the Arbitration Foundation of Southern Africa (AFSA) before pursuing litigation.</p>
            <p><strong>Arbitration:</strong> For disputes exceeding R50,000, parties may opt for binding arbitration under AFSA rules. Arbitration shall take place in Johannesburg, South Africa.</p>
            <p><strong>Small Claims:</strong> For disputes under R20,000, either party may approach the Small Claims Court.</p>
            <p><strong>EU Users:</strong> EU consumers may have the right to alternative dispute resolution through their national consumer protection authorities.</p>
          </section>

          <section id="governing" className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">14. Governing Law & Jurisdiction</h2>
            <p>These terms are governed by the laws of the Republic of South Africa. Any legal proceedings shall be subject to the jurisdiction of the High Court of South Africa, Gauteng Division, Johannesburg.</p>
            <p>For EU consumers, the mandatory consumer protection laws of your country of residence remain unaffected. You may bring proceedings in your local courts.</p>
          </section>

          <section id="general" className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">15. General Provisions</h2>
            <ul className="list-disc pl-5 space-y-2 text-xs">
              <li><strong>Entire Agreement:</strong> These terms, together with our Privacy Policy, constitute the entire agreement between you and us.</li>
              <li><strong>Amendments:</strong> We may update these terms periodically. Material changes will be communicated via email or platform notification 30 days in advance.</li>
              <li><strong>Severability:</strong> If any provision is found unenforceable, the remaining provisions remain in full effect.</li>
              <li><strong>Waiver:</strong> Our failure to enforce any right does not constitute a waiver of that right.</li>
              <li><strong>Assignment:</strong> You may not assign these terms without our written consent. We may assign these terms to an affiliate or successor.</li>
              <li><strong>Notices:</strong> We will send notices to your registered email address. You must keep your contact information current.</li>
              <li><strong>Language:</strong> These terms are drafted in English. Translations are provided for convenience; the English version prevails.</li>
            </ul>
          </section>

          <div className="pt-8 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500">
            <p className="font-bold mb-2">Contact Us</p>
            <p>For questions regarding these Terms of Service, please contact:</p>
            <p className="mt-2"><strong>My Grafix Media</strong></p>
            <p>Email: legal@mygrafixmedia.co.za</p>
            <p>Support: support@mygrafixmedia.co.za</p>
            <p className="mt-4">These Terms of Service are effective as of August 13, 2026.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
