// src/Dashboard.tsx
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

  const [particles] = useState(() =>
    [...Array(15)].map(() => ({
      size: Math.random() * 12 + 6,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      delay: Math.random() * 5,
      duration: 6 + Math.random() * 4
    }))
  );

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

    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 5000);
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
        console.error('Share action encounterd an issue:', err);
      }
    } else {
      copyLink();
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <p className="font-black uppercase italic animate-pulse tracking-widest text-teal-600 px-4 text-center">
        Loading Profile...
      </p>
    </div>
  );

  return (
    <div className="min-h-screen relative bg-gradient-to-b from-white via-white to-gray-50 overflow-x-hidden text-gray-900 font-sans">
      {particles.map((p, i) => (
        <Particle key={i} {...p} />
      ))}

      {/* ---------- NAVBAR: Optimized for 320px ---------- */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md shadow-md z-50 px-3 sm:px-6 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img src={logo} alt="SQ" className="w-8 h-8 sm:w-10 sm:h-10 object-contain rounded-lg" />
          <span className="text-sm sm:text-xl font-black uppercase italic tracking-tighter">
            ServeQrew <span className="hidden xs:inline">Dashboard</span>
          </span>
        </div>
        <a href="/" className="p-2 sm:p-3 rounded-xl border border-gray-200 hover:bg-gray-100 transition">
          <Home className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
        </a>
      </nav>

      {/* ---------- HERO ---------- */}
      <section className="pt-24 pb-8 px-4 sm:px-6 flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-teal-50 to-lime-50 rounded-[2rem] border border-white shadow-xl p-6 sm:p-10 max-w-xl w-full text-center"
        >
          <h1 className="text-2xl sm:text-4xl font-black uppercase italic tracking-tight mb-2">
            Welcome{userData.name ? `, ${userData.name.split(' ')[0]}` : ""}!
          </h1>
          <p className="text-[10px] sm:text-xs opacity-60 font-mono break-all">
            {userData.email || "No email assigned"}
          </p>
        </motion.div>
      </section>

      {/* ---------- REFERRAL BOX ---------- */}
      <section className="px-4 sm:px-6 mb-8 w-full flex justify-center">
        <div className="bg-white shadow-2xl border border-gray-100 rounded-[2.5rem] p-5 sm:p-8 max-w-xl w-full">
          <h2 className="text-center text-lg sm:text-xl font-black uppercase italic mb-4">Your Link</h2>
          
          <div className="space-y-3">
            <input
              type="text"
              readOnly
              value={userData.referralLink}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-mono text-[10px] sm:text-xs"
            />
            <div className="flex gap-2">
              <button
                onClick={copyLink}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-200 transition font-bold text-xs"
              >
                <Copy className="w-4 h-4" />
                {copied ? 'Copied' : 'Copy'}
              </button>
              <button
                onClick={shareLink}
                className="flex-1 py-3 bg-teal-500 text-white rounded-2xl flex items-center justify-center gap-2 hover:bg-teal-600 transition font-bold text-xs shadow-lg shadow-teal-500/20"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
          </div>

          {/* ---------- REFERRALS LIST: Optimized for small screens ---------- */}
          <div className="mt-8 pt-6 border-t border-gray-50">
            <h3 className="text-sm font-black uppercase mb-4 flex items-center gap-2 justify-center">
               <Sparkles className="w-3 h-3 text-teal-500" /> Recent Recruits
            </h3>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
              {userData.referralList.length > 0 ? (
                userData.referralList.map((r, i) => (
                  <div key={i} className="flex justify-between items-center p-2 bg-gray-50/50 rounded-xl">
                    <span className="font-bold uppercase italic text-[9px] truncate max-w-[100px]">{r.name}</span>
                    <span className="opacity-40 text-[9px] truncate max-w-[120px] ml-2">{r.email}</span>
                  </div>
                ))
              ) : (
                <p className="text-[10px] text-center opacity-40 italic">Waiting for your first referral...</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- STATS GRID ---------- */}
      <section className="px-4 sm:px-6 mb-20 w-full flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl w-full">
          <div className="bg-white border border-gray-100 p-5 rounded-[2rem] flex flex-col items-center shadow-sm">
            <Users className="w-6 h-6 text-teal-500 mb-1" />
            <span className="text-2xl font-black">{userData.referrals}</span>
            <span className="text-[9px] uppercase font-bold text-gray-400">Referrals</span>
          </div>
          <div className="bg-white border border-gray-100 p-5 rounded-[2rem] flex flex-col items-center shadow-sm">
            <Trophy className="w-6 h-6 text-lime-500 mb-1" />
            <span className="text-2xl font-black">#{userData.rank || "-"}</span>
            <span className="text-[9px] uppercase font-bold text-gray-400">Your Rank</span>
          </div>
          <div className="bg-white border border-gray-100 p-5 rounded-[2rem] flex flex-col items-center shadow-sm sm:col-span-1">
             <span className="text-[9px] uppercase font-bold text-gray-400 mb-2">Milestone</span>
             <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <motion.div 
                  className="h-full bg-teal-500" 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(userData.referrals * 10, 100)}%` }}
                />
             </div>
          </div>
        </div>
      </section>

      <footer className="py-10 text-center text-gray-400 text-[10px] uppercase tracking-widest">
        © 2026 ServeQrew Network
      </footer>
    </div>
  );
};

export default Dashboard;