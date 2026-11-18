import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import {InvestForm} from './InvestForm.tsx';
import {ThankYou} from './ThankYou.tsx';
import {PrivacyPolicy} from './PrivacyPolicy.tsx';
import {captureUtmParams, useRoute} from './router';
import {initMetaClickTracking} from './meta';
import './index.css';

// Capture UTM params from the entry URL before any in-app navigation runs.
captureUtmParams();

// Track clicks on any element tagged with data-meta-event (see App.tsx).
initMetaClickTracking();

function Root() {
  const path = useRoute();
  if (path === '/invest') return <InvestForm />;
  if (path === '/thank-you') return <ThankYou />;
  if (path === '/privacy' || path === '/privacy-policy') return <PrivacyPolicy />;
  return <App />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);
