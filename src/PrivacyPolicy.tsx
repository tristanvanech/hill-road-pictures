import { useEffect } from 'react';
import { ArrowLeft, Shield, Mail, Phone, Lock, MessageSquare, ChevronRight } from 'lucide-react';
import { navigate } from './router';

export function PrivacyPolicy() {
  useEffect(() => {
    document.title = "Privacy Policy — Hill Road Pictures & 'So, I'm the Crazy One?'";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background text-text-main flex flex-col selection:bg-brand-red selection:text-white">
      {/* Top Header */}
      <header className="sticky top-0 left-0 w-full z-40 bg-brand-blue shadow-xl border-b border-brand-gold/20">
        <div className="max-w-[1536px] mx-auto px-6 sm:px-12 lg:px-20 xl:px-24 py-3 md:py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 md:gap-8">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                navigate('/');
              }}
              className="flex items-center group"
            >
              <img
                src="/Hill Road Pictures Wordmark white transparent.png"
                alt="Hill Road Pictures"
                className="h-8 md:h-10 w-auto opacity-90 group-hover:opacity-100 transition-opacity"
                referrerPolicy="no-referrer"
              />
            </a>
            <div className="h-6 w-px bg-white/20 hidden sm:block" />
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                navigate('/');
              }}
              className="hidden sm:flex items-center group"
            >
              <img
                src="/SITCO Primary Wordmark single line white transparent v2.png"
                alt="So, I'm the Crazy One?"
                className="h-6 md:h-7 w-auto opacity-90 group-hover:opacity-100 transition-opacity"
                referrerPolicy="no-referrer"
              />
            </a>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-white/80 hover:text-brand-gold transition-colors px-3 py-1.5 rounded-lg border border-white/10 hover:border-brand-gold/40"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Overview</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/invest')}
              className="inline-flex items-center gap-1.5 bg-brand-red text-white hover:bg-red-700 transition-all px-3.5 py-1.5 rounded-lg font-black text-xs sm:text-sm uppercase tracking-wider shadow-md"
            >
              <span>Invest</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-6 sm:px-10 py-12 md:py-16">
        {/* Title Header */}
        <div className="mb-10 pb-8 border-b border-border">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/5 border border-brand-blue/15 text-brand-blue text-xs font-bold uppercase tracking-widest mb-4">
            <Shield className="w-3.5 h-3.5 text-brand-red" />
            <span>Legal Transparency</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display uppercase tracking-tight text-brand-blue leading-tight mb-3">
            Privacy Policy
          </h1>
          <p className="text-sm sm:text-base text-text-muted">
            Effective Date: September 1, 2026 &bull; Last Updated: September 2026
          </p>
        </div>

        {/* Informational Notice */}
        <div className="mb-10 rounded-xl border border-brand-blue/15 bg-white p-5 shadow-sm">
          <p className="text-xs sm:text-sm leading-relaxed text-text-muted">
            <strong className="text-brand-blue font-semibold">Important Notice: </strong>
            This Privacy Policy is provided by Hill Road Pictures LLC for informational transparency regarding how we collect, use, and protect your personal information on our investor portal for the feature film <em className="font-semibold text-brand-blue">"So, I'm the Crazy One?"</em>. This document does not constitute formal legal advice. If you have specific legal questions concerning privacy rights or investments, please consult qualified legal counsel.
          </p>
        </div>

        <div className="space-y-10 text-text-main text-sm sm:text-base leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-display uppercase tracking-wide text-brand-blue">
              1. Overview &amp; Who We Are
            </h2>
            <p>
              Hill Road Pictures LLC ("Hill Road Pictures," "we," "us," or "our") operates the investor portal and website for the motion picture production <em>"So, I'm the Crazy One?"</em>. We respect your privacy and are committed to safeguarding the personal information you share with us.
            </p>
            <p>
              This Privacy Policy explains how we collect, use, disclose, and protect your personal contact information, qualification preferences, and communication preferences when you browse our site, register for investor webinars, request investment documents, or schedule an investor discussion.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-display uppercase tracking-wide text-brand-blue">
              2. Information We Collect
            </h2>
            <p>
              We collect information that you voluntarily provide to us through our online inquiry forms, webinar registration pages, and scheduling tools:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-text-muted">
              <li>
                <strong className="text-text-main">Contact Information:</strong> Your first and last name, email address, mobile phone number, country, and time zone.
              </li>
              <li>
                <strong className="text-text-main">Investor Qualification &amp; Preferences:</strong> Self-reported accredited investor status (under SEC Rule 506(c) of Regulation D), preferred investment amount range, and specific interest pathway (offering documents, live webinar, or 1-on-1 call).
              </li>
              <li>
                <strong className="text-text-main">Scheduling Details:</strong> Preferred meeting dates and times for discussions with writer Frank Peluso Jr. and Executive Producer Bob Vanech.
              </li>
              <li>
                <strong className="text-text-main">Attribution &amp; Technical Usage Data:</strong> Referral source, campaign identifiers (UTM parameters), browser type, operating system, and IP address for internal analytics and site functionality.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-display uppercase tracking-wide text-brand-blue">
              3. How We Use Your Information
            </h2>
            <p>
              We use the collected information exclusively for purposes related to our investor relations and project communications, including:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-text-muted">
              <li>Fulfilling your requests for investment offering memoranda, subscription packets, and financial schedules.</li>
              <li>Registering you for upcoming live investor webinars and sending direct Zoom access credentials and calendar reminders.</li>
              <li>Coordinating and confirming one-on-one phone or video conferences with executive leadership.</li>
              <li>Delivering periodic production updates, casting news, tax incentive milestones, and film announcements.</li>
              <li>Verifying investor eligibility under applicable securities laws (e.g., Rule 506(c) accredited investor requirements).</li>
              <li>Maintaining administrative records and complying with relevant regulatory and legal obligations.</li>
            </ul>
          </section>

          {/* Section 4 - SMS MARKETING PRIVACY DISCLOSURES (KLAVIYO / CTIA REQUIREMENTS) */}
          <section className="rounded-2xl border-2 border-brand-red/30 bg-white p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5">
              <MessageSquare className="w-5 h-5 text-brand-red shrink-0" />
              <h2 className="text-xl sm:text-2xl font-display uppercase tracking-wide text-brand-red">
                4. SMS &amp; Mobile Messaging Privacy Disclosures
              </h2>
            </div>

            <p className="font-medium text-brand-blue">
              Hill Road Pictures LLC takes mobile privacy seriously. If you provide your mobile phone number and consent to receive text messages from us, the following terms and disclosures strictly apply:
            </p>

            {/* Strict Third Party Prohibition */}
            <div className="rounded-xl border-2 border-brand-blue/20 bg-brand-blue/5 p-4 sm:p-5 space-y-2">
              <div className="flex items-center gap-2 font-bold text-brand-blue text-sm uppercase tracking-wider">
                <Lock className="w-4 h-4 text-brand-red shrink-0" />
                <span>Strict Third-Party Data Sharing Prohibition</span>
              </div>
              <p className="text-xs sm:text-sm text-brand-blue/90 leading-relaxed font-semibold">
                SMS opt-in/consent information and phone numbers will not be shared with third parties or affiliates for their own unrelated marketing purposes.
              </p>
              <p className="text-xs sm:text-sm text-brand-blue/80 leading-relaxed">
                No mobile information will be shared with third parties or affiliates for marketing or promotional purposes. All other categories exclude text messaging originator opt-in data and consent; this information will not be shared with or sold to any third parties.
              </p>
            </div>

            {/* Vendors and Service Providers */}
            <div className="space-y-2">
              <h3 className="font-bold text-brand-blue text-sm uppercase tracking-wide">
                Authorized Service Providers &amp; Vendors
              </h3>
              <p className="text-text-muted text-xs sm:text-sm">
                We may share your mobile phone number and opt-in information solely with trusted service providers, vendors, and contractors who assist us directly in delivering text messages and communications (such as our SMS marketing platform providers, messaging aggregators, telecommunications carriers, and hosting providers). These entities are contractually bound to use your information solely to provide and operate that delivery service on our behalf.
              </p>
            </div>

            {/* Program Details, Consent, Frequency, Opt-Out */}
            <div className="space-y-3 pt-2 border-t border-gray-100">
              <h3 className="font-bold text-brand-blue text-sm uppercase tracking-wide">
                SMS Consent, Frequency &amp; Opt-Out Options
              </h3>
              <ul className="list-disc pl-6 space-y-1.5 text-xs sm:text-sm text-text-muted">
                <li>
                  <strong className="text-brand-blue">Program Description:</strong> When you opt in, you may receive informational and transactional SMS messages regarding investor webinar reminders, call confirmations, and offering updates.
                </li>
                <li>
                  <strong className="text-brand-blue">Message Frequency:</strong> Message frequency varies based on scheduled meetings and project milestones.
                </li>
                <li>
                  <strong className="text-brand-blue">Rates:</strong> Message and data rates may apply depending on your mobile carrier and wireless service plan.
                </li>
                <li>
                  <strong className="text-brand-blue">How to Opt Out (Unsubscribe):</strong> You can cancel SMS notifications at any time. Simply reply <strong>STOP</strong> to any text message from us. After sending STOP, you will receive one confirmation message confirming your unsubscribe status, and no further text messages will be sent to your mobile number unless you re-subscribe.
                </li>
                <li>
                  <strong className="text-brand-blue">Help &amp; Support:</strong> For assistance, reply <strong>HELP</strong> to any message, or contact our team directly at <a href="mailto:finance@hillroadpictures.com" className="text-brand-red font-semibold hover:underline">finance@hillroadpictures.com</a>.
                </li>
                <li>
                  <strong className="text-brand-blue">No Contingency:</strong> Consent to receive promotional or informational text messages is never a condition of purchase, participation, or investment in Hill Road Pictures LLC or <em>"So, I'm the Crazy One?"</em>.
                </li>
                <li>
                  <strong className="text-brand-blue">Carrier Disclaimer:</strong> Wireless carriers are not liable for delayed or undelivered messages.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-display uppercase tracking-wide text-brand-blue">
              5. Information Sharing and Disclosure
            </h2>
            <p>
              Except as described in this policy, we do not sell, rent, or lease your personal information to third parties. We disclose your information only under the following limited circumstances:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-text-muted">
              <li>
                <strong className="text-text-main">Operational Service Providers:</strong> To contracted vendors who facilitate our business operations (e.g., email distribution platforms, calendar scheduling systems, and secure document delivery).
              </li>
              <li>
                <strong className="text-text-main">Legal and Regulatory Compliance:</strong> If required by law, subpoena, or governmental regulation, or when we believe in good faith that disclosure is necessary to comply with securities laws (including SEC Rule 506(c)), protect our rights, or protect the safety of our company or others.
              </li>
              <li>
                <strong className="text-text-main">Business Reorganization:</strong> In connection with any merger, financing, acquisition, or restructuring of Hill Road Pictures LLC or the film production entity, subject to standard confidentiality protections.
              </li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-display uppercase tracking-wide text-brand-blue">
              6. Data Security &amp; Retention
            </h2>
            <p>
              We implement industry-standard administrative, physical, and technical safeguards designed to protect personal information against unauthorized access, loss, alteration, or misuse.
            </p>
            <p>
              We retain personal information for the period necessary to fulfill the purposes outlined in this policy, manage ongoing investor relations, satisfy legal and regulatory record-keeping obligations, and resolve any disputes.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-display uppercase tracking-wide text-brand-blue">
              7. Your Choices &amp; Rights
            </h2>
            <p>
              You have full control over your communications:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-text-muted">
              <li>
                <strong className="text-text-main">Email Communications:</strong> Every commercial or informational email includes an unsubscribe link allowing you to opt out of future mailings.
              </li>
              <li>
                <strong className="text-text-main">SMS Communications:</strong> Reply <strong>STOP</strong> at any time to opt out of text messaging.
              </li>
              <li>
                <strong className="text-text-main">Review or Update Information:</strong> You may request to review, modify, or delete your contact information by contacting us at <a href="mailto:finance@hillroadpictures.com" className="text-brand-red font-semibold hover:underline">finance@hillroadpictures.com</a>.
              </li>
            </ul>
          </section>

          {/* Section 8 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-display uppercase tracking-wide text-brand-blue">
              8. Changes to This Privacy Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time to reflect modifications in our practices, technology, operational workflows, or regulatory obligations. When changes are posted, we will update the "Effective Date" at the top of this page. We encourage you to periodically review this page for the latest information on our privacy practices.
            </p>
          </section>

          {/* Section 9 */}
          <section className="space-y-3 pt-4 border-t border-border">
            <h2 className="text-xl sm:text-2xl font-display uppercase tracking-wide text-brand-blue">
              9. Contact Us
            </h2>
            <p>
              If you have any questions, comments, or requests regarding this Privacy Policy or our mobile messaging practices, please contact our team:
            </p>
            <div className="rounded-xl border border-border bg-white p-5 space-y-2">
              <p className="font-bold text-brand-blue">Hill Road Pictures LLC</p>
              <p className="text-sm text-text-muted">Producer: "So, I'm the Crazy One?"</p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 pt-2 text-sm">
                <a href="mailto:finance@hillroadpictures.com" className="inline-flex items-center gap-2 text-brand-red hover:underline font-semibold">
                  <Mail className="w-4 h-4" />
                  <span>finance@hillroadpictures.com</span>
                </a>
                <span className="text-text-muted hidden sm:inline">&bull;</span>
                <span className="text-text-muted">Los Angeles, CA</span>
              </div>
            </div>
          </section>
        </div>

        {/* Back navigation CTA */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-brand-blue hover:text-brand-red transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Main Film Page</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/invest')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-red text-white px-6 py-3 text-sm font-bold uppercase tracking-wider rounded-xl hover:bg-red-700 transition-colors shadow-md"
          >
            <span>Go to Investor Inquiry</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-brand-blue text-white py-10 border-t border-brand-gold/30 mt-12">
        <div className="max-w-[1536px] mx-auto px-6 sm:px-12 lg:px-20 xl:px-24 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <div>
            &copy; 2026 Hill Road Pictures LLC. All Rights Reserved. Private Placement Offering under Rule 506(c).
          </div>
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="hover:text-brand-gold transition-colors uppercase tracking-wider text-[11px]"
            >
              Film Overview
            </button>
            <button
              type="button"
              onClick={() => navigate('/invest')}
              className="hover:text-brand-gold transition-colors uppercase tracking-wider text-[11px]"
            >
              Invest
            </button>
            <span className="text-brand-gold font-semibold uppercase tracking-wider text-[11px]">
              Privacy Policy
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
