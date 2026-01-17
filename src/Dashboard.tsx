// src/Dashboard.tsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Copy, Home, Share2, Sparkles, Users, Trophy } from 'lucide-react';
import logo from './assets/logo.jpeg';

/* ---------------- TYPES ---------------- */

type Referral = {
  name: string;
  email: string;
};

type UserData = {
  name: string;
  email?: string; // optional in case backend doesn't return it
  referralLink: string;
  referrals: number;
  rank: number;
  referralList: Referral[];
};

/* ---------------- PARTICLE ---------------- */

const Particle = ({
  size,
  x,
  y,
  delay,
  duration
}: {
  size: number;
  x: number;
  y: number;
  delay: number;
  duration: number;
}) => (
  <motion.div
    className="absolute rounded-full bg-teal-200 opacity-30"
    style={{ width: size, height: size, top: y, left: x }}
    animate={{ y: [y, y - 20, y], x: [x, x + 15, x] }}
    transition={{ repeat: Infinity, duration, delay }}
  />
);

/* ================= DASHBOARD ================= */

const Dashboard = () => {
  /* ---- MAGIC LINK FRIENDLY ---- */
  const referralCode = new URLSearchParams(window.location.search).get('code') || '';

  /* ---- STATE ---- */
  const [userData, setUserData] = useState<UserData>({
    name: '',
    email: '',
    referralLink: '',
    referrals: 0,
    rank: 0,
    referralList: [],
  });

  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  /* ---- PARTICLES ---- */
  const [particles] = useState(() =>
    [...Array(15)].map(() => ({
      size: Math.random() * 12 + 6,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      delay: Math.random() * 5,
      duration: 6 + Math.random() * 4
    }))
  );

  /* ---- GUARD: NO MAGIC LINK ---- */
  useEffect(() => {
    if (!referralCode) {
      window.location.href = '/';
    }
  }, [referralCode]);

  /* ---- FETCH DASHBOARD DATA ---- */
  useEffect(() => {
    if (!referralCode) return;
    let isMounted = true;

    const fetchDashboardData = async () => {
      try {
        // FIX: Added ?apikey= to the URL to bypass browser CORS header blocks
        const url = `https://mnqypkgrbqhkzwptmaug.supabase.co/functions/v1/smooth-worker/dashboard?code=${referralCode}&apikey=${import.meta.env.VITE_SUPABASE_ANON_KEY}`;
        
        const res = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data: UserData = await res.json();

        if (isMounted) {
          setUserData({
            name: data.name,
            email: data.email,
            referralLink: data.referralLink,
            referrals: data.referrals,
            rank: data.rank,
            referralList: data.referralList || [],
          });
        }
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [referralCode]);

  /* ---- COPY ---- */
  const copyLink = () => {
    if (userData.referralLink) {
      navigator.clipboard.writeText(userData.referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  /* ---- SHARE ---- */
  const shareLink = async () => {
    if (navigator.share && userData.referralLink) {
      try {
        await navigator.share({
          title: 'Join ServeQrew',
          text: 'Join me on ServeQrew!',
          url: userData.referralLink,
        });
      } catch (err) {
        console.error('Share failed:', err);
        copyLink(); // fallback copy
      }
    } else {
      copyLink();
    }
  };

  /* ---- LOADING ---- */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-black uppercase italic tracking-widest animate-pulse text-teal-600">
          Loading your dashboard…
        </p>
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="min-h-screen relative bg-gradient-to-b from-white via-white to-gray-50 overflow-hidden text-gray-900 font-sans">
      {/* PARTICLES */}
      {particles.map((p, i) => <Particle key={i} {...p} />)}

      {/* NAV */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur shadow z-50 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img src={logo} className="w-12 h-12 rounded-xl" />
          <span className="font-black italic text-xl">ServeQrew Dashboard</span>
        </div>
        <a href="/" className="flex items-center gap-2 border px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors">
          <Home className="w-5 h-5" />
          Home
        </a>
      </nav>

      {/* HERO */}
      <section className="pt-32 flex justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-teal-100 to-lime-100 p-10 rounded-3xl shadow-xl text-center max-w-xl w-full"
        >
          <h1 className="text-4xl font-black italic uppercase mb-2">
            Welcome{userData.name ? `, ${userData.name.split(' ')[0]}` : ''}!
          </h1>
          <p className="opacity-70">{userData.email || '-'}</p>
        </motion.div>
      </section>

      {/* STATS */}
      <section className="flex justify-center px-6 mt-8">
        <div className="grid grid-cols-2 gap-6 max-w-xl w-full">
          <div className="bg-white rounded-3xl p-6 shadow text-center border border-gray-100">
            <Users className="mx-auto mb-2 text-teal-500" />
            <p className="text-3xl font-black">{userData.referrals}</p>
            <p className="text-xs uppercase opacity-60">Referrals</p>
          </div>
          <div className="bg-white rounded-3xl p-6 shadow text-center border border-gray-100">
            <Trophy className="mx-auto mb-2 text-lime-500" />
            <p className="text-3xl font-black">#{userData.rank || '-'}</p>
            <p className="text-xs uppercase opacity-60">Rank</p>
          </div>
        </div>
      </section>

      {/* REFERRAL */}
      <section className="flex justify-center px-6 mt-10">
        <div className="bg-white rounded-3xl p-8 shadow max-w-xl w-full border border-gray-100">
          <h2 className="font-black italic uppercase mb-4">Your Referral Link</h2>

          <div className="flex gap-2 mb-4">
            <input
              readOnly
              value={userData.referralLink}
              className="flex-1 px-3 py-2 border rounded-xl text-xs font-mono bg-gray-50"
            />
            <button onClick={copyLink} className="px-4 py-2 border rounded-xl flex items-center gap-1 hover:bg-gray-50 active:scale-95 transition-all">
              <Copy className="w-4 h-4" />
              {copied && <span className="text-xs font-bold text-teal-600">Copied</span>}
            </button>
            <button onClick={shareLink} className="px-4 py-2 bg-teal-500 text-white rounded-xl flex items-center gap-1 hover:bg-teal-600 active:scale-95 transition-all">
              <Share2 className="w-4 h-4" />
              <span className="text-xs font-bold">Share</span>
            </button>
          </div>

          <h3 className="flex items-center gap-2 font-bold uppercase text-sm mt-6 mb-2">
            <Sparkles className="w-4 h-4 text-teal-500" />
            Your Referrals
          </h3>

          {userData.referralList.length ? (
            <div className="max-h-60 overflow-y-auto">
                <ul className="text-xs">
                {userData.referralList.map((r, i) => (
                    <li key={i} className="flex justify-between py-2 border-b last:border-0">
                    <span className="font-bold">{r.name}</span>
                    <span className="opacity-50">{r.email}</span>
                    </li>
                ))}
                </ul>
            </div>
          ) : (
            <p className="opacity-50 text-sm mt-2 italic">No referrals yet. Start sharing!</p>
          )}
        </div>
      </section>

      <footer className="mt-24 text-center text-xs opacity-50 py-12">
        © 2026 ServeQrew
      </footer>
    </div>
  );
};

export default Dashboard;