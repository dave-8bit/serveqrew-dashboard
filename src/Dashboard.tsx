// src/Dashboard.tsx
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Copy, Home, Users, Trophy, Share2, Sparkles } from 'lucide-react';
import logo from './assets/logo.jpeg';

type Referral = {
  name: string;
  email: string;
};

type UserData = {
  name: string;
  email: string;
  referralLink: string;
  referrals: number;
  rank: number;
  referralList: Referral[];
};

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

const Dashboard = ({ referralCode }: { referralCode: string }) => {
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

  // Generate particles
  const [particles] = useState(() =>
    [...Array(15)].map(() => ({
      size: Math.random() * 12 + 6,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      delay: Math.random() * 5,
      duration: 6 + Math.random() * 4
    }))
  );

  // ----------- POLLING DASHBOARD DATA WITH REFERRALS -----------
  useEffect(() => {
    let isMounted = true;

    const fetchDashboardData = async () => {
      try {
        const res = await fetch(`https://serveqrew.org/dashboard?code=${referralCode}`);
        const data = await res.json();
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
        console.error('Error fetching dashboard data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDashboardData(); // initial fetch

    const interval = setInterval(() => {
      fetchDashboardData();
    }, 5000); // poll every 5 seconds

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [referralCode]);

  const copyLink = () => {
    if (userData.referralLink) {
      navigator.clipboard.writeText(userData.referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareLink = async () => {
    if (navigator.share && userData.referralLink) {
      try {
        await navigator.share({
          title: 'Join ServeQrew',
          text: `Join me on ServeQrew and let's grow together!`,
          url: userData.referralLink,
        });
      } catch (err) {
        // Preserving 'err' as requested for your backend context
        console.error('Share action encounterd an issue:', err);
      }
    } else {
      copyLink();
    }
  };

  if (loading) return <p className="text-center mt-20 font-black uppercase italic animate-pulse tracking-widest text-teal-600">Loading your dashboard...</p>;

  return (
    <div className="min-h-screen relative bg-gradient-to-b from-white via-white to-gray-50 overflow-hidden text-gray-900 font-sans">
      {/* ---------- PARTICLES ---------- */}
      {particles.map((p, i) => (
        <Particle key={i} {...p} />
      ))}

      {/* ---------- NAVBAR ---------- */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md shadow-md z-50 px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
        <div className="flex items-center gap-2 sm:gap-3">
          <img src={logo} alt="ServeQrew" className="w-10 h-10 sm:w-12 sm:h-12 object-contain rounded-xl" />
          <span className="text-lg sm:text-xl font-black uppercase italic tracking-tight">ServeQrew Dashboard</span>
        </div>
        <a href="/" className="p-3 rounded-xl border border-gray-300 hover:bg-gray-100 transition">
          <Home className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
        </a>
      </nav>

      {/* ---------- HERO ---------- */}
      <section className="pt-28 pb-12 px-4 sm:px-6 flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: -60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="bg-gradient-to-r from-teal-100 to-lime-100 rounded-3xl shadow-2xl p-8 sm:p-12 max-w-xl w-full text-center hover:scale-105 transition-transform"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase italic tracking-tight mb-4">
            Welcome{userData.name ? `, ${userData.name.split(' ')[0]}` : ""}!
          </h1>
          <p className="text-xs sm:text-sm md:text-base opacity-80">
            Your email: <span className="font-bold">{userData.email || "-"}</span>
          </p>
        </motion.div>
      </section>

      {/* ---------- REFERRAL & REWARDS ---------- */}
      <section className="px-4 sm:px-6 flex justify-center mb-16 w-full">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="bg-white shadow-2xl border border-gray-200 rounded-3xl p-6 sm:p-10 max-w-xl w-full flex flex-col items-center gap-6 relative overflow-hidden hover:shadow-teal-400/30 hover:scale-105 transition-all"
        >
          <h2 className="text-2xl font-black uppercase italic mb-2">Your Referral Link</h2>
          <div className="flex flex-col sm:flex-row items-center gap-2 w-full">
            <input
              type="text"
              readOnly
              value={userData.referralLink}
              placeholder="Referral link will appear here"
              className="flex-1 px-3 py-3 border rounded-xl outline-none bg-gray-50 font-mono text-xs sm:text-sm w-full"
            />
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={copyLink}
                className="flex-1 sm:flex-none px-4 py-3 bg-gray-100 text-gray-700 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 transition font-bold"
              >
                <Copy className="w-4 h-4 sm:w-5 sm:h-5" />
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <button
                onClick={shareLink}
                className="flex-1 sm:flex-none px-6 py-3 bg-teal-500 text-white rounded-xl flex items-center justify-center gap-2 hover:bg-teal-600 transition font-bold shadow-lg shadow-teal-500/20"
              >
                <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                Share
              </button>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xs text-gray-600 mt-2 text-center"
          >
            Share this link with friends to climb the leaderboard and earn rewards.
          </motion.div>

          {/* ---------- LIVE REFERRALS LIST ---------- */}
          <div className="w-full mt-6 text-center">
            <h3 className="text-lg font-bold uppercase mb-2 flex items-center justify-center gap-2">
               <Sparkles className="w-4 h-4 text-teal-500" /> Your Referrals
            </h3>
            {userData.referralList.length > 0 ? (
              <ul className="text-sm flex flex-col gap-1 max-h-48 overflow-y-auto pr-2">
                {userData.referralList.map((r, i) => (
                  <li key={i} className="py-2 border-b border-gray-50 last:border-0 flex justify-between items-center">
                    <span className="font-bold uppercase italic text-[10px] sm:text-xs">{r.name}</span>
                    <span className="opacity-50 text-[10px] sm:text-xs">{r.email}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm opacity-60">You haven’t referred anyone yet.</p>
            )}
          </div>
        </motion.div>
      </section>

      {/* ---------- PROGRESS ---------- */}
      <section className="px-4 sm:px-6 flex justify-center w-full">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-white shadow-2xl border border-gray-200 rounded-3xl p-6 sm:p-10 max-w-2xl w-full grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 hover:shadow-lime-400/30 hover:scale-105 transition-all"
        >
          <div className="flex flex-col items-center justify-center gap-2">
            <Users className="w-10 h-10 text-teal-500" />
            <span className="text-3xl font-black">{userData.referrals}</span>
            <span className="text-sm uppercase tracking-wide opacity-70">Referrals</span>
          </div>
          <div className="flex flex-col items-center justify-center gap-2">
            <Trophy className="w-10 h-10 text-lime-500" />
            <span className="text-3xl font-black">#{userData.rank || "-"}</span>
            <span className="text-sm uppercase tracking-wide opacity-70">Your Rank</span>
          </div>
          <div className="flex flex-col items-center justify-center gap-2 w-full">
            <span className="text-sm uppercase tracking-wide opacity-70">Progress to Top 10</span>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden mt-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((userData.referrals / 100) * 100, 100)}%` }}
                transition={{ duration: 1.4, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-teal-400 to-lime-400"
              />
            </div>
          </div>
        </motion.div>
      </section>

      {/* ---------- FOOTER ---------- */}
      <footer className="mt-32 py-16 text-center text-gray-500 text-xs">
        © 2026 ServeQrew. All rights reserved.
      </footer>
    </div>
  );
};

export default Dashboard;