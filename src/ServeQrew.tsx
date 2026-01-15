// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, type Variants, useMotionValue, useSpring, useTransform } from 'framer-motion';
import logo from './assets/logo.jpeg'; 
import primegadgets from './assets/primegadgets.jpeg';
import cryptoqrew from './assets/crypto.jpeg';
import muna from './assets/muna.jpeg';
import kekachi from './assets/kekachi.jpeg';
import crochetArt from './assets/crochet.jpeg';
import chioma from './assets/chioma.jpeg'; 
import ella from './assets/ella.jpeg'; 
import nuel from './assets/nuel.jpeg'; 
import jessica from './assets/jessica.jpeg'; 
import alex from './assets/alex.jpeg'; 
import tessy from './assets/tessy.jpeg';


import { 
  Sun, 
  Moon, 
  ExternalLink, 
  ShieldCheck, 
  UserCheck, 
  ChevronDown,
  Sparkles,
  Trophy, 
} from 'lucide-react';

// --- SUB-COMPONENT: 3D TILT CARD ---
const TiltCard = ({ children, color, isDark }: { children: React.ReactNode, color: string, isDark: boolean }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set( (e.clientX - rect.left) / rect.width - 0.5 );
    y.set( (e.clientY - rect.top) / rect.height - 0.5 );
  };

  const handleMouseLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={`relative group p-10 rounded-[50px] border backdrop-blur-sm overflow-hidden transition-all duration-500 
        ${isDark ? 'bg-white/[0.02] border-white/10 hover:border-teal-400' : 'bg-black/[0.02] border-black/10 hover:border-teal-600'}`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${color} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
      <div style={{ transform: "translateZ(50px)" }} className="relative z-10">{children}</div>
    </motion.div>
  );
};

const STATIC_PARTICLES = [...Array(20)].map((_, i) => ({
  id: i,
  left: `${(i * 5)}%`, 
  duration: 4 + (i % 4), 
  delay: i * 0.1
}));

// ADDED PROPS INTERFACE
interface ServeQrewProps {
  onNavigate: (code: string) => void;
}

const ServeQrew: React.FC<ServeQrewProps> = ({ onNavigate }) => {
  const [isDark, setIsDark] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [waitlistStatus, setWaitlistStatus] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const [expandedBrand, setExpandedBrand] = useState<number | null>(null);
  const [expandedAmbassador, setExpandedAmbassador] = useState<number | null>(null); 
      
  const [leaderboard, setLeaderboard] = useState<{name: string, referrals: number}[]>([]);

  const waitlistRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  const fetchLeaderboard = async () => {
  try {
    const res = await fetch('https://mnqypkgrbqhkzwptmaug.supabase.co/functions/v1/smooth-worker/leaderboard', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // This references your .env and Vercel settings
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
      }
    });
    
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    
    const data = await res.json();
    setLeaderboard(data.topReferrers || []);
  } catch (err) {
    console.error("Leaderboard fetch error:", err);
  }
};
    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 30000);
    return () => clearInterval(interval);
  }, []);
const joinWaitlist = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setWaitlistStatus(null);

    const form = e.currentTarget;
    const full_name = (form.elements.namedItem('full_name') as HTMLInputElement).value.trim();
    const email = (form.elements.namedItem('email') as HTMLInputElement).value.trim();
    const brand_name = (form.elements.namedItem('brand_name') as HTMLInputElement)?.value.trim();
    
   try {
      const res = await fetch('https://mnqypkgrbqhkzwptmaug.supabase.co/functions/v1/smooth-worker/join', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ full_name, email, brand_name })
      });

      const data = await res.json();

      if (res.ok) {
        setWaitlistStatus({ type: 'success', message: 'Welcome to the Qrew!' });
        // If your backend returns a referral code, navigate to dashboard
        if (data.referralCode) {
          onNavigate(data.referralCode);
        }
      } else {
        setWaitlistStatus({ type: 'error', message: data.error || 'Something went wrong' });
      }
 } catch (err) {
  console.error("Join error:", err);
  setWaitlistStatus({ type: 'error', message: 'Failed to connect to server' });
}
  };
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const scrollToWaitlist = () => {
    waitlistRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const blink: Variants = {
    initial: { opacity: 0.3, y: 0, filter: "blur(2px)" },
    animate: (i: number = 0) => ({
      opacity: [0.3, 1, 0.3],
      filter: ["blur(2px)", "blur(0px)", "blur(2px)"],
      transition: { delay: Number(i) * 0.8, duration: 3, repeat: Infinity, ease: "easeInOut" }
    })
  };

  const faqs = [
    { q: "What exactly is ServeQrew?", a: "Think of it as a digital market. It’s where you go when you need a laundry guy, an online fragrance store, a web developer, or even a used textbook, basically any goods or service that you can think off." },
    { q: "Do I have to be a student to use it?", a: "Our heart is in UNN for now as we have to start somewhere so students are our priority. However, anyone in Nigeria (lecturers, business owners, etc.) can buy or sell services! UNN is the starting point!" },
    { q: "How do I get paid for my services?", a: "You search for a provider, chat with them directly on the app, and agree on terms. We are building secure ways to ensure everyone gets what they paid for and also maximum security of vital information." },
    { q: "Is my data safe?", a: "100%. We use modern security to keep your chats private. Plus, we verify users to keep the scammers out." },
    { q: "Why should I join the waitlist?", a: "Waitlist members get the ServeQrew badge, early access to the best deals especially from our collaborators, and a chance to use our premium features for free when we go live." }
  ];

  const collaborators = [
    { name: 'Prime Gadgets', img: primegadgets, desc: 'Premier hardware devices.' },
    { name: 'Crypto Qrew', img: cryptoqrew, desc: 'Digital asset management.' },
    { name: 'Jessica', img: jessica, desc: 'Elite Visual Brand Identity.' },
    { name: 'Alex', img: alex, desc: 'Strategic Brand Consultancy.' },
    { name: 'Muna Style', img: muna, desc: 'Bespoke apparel design.' },
    { name: 'Crochet Art', img: crochetArt, desc: 'Luxury Handcrafted Art.' },
    { name: 'Shadow Enterprise', img: kekachi, desc: 'Your Online Gadget Store.' },
    { name: 'Essence Haven', img: chioma, desc: 'Premium fragrances.' },
    { name: "Tessy's Kitchen", img: tessy, desc: 'Fresh pastries, cakes, and homemade treats.' }
  ];

  const ambassadors = [
    { name: "Ekobosowo Ella", role: "Strategic Lead", img: ella, bio: "Ella is one of the most recognized faces on campus. She helps represent ServeQrew, spread the word, and connect us with the student community.", color: "from-teal-500/20" },
    { name: "Nu3l", role: "Growth Architect", img: nuel, bio: "Nu3l is an upcoming artist who brings creativity and culture into the ServeQrew brand. He helps push the vibe, visuals, and creative direction of the platform.", color: "from-lime-500/20" }
  ];

  return (
    <div className={`${isDark ? 'dark bg-[#08080A] text-white' : 'bg-[#FDFDFD] text-[#08080A]'} min-h-screen transition-colors duration-1000 overflow-x-hidden lg:cursor-none font-sans`}>
      
      {/* Custom Cursor */}
      <motion.div className="fixed top-0 left-0 w-8 h-8 rounded-full border border-teal-400 pointer-events-none z-[9999] hidden lg:block" animate={{ x: mousePos.x - 16, y: mousePos.y - 16 }} transition={{ type: 'spring', damping: 25, stiffness: 250, mass: 0.5 }} />

      {/* Background Particles */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-30">
        {STATIC_PARTICLES.map((p) => (
          <motion.div
            key={p.id}
            className={`absolute w-px h-20 ${isDark ? 'bg-gradient-to-b from-teal-500/0 via-teal-500/50 to-teal-500/0' : 'bg-gradient-to-b from-teal-600/0 via-teal-600/30 to-teal-600/0'}`}
            initial={{ top: -100, left: p.left }}
            animate={{ top: '120%' }}
            transition={{ duration: p.duration, repeat: Infinity, ease: "linear", delay: p.delay }}
          />
        ))}
      </div>

      <nav className={`fixed top-0 w-full z-50 px-4 sm:px-8 py-3 sm:py-5 backdrop-blur-2xl border-b flex justify-between items-center ${isDark ? 'border-white/10' : 'border-black/10'}`}>
  <div className="flex items-center gap-3 sm:gap-5">
    {/* Logo Container: Scaled down on mobile (w-12 h-12) and original on desktop (sm:w-16 sm:h-16) */}
    <div className="relative w-12 h-12 sm:w-16 sm:h-16 p-[2px] rounded-xl sm:rounded-2xl bg-white/10 overflow-hidden">
      <motion.div 
        animate={{ rotate: 360 }} 
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }} 
        className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,transparent_0%,transparent_70%,#14b8a6_100%)]" 
      />
      <div className="relative w-full h-full rounded-[10px] sm:rounded-[14px] bg-black p-1 flex items-center justify-center z-10">
        <img src={logo} alt="ServeQrew" className="w-full h-full object-contain" />
      </div>
    </div>

    {/* Text Section: Hidden on very small screens, appears at 'sm' breakpoint (640px+) */}
    <div className={`hidden sm:flex flex-col border-l pl-5 ${isDark ? 'border-white/10' : 'border-black/10'}`}>
      <h1 className="text-2xl font-black uppercase italic leading-none tracking-tighter">ServeQrew</h1>
      <div className="flex items-center gap-3 mt-1">
        <ShieldCheck className="w-3 h-3 text-teal-500" />
        <span className={`text-[8px] font-mono uppercase tracking-widest ${isDark ? 'text-white/30' : 'text-black/30'}`}>
          LOC: {mousePos.x}, {mousePos.y}
        </span>
      </div>
    </div>
  </div>

  <div className="flex items-center gap-2 sm:gap-4">
    {/* Join Button: Stays hidden on mobile, appears on md (768px+) */}
    <button 
      onClick={scrollToWaitlist}
      className={`hidden md:block px-6 py-2 rounded-xl text-xs font-black uppercase italic tracking-widest border transition-all ${isDark ? 'border-white/10 hover:border-teal-400 bg-white/5' : 'border-black/10 hover:border-teal-600 bg-black/5'}`}
    >
      Join The Waitlist
    </button>
    
    {/* Theme Toggle: Slightly smaller on mobile (p-2) to save space */}
    <button 
      onClick={() => setIsDark(!isDark)} 
      className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl border transition-all ${isDark ? 'bg-white/5 border-white/10 hover:border-lime-400' : 'bg-black/5 border-black/10 hover:border-teal-600'}`}
    >
      {isDark ? <Sun className="text-lime-400 w-5 h-5 sm:w-6 sm:h-6" /> : <Moon className="text-teal-600 w-5 h-5 sm:w-6 sm:h-6" />}
    </button>
  </div>
</nav>
{/* --- HERO SECTION --- */}
      {/* Reduced pt-52 to pt-32 on small mobile (sm:pt-52) so users see content faster */}
      <section className="relative z-10 pt-32 sm:pt-52 pb-40 px-4 sm:px-6 text-center">
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-8">
          {["Connect", "Chat", "Grow"].map((word, i) => (
            <motion.h1 
              key={word} 
              custom={i} 
              variants={blink} 
              initial="initial" 
              animate="animate" 
              /* text-4xl for 320px screens, scaling up to 6xl on tablets, and 9xl on desktop */
              className={`text-4xl sm:text-6xl md:text-9xl font-black tracking-tighter uppercase italic drop-shadow-2xl ${isDark ? 'text-white' : 'text-slate-900'}`}
            >
              {word}<span className="text-lime-400">.</span>
            </motion.h1>
          ))}
        </div>
        {/* Adjusted text-lg for mobile so it stays on fewer lines */}
        <p className={`text-lg sm:text-xl font-bold italic uppercase tracking-widest opacity-50 ${isDark ? 'text-white' : 'text-black'}`}>
          The Service Exchange for the Bold.
        </p>
      </section>


      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-32">
        <h2 className={`text-3xl sm:text-5xl font-black uppercase italic tracking-tighter text-center mb-10 sm:mb-20 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Founding Ambassadors
        </h2>
        
        <div className="grid grid-cols-2 gap-3 sm:gap-12">
          {ambassadors.map((p, idx) => (
            <TiltCard key={p.name} color={p.color} isDark={isDark}>
              <div className="flex flex-col items-center p-2 sm:p-0">
                <div className={`w-full aspect-[4/5] rounded-[20px] sm:rounded-[40px] border mb-4 sm:mb-8 flex items-center justify-center relative overflow-hidden ${isDark ? 'bg-black/40 border-white/5' : 'bg-white/40 border-black/5'}`}>
                   {p.img ? (
                     <img src={p.img} alt={p.name} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                   ) : (
                     <span className={`font-black text-2xl sm:text-6xl italic uppercase opacity-10 rotate-12 ${isDark ? 'text-white' : 'text-black'}`}>ServeQrew</span>
                   )}
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-3 mb-1 sm:mb-2 text-center">
                  <UserCheck className="w-4 h-4 sm:w-6 sm:h-6 text-lime-400 flex-shrink-0" />
                  <h3 className={`text-lg sm:text-4xl font-black uppercase italic tracking-tighter leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {p.name}
                  </h3>
                </div>

                <span className="text-teal-400 font-black text-[7px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.4em] mb-2 sm:mb-4 text-center">
                  {p.role}
                </span>

                {/* Desktop: Full bio always visible */}
                <p className={`hidden sm:block text-center max-w-sm text-sm italic ${isDark ? 'text-white opacity-50' : 'text-slate-600'}`}>
                  "{p.bio}"
                </p>

                {/* Mobile: Show first part of bio with line clamp */}
                <p className={`sm:hidden text-center max-w-sm text-[10px] italic line-clamp-2 ${isDark ? 'text-white opacity-50' : 'text-slate-600'}`}>
                  "{p.bio}"
                </p>

                {/* Mobile: Read More button */}
                <button
                  onClick={() => setExpandedAmbassador(expandedAmbassador === idx ? null : idx)}
                  className={`sm:hidden text-[7px] font-black uppercase mt-2 px-2 py-0.5 rounded transition-colors ${
                    expandedAmbassador === idx
                      ? `${isDark ? 'bg-teal-500/30 text-teal-300' : 'bg-teal-600/20 text-teal-600'}`
                      : `${isDark ? 'text-teal-400/60 hover:text-teal-400' : 'text-teal-600/60 hover:text-teal-600'}`
                  }`}
                >
                  {expandedAmbassador === idx ? 'Read Less' : 'Read More'}
                </button>

                {/* Mobile: Expandable full bio */}
                <AnimatePresence>
                  {expandedAmbassador === idx && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="sm:hidden w-full mt-2 pt-2 border-t border-white/10"
                    >
                      <p className={`text-center text-[9px] italic leading-tight
                        ${isDark ? 'text-white opacity-70' : 'text-slate-700'}`}>
                        "{p.bio}"
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </TiltCard>
          ))}
        </div>
      </section>

   {/* --- MOST TRUSTED BRANDS --- */}
      {/* Adjusted py-32 to py-16 on mobile (sm:py-32) */}
     
      <section className={`relative z-10 py-16 sm:py-32 border-y transition-colors duration-1000 ${isDark ? 'bg-black/20 border-white/5' : 'bg-slate-50 border-black/5'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className={`text-3xl sm:text-5xl md:text-6xl font-black uppercase italic tracking-tighter mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Our Most <span className="text-teal-500">Trusted</span> Brands
            </h2>
            <p className={`text-[8px] sm:text-[10px] font-mono tracking-[0.3em] sm:tracking-[0.5em] uppercase mb-10 sm:mb-20 ${isDark ? 'text-white/30' : 'text-black/30'}`}>
              The Elite Partnership Network
            </p>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              visible: { transition: { staggerChildren: 0.1 } }
            }}
            className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-8"
          >
            {collaborators.map((collab, i) => (
              <motion.div 
                key={i} 
                variants={{
                  hidden: { opacity: 0, scale: 0.9, y: 20 },
                  visible: { opacity: 1, scale: 1, y: 0 }
                }}
                whileHover={{ y: -10 }} 
                className="group relative"
              >
                <div className="absolute inset-0 bg-teal-500/10 blur-[30px] sm:blur-[60px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                <div className={`relative h-full p-3 sm:p-8 rounded-2xl sm:rounded-[40px] border backdrop-blur-md overflow-hidden transition-all duration-500 flex flex-col items-center justify-center
                  ${isDark 
                    ? 'bg-white/[0.03] border-white/10 group-hover:border-teal-400/50 group-hover:bg-white/[0.05]' 
                    : 'bg-black/[0.02] border-black/5 group-hover:border-teal-600/50 group-hover:bg-black/[0.04]'}`}
                >
                  <div className="absolute top-0 right-0 w-12 h-12 sm:w-24 sm:h-24 bg-gradient-to-bl from-teal-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="relative w-12 h-12 sm:w-24 sm:h-24 mx-auto mb-3 sm:mb-6">
                    <div className={`absolute inset-0 rounded-xl sm:rounded-3xl animate-pulse blur-[2px] sm:blur-sm ${isDark ? 'bg-teal-400/20' : 'bg-teal-600/10'}`} />
                    <div className={`relative w-full h-full rounded-xl sm:rounded-3xl border p-0.5 sm:p-1 overflow-hidden transition-transform duration-500 group-hover:scale-110
                      ${isDark ? 'border-white/10 bg-black' : 'border-black/10 bg-white'}`}>
                      <img src={collab.img} alt={collab.name} className="w-full h-full object-cover rounded-lg sm:rounded-[20px]" />
                    </div>
                  </div>

                  <h3 className={`text-[10px] sm:text-xl font-black uppercase italic tracking-tighter transition-colors text-center ${collab.desc ? 'mb-1' : 'mb-0'}
                    ${isDark ? 'text-white group-hover:text-teal-400' : 'text-slate-900 group-hover:text-teal-600'}`}>
                    {collab.name}
                  </h3>

                  {/* Desktop: Always visible description */}
                  {collab.desc && (
                    <p className={`hidden sm:block text-[10px] font-bold leading-relaxed italic text-center transition-opacity duration-500
                      ${isDark ? 'text-white/40 group-hover:text-white/70' : 'text-slate-500 group-hover:text-slate-700'}`}>
                      {collab.desc}
                    </p>
                  )}

                  {/* Mobile: Read More button */}
                  {collab.desc && (
                    <button
                      onClick={() => setExpandedBrand(expandedBrand === i ? null : i)}
                      className={`sm:hidden text-[7px] font-black uppercase mt-1 px-1.5 py-0.5 rounded transition-colors ${
                        expandedBrand === i
                          ? `${isDark ? 'bg-teal-500/30 text-teal-300' : 'bg-teal-600/20 text-teal-600'}`
                          : `${isDark ? 'text-teal-400/60 hover:text-teal-400' : 'text-teal-600/60 hover:text-teal-600'}`
                      }`}
                    >
                      {expandedBrand === i ? 'Hide' : 'More'}
                    </button>
                  )}

                  {/* Mobile: Expandable description */}
                  <AnimatePresence>
                    {expandedBrand === i && collab.desc && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="sm:hidden w-full mt-2 pt-2 border-t border-white/10"
                      >
                        <p className={`text-[8px] font-bold leading-tight italic text-center
                          ${isDark ? 'text-white/60' : 'text-slate-600'}`}>
                          {collab.desc}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="mt-3 sm:mt-6 flex justify-center">
                    <div className={`h-[1px] sm:h-[2px] w-4 sm:w-8 rounded-full transition-all duration-500 group-hover:w-16 
                      ${isDark ? 'bg-teal-400/30 group-hover:bg-teal-400' : 'bg-teal-600/20 group-hover:bg-teal-600'}`} />
                  </div>

                  <ExternalLink className={`absolute top-3 right-3 w-3 h-3 sm:w-4 sm:h-4 transition-all duration-500 
                    ${isDark ? 'text-white/10 group-hover:text-teal-400' : 'text-black/10 group-hover:text-teal-600'}`} />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
{/* --- TOP 10 LEADERBOARD --- */}
<section className="relative z-20 py-20 md:py-32 max-w-6xl mx-auto px-4 md:px-6">
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="text-center mb-14 md:mb-20"
  >
    <h2
      className={`text-3xl md:text-6xl font-black uppercase italic tracking-tighter mb-4 md:mb-6 flex items-center justify-center gap-2 md:gap-4 ${
        isDark ? 'text-white' : 'text-slate-900'
      }`}
    >
      <Trophy className="w-8 h-8 md:w-12 md:h-12 text-lime-500" />
      Live <span className="text-lime-500">Leaderboard</span>
    </h2>

    <p
      className={`text-xs md:text-lg font-mono uppercase tracking-widest opacity-60 ${
        isDark ? 'text-white' : 'text-black'
      }`}
    >
      Top 10 Most Active Referrers • Updates Live
    </p>
  </motion.div>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
    {leaderboard.length > 0 ? (
      leaderboard.map((user, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          className={`relative p-4 md:p-6 rounded-3xl border flex items-center justify-between overflow-hidden ${
            isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'
          }`}
        >
          {/* EARLY BIRD BADGE */}
          {leaderboard.length < 3 && (
            <div className="absolute top-0 right-0 bg-lime-400 text-black text-[7px] font-black uppercase px-2 py-1 rounded-bl-lg tracking-tighter animate-pulse">
              Early Bird
            </div>
          )}

          <div className="flex items-center gap-3 md:gap-4">
            <span className="text-lg md:text-2xl font-black italic text-teal-500">
              #{index + 1}
            </span>

            <div className="flex flex-col">
              <span
                className={`font-black uppercase italic text-xs md:text-sm ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                {user.name}
              </span>

              <span className="text-[9px] md:text-[10px] text-lime-500 font-mono uppercase tracking-widest">
                Verified Qrew
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="block text-lg md:text-xl font-black italic">
              {user.referrals}
            </span>
            <span className="text-[7px] md:text-[8px] uppercase tracking-widest opacity-50">
              Refers
            </span>
          </div>
        </motion.div>
      ))
    ) : (
      <div className="col-span-full py-10 text-center">
       <p 
      className={`opacity-50 italic mb-4 text-sm ${
        isDark ? 'text-white' : 'text-slate-900'
      }`}
    >
      The ranks are currently empty...
    </p>
        <p className="text-lime-400 font-black uppercase text-xs md:text-sm animate-bounce tracking-widest">
          Be the first to join the legend!
        </p>
      </div>
    )}
  </div>
</section>

{/* WAITLIST SECTION */}
<section
  ref={waitlistRef}
  id="waitlist-form"
  className="relative z-10 py-20 md:py-32 px-4 md:px-6 scroll-mt-32"
>
  <div className="text-center mb-10 md:mb-12">
    <h2
      className={`text-3xl md:text-5xl font-black uppercase italic tracking-tighter mb-3 md:mb-4 ${
        isDark ? 'text-white' : 'text-slate-900'
      }`}
    >
      Join The Waitlist
    </h2>

    <p
      className={`text-xs md:text-sm italic max-w-xs md:max-w-md mx-auto opacity-60 ${
        isDark ? 'text-white' : 'text-black'
      }`}
    >
      Secure your position in the network before we launch and trust me you
      don't want to miss.
    </p>
  </div>

  <div className="w-full max-w-md md:max-w-2xl mx-auto">
    <motion.div
      className={`relative p-4 md:p-6 border rounded-[28px] md:rounded-[40px] backdrop-blur-2xl shadow-2xl overflow-hidden transition-all duration-500 ${
        isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'
      }`}
    >
      <form className="flex flex-col gap-3 md:gap-4" onSubmit={joinWaitlist}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <input
            name="full_name"
            type="text"
            placeholder="Full Name"
            className="bg-transparent px-4 md:px-6 py-3 md:py-4 border rounded-xl md:rounded-2xl outline-none font-bold transition-all text-sm md:text-base"
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email Address"
            className="bg-transparent px-4 md:px-6 py-3 md:py-4 border rounded-xl md:rounded-2xl outline-none font-bold transition-all text-sm md:text-base"
            required
          />
        </div>

        <input
          name="brand_name"
          type="text"
          placeholder="Brand Name (Optional)"
          className="bg-transparent px-4 md:px-6 py-3 md:py-4 border rounded-xl md:rounded-2xl outline-none font-bold transition-all text-sm md:text-base"
        />

        {waitlistStatus && (
          <p
            className={`text-xs md:text-sm mt-2 text-center ${
              waitlistStatus.type === 'success'
                ? 'text-lime-400'
                : 'text-red-400'
            }`}
          >
            {waitlistStatus.message}
          </p>
        )}

        <button
          type="submit"
          className="w-full py-4 md:py-5 rounded-xl md:rounded-2xl font-black uppercase italic tracking-tighter bg-[#84CC16] text-black hover:bg-lime-400 transition-all flex items-center justify-center gap-2 md:gap-3 text-sm md:text-base"
        >
          <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
          Join The Waitlist
        </button>
      </form>
    </motion.div>
  </div>
</section>
{/* --- FAQ SECTION --- */}
<section className="relative z-10 py-20 md:py-32 max-w-4xl mx-auto px-4 md:px-6">
  <div className="text-center mb-12 md:mb-16">
    <h2
      className={`text-2xl md:text-4xl font-black uppercase italic tracking-tighter ${
        isDark ? 'text-white' : 'text-slate-900'
      }`}
    >
      Information Protocol
    </h2>

    <p className="text-teal-500 text-[9px] md:text-[10px] uppercase font-mono tracking-[0.25em] md:tracking-[0.3em] mt-2">
      Frequently Asked Questions
    </p>
  </div>

  <div className="space-y-3 md:space-y-4">
    {faqs.map((faq, i) => (
      <div
        key={i}
        className={`border rounded-2xl md:rounded-3xl overflow-hidden backdrop-blur-sm transition-all duration-500 ${
          isDark
            ? 'border-white/10 bg-white/[0.02]'
            : 'border-black/10 bg-black/[0.02]'
        }`}
      >
        <button
          onClick={() => setActiveFaq(activeFaq === i ? null : i)}
          className="w-full px-4 md:px-8 py-4 md:py-6 flex items-center justify-between text-left hover:bg-teal-500/5 transition-colors gap-3"
        >
          <span
            className={`text-sm md:text-lg font-black uppercase italic tracking-tighter ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            {faq.q}
          </span>

          <motion.div
            animate={{ rotate: activeFaq === i ? 180 : 0 }}
            className="text-teal-500 flex-shrink-0"
          >
            <ChevronDown className="w-4 h-4 md:w-6 md:h-6" />
          </motion.div>
        </button>

        <AnimatePresence>
          {activeFaq === i && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div
                className={`px-4 md:px-8 pb-4 md:pb-6 text-xs md:text-sm italic leading-relaxed border-t pt-3 md:pt-4 ${
                  isDark
                    ? 'border-white/5 text-white/50'
                    : 'border-black/5 text-slate-600'
                }`}
              >
                {faq.a}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    ))}
  </div>
</section>
{/* --- FOOTER --- */}
<footer
  className={`relative py-16 md:py-24 border-t overflow-hidden transition-colors duration-1000 ${
    isDark ? 'border-white/5 bg-black' : 'border-black/5 bg-slate-50'
  }`}
>
  <div
    className={`absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px ${
      isDark
        ? 'bg-gradient-to-r from-transparent via-teal-500/50 to-transparent'
        : 'bg-gradient-to-r from-transparent via-teal-600/30 to-transparent'
    }`}
  />

  <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col items-center">
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex flex-col items-center gap-6 md:gap-8"
    >
      <div
        className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl border p-1 opacity-50 grayscale transition-all duration-700 ${
          isDark ? 'border-white/10 bg-white/5' : 'border-black/10 bg-black/5'
        }`}
      >
        <img src={logo} alt="SD" className="w-full h-full object-contain" />
      </div>

      <div className="text-center space-y-1 md:space-y-2">
        <h4
          className={`text-[9px] md:text-xs font-mono tracking-[0.35em] md:tracking-[0.4em] uppercase font-black transition-colors ${
            isDark
              ? 'text-white/40 hover:text-teal-400'
              : 'text-black/40 hover:text-teal-600'
          }`}
        >
          © 2026 <span className={isDark ? 'text-white' : 'text-black'}>ServeQrew</span>.
          <span className="hidden md:inline">
            {' '}
            The future of professional services.
          </span>
        </h4>

        <p
          className={`md:hidden text-[8px] font-mono tracking-[0.2em] uppercase opacity-40 ${
            isDark ? 'text-white' : 'text-black'
          }`}
        >
          The future of professional services.
        </p>
      </div>

      <div className="flex items-center gap-3 md:gap-4 opacity-20">
        <div className={`h-[1px] w-10 md:w-12 ${isDark ? 'bg-white' : 'bg-black'}`} />
        <div className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
        <div className={`h-[1px] w-10 md:w-12 ${isDark ? 'bg-white' : 'bg-black'}`} />
      </div>

      <p
        className={`text-[7px] md:text-[8px] font-mono tracking-[1.2em] md:tracking-[1.5em] uppercase pointer-events-none ${
          isDark ? 'text-teal-400/20' : 'text-teal-600/40'
        }`}
      >
        End Stream
      </p>
    </motion.div>
  </div>

  <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 w-3 h-3 border-l border-b border-teal-500/20 hidden md:block" />
  <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 w-3 h-3 border-r border-b border-teal-500/20 hidden md:block" />
</footer>
{/* --- FLOATING CONTACT STRIP --- */}
<motion.div
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 1, duration: 0.6 }}
  className="fixed z-[60] bottom-2 md:bottom-4 inset-x-0 md:inset-x-auto md:right-6 flex justify-center md:justify-end pointer-events-auto px-2 md:px-0"
>
  <div
    className={`flex flex-col md:flex-row items-center gap-2 md:gap-3 px-2.5 py-2.5 md:px-4 md:py-3 rounded-2xl border backdrop-blur-xl shadow-2xl w-full max-w-[310px] md:max-w-none
    ${isDark ? 'bg-black/80 border-teal-500/40' : 'bg-white/95 border-teal-600/40'}`}
  >
    {/* LABEL - Scaled down for 320px */}
    <div className="flex flex-col items-center md:items-start">
      <span className="text-[7px] md:text-[9px] font-mono uppercase tracking-[0.15em] md:tracking-[0.2em] text-teal-500 font-bold leading-none mb-1 md:mb-0">
        Chat or Call the Qrew
      </span>
    </div>

    <div className="flex flex-col xs:flex-row flex-wrap justify-center gap-1.5 md:gap-2 items-center w-full md:w-auto">
      {/* CONTACT ONE: SPLIT BUTTON */}
      <div className="flex items-center overflow-hidden rounded-lg md:rounded-xl shadow-sm border border-black/5 w-full xs:w-auto">
        <a
          href="https://wa.me/2349112536022?text=Hello%20ServeQrew%2C%20I%20need%20assistance."
          target="_blank"
          rel="noopener noreferrer"
          className="bg-lime-400 hover:bg-lime-300 text-black text-[9px] md:text-xs font-black uppercase italic px-2.5 py-2 border-r border-black/10 transition-colors flex-1 text-center"
        >
          Chat
        </a>
        <a
          href="tel:09112536022"
          className="bg-lime-400 hover:bg-lime-300 text-black text-[9px] md:text-xs font-black uppercase italic px-2.5 py-2 transition-colors flex-[2] text-center"
        >
          0911 253 6022
        </a>
      </div>

      {/* CONTACT TWO: SPLIT BUTTON */}
      <div className="flex items-center overflow-hidden rounded-lg md:rounded-xl shadow-sm border border-teal-500/20 w-full xs:w-auto">
        <a
          href="https://wa.me/2347084515746?text=Hello%20ServeQrew%2C%20I%20have%20a%20question."
          target="_blank"
          rel="noopener noreferrer"
          className={`text-[9px] md:text-xs font-black uppercase italic px-2.5 py-2 border-r transition-colors flex-1 text-center ${
            isDark 
              ? 'bg-teal-500/10 text-teal-400 border-teal-500/20 hover:bg-teal-500/20' 
              : 'bg-teal-600/5 text-teal-700 border-teal-600/20 hover:bg-teal-600/10'
          }`}
        >
          Chat
        </a>
        <a
          href="tel:07084515746"
          className={`text-[9px] md:text-xs font-black uppercase italic px-2.5 py-2 transition-colors flex-[2] text-center ${
            isDark 
              ? 'bg-teal-500/10 text-teal-400 hover:bg-teal-500/20' 
              : 'bg-teal-600/5 text-teal-700 hover:bg-teal-600/10'
          }`}
        >
          0708 451 5746
        </a>
      </div>
    </div>
  </div>
</motion.div>
</div>
  );
}
export default ServeQrew;