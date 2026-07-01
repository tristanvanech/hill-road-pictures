import { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, Check, ChevronDown, X, Loader2, Sunrise, Sun, Sunset, FileText, Play, Phone } from 'lucide-react';
import { navigate, getUtmParams, type UtmParams } from './router';
import { trackMeta } from './meta';

// --- Types ---

type InvestmentLevel = '5000' | '10000' | '30000' | '100000' | 'other';
type Accredited = 'yes' | 'no' | 'unsure';
type CallbackTime = 'morning' | 'afternoon' | 'evening';
type TimeZone = 'ET' | 'CT' | 'MT' | 'PT';
type InterestType = 'documents' | 'webinar' | 'call';

interface LeadData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  phoneCountry: string;
  investmentLevel: InvestmentLevel | '';
  investmentOther: string;
  accredited: Accredited | '';
  callbackDate: string;
  callbackTime: string;
  timeZone: string;
  consent: boolean;
  interest: InterestType | '';
  webinarSession: string;
}

/** The full payload sent on submit: form fields plus hidden UTM attribution and path-specific fields. */
interface SubmitLeadPayload {
  name: string;
  email: string;
  phone: string;
  investment_level: string;
  accredited: string;
  consent: boolean;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  interest: InterestType;
  webinar_session?: string;
  preferred_date?: string;
  preferred_time?: string;
  timezone?: string;
}

type FieldErrors = Partial<Record<keyof LeadData, string>>;

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
  interest: '',
  webinarSession: '',
};

const INVESTMENT_OPTIONS: { value: InvestmentLevel; label: string }[] = [
  { value: '5000', label: '$5,000' },
  { value: '10000', label: '$10,000' },
  { value: '30000', label: '$30,000' },
  { value: '100000', label: '$100,000' },
  { value: 'other', label: 'Other amount' },
];

const ACCREDITED_OPTIONS: { value: Accredited; label: string; hint: string }[] = [
  { value: 'yes', label: 'Yes', hint: 'I meet the SEC accredited investor criteria.' },
  { value: 'no', label: 'No', hint: 'I do not currently meet those criteria.' },
  { value: 'unsure', label: "I'm not sure", hint: "I'd like help understanding this." },
];

const CALL_TIME_BLOCKS = [
  '8:00 AM - 8:30 AM',
  '8:30 AM - 9:00 AM',
  '9:00 AM - 9:30 AM',
  '9:30 AM - 10:00 AM',
  '10:00 AM - 10:30 AM',
  '10:30 AM - 11:00 AM',
  '11:00 AM - 11:30 AM',
  '11:30 AM - 12:00 PM',
  '12:00 PM - 12:30 PM',
  '12:30 PM - 1:00 PM',
  '1:00 PM - 1:30 PM',
  '1:30 PM - 2:00 PM',
  '2:00 PM - 2:30 PM',
  '2:30 PM - 3:00 PM',
  '3:00 PM - 3:30 PM',
  '3:30 PM - 4:00 PM',
  '4:00 PM - 4:30 PM',
  '4:30 PM - 5:00 PM',
  '5:00 PM - 5:30 PM',
  '5:30 PM - 6:00 PM',
  '6:00 PM - 6:30 PM',
  '6:30 PM - 7:00 PM',
  '7:00 PM - 7:30 PM',
  '7:30 PM - 8:00 PM',
];

const TIMEZONE_GLOBAL_OPTIONS = [
  { value: 'ET', label: 'Eastern Time (US & Canada)' },
  { value: 'CT', label: 'Central Time (US & Canada)' },
  { value: 'MT', label: 'Mountain Time (US & Canada)' },
  { value: 'PT', label: 'Pacific Time (US & Canada)' },
  { value: 'AKST', label: 'Alaska Time (US & Canada)' },
  { value: 'HST', label: 'Hawaii Time (US)' },
  { value: 'AST', label: 'Atlantic Time (Canada)' },
  { value: 'GMT', label: 'Greenwich Mean Time (GMT / UTC)' },
  { value: 'BST', label: 'British Summer Time (BST, UTC+1)' },
  { value: 'CET', label: 'Central European Time (CET, UTC+1)' },
  { value: 'EET', label: 'Eastern European Time (EET, UTC+2)' },
  { value: 'MSK', label: 'Moscow Time (MSK, UTC+3)' },
  { value: 'GST', label: 'Gulf Standard Time (GST, UTC+4)' },
  { value: 'IST', label: 'India Standard Time (IST, UTC+5:30)' },
  { value: 'SGT', label: 'Singapore Standard Time (SGT, UTC+8)' },
  { value: 'WIB', label: 'Western Indonesia Time (WIB, UTC+7)' },
  { value: 'CST_CN', label: 'China Standard Time (CST, UTC+8)' },
  { value: 'JST', label: 'Japan Standard Time (JST, UTC+9)' },
  { value: 'AEST', label: 'Australian Eastern Standard Time (AEST, UTC+10)' },
  { value: 'NZST', label: 'New Zealand Standard Time (NZST, UTC+12)' },
  { value: 'BRT', label: 'Brasilia Time (BRT, UTC-3)' },
  { value: 'ART', label: 'Argentina Time (ART, UTC-3)' },
  { value: 'SAST', label: 'South Africa Standard Time (SAST, UTC+2)' },
  { value: 'EAT', label: 'East Africa Time (EAT, UTC+3)' },
];

const WEBINAR_OPTIONS = [
  'Thursday, June 18 — 7:15 PM ET',
  'Tuesday, June 23 — 4:15 PM ET',
];

interface Country {
  code: string; // ISO 3166-1 alpha-2
  name: string;
  dialCode: string;
}

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
] as const;

function getCountry(code: string): typeof COUNTRIES[number] {
  return COUNTRIES.find((c) => c.code === code) ?? COUNTRIES[0];
}

function isNANP(code: string): boolean {
  return code === 'US' || code === 'CA';
}

const DISCLAIMER =
  'This offering is being made under Rule 506(c) of Regulation D. Only accredited investors as defined by the SEC are eligible to participate. Investing in independent film involves significant risk, including the potential loss of your entire investment. Past performance of the production team is not a guarantee of future results.';

const INTAKE_URL = 'https://api.coopsimms.com/hr/lead-intake';
const INTAKE_SECRET = '0g_igX18PwIRs-zHXsiLs4CCuTfsLMn1RCwyXKB_E0c';

async function submitLead(payload: SubmitLeadPayload): Promise<void> {
  const response = await fetch(INTAKE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-HR-Intake-Secret': INTAKE_SECRET,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Lead intake responded with ${response.status}`);
  }
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function todayISO(): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function formatUSPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 10);
  if (digits.length === 0) return '';
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function formatPhone(country: string, value: string): string {
  if (isNANP(country)) return formatUSPhone(value);
  return value.replace(/\D/g, '').slice(0, 15);
}

function validateStepCode(stepCode: string, d: LeadData): FieldErrors {
  const e: FieldErrors = {};

  if (stepCode === 'info') {
    if (!d.firstName.trim()) e.firstName = 'Please enter your first name.';
    if (!d.lastName.trim()) e.lastName = 'Please enter your last name.';
    if (!d.email.trim()) e.email = 'Please enter your email address.';
    else if (!EMAIL_RE.test(d.email.trim())) e.email = 'Please enter a valid email address.';
    
    if (d.interest === 'call') {
      if (!d.phone.trim()) {
        e.phone = 'Please enter your phone number.';
      } else {
        const digits = d.phone.replace(/\D/g, '');
        const minDigits = isNANP(d.phoneCountry) ? 10 : 6;
        if (digits.length < minDigits) e.phone = 'Please enter a valid phone number.';
      }
    } else {
      if (d.phone.trim()) {
        const digits = d.phone.replace(/\D/g, '');
        const minDigits = isNANP(d.phoneCountry) ? 10 : 6;
        if (digits.length < minDigits) e.phone = 'Please enter a valid phone number.';
      }
    }
  } else if (stepCode === 'amount') {
    if (!d.investmentLevel) {
      e.investmentLevel = 'Please choose an investment level.';
    } else if (d.investmentLevel === 'other') {
      const amount = Number(d.investmentOther.replace(/[^0-9.]/g, ''));
      if (!amount || amount <= 0) e.investmentOther = 'Please enter an amount.';
    }
  } else if (stepCode === 'accredited') {
    if (!d.accredited) e.accredited = 'Please select one option.';
  } else if (stepCode === 'session') {
    if (!d.webinarSession) e.webinarSession = 'Please select a webinar session.';
  } else if (stepCode === 'schedule') {
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

// --- Presentational components ---

function StepHeading({ step, total, title, subtitle }: { step: number; total: number; title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-red mb-2">
        Step {step} of {total}
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

function ConsentCheckbox({
  checked,
  onChange,
  interest,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  interest?: InterestType | '';
}) {
  let labelText = "I agree to receive communication from Hill Road Pictures LLC regarding this project.";
  if (interest === 'webinar') {
    labelText = "I agree to receive a meeting link to the webinar and to receive future communication from Hill Road Pictures LLC.";
  } else if (interest === 'documents') {
    labelText = "I agree to receive the investment documents and to receive future communication from Hill Road Pictures LLC.";
  } else if (interest === 'call') {
    labelText = "I agree to receive call-back scheduling confirmations and to receive future communication from Hill Road Pictures LLC.";
  }

  return (
    <label
      htmlFor="consent"
      className="mt-6 flex cursor-pointer items-start gap-3 rounded-xl border-2 border-brand-blue/15 bg-white px-4 py-3.5 select-none transition hover:border-brand-blue/30"
    >
      <input
        id="consent"
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-5 w-5 shrink-0 accent-brand-red cursor-pointer"
      />
      <span className="text-sm leading-relaxed text-brand-blue/80">
        {labelText}
      </span>
    </label>
  );
}

// --- Steps ---

function ChooserStep({ onSelect }: { onSelect: (interest: InterestType) => void }) {
  return (
    <div>
      <img
        src="/poster-horizontal.png"
        alt="So, I'm the Crazy One? — film key art"
        className="-mx-6 -mt-6 mb-6 w-[calc(100%+3rem)] max-w-none rounded-t-2xl sm:-mx-9 sm:-mt-9 sm:mb-7 sm:w-[calc(100%+4.5rem)]"
        referrerPolicy="no-referrer"
      />

      <div className="text-center mb-8">
        <p className="text-lg sm:text-xl font-bold text-brand-blue leading-snug">
          Choose how you&apos;d like to start.
          <br />
          It takes less than a minute.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {[
          {
            id: 'documents' as const,
            title: 'Send me the documents',
            desc: 'Request the investment offering documents directly to your inbox.',
            icon: FileText,
            metaEvent: 'ChooseDocuments' as const,
          },
          {
            id: 'webinar' as const,
            title: 'Join a webinar',
            desc: 'Attend a live webinar session and discover how the film gets made and how the investment works.',
            icon: Play,
            metaEvent: 'ChooseWebinar' as const,
          },
          {
            id: 'call' as const,
            title: 'Schedule a call',
            desc: 'Talk one-on-one with Frank and Bob to discuss investment details.',
            icon: Phone,
            metaEvent: 'ChooseCall' as const,
          },
        ].map((opt) => {
          const Icon = opt.icon;
          return (
            <button
              key={opt.id}
              type="button"
              data-meta-event={opt.metaEvent}
              data-meta-interest={opt.id}
              onClick={() => onSelect(opt.id)}
              className="group w-full flex items-start gap-4 rounded-xl border-2 border-brand-blue/15 bg-white p-5 text-left transition-all hover:border-brand-red hover:shadow-lg active:scale-[0.99] relative overflow-hidden"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-red/5 group-hover:bg-brand-red group-hover:text-white text-brand-red transition-all">
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1 pr-8">
                <span className="block text-base sm:text-lg font-bold text-brand-blue group-hover:text-brand-red transition-colors">
                  {opt.title}
                </span>
                <span className="block text-[11px] sm:text-[13px] text-brand-blue/60 mt-1 leading-relaxed">
                  {opt.desc}
                </span>
              </div>
              <div className="absolute top-1/2 -translate-y-1/2 right-5 h-7 w-7 rounded-full border border-brand-blue/10 flex items-center justify-center text-brand-blue/20 group-hover:bg-brand-red group-hover:text-white group-hover:border-brand-red transition-all">
                <ArrowRight className="h-4 w-4" strokeWidth={3} />
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-8 text-center border-t border-brand-blue/5 pt-6">
        <a
          href="/"
          data-meta-event="LearnMoreFromForm"
          onClick={(e) => {
            e.preventDefault();
            navigate('/');
          }}
          className="inline-block text-sm font-semibold tracking-wide text-brand-blue/50 hover:text-brand-red hover:underline transition-colors py-2 px-4"
        >
          Learn more about this opportunity.
        </a>
      </div>
    </div>
  );
}

interface StepProps {
  data: LeadData;
  errors: FieldErrors;
  update: (patch: Partial<LeadData>) => void;
  interest?: InterestType | '';
  totalSteps: number;
  stepIndex: number;
  showConsent?: boolean;
}

function InfoStep({ data, errors, update, totalSteps, stepIndex }: StepProps) {
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
      <StepHeading
        step={stepIndex}
        total={totalSteps}
        title="Your details"
        subtitle="Let's start with some basic info."
      />
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
            Phone number {data.interest !== 'call' && <span className="text-xs font-normal text-brand-blue/50 lowercase">(optional)</span>}
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
                  className="absolute left-0 top-[calc(100%+4px)] z-30 max-h-72 w-56 sm:w-72 max-w-[calc(100vw-2.5rem)] overflow-y-auto rounded-xl border-2 border-brand-blue/15 bg-white shadow-xl"
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

function AmountStep({ data, errors, update, totalSteps, stepIndex }: StepProps) {
  return (
    <div>
      <StepHeading
        step={stepIndex}
        total={totalSteps}
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

function AccreditedStep({ data, errors, update, totalSteps, stepIndex, showConsent }: StepProps) {
  return (
    <div>
      <StepHeading step={stepIndex} total={totalSteps} title="Are you an accredited investor?" />
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

      {showConsent && (
        <ConsentCheckbox
          checked={data.consent}
          onChange={(val) => update({ consent: val })}
          interest={data.interest}
        />
      )}
    </div>
  );
}

function WebinarStep({ data, errors, update, totalSteps, stepIndex, showConsent }: StepProps) {
  return (
    <div>
      <StepHeading
        step={stepIndex}
        total={totalSteps}
        title="Choose a webinar session"
        subtitle="Attend a live info session with our team."
      />
      <div className="space-y-3">
        {WEBINAR_OPTIONS.map((opt) => (
          <div key={opt}>
            <OptionCard
              selected={data.webinarSession === opt}
              onClick={() => update({ webinarSession: opt })}
              title={opt}
            />
          </div>
        ))}
      </div>
      <FieldError message={errors.webinarSession} />

      {showConsent && (
        <ConsentCheckbox
          checked={data.consent}
          onChange={(val) => update({ consent: val })}
          interest={data.interest}
        />
      )}
    </div>
  );
}

function ScheduleStep({ data, errors, update, totalSteps, stepIndex, showConsent }: StepProps) {
  return (
    <div>
      <StepHeading
        step={stepIndex}
        total={totalSteps}
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
          <label htmlFor="callbackTime" className="mb-1.5 block text-sm font-bold uppercase tracking-wide text-brand-blue">
            Preferred 30-minute block
          </label>
          <div className="relative">
            <select
              id="callbackTime"
              value={data.callbackTime}
              onChange={(e) => update({ callbackTime: e.target.value })}
              className={`${inputClasses(!!errors.callbackTime)} appearance-none pr-10`}
            >
              <option value="">Choose a 30-minute call block</option>
              {CALL_TIME_BLOCKS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-brand-blue/50">
              <ChevronDown className="h-5 w-5" />
            </div>
          </div>
          <FieldError message={errors.callbackTime} />
        </div>

        <div>
          <label htmlFor="timeZone" className="mb-1.5 block text-sm font-bold uppercase tracking-wide text-brand-blue">
            Your time zone
          </label>
          <div className="relative">
            <select
              id="timeZone"
              value={data.timeZone}
              onChange={(e) => update({ timeZone: e.target.value })}
              className={`${inputClasses(!!errors.timeZone)} appearance-none pr-10`}
            >
              <option value="">Select your time zone</option>
              {TIMEZONE_GLOBAL_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-brand-blue/50">
              <ChevronDown className="h-5 w-5" />
            </div>
          </div>
          <FieldError message={errors.timeZone} />
        </div>

        {showConsent && (
          <ConsentCheckbox
            checked={data.consent}
            onChange={(val) => update({ consent: val })}
            interest={data.interest}
          />
        )}
      </div>
    </div>
  );
}

// --- Main component ---

export function InvestForm() {
  const [data, setData] = useState<LeadData>(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const initialAmount = searchParams.get('amount') as InvestmentLevel | null;
    const hasPreselectedAmount = ['5000', '10000', '30000', '100000'].includes(initialAmount || '');
    if (hasPreselectedAmount && initialAmount) {
      return {
        ...EMPTY_LEAD,
        interest: 'documents',
        investmentLevel: initialAmount,
      };
    }
    return EMPTY_LEAD;
  });
  const [utms] = useState<UtmParams>(() => getUtmParams());
  const [step, setStep] = useState(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const initialAmount = searchParams.get('amount') as InvestmentLevel | null;
    const hasPreselectedAmount = ['5000', '10000', '30000', '100000'].includes(initialAmount || '');
    return hasPreselectedAmount ? 1 : 0;
  }); // 0 = chooser, 1..N = form steps
  const [direction, setDirection] = useState(1);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const stepRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = "Invest — So, I'm the Crazy One?";
    window.gtag?.('event', 'page_view', {
      page_path: '/invest',
      page_title: 'Invest',
      page_location: window.location.href,
    });
    (window as any).fbq?.('track', 'PageView');
    // Form opened: top of the lead funnel.
    trackMeta('InitiateCheckout');
  }, []);

  useEffect(() => {
    stepRef.current?.focus();
  }, [step]);

  // Read preselected amount from queries
  const searchParams = useMemo(() => new URLSearchParams(window.location.search), []);
  const initialAmount = useMemo(() => searchParams.get('amount') as InvestmentLevel | null, [searchParams]);
  const hasPreselectedAmount = useMemo(() => {
    return ['5000', '10000', '30000', '100000'].includes(initialAmount || '');
  }, [initialAmount]);

  // Dynamically configure steps for the chosen path
  const steps = useMemo(() => {
    const list: string[] = [];
    if (data.interest) {
      list.push('info');
      if (!hasPreselectedAmount) {
        list.push('amount');
      }
      list.push('accredited');
      if (data.interest === 'webinar') {
        list.push('session');
      } else if (data.interest === 'call') {
        list.push('schedule');
      }
    }
    return list;
  }, [data.interest, hasPreselectedAmount]);

  const activeStepCode = step > 0 ? steps[step - 1] : '';

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

  function handleSelectInterest(chosen: InterestType) {
    setData((prev) => ({
      ...prev,
      interest: chosen,
      investmentLevel: hasPreselectedAmount && initialAmount ? initialAmount : prev.investmentLevel,
    }));
    goTo(1);
  }

  async function handleSubmit() {
    setSubmitting(true);
    setSubmitError('');
    try {
      const dialCode = getCountry(data.phoneCountry).dialCode;
      const phoneFull = data.phone.trim() ? `+${dialCode} ${data.phone}` : '';
      
      const payload: SubmitLeadPayload = {
        name: `${data.firstName} ${data.lastName}`.trim(),
        email: data.email,
        phone: phoneFull,
        investment_level: data.investmentLevel === 'other' ? data.investmentOther : data.investmentLevel,
        accredited: data.accredited,
        consent: data.consent,
        utm_source: utms.utm_source || '',
        utm_medium: utms.utm_medium || '',
        utm_campaign: utms.utm_campaign || '',
        utm_content: utms.utm_content || '',
        interest: data.interest as InterestType,
      };

      if (data.interest === 'webinar') {
        payload.webinar_session = data.webinarSession;
      } else if (data.interest === 'call') {
        payload.preferred_date = data.callbackDate;
        payload.preferred_time = data.callbackTime;
        payload.timezone = data.timeZone;
      }

      await submitLead(payload);

      // Meta conversion. Fire here (on successful submit) rather than on the
      // thank-you page so a refresh of /thank-you can't double-count it.
      const rawAmount =
        data.investmentLevel === 'other' ? data.investmentOther : data.investmentLevel;
      const leadValue = Number(String(rawAmount).replace(/[^0-9.]/g, '')) || 0;
      trackMeta('Lead', {
        content_name: 'Invest Inquiry',
        value: leadValue,
        currency: 'USD',
        accredited: data.accredited || 'unknown',
        interest: data.interest || 'unknown',
      });
      
      sessionStorage.setItem(
        'hrp_lead',
        JSON.stringify({
          firstName: data.firstName.trim(),
          email: data.email.trim(),
          interest: data.interest,
          webinarSession: data.webinarSession,
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
    if (step === 0) return; // Chosen directly by screen elements
    
    const stepErrors = validateStepCode(activeStepCode, data);
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length > 0) {
      stepRef.current?.focus();
      return;
    }
    
    if (step < steps.length) {
      goTo(step + 1);
    } else {
      handleSubmit();
    }
  }

  const TOTAL_STEPS = steps.length;
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
            href="https://hillroadpictures.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Hill Road Pictures home"
          >
            <img
              src="/Hill Road Pictures Wordmark white transparent.png"
              alt="Hill Road Pictures"
              className="h-9 w-auto opacity-90 hover:opacity-100 transition-opacity"
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
                {step === 0 && <ChooserStep onSelect={handleSelectInterest} />}
                {step > 0 && activeStepCode === 'info' && (
                  <InfoStep data={data} errors={errors} update={update} totalSteps={TOTAL_STEPS} stepIndex={step} />
                )}
                {step > 0 && activeStepCode === 'amount' && (
                  <AmountStep data={data} errors={errors} update={update} totalSteps={TOTAL_STEPS} stepIndex={step} />
                )}
                {step > 0 && activeStepCode === 'accredited' && (
                  <AccreditedStep data={data} errors={errors} update={update} totalSteps={TOTAL_STEPS} stepIndex={step} showConsent={step === TOTAL_STEPS} />
                )}
                {step > 0 && activeStepCode === 'session' && (
                  <WebinarStep data={data} errors={errors} update={update} totalSteps={TOTAL_STEPS} stepIndex={step} showConsent={step === TOTAL_STEPS} />
                )}
                {step > 0 && activeStepCode === 'schedule' && (
                  <ScheduleStep data={data} errors={errors} update={update} totalSteps={TOTAL_STEPS} stepIndex={step} showConsent={step === TOTAL_STEPS} />
                )}

                {submitError && (
                  <p role="alert" className="mt-5 rounded-lg bg-brand-red/10 px-4 py-3 text-sm font-semibold text-brand-red">
                    {submitError}
                  </p>
                )}

                {/* Actions */}
                {step > 0 && (
                  <div className="mt-7 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        if (step === 1) {
                          // Go back to chooser step
                          goTo(0);
                        } else {
                          goTo(step - 1);
                        }
                      }}
                      disabled={submitting}
                      className="flex items-center justify-center gap-1.5 rounded-xl border-2 border-brand-blue/20 px-5 py-3.5 text-sm font-bold uppercase tracking-wider text-brand-blue transition hover:bg-brand-blue/5 hover:text-brand-blue/80 active:scale-[0.98] disabled:opacity-50"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-red px-6 py-3.5 text-sm font-bold uppercase tracking-widest text-white shadow-md transition hover:bg-red-700 active:scale-[0.99] disabled:opacity-50"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : step === TOTAL_STEPS ? (
                        <>
                          Submit Details
                          <Check className="h-4 w-4" strokeWidth={3} />
                        </>
                      ) : (
                        <>
                          Next Step
                          <ArrowRight className="h-4 w-4" strokeWidth={3} />
                        </>
                      )}
                    </button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </form>
        </div>
      </main>

      {/* Disclaimer */}
      <footer className="shrink-0 bg-brand-blue border-t border-white/5 py-6">
        <div className="mx-auto w-full max-w-xl px-5 text-center">
          <p className="text-[10px] leading-relaxed text-white/40 font-sans">{DISCLAIMER}</p>
        </div>
      </footer>
    </div>
  );
}
