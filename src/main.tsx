import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import {InvestForm} from './InvestForm.tsx';
import {ThankYou} from './ThankYou.tsx';
import {captureUtmParams, useRoute} from './router';
import './index.css';

// Capture UTM params from the entry URL before any in-app navigation runs.
captureUtmParams();

function Root() {
  const path = useRoute();
  if (path === '/invest') return <InvestForm />;
  if (path === '/thank-you') return <ThankYou />;
  return <App />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);
