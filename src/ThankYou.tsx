import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Check, ArrowRight } from 'lucide-react';
import { navigate } from './router';

function formatDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

const TIME_PHRASE: Record<string, string> = {
  morning: 'in the morning',
  afternoon: 'in the afternoon',
  evening: 'in the evening',
};

export function ThankYou() {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [interest, setInterest] = useState<'documents' | 'webinar' | 'call' | ''>('');
  const [webinarSession, setWebinarSession] = useState('');
  const [callbackDate, setCallbackDate] = useState('');
  const [callbackTime, setCallbackTime] = useState('');
  const [timeZone, setTimeZone] = useState('');

  useEffect(() => {
    document.title = "Thank You — So, I'm the Crazy One?";

    try {
      const raw = sessionStorage.getItem('hrp_lead');
      if (raw) {
        const parsed = JSON.parse(raw) as {
          firstName?: string;
          email?: string;
          interest?: 'documents' | 'webinar' | 'call';
          webinarSession?: string;
          callbackDate?: string;
          callbackTime?: string;
          timeZone?: string;
        };
        if (parsed.firstName) setFirstName(parsed.firstName);
        if (parsed.email) setEmail(parsed.email);
        if (parsed.interest) setInterest(parsed.interest);
        if (parsed.webinarSession) setWebinarSession(parsed.webinarSession);
        if (parsed.callbackDate) setCallbackDate(parsed.callbackDate);
        if (parsed.callbackTime) setCallbackTime(parsed.callbackTime);
        if (parsed.timeZone) setTimeZone(parsed.timeZone);
      }
    } catch {
      /* ignore malformed storage */
    }

    // Conversion tracking: registers a virtual page view + lead event for the
    // GA tag already loaded in index.html (G-1720Q6J42F). Mark either the
    // /thank-you page or the `generate_lead` event as a conversion in GA/Ads.
    window.gtag?.('event', 'page_view', {
      page_path: '/thank-you',
      page_title: 'Thank You',
      page_location: window.location.href,
    });
    window.gtag?.('event', 'generate_lead');

    // Note: the Meta Pixel `Lead` event fires on form submit (see
    // InvestForm.tsx handleSubmit), not here, so a refresh of this page
    // does not double-count the conversion.
  }, []);

  const prettyDate = callbackDate ? formatDate(callbackDate) : '';
  
  const timezoneNames: Record<string, string> = {
    ET: 'Eastern Time (US & Canada)',
    CT: 'Central Time (US & Canada)',
    MT: 'Mountain Time (US & Canada)',
    PT: 'Pacific Time (US & Canada)',
    AKST: 'Alaska Time (US & Canada)',
    HST: 'Hawaii Time (US)',
    AST: 'Atlantic Time (Canada)',
    GMT: 'Greenwich Mean Time (GMT / UTC)',
    BST: 'British Summer Time (BST, UTC+1)',
    CET: 'Central European Time (CET, UTC+1)',
    EET: 'Eastern European Time (EET, UTC+2)',
    MSK: 'Moscow Time (MSK, UTC+3)',
    GST: 'Gulf Standard Time (GST, UTC+4)',
    IST: 'India Standard Time (IST, UTC+5:30)',
    SGT: 'Singapore Standard Time (SGT, UTC+8)',
    WIB: 'Western Indonesia Time (WIB, UTC+7)',
    CST_CN: 'China Standard Time (CST, UTC+8)',
    JST: 'Japan Standard Time (JST, UTC+9)',
    AEST: 'Australian Eastern Standard Time (AEST, UTC+10)',
    NZST: 'New Zealand Standard Time (NZST, UTC+12)',
    BRT: 'Brasilia Time (BRT, UTC-3)',
    ART: 'Argentina Time (ART, UTC-3)',
    SAST: 'South Africa Standard Time (SAST, UTC+2)',
    EAT: 'East Africa Time (EAT, UTC+3)',
  };
  const timezoneLabel = timezoneNames[timeZone] || timeZone;

  let thankYouTitle = 'Thank You!';
  let thankYouMessage = '';
  let personalizedMessage = '';

  if (interest === 'documents') {
    thankYouTitle = 'Documents Requested!';
    thankYouMessage = `Thanks, ${firstName || 'there'} — the offering documents are on their way to ${email || 'your email'}.`;
    personalizedMessage = `Bob Vanech, our Executive Producer, will personally follow up to ensure you got the packet and to answer any initial structure questions.`;
  } else if (interest === 'webinar') {
    thankYouTitle = "You're Registered!";
    thankYouMessage = `You're registered for the webinar: ${webinarSession || 'live session'}. We'll email your link shortly.`;
    personalizedMessage = `Bob Vanech, our Executive Producer, will be personally reaching out with a meeting link and direct webinar instructions.`;
  } else if (interest === 'call') {
    thankYouTitle = 'Call Scheduled!';
    thankYouMessage = `We have you scheduled for a discussion on ${prettyDate || callbackDate} at ${callbackTime || 'your selected time'} (${timezoneLabel}).`;
    personalizedMessage = `Bob Vanech, our Executive Producer, will be personally reaching out with a calendar invitation and a meeting link.`;
  } else {
    thankYouTitle = 'Thank You!';
    thankYouMessage = `Your details are in. Bob Vanech, our Executive Producer, will personally follow up with more information shortly.`;
    personalizedMessage = `Bob Vanech, our Executive Producer, will be personally reaching out with a meeting link.`;
  }

  return (
    <div className="min-h-screen bg-brand-blue flex flex-col items-center justify-center px-5 py-12 text-center">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <img
          src="/Hill Road Pictures Wordmark white transparent.png"
          alt="Hill Road Pictures"
          className="h-12 w-auto mx-auto mb-10 opacity-90"
          referrerPolicy="no-referrer"
        />

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.15, type: 'spring', stiffness: 200, damping: 14 }}
          className="mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-full bg-brand-red shadow-xl"
        >
          <Check className="h-11 w-11 text-white" strokeWidth={3} />
        </motion.div>

        <h1 className="font-display uppercase tracking-wide text-white text-4xl sm:text-5xl leading-none mb-4">
          {thankYouTitle}
        </h1>

        <p className="text-white/90 text-base sm:text-lg leading-relaxed mb-4">
          {thankYouMessage}
        </p>

        <p className="text-brand-gold bg-brand-gold/10 border border-brand-gold/20 px-5 py-4 rounded-xl text-sm sm:text-base leading-relaxed mb-6 font-medium text-center max-w-md mx-auto">
          {personalizedMessage}
        </p>

        <p className="text-white/60 text-xs sm:text-sm uppercase tracking-widest mb-9">
          Keep an eye on your inbox and phone.
        </p>

        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            navigate('/');
          }}
          className="inline-flex items-center justify-center gap-2 bg-brand-red text-white px-8 py-4 text-lg font-display uppercase tracking-wider hover:bg-red-700 transition-colors rounded-xl shadow-lg group"
        >
          Back to the film
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </a>
      </motion.div>
    </div>
  );
}
