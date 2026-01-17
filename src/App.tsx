import { useState } from 'react';
import ServeQrew from './ServeQrew';
import Dashboard from './Dashboard';

const getInitialReferralCode = () => {
  const params = new URLSearchParams(window.location.search);
  const accessTokenFromUrl = params.get('access_token');

  if (accessTokenFromUrl) {
    localStorage.setItem('serveqrew_access_code', accessTokenFromUrl);

    // clean URL immediately
    window.history.replaceState({}, document.title, '/');
    return accessTokenFromUrl;
  }

  return localStorage.getItem('serveqrew_access_code');
};

const App = () => {
  const [referralCode, setReferralCode] = useState<string | null>(
    getInitialReferralCode
  );

  const handleJoinSuccess = (newCode: string) => {
    localStorage.setItem('serveqrew_access_code', newCode);
    setReferralCode(newCode);
  };

  return (
    <main className="min-h-screen bg-black">
      {referralCode ? (
        <Dashboard referralCode={referralCode} />
      ) : (
        <ServeQrew onNavigate={handleJoinSuccess} />
      )}
    </main>
  );
};

export default App;
