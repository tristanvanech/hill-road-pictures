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
  const [callbackDate, setCallbackDate] = useState('');
  const [callbackTime, setCallbackTime] = useState('');

  useEffect(() => {
    document.title = "Thank You — So, I'm the Crazy One?";

    try {
      const raw = sessionStorage.getItem('hrp_lead');
      if (raw) {
        const parsed = JSON.parse(raw) as {
          firstName?: string;
          callbackDate?: string;
          callbackTime?: string;
        };
        if (parsed.firstName) setFirstName(parsed.firstName);
        if (parsed.callbackDate) setCallbackDate(parsed.callbackDate);
        if (parsed.callbackTime) setCallbackTime(parsed.callbackTime);
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
    });
    window.gtag?.('event', 'generate_lead');
  }, []);

  const prettyDate = callbackDate ? formatDate(callbackDate) : '';
  const timePhrase = TIME_PHRASE[callbackTime] ?? '';

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
          {firstName ? `Thank you, ${firstName}!` : 'Thank you!'}
        </h1>

        <p className="text-white/80 text-base sm:text-lg leading-relaxed mb-3">
          Your details are in. Frank and Bob will personally reach out
          {prettyDate
            ? ` around ${prettyDate}${timePhrase ? ` ${timePhrase}` : ''}`
            : ' shortly'}{' '}
          to talk through the opportunity one-on-one.
        </p>

        <p className="text-brand-gold/90 text-sm font-semibold uppercase tracking-wider mb-9">
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
