import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, Check, ChevronDown, X, Loader2, Sunrise, Sun, Sunset } from 'lucide-react';
import { navigate, getUtmParams, type UtmParams } from './router';

// --- Types ---

type InvestmentLevel = '5000' | '10000' | '30000' | '100000' | 'other';
type Accredited = 'yes' | 'no' | 'unsure';
type CallbackTime = 'morning' | 'afternoon' | 'evening';
type TimeZone = 'ET' | 'CT' | 'MT' | 'PT';

interface LeadData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  investmentLevel: InvestmentLevel | '';
  investmentOther: string;
  accredited: Accredited | '';
  phoneCountry: string;
  callbackDate: string;
  callbackTime: CallbackTime | '';
  timeZone: TimeZone | '';
  consent: boolean;
}

/** The full payload sent on submit: form fields plus hidden UTM attribution. */
type LeadSubmission = LeadData & UtmParams;

type FieldErrors = Partial<Record<keyof LeadData, string>>;

const TOTAL_STEPS = 4;

const EMPTY_LEAD: LeadData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  phoneCountry: 'US',
  investmentLevel: '',
  investmentOther: '',
  accredited: '',
  callbackDate: '',
  callbackTime: '',
  timeZone: '',
  consent: false,
};

const INVESTMENT_OPTIONS: { value: InvestmentLevel; label: string }[] = [
  { value: '5000', label: '$5,000' },
  { value: '10000', label: '$10,000' },
  { value: '30000', label: '$30,000' },
  { value: '100000', label: '$100,000' },
  { value: 'other', label: 'Other amount' },
];

const ACCREDITED_OPTIONS: { value: Accredited; label: string; hint: string }[] = [
  { value: 'yes', label: 'Yes', hint: 'I meet the SEC accredited investor criteria' },
  { value: 'no', label: 'No', hint: 'I do not currently meet those criteria' },
  { value: 'unsure', label: "I'm not sure", hint: "I'd like help understanding this" },
];

const TIME_OPTIONS: { value: CallbackTime; label: string; Icon: typeof Sun }[] = [
  { value: 'morning', label: 'Morning', Icon: Sunrise },
  { value: 'afternoon', label: 'Afternoon', Icon: Sun },
  { value: 'evening', label: 'Evening', Icon: Sunset },
];

const TIMEZONE_OPTIONS: { value: TimeZone; label: string }[] = [
  { value: 'ET', label: 'Eastern Time' },
  { value: 'CT', label: 'Central Time' },
  { value: 'MT', label: 'Mountain Time' },
  { value: 'PT', label: 'Pacific Time' },
];

interface Country {
  code: string; // ISO 3166-1 alpha-2
  name: string;
  dialCode: string;
}

// USA first (default) and Canada second; rest alphabetical. Curated for a
// US-focused offering with reasonable international coverage.
const COUNTRIES: Country[] = [
  { code: 'US', name: 'United States', dialCode: '1' },
  { code: 'CA', name: 'Canada', dialCode: '1' },
  { code: 'AR', name: 'Argentina', dialCode: '54' },
  { code: 'AU', name: 'Australia', dialCode: '61' },
  { code: 'AT', name: 'Austria', dialCode: '43' },
  { code: 'BE', name: 'Belgium', dialCode: '32' },
  { code: 'BR', name: 'Brazil', dialCode: '55' },
  { code: 'CL', name: 'Chile', dialCode: '56' },
  { code: 'CN', name: 'China', dialCode: '86' },
  { code: 'CO', name: 'Colombia', dialCode: '57' },
  { code: 'CZ', name: 'Czech Republic', dialCode: '420' },
  { code: 'DK', name: 'Denmark', dialCode: '45' },
  { code: 'EG', name: 'Egypt', dialCode: '20' },
  { code: 'FI', name: 'Finland', dialCode: '358' },
  { code: 'FR', name: 'France', dialCode: '33' },
  { code: 'DE', name: 'Germany', dialCode: '49' },
  { code: 'GR', name: 'Greece', dialCode: '30' },
  { code: 'HK', name: 'Hong Kong', dialCode: '852' },
  { code: 'HU', name: 'Hungary', dialCode: '36' },
  { code: 'IN', name: 'India', dialCode: '91' },
  { code: 'ID', name: 'Indonesia', dialCode: '62' },
  { code: 'IE', name: 'Ireland', dialCode: '353' },
  { code: 'IL', name: 'Israel', dialCode: '972' },
  { code: 'IT', name: 'Italy', dialCode: '39' },
  { code: 'JP', name: 'Japan', dialCode: '81' },
  { code: 'MX', name: 'Mexico', dialCode: '52' },
  { code: 'NL', name: 'Netherlands', dialCode: '31' },
  { code: 'NZ', name: 'New Zealand', dialCode: '64' },
  { code: 'NO', name: 'Norway', dialCode: '47' },
  { code: 'PH', name: 'Philippines', dialCode: '63' },
  { code: 'PL', name: 'Poland', dialCode: '48' },
  { code: 'PT', name: 'Portugal', dialCode: '351' },
  { code: 'RO', name: 'Romania', dialCode: '40' },
  { code: 'RU', name: 'Russia', dialCode: '7' },
  { code: 'SA', name: 'Saudi Arabia', dialCode: '966' },
  { code: 'SG', name: 'Singapore', dialCode: '65' },
  { code: 'ZA', name: 'South Africa', dialCode: '27' },
  { code: 'KR', name: 'South Korea', dialCode: '82' },
  { code: 'ES', name: 'Spain', dialCode: '34' },
  { code: 'SE', name: 'Sweden', dialCode: '46' },
  { code: 'CH', name: 'Switzerland', dialCode: '41' },
  { code: 'TW', name: 'Taiwan', dialCode: '886' },
  { code: 'TH', name: 'Thailand', dialCode: '66' },
  { code: 'TR', name: 'Turkey', dialCode: '90' },
  { code: 'UA', name: 'Ukraine', dialCode: '380' },
  { code: 'AE', name: 'United Arab Emirates', dialCode: '971' },
  { code: 'GB', name: 'United Kingdom', dialCode: '44' },
  { code: 'VN', name: 'Vietnam', dialCode: '84' },
];

function getCountry(code: string): Country {
  return COUNTRIES.find((c) => c.code === code) ?? COUNTRIES[0];
}

function isNANP(code: string): boolean {
  return code === 'US' || code === 'CA';
}

const DISCLAIMER =
  'This offering is being made under Rule 506(c) of Regulation D. Only accredited investors as defined by the SEC are eligible to participate. Investing in independent film involves significant risk, including the potential loss of your entire investment. Past performance of the production team is not a guarantee of future results.';

// --- Submission ---
// Posts the lead (form fields + hidden UTM attribution) to a Zapier Catch Hook.
// Sent as form-urlencoded so each field arrives as its own mappable value in
// the Zap and the request stays a "simple" CORS request (no preflight).
// Throws on failure so the form surfaces an error and lets the user retry.
const ZAPIER_WEBHOOK_URL = 'https://hooks.zapier.com/hooks/catch/1567227/4o8qyz0/';

async function submitLead(data: LeadSubmission): Promise<void> {
  const body = new URLSearchParams();
  for (const [key, value] of Object.entries(data)) {
    body.append(key, String(value));
  }

  const response = await fetch(ZAPIER_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  if (!response.ok) {
    throw new Error(`Zapier webhook responded with ${response.status}`);
  }
}

// --- Validation ---

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function todayISO(): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Live-formats keystrokes into a US phone number: (xxx) xxx-xxxx. */
function formatUSPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 10);
  if (digits.length === 0) return '';
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

/** Per-country phone formatting. NANP gets the pretty US format; others stay
 * as plain digits up to the E.164 max of 15. */
function formatPhone(country: string, value: string): string {
  if (isNANP(country)) return formatUSPhone(value);
  return value.replace(/\D/g, '').slice(0, 15);
}

function validateStep(step: number, d: LeadData): FieldErrors {
  const e: FieldErrors = {};

  if (step === 1) {
    if (!d.firstName.trim()) e.firstName = 'Please enter your first name.';
    if (!d.lastName.trim()) e.lastName = 'Please enter your last name.';
    if (!d.email.trim()) e.email = 'Please enter your email address.';
    else if (!EMAIL_RE.test(d.email.trim())) e.email = 'Please enter a valid email address.';
    if (!d.phone.trim()) {
      e.phone = 'Please enter your phone number.';
    } else {
      const digits = d.phone.replace(/\D/g, '');
      const minDigits = isNANP(d.phoneCountry) ? 10 : 6;
      if (digits.length < minDigits) e.phone = 'Please enter a valid phone number.';
    }
  } else if (step === 2) {
    if (!d.investmentLevel) {
      e.investmentLevel = 'Please choose an investment level.';
    } else if (d.investmentLevel === 'other') {
      const amount = Number(d.investmentOther.replace(/[^0-9.]/g, ''));
      if (!amount || amount <= 0) e.investmentOther = 'Please enter an amount.';
    }
  } else if (step === 3) {
    if (!d.accredited) e.accredited = 'Please select one option.';
  } else if (step === 4) {
    if (!d.callbackDate) {
      e.callbackDate = 'Please choose a date for your call.';
    } else if (d.callbackDate < todayISO()) {
      e.callbackDate = 'Please choose today or a future date.';
    }
    if (!d.callbackTime) e.callbackTime = 'Please choose a preferred time.';
    if (!d.timeZone) e.timeZone = 'Please choose your time zone.';
  }

  return e;
}

// --- Presentational helpers ---

function StepHeading({ step, title, subtitle }: { step: number; title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-red mb-2">
        Step {step} of {TOTAL_STEPS}
      </p>
      <h2 className="font-display uppercase tracking-wide text-brand-blue text-2xl sm:text-3xl leading-tight">
        {title}
      </h2>
      {subtitle && <p className="mt-2 text-sm text-brand-blue/60">{subtitle}</p>}
    </div>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="mt-1.5 text-sm font-semibold text-brand-red">
      {message}
    </p>
  );
}

const inputBase =
  'w-full rounded-xl border-2 bg-white px-4 py-3.5 text-base text-brand-blue placeholder-brand-blue/35 transition focus:outline-none focus:ring-2';

function inputClasses(hasError?: boolean): string {
  return `${inputBase} ${
    hasError
      ? 'border-brand-red focus:border-brand-red focus:ring-brand-red/20'
      : 'border-brand-blue/15 focus:border-brand-red focus:ring-brand-red/15'
  }`;
}

function OptionCard({
  selected,
  onClick,
  title,
  hint,
}: {
  selected: boolean;
  onClick: () => void;
  title: string;
  hint?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`w-full flex items-center justify-between gap-3 rounded-xl border-2 px-5 py-4 text-left transition-all ${
        selected
          ? 'border-brand-red bg-brand-red/5 shadow-md'
          : 'border-brand-blue/15 bg-white hover:border-brand-blue/40 active:scale-[0.99]'
      }`}
    >
      <span>
        <span className="block text-base font-bold text-brand-blue">{title}</span>
        {hint && <span className="block text-sm text-brand-blue/55 mt-0.5">{hint}</span>}
      </span>
      <span
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
          selected ? 'border-brand-red bg-brand-red text-white' : 'border-brand-blue/25'
        }`}
      >
        {selected && <Check className="h-4 w-4" strokeWidth={3} />}
      </span>
    </button>
  );
}

// --- Main component ---

export function InvestForm() {
  const [data, setData] = useState<LeadData>(EMPTY_LEAD);
  // Captured once on mount and held for the whole flow (survives all steps).
  const [utms] = useState<UtmParams>(() => getUtmParams());
  const [step, setStep] = useState(0); // 0 = intro screen, 1..4 = form steps
  const [direction, setDirection] = useState(1);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const stepRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = "Invest — So, I'm the Crazy One?";
    window.gtag?.('event', 'page_view', { page_path: '/invest', page_title: 'Invest' });
  }, []);

  useEffect(() => {
    stepRef.current?.focus();
  }, [step]);

  function update(patch: Partial<LeadData>) {
    setData((d) => ({ ...d, ...patch }));
    setErrors((e) => {
      const next = { ...e };
      for (const key of Object.keys(patch)) delete next[key as keyof LeadData];
      return next;
    });
  }

  function goTo(next: number) {
    setDirection(next > step ? 1 : -1);
    setStep(next);
  }

  async function handleSubmit() {
    setSubmitting(true);
    setSubmitError('');
    try {
      const dialCode = getCountry(data.phoneCountry).dialCode;
      const phoneFull = data.phone ? `+${dialCode} ${data.phone}` : '';
      await submitLead({ ...data, phone: phoneFull, ...utms });
      sessionStorage.setItem(
        'hrp_lead',
        JSON.stringify({
          firstName: data.firstName.trim(),
          callbackDate: data.callbackDate,
          callbackTime: data.callbackTime,
          timeZone: data.timeZone,
        }),
      );
      navigate('/thank-you');
    } catch {
      setSubmitError('Something went wrong submitting your details. Please try again.');
      setSubmitting(false);
    }
  }

  function handleAdvance() {
    if (submitting) return;
    const stepErrors = validateStep(step, data);
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length > 0) {
      stepRef.current?.focus();
      return;
    }
    if (step < TOTAL_STEPS) goTo(step + 1);
    else handleSubmit();
  }

  const progressPct = step === 0 ? 0 : (step / TOTAL_STEPS) * 100;

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 48 : -48, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -48 : 48, opacity: 0 }),
  };

  return (
    <div className="min-h-screen bg-brand-blue flex flex-col">
      {/* Top bar */}
      <header className="shrink-0 border-b border-white/10">
        <div className="mx-auto flex w-full max-w-xl items-center justify-between px-5 py-4">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigate('/');
            }}
            aria-label="Hill Road Pictures home"
          >
            <img
              src="/Hill Road Pictures Wordmark white transparent.png"
              alt="Hill Road Pictures"
              className="h-9 w-auto opacity-90"
              referrerPolicy="no-referrer"
            />
          </a>
          <button
            type="button"
            onClick={() => navigate('/')}
            aria-label="Close and return to the site"
            className="flex h-9 w-9 items-center justify-center rounded-full text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {/* Progress bar */}
        <div
          className="h-1.5 w-full bg-white/10"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={TOTAL_STEPS}
          aria-valuenow={step}
          aria-label="Form progress"
        >
          <div
            className="h-full bg-brand-red transition-all duration-500 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </header>

      {/* Body */}
      <main className="flex flex-1 items-start justify-center px-4 py-8 sm:items-center sm:py-12">
        <div className="w-full max-w-xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAdvance();
            }}
            noValidate
          >
            {/* Hidden attribution fields — carried from the landing-page URL */}
            <input type="hidden" name="utm_source" value={utms.utm_source} readOnly />
            <input type="hidden" name="utm_medium" value={utms.utm_medium} readOnly />
            <input type="hidden" name="utm_campaign" value={utms.utm_campaign} readOnly />
            <input type="hidden" name="utm_content" value={utms.utm_content} readOnly />
            <AnimatePresence mode="wait" custom={direction} initial={false}>
              <motion.div
                key={step}
                ref={stepRef}
                tabIndex={-1}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.26, ease: 'easeInOut' }}
                className="rounded-2xl border border-brand-gold/20 bg-paper p-6 shadow-2xl outline-none sm:p-9"
              >
                {step === 0 && <IntroStep />}
                {step === 1 && <Step1 data={data} errors={errors} update={update} />}
                {step === 2 && <Step2 data={data} errors={errors} update={update} />}
                {step === 3 && <Step3 data={data} errors={errors} update={update} />}
                {step === 4 && <Step4 data={data} errors={errors} update={update} />}

                {submitError && (
                  <p role="alert" className="mt-5 rounded-lg bg-brand-red/10 px-4 py-3 text-sm font-semibold text-brand-red">
                    {submitError}
                  </p>
                )}

                {/* Actions */}
                <div className="mt-7 flex items-center gap-3">
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={() => goTo(step - 1)}
                      disabled={submitting}
                      className="flex items-center justify-center gap-1.5 rounded-xl border-2 border-brand-blue/20 px-5 py-3.5 text-sm font-bold uppercase tracking-wider text-brand-blue transition-colors hover:bg-brand-blue/5 disabled:opacity-50"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-red px-6 py-3.5 text-base font-display uppercase tracking-wider text-white shadow-lg transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {step === 0 && 'Get Started'}
                    {step >= 1 && step < TOTAL_STEPS && 'Continue'}
                    {step === TOTAL_STEPS &&
                      (submitting ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Submitting…
                        </>
                      ) : (
                        'Submit'
                      ))}
                    {step < TOTAL_STEPS && <ArrowRight className="h-5 w-5" />}
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </form>
          <p className="mx-auto mt-6 max-w-lg text-center text-[11px] leading-relaxed text-white/45">
            {DISCLAIMER}
          </p>
        </div>
      </main>
    </div>
  );
}

// --- Steps ---

function IntroStep() {
  return (
    <div>
      <img
        src="/poster-horizontal.png"
        alt="So, I'm the Crazy One? — film key art"
        className="-mx-6 -mt-6 mb-6 w-[calc(100%+3rem)] max-w-none rounded-t-2xl sm:-mx-9 sm:-mt-9 sm:mb-7 sm:w-[calc(100%+4.5rem)]"
      />
      <h1 className="font-display uppercase tracking-wide text-brand-blue text-3xl sm:text-4xl leading-tight">
        Considering investing?
      </h1>
      <p className="mt-4 text-base leading-relaxed text-brand-blue/75">
        Talk one-on-one with Frank or Bob to learn more. Share your email and phone
        number, and we&apos;ll reach out as soon as possible.
      </p>
      <p className="mt-4 text-sm font-semibold uppercase tracking-wider text-brand-red">
        Takes less than a minute.
      </p>
    </div>
  );
}

interface StepProps {
  data: LeadData;
  errors: FieldErrors;
  update: (patch: Partial<LeadData>) => void;
}

function Step1({ data, errors, update }: StepProps) {
  const [countryOpen, setCountryOpen] = useState(false);
  const countryRef = useRef<HTMLDivElement>(null);
  const currentCountry = getCountry(data.phoneCountry);

  useEffect(() => {
    if (!countryOpen) return;
    const onDown = (e: MouseEvent) => {
      if (countryRef.current && !countryRef.current.contains(e.target as Node)) {
        setCountryOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setCountryOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [countryOpen]);

  return (
    <div>
      <StepHeading step={1} title="Your info" />
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="firstName" className="mb-1.5 block text-sm font-bold uppercase tracking-wide text-brand-blue">
              First name
            </label>
            <input
              id="firstName"
              type="text"
              autoComplete="given-name"
              value={data.firstName}
              onChange={(e) => update({ firstName: e.target.value })}
              className={inputClasses(!!errors.firstName)}
              aria-invalid={!!errors.firstName}
            />
            <FieldError message={errors.firstName} />
          </div>
          <div>
            <label htmlFor="lastName" className="mb-1.5 block text-sm font-bold uppercase tracking-wide text-brand-blue">
              Last name
            </label>
            <input
              id="lastName"
              type="text"
              autoComplete="family-name"
              value={data.lastName}
              onChange={(e) => update({ lastName: e.target.value })}
              className={inputClasses(!!errors.lastName)}
              aria-invalid={!!errors.lastName}
            />
            <FieldError message={errors.lastName} />
          </div>
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-bold uppercase tracking-wide text-brand-blue">
            Email address
          </label>
          <input
            id="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={data.email}
            onChange={(e) => update({ email: e.target.value })}
            className={inputClasses(!!errors.email)}
            aria-invalid={!!errors.email}
          />
          <FieldError message={errors.email} />
        </div>
        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm font-bold uppercase tracking-wide text-brand-blue">
            Phone number
          </label>
          <div className="flex items-stretch gap-2">
            <div className="relative" ref={countryRef}>
              <button
                type="button"
                onClick={() => setCountryOpen((o) => !o)}
                aria-haspopup="listbox"
                aria-expanded={countryOpen}
                aria-label={`Country: ${currentCountry.name}`}
                className={`inline-flex h-full items-center gap-1.5 rounded-xl border-2 bg-white px-3 text-base font-bold text-brand-blue transition focus:outline-none focus:ring-2 focus:ring-brand-red/15 ${
                  errors.phone ? 'border-brand-red' : 'border-brand-blue/15 hover:border-brand-blue/30'
                }`}
              >
                +{currentCountry.dialCode}
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${countryOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {countryOpen && (
                <div
                  role="listbox"
                  className="absolute left-0 top-[calc(100%+4px)] z-30 max-h-72 w-72 max-w-[calc(100vw-2.5rem)] overflow-y-auto rounded-xl border-2 border-brand-blue/15 bg-white shadow-xl"
                >
                  {COUNTRIES.map((c) => {
                    const selected = data.phoneCountry === c.code;
                    return (
                      <button
                        key={c.code}
                        type="button"
                        role="option"
                        aria-selected={selected}
                        onClick={() => {
                          update({
                            phoneCountry: c.code,
                            phone: formatPhone(c.code, data.phone),
                          });
                          setCountryOpen(false);
                        }}
                        className={`flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm transition-colors ${
                          selected
                            ? 'bg-brand-red/5 font-bold text-brand-red'
                            : 'text-brand-blue hover:bg-brand-blue/5'
                        }`}
                      >
                        <span className="w-12 shrink-0 font-mono text-xs text-brand-blue/55 tabular-nums">
                          +{c.dialCode}
                        </span>
                        <span>{c.name}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            <input
              id="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder={isNANP(data.phoneCountry) ? '(555) 123-4567' : 'Phone number'}
              value={data.phone}
              onChange={(e) => update({ phone: formatPhone(data.phoneCountry, e.target.value) })}
              className={`flex-1 min-w-0 ${inputClasses(!!errors.phone)}`}
              aria-invalid={!!errors.phone}
            />
          </div>
          <FieldError message={errors.phone} />
        </div>
      </div>
    </div>
  );
}

function Step2({ data, errors, update }: StepProps) {
  return (
    <div>
      <StepHeading
        step={2}
        title="What level of investment are you interested in making?"
      />
      <div className="space-y-3">
        {INVESTMENT_OPTIONS.map((opt) => (
          <div key={opt.value}>
            <OptionCard
              selected={data.investmentLevel === opt.value}
              onClick={() => update({ investmentLevel: opt.value })}
              title={opt.label}
            />
          </div>
        ))}
      </div>
      {data.investmentLevel === 'other' && (
        <div className="mt-4">
          <label htmlFor="investmentOther" className="mb-1.5 block text-sm font-bold uppercase tracking-wide text-brand-blue">
            Your amount
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-base font-bold text-brand-blue/50">
              $
            </span>
            <input
              id="investmentOther"
              type="text"
              inputMode="numeric"
              placeholder="Enter an amount"
              value={data.investmentOther}
              onChange={(e) => update({ investmentOther: e.target.value })}
              className={`${inputClasses(!!errors.investmentOther)} pl-8`}
              aria-invalid={!!errors.investmentOther}
            />
          </div>
          <FieldError message={errors.investmentOther} />
        </div>
      )}
      <FieldError message={errors.investmentLevel} />
    </div>
  );
}

function Step3({ data, errors, update }: StepProps) {
  return (
    <div>
      <StepHeading step={3} title="Are you an accredited investor?" />
      <div className="space-y-3">
        {ACCREDITED_OPTIONS.map((opt) => (
          <div key={opt.value}>
            <OptionCard
              selected={data.accredited === opt.value}
              onClick={() => update({ accredited: opt.value })}
              title={opt.label}
              hint={opt.hint}
            />
          </div>
        ))}
      </div>
      <FieldError message={errors.accredited} />
    </div>
  );
}

function Step4({ data, errors, update }: StepProps) {
  return (
    <div>
      <StepHeading
        step={4}
        title="We'll be in touch"
        subtitle="Pick a day and time that work for a quick call."
      />
      <div className="space-y-5">
        <div>
          <label htmlFor="callbackDate" className="mb-1.5 block text-sm font-bold uppercase tracking-wide text-brand-blue">
            Preferred call-back date
          </label>
          <input
            id="callbackDate"
            type="date"
            min={todayISO()}
            value={data.callbackDate}
            onChange={(e) => update({ callbackDate: e.target.value })}
            className={inputClasses(!!errors.callbackDate)}
            aria-invalid={!!errors.callbackDate}
          />
          <FieldError message={errors.callbackDate} />
        </div>

        <div>
          <span className="mb-1.5 block text-sm font-bold uppercase tracking-wide text-brand-blue">
            Preferred time of day
          </span>
          <div className="grid grid-cols-3 gap-3" role="group" aria-label="Preferred time of day">
            {TIME_OPTIONS.map((opt) => {
              const selected = data.callbackTime === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => update({ callbackTime: opt.value })}
                  aria-pressed={selected}
                  className={`flex flex-col items-center justify-center gap-1.5 rounded-xl border-2 px-2 py-3.5 transition-all ${
                    selected
                      ? 'border-brand-red bg-brand-red/5 text-brand-red shadow-md'
                      : 'border-brand-blue/15 bg-white text-brand-blue hover:border-brand-blue/40 active:scale-[0.98]'
                  }`}
                >
                  <opt.Icon className="h-5 w-5" />
                  <span className="text-sm font-bold">{opt.label}</span>
                </button>
              );
            })}
          </div>
          <FieldError message={errors.callbackTime} />
        </div>

        <div>
          <span className="mb-1.5 block text-sm font-bold uppercase tracking-wide text-brand-blue">
            Your time zone
          </span>
          <div className="grid grid-cols-2 gap-3" role="group" aria-label="Your time zone">
            {TIMEZONE_OPTIONS.map((opt) => {
              const selected = data.timeZone === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => update({ timeZone: opt.value })}
                  aria-pressed={selected}
                  className={`rounded-xl border-2 px-3 py-3 text-sm font-bold transition-all ${
                    selected
                      ? 'border-brand-red bg-brand-red/5 text-brand-red shadow-md'
                      : 'border-brand-blue/15 bg-white text-brand-blue hover:border-brand-blue/40 active:scale-[0.98]'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
          <FieldError message={errors.timeZone} />
        </div>

        <label
          htmlFor="consent"
          className="flex cursor-pointer items-start gap-3 rounded-xl border-2 border-brand-blue/15 bg-white px-4 py-3.5"
        >
          <input
            id="consent"
            type="checkbox"
            checked={data.consent}
            onChange={(e) => update({ consent: e.target.checked })}
            className="mt-0.5 h-5 w-5 shrink-0 accent-brand-red"
          />
          <span className="text-sm leading-relaxed text-brand-blue/80">
            I agree to receive communication from Hill Road Pictures LLC regarding this
            project.
          </span>
        </label>
      </div>
    </div>
  );
}
