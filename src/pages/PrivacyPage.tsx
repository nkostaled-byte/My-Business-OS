import React from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, FileText, CheckCircle2 } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Hero */}
      <section className="relative overflow-hidden pt-24 pb-16 lg:pt-32 lg:pb-20 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">Privacy Policy</h1>
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
        {/* Table of Contents (Desktop Sidebar) */}
        <div className="hidden lg:block lg:col-span-1 space-y-3 sticky top-24 self-start">
          <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-4">Table of Contents</h4>
          <ul className="space-y-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
            <li><a href="#overview" className="hover:text-indigo-600">1. Overview</a></li>
            <li><a href="#officer" className="hover:text-indigo-600">2. Information Officer</a></li>
            <li><a href="#collection" className="hover:text-indigo-600">3. Information We Collect</a></li>
            <li><a href="#usage" className="hover:text-indigo-600">4. How We Use Your Data</a></li>
            <li><a href="#legal-basis" className="hover:text-indigo-600">5. Legal Basis for Processing</a></li>
            <li><a href="#consent" className="hover:text-indigo-600">6. Consent</a></li>
            <li><a href="#cookies" className="hover:text-indigo-600">7. Cookies & Tracking</a></li>
            <li><a href="#thirdparty" className="hover:text-indigo-600">8. Third-Party Services</a></li>
            <li><a href="#cross-border" className="hover:text-indigo-600">9. Cross-Border Transfers</a></li>
            <li><a href="#retention" className="hover:text-indigo-600">10. Data Retention</a></li>
            <li><a href="#security" className="hover:text-indigo-600">11. Security Measures</a></li>
            <li><a href="#rights" className="hover:text-indigo-600">12. Your Rights</a></li>
            <li><a href="#children" className="hover:text-indigo-600">13. Children's Privacy</a></li>
            <li><a href="#breach" className="hover:text-indigo-600">14. Data Breach Procedures</a></li>
            <li><a href="#complaints" className="hover:text-indigo-600">15. Complaints</a></li>
            <li><a href="#contact" className="hover:text-indigo-600">16. Contact Information</a></li>
          </ul>
        </div>

        {/* Main Legal Body */}
        <div className="lg:col-span-3 space-y-12 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          <div className="p-6 rounded-3xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 text-xs text-indigo-900 dark:text-indigo-200 space-y-2">
            <p className="font-bold">Overview</p>
            <p>At My Grafix Media ("we", "our", or "us"), we respect your privacy and are committed to protecting your personal information in accordance with the Protection of Personal Information Act 4 of 2013 (POPIA) of South Africa, the General Data Protection Regulation (GDPR) of the European Union, and other applicable international data protection laws. This Privacy Policy outlines how we collect, use, store, and safeguard your data when you use My Grafix OS and our web services.</p>
          </div>

          <section id="overview" className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">1. Overview</h2>
            <p>This Privacy Policy applies to all users of My Grafix OS, including business owners, staff members, and end customers whose data is processed through our platform. We are committed to processing personal information lawfully, reasonably, and in a manner that does not infringe on your privacy.</p>
            <p>We process personal information in accordance with the 8 Conditions for Lawful Processing under POPIA and the principles of data minimization, purpose limitation, and accountability under GDPR.</p>
          </section>

          <section id="officer" className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">2. Information Officer</h2>
            <p>In accordance with POPIA, we have appointed an Information Officer responsible for ensuring compliance with data protection legislation:</p>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
              <p><strong>Information Officer:</strong> Data Protection Team</p>
              <p><strong>Email:</strong> privacy@mygrafixmedia.co.za</p>
              <p><strong>Deputy Information Officer:</strong> Available upon request</p>
            </div>
            <p>The Information Officer is responsible for handling data subject requests, ensuring compliance, and liaising with the Information Regulator.</p>
          </section>

          <section id="collection" className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">3. Information We Collect</h2>
            <p>We collect the following categories of personal information:</p>
            
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 mt-4">3.1 Account Information</h3>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li>Full name and surname</li>
              <li>Business name and registration number</li>
              <li>Email address and phone number</li>
              <li>Physical business address</li>
              <li>Login credentials (securely hashed)</li>
            </ul>

            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 mt-4">3.2 Business Content</h3>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li>Product catalogs and service listings</li>
              <li>Booking schedules and appointment data</li>
              <li>Gallery images and media files</li>
              <li>Customer records and transaction history</li>
              <li>Invoice records and payment summaries</li>
            </ul>

            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 mt-4">3.3 Technical Data</h3>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li>IP address and browser type</li>
              <li>Device information and operating system</li>
              <li>Session cookies and authentication tokens</li>
              <li>Usage analytics and interaction data</li>
            </ul>

            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 mt-4">3.4 End Customer Data</h3>
            <p>When your customers interact with your business through our platform (e.g., booking appointments, submitting forms), we process their personal information on your behalf as a data processor.</p>
          </section>

          <section id="usage" className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">4. How We Use Your Data</h2>
            <p>We use your personal information for the following specific purposes:</p>
            <ul className="list-disc pl-5 space-y-2 text-xs">
              <li><strong>Service Provision:</strong> Generating and hosting your business website, processing bookings, managing invoices, and providing dashboard functionality.</li>
              <li><strong>Communication:</strong> Sending essential transactional notifications, system alerts, and support responses.</li>
              <li><strong>Payment Processing:</strong> Facilitating subscription billing and payment processing through Paystack.</li>
              <li><strong>Security:</strong> Protecting against unauthorized access, fraud, and security breaches.</li>
              <li><strong>Improvement:</strong> Analyzing usage patterns to improve platform features and user experience.</li>
              <li><strong>Legal Compliance:</strong> Meeting legal obligations under POPIA, GDPR, tax laws, and other applicable regulations.</li>
            </ul>
            <p>We do not use your personal information for purposes beyond those specified here without obtaining additional consent.</p>
          </section>

          <section id="legal-basis" className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">5. Legal Basis for Processing</h2>
            
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 mt-4">5.1 Under POPIA (South Africa)</h3>
            <p>We process personal information based on the following justifications:</p>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li><strong>Consent:</strong> You have given explicit consent for specific processing purposes.</li>
              <li><strong>Contract:</strong> Processing is necessary for the performance of a contract with you.</li>
              <li><strong>Legal Obligation:</strong> Processing is required by law (e.g., tax records, anti-fraud).</li>
              <li><strong>Legitimate Interest:</strong> Processing is necessary for our legitimate business interests, provided your rights are not overridden.</li>
            </ul>

            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 mt-4">5.2 Under GDPR (European Union)</h3>
            <p>For EU users, we rely on the following legal bases under Article 6 GDPR:</p>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li><strong>Contractual Necessity (Art. 6(1)(b)):</strong> Processing required to fulfill our service agreement.</li>
              <li><strong>Consent (Art. 6(1)(a)):</strong> Where you have given clear, informed consent.</li>
              <li><strong>Legal Obligation (Art. 6(1)(c)):</strong> Compliance with legal requirements.</li>
              <li><strong>Legitimate Interests (Art. 6(1)(f)):</strong> For security, fraud prevention, and service improvement.</li>
            </ul>
          </section>

          <section id="consent" className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">6. Consent</h2>
            <p>When you create an account, you provide explicit consent to the processing of your personal information as described in this policy. You may withdraw consent at any time by:</p>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li>Contacting our Information Officer at privacy@mygrafixmedia.co.za</li>
              <li>Deleting your account through the platform settings</li>
              <li>Unsubscribing from marketing communications</li>
            </ul>
            <p>Withdrawing consent does not affect the lawfulness of processing based on consent before its withdrawal.</p>
          </section>

          <section id="cookies" className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">7. Cookies & Tracking</h2>
            <p>We use the following types of cookies and similar technologies:</p>
            
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 mt-4">7.1 Strictly Necessary Cookies</h3>
            <p>These cookies are essential for platform functionality, including authentication, session management, and security. They cannot be disabled without affecting service availability.</p>

            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 mt-4">7.2 Local Storage</h3>
            <p>We use browser local storage to store authentication tokens and user preferences (e.g., theme settings). This data is not transmitted to third parties.</p>

            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 mt-4">7.3 Analytics</h3>
            <p>We do not use third-party advertising cookies or tracking pixels. We may use anonymized analytics to understand platform usage patterns, but this data cannot be linked to individual users.</p>
          </section>

          <section id="thirdparty" className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">8. Third-Party Services</h2>
            <p>We integrate with the following third-party service providers, all of whom are contractually bound to protect your data:</p>
            <ul className="list-disc pl-5 space-y-2 text-xs">
              <li><strong>Supabase:</strong> Database hosting and authentication (GDPR compliant, data centers in EU/US)</li>
              <li><strong>Cloudflare:</strong> CDN and edge computing (GDPR compliant, global infrastructure)</li>
              <li><strong>Paystack:</strong> Payment processing (PCI DSS compliant, South African registered)</li>
              <li><strong>Cloudinary:</strong> Image storage and optimization (GDPR compliant)</li>
              <li><strong>Resend:</strong> Email delivery service (GDPR compliant)</li>
            </ul>
            <p>We do not sell, rent, or share your personal information with third parties for their marketing purposes.</p>
          </section>

          <section id="cross-border" className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">9. Cross-Border Transfers</h2>
            <p>Some of our service providers (Supabase, Cloudflare) store data outside South Africa. In accordance with POPIA Section 72, we ensure that cross-border transfers are subject to:</p>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li>Adequate data protection laws in the recipient country</li>
              <li>Binding corporate rules or standard contractual clauses</li>
              <li>Your explicit consent where required</li>
              <li>Technical and organizational security measures</li>
            </ul>
            <p>For EU users, we rely on Standard Contractual Clauses (SCCs) or adequacy decisions under GDPR Chapter V.</p>
          </section>

          <section id="retention" className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">10. Data Retention</h2>
            <p>We retain personal information only for as long as necessary to fulfill the purposes for which it was collected:</p>
            <ul className="list-disc pl-5 space-y-2 text-xs">
              <li><strong>Account Data:</strong> Retained while your account is active, plus 30 days after deletion request.</li>
              <li><strong>Transaction Records:</strong> Retained for 5 years to comply with South African tax law (SARS requirements).</li>
              <li><strong>Booking Data:</strong> Retained for 2 years after the booking date.</li>
              <li><strong>Support Communications:</strong> Retained for 3 years for quality and legal purposes.</li>
              <li><strong>Analytics Data:</strong> Anonymized after 12 months.</li>
            </ul>
            <p>Upon account deletion, all personal data is securely purged from active systems within 30 days. Backup copies may be retained for up to 90 days before permanent deletion.</p>
          </section>

          <section id="security" className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">11. Security Measures</h2>
            <p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, loss, damage, or destruction:</p>
            <ul className="list-disc pl-5 space-y-2 text-xs">
              <li><strong>Encryption:</strong> All data is encrypted in transit (TLS 1.3) and at rest (AES-256).</li>
              <li><strong>Access Controls:</strong> Role-based access control (RBAC) with principle of least privilege.</li>
              <li><strong>Authentication:</strong> Secure password hashing (bcrypt) and optional two-factor authentication.</li>
              <li><strong>Infrastructure:</strong> Cloud providers with SOC 2 Type II, ISO 27001, and GDPR certifications.</li>
              <li><strong>Monitoring:</strong> Continuous security monitoring and intrusion detection systems.</li>
              <li><strong>Staff Training:</strong> Regular data protection training for all employees with access to personal data.</li>
            </ul>
            <p>Despite these measures, no internet transmission is 100% secure. We cannot guarantee absolute security but will take all reasonable steps to protect your data.</p>
          </section>

          <section id="rights" className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">12. Your Rights</h2>
            <p>You have the following rights regarding your personal information:</p>

            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 mt-4">12.1 POPIA Rights (South Africa)</h3>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li><strong>Right to Access:</strong> Request a copy of the personal information we hold about you.</li>
              <li><strong>Right to Correction:</strong> Request correction of inaccurate, incomplete, or outdated information.</li>
              <li><strong>Right to Deletion:</strong> Request deletion of your personal information (subject to legal retention requirements).</li>
              <li><strong>Right to Object:</strong> Object to processing based on legitimate interests or direct marketing.</li>
              <li><strong>Right to Portability:</strong> Request transfer of your data to another service provider in a machine-readable format.</li>
              <li><strong>Right to Restrict Processing:</strong> Request limitation of processing in certain circumstances.</li>
            </ul>

            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 mt-4">12.2 GDPR Rights (European Union)</h3>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li><strong>Right of Access (Art. 15):</strong> Obtain confirmation and a copy of your personal data.</li>
              <li><strong>Right to Rectification (Art. 16):</strong> Correct inaccurate personal data.</li>
              <li><strong>Right to Erasure (Art. 17):</strong> "Right to be forgotten" under certain conditions.</li>
              <li><strong>Right to Restriction (Art. 18):</strong> Limit processing in specific scenarios.</li>
              <li><strong>Right to Data Portability (Art. 20):</strong> Receive your data in a structured, machine-readable format.</li>
              <li><strong>Right to Object (Art. 21):</strong> Object to processing based on legitimate interests.</li>
              <li><strong>Right to Withdraw Consent (Art. 7(3)):</strong> Withdraw consent at any time.</li>
              <li><strong>Right to Lodge Complaint (Art. 77):</strong> Complain to a supervisory authority.</li>
            </ul>

            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 mt-4">12.3 Exercising Your Rights</h3>
            <p>To exercise any of these rights, contact our Information Officer at <span className="font-mono text-indigo-600">privacy@mygrafixmedia.co.za</span>. We will respond within 30 days (POPIA) or one month (GDPR). We may request identification to verify your identity before processing your request.</p>
          </section>

          <section id="children" className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">13. Children's Privacy</h2>
            <p>Our services are not directed to individuals under the age of 18 (or the age of majority in your jurisdiction). We do not knowingly collect personal information from children. If you believe we have collected data from a child, please contact us immediately, and we will delete the information.</p>
          </section>

          <section id="breach" className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">14. Data Breach Procedures</h2>
            <p>In the event of a data breach that poses a risk to your rights and freedoms, we will:</p>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li>Notify the Information Regulator (South Africa) within the timeframe required by POPIA.</li>
              <li>Notify the relevant supervisory authority (GDPR) within 72 hours where required.</li>
              <li>Notify affected individuals without undue delay if the breach poses a high risk to their rights.</li>
              <li>Provide details of the breach, potential consequences, and measures taken to address it.</li>
              <li>Cooperate with authorities and provide all necessary information for investigation.</li>
            </ul>
          </section>

          <section id="complaints" className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">15. Complaints</h2>
            <p>If you are dissatisfied with how we have handled your personal information, you have the right to lodge a complaint with:</p>
            
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 mt-4">South Africa — Information Regulator</h3>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
              <p><strong>Information Regulator of South Africa</strong></p>
              <p>JD House, 18 Reitz Street, Braamfontein, Johannesburg, 2017</p>
              <p>Email: inforeg@inforegulator.org.za</p>
              <p>Website: www.inforegulator.org.za</p>
            </div>

            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 mt-4">European Union — Supervisory Authority</h3>
            <p>EU residents may lodge a complaint with their local data protection authority. A list of supervisory authorities is available at: https://edpb.europa.eu/about-edpb/board/members_en</p>

            <p>We encourage you to contact us first at <span className="font-mono text-indigo-600">privacy@mygrafixmedia.co.za</span> so we can attempt to resolve your concern directly.</p>
          </section>

          <section id="contact" className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">16. Contact Information</h2>
            <p>For any privacy-related queries, requests, or concerns, please contact:</p>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
              <p><strong>My Grafix Media</strong></p>
              <p><strong>Information Officer:</strong> Data Protection Team</p>
              <p><strong>Email:</strong> privacy@mygrafixmedia.co.za</p>
              <p><strong>Postal Address:</strong> [To be provided upon request]</p>
            </div>
            <p>We will respond to all privacy requests within 30 days (POPIA) or one month (GDPR).</p>
          </section>

          <div className="pt-8 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500">
            <p>This Privacy Policy is effective as of August 13, 2026. We may update this policy periodically to reflect changes in our practices or legal requirements. Material changes will be communicated via email or platform notification.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
