import { useState, useEffect } from 'react';
import ServeQrew from './ServeQrew';
import Dashboard from './Dashboard';

const App = ({ referralCode: initialCode }: { referralCode?: string }) => {
  const [referralCode, setReferralCode] = useState<string | null>(() => {
    return initialCode || localStorage.getItem('serveqrew_access_code');
  });

  useEffect(() => {
    if (referralCode) {
      localStorage.setItem('serveqrew_access_code', referralCode);
    }
  }, [referralCode]);

  const handleJoinSuccess = (newCode: string) => {
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