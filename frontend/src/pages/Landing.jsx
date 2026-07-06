import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Search, 
  Mic, 
  Sparkles, 
  Star, 
  ChevronRight, 
  ChevronDown, 
  CheckCircle2, 
  User, 
  ArrowRight, 
  Database, 
  MapPin, 
  Timer, 
  Send,
  Lock,
  Globe2,
  FileCheck2
} from "lucide-react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import SchemeCard from "../components/SchemeCard";
import { LoadingState, ErrorState } from "../components/StatusStates";
import { CATEGORY_ICONS } from "../data/categoryIcons";
import { useSchemeContext } from "../context/SchemeContext";
import { getSchemes } from "../api";
import Logo from "../components/Logo";

const TESTIMONIALS = [
  { name: "Meera J.", role: "Farmer, Nashik", text: "I found out I was owed three PM-KISAN instalments I never knew existed. Took ten minutes." },
  { name: "Arjun P.", role: "Engineering student, Lucknow", text: "The assistant matched me to a scholarship my college never mentioned." },
  { name: "Fatima R.", role: "Small business owner, Hyderabad", text: "Stand-Up India felt out of reach until YojanaSetu laid out exactly what the bank would ask for." },
];

const FAQS = [
  { q: "Is YojanaSetu a government website?", a: "YojanaSetu is an independent public-service platform that aggregates official scheme data and links directly to official government portals for submissions." },
  { q: "Do I need to pay to check eligibility?", a: "No. Checking eligibility, comparing schemes, and receiving conversational guidance is 100% free and open-source." },
  { q: "What happens to my personal data?", a: "Your profile is stored completely locally in your browser's localStorage and used solely to match you to eligible schemes. We never collect or sell your data." },
  { q: "Can I use this without reading English well?", a: "Yes! YojanaSetu supports English, Hindi, and regional translations, along with an AI voice guidance selector." },
];

// InView counter animation
function AnimatedCounter({ target, suffix = "", duration = 1.2 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const end = parseInt(target, 10);
    if (start === end) return;

    let totalMiliseconds = duration * 1000;
    let incrementTime = Math.abs(Math.floor(totalMiliseconds / end));
    if (incrementTime < 10) incrementTime = 10; // floor cap

    const timer = setInterval(() => {
      start += Math.ceil(end / (totalMiliseconds / 30));
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(start);
      }
    }, 30);

    return () => clearInterval(timer);
  }, [target, duration, isInView]);

  return <span ref={ref}>{count.toLocaleString("en-IN")}{suffix}</span>;
}

// Interactive preview simulation widget
function InteractiveShowcase() {
  const [profileStep, setProfileStep] = useState(0);
  const steps = [
    { key: "basics", icon: "🎓", label: "Profile Details", val: "22yo Female Student from UP" },
    { key: "income", icon: "💰", label: "Income & Caste", val: "Family income < ₹2.5L • OBC" },
    { key: "match", icon: "✨", label: "Matched Benefit", val: "NSP Scholarship Matched (95% fit)" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProfileStep((s) => (s + 1) % steps.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-3xl border border-line bg-white p-6 shadow-xl relative overflow-hidden select-none">
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-xl pointer-events-none" />
      <div className="flex items-center justify-between border-b border-line/60 pb-3.5 mb-4">
        <span className="text-xs font-black text-ink flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-success animate-pulse" />
          YojanaSetu Matcher Demo
        </span>
        <span className="text-[10px] font-extrabold text-slate-400 bg-slate-100 rounded-full px-2.5 py-1">Live Engine</span>
      </div>

      <div className="space-y-3.5">
        {steps.map((st, i) => {
          const isActive = profileStep === i;
          return (
            <motion.div
              key={st.key}
              animate={{
                scale: isActive ? 1.02 : 1,
                opacity: profileStep >= i ? 1 : 0.4
              }}
              transition={{ type: "spring", stiffness: 350, damping: 22 }}
              className={`flex items-center gap-3.5 rounded-2xl border p-4 transition-all duration-300 ${
                isActive 
                  ? "border-primary bg-primaryTint/20 shadow-sm" 
                  : "border-line bg-slate-50/50"
              }`}
            >
              <span className="text-xl shrink-0">{st.icon}</span>
              <div className="flex-1">
                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">{st.label}</span>
                <p className="text-xs font-extrabold text-ink mt-0.5">{st.val}</p>
              </div>
              {isActive && (
                <span className="h-5 w-5 rounded-full bg-primary flex items-center justify-center text-white shrink-0">
                  <CheckCircle2 size={12} />
                </span>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default function Landing() {
  const navigate = useNavigate();
  const { categories } = useSchemeContext();
  const [query, setQuery] = useState("");
  const [openFaq, setOpenFaq] = useState(0);
  const [schemes, setSchemes] = useState([]);
  const [status, setStatus] = useState("loading");

  const load = () => {
    setStatus("loading");
    getSchemes()
      .then((data) => {
        setSchemes(data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  };

  useEffect(load, []);

  const goSearch = () => {
    if (query.trim()) {
      navigate(`/schemes?search=${encodeURIComponent(query)}`);
    } else {
      navigate("/schemes");
    }
  };

  // Section scroll-up animation settings
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="relative overflow-hidden bg-slate-50/20">
      {/* Decorative Grids */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-primaryTint/30 via-white to-white" />
      <div className="absolute inset-x-0 top-0 -z-10 h-[600px] w-full bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-25" />

      {/* Hero Section */}
      <section className="relative px-6 pb-20 pt-12 md:pt-20 lg:pb-24">
        {/* Glow Spheres */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-secondary/5 opacity-60 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 top-40 h-80 w-80 rounded-full bg-primary/5 opacity-40 blur-3xl" />

        <div className="mx-auto max-w-6xl grid lg:grid-cols-12 gap-12 items-center text-center lg:text-left">
          {/* Left Text and inputs area */}
          <div className="lg:col-span-7 space-y-6">
            {/* Badge */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mx-auto lg:mx-0 flex w-fit items-center gap-2 rounded-full border border-line bg-white px-4.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-primary shadow-sm"
            >
              <Sparkles size={13} className="text-secondary animate-pulse shrink-0" /> 
              <span>Now with Multilingual AI Assistance & Instant Profile Check</span>
            </motion.div>

            {/* Typography Header */}
            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl font-black leading-[1.1] tracking-tight text-ink sm:text-5xl lg:text-6xl"
            >
              Every government benefit you qualify for, <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-primary via-primary/95 to-secondary bg-clip-text text-transparent">discovered in minutes.</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mx-auto lg:mx-0 max-w-2xl text-base text-sub sm:text-lg leading-relaxed font-semibold"
            >
              Answer a few simple questions. Our intelligent, privacy-first matcher instantly shows you every eligible central and state scheme with plain-language steps to apply.
            </motion.p>

            {/* CTAs */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col justify-center lg:justify-start gap-3.5 sm:flex-row sm:items-center"
            >
              <button
                onClick={() => navigate("/onboarding")}
                className="group flex items-center justify-center gap-2 rounded-full bg-secondary hover:bg-secondary/95 text-white shadow-md shadow-secondary/15 transition-all duration-200 hover:shadow-lg hover:scale-[1.01] active:scale-95 px-8 py-4 text-sm font-extrabold"
              >
                Check Your Eligibility 
                <ArrowRight size={18} className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </button>
              <a
                href="#search"
                className="flex items-center justify-center gap-2 rounded-full border border-line bg-white hover:bg-slate-50 text-ink shadow-sm transition-all hover:shadow-md active:scale-95 px-8 py-4 text-sm font-extrabold"
              >
                Search Manually
              </a>
            </motion.div>

            {/* Search bar container */}
            <motion.div 
              id="search" 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mx-auto lg:mx-0 max-w-2xl rounded-2xl border border-line/80 bg-white p-2.5 shadow-md focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/5 transition-all duration-300"
            >
              <div className="flex items-center gap-2">
                <Search size={19} className="ml-2 shrink-0 text-sub" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && goSearch()}
                  placeholder="Try 'scholarship for engineering students in Maharashtra'"
                  className="w-full bg-transparent text-sm sm:text-base text-ink outline-none placeholder:text-slate-400 font-semibold"
                />
                <button 
                  className="rounded-full bg-slate-50 hover:bg-primaryTint/50 p-2.5 transition-colors" 
                  aria-label="Voice search"
                >
                  <Mic size={16} className="text-primary" />
                </button>
                <button 
                  onClick={goSearch} 
                  className="rounded-xl bg-primary hover:bg-primaryDark text-white px-6 py-2.5 text-sm sm:text-base font-extrabold transition-colors shadow-sm"
                >
                  Search
                </button>
              </div>
            </motion.div>

            {/* Popular Pills */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 text-xs text-sub">
              <span className="font-extrabold text-slate-400">Popular Queries:</span>
              {["PM-KISAN", "Scholarships", "Ayushman Bharat", "Mudras Loans"].map((t) => (
                <button 
                  key={t} 
                  onClick={() => { setQuery(t); navigate(`/schemes?search=${encodeURIComponent(t)}`); }} 
                  className="rounded-full border border-line bg-white px-3.5 py-1 text-xs font-bold hover:border-slate-300 hover:text-ink transition-all shadow-sm"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Right Showcase area */}
          <div className="lg:col-span-5 relative hidden lg:block">
            <InteractiveShowcase />
          </div>
        </div>

        {/* Dynamic Statistics counters grid */}
        <div className="mx-auto mt-20 grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-3">
          {[
            { target: 1200, suffix: "+", label: "Schemes Tracked", desc: "Central & state assistance programs", icon: Database },
            { target: 28, suffix: "", label: "States Covered", desc: "Unified pan-India support systems", icon: MapPin },
            { target: 90, suffix: "%", label: "Time Saved", desc: "Fast matching with clear steps", icon: Timer }
          ].map((item) => (
            <div 
              key={item.label} 
              className="group relative overflow-hidden rounded-3xl border border-line/60 bg-white/70 backdrop-blur-sm p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:bg-white hover:shadow-lg hover:shadow-slate-100/50"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primaryTint text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                  <item.icon size={22} className="transition-transform duration-300 group-hover:scale-115" />
                </div>
                <div>
                  <p className="text-3xl font-black tracking-tight text-ink">
                    <AnimatedCounter target={item.target} suffix={item.suffix} />
                  </p>
                  <p className="text-xs font-bold text-slate-400 mt-0.5">{item.label}</p>
                </div>
              </div>
              <p className="mt-4 text-xs font-semibold text-sub leading-relaxed border-t border-slate-100 pt-3">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust & Guarantee Banner */}
      <section className="bg-white border-y border-line/60 py-6 px-6">
        <div className="mx-auto max-w-6xl flex flex-wrap justify-center items-center gap-8 sm:gap-12 md:gap-20 text-xs font-bold text-sub">
          <div className="flex items-center gap-2">
            <Lock size={15} className="text-accent" />
            <span>100% Secure & Privacy-First</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe2 size={15} className="text-accent" />
            <span>No Signup Required</span>
          </div>
          <div className="flex items-center gap-2">
            <FileCheck2 size={15} className="text-accent" />
            <span>Verified Document Checklist</span>
          </div>
        </div>
      </section>

      {/* AI Assistant Preview Panel */}
      <motion.section 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="mx-auto max-w-5xl px-6 py-16"
      >
        <div className="grid gap-8 md:grid-cols-2 items-center rounded-3xl border border-line bg-gradient-to-br from-white via-white to-primaryTint/25 p-8 shadow-sm">
          <div>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primaryTint text-primary mb-4">
              <Sparkles size={20} />
            </div>
            <h2 className="text-2xl font-black tracking-tight text-ink">Meet the YojanaSetu Chatbot</h2>
            <p className="mt-4 text-sm font-semibold text-sub leading-relaxed">
              Don't feel like filling out forms? Speak or write to our assistant in your mother tongue. Tell us your situation, and watch schemes match dynamically.
            </p>
            <div className="mt-6">
              <button 
                onClick={() => navigate("/assistant")}
                className="inline-flex items-center gap-1.5 rounded-full bg-primary hover:bg-primaryDark text-white px-5.5 py-3 text-xs font-bold shadow-sm transition-all active:scale-95"
              >
                Try the AI Assistant <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Interactive Chat interface Teaser */}
          <div className="rounded-2xl border border-line bg-slate-900/95 p-4 shadow-xl text-white font-mono text-xs space-y-3.5 select-none">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-1">
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] text-slate-400 font-sans font-bold">Assistant Online</span>
              </div>
              <span className="text-[9px] text-slate-500">v2.0</span>
            </div>
            
            <div className="space-y-3">
              <div className="flex gap-2">
                <span className="text-primary font-bold">Citizen:</span>
                <span className="text-slate-300">I am a small cultivator in Pune. Are there subsidies for solar pumps?</span>
              </div>
              
              <div className="flex gap-2 border-l border-secondary pl-2 text-[11px]">
                <span className="text-secondary font-bold">YojanaSetu:</span>
                <span className="text-slate-200">
                  Yes, matching you with the <strong className="text-white">PM-KUSUM Scheme</strong>. Under Component-B, you qualify for up to 60% subsidy for installation of off-grid solar agriculture pumps.
                </span>
              </div>

              <div className="flex gap-2 items-center justify-between bg-slate-800/50 rounded-xl p-2.5">
                <span className="text-[10px] text-slate-400">Match Accuracy: 94%</span>
                <span className="text-[10px] text-emerald-400 font-sans font-bold flex items-center gap-0.5">
                  <CheckCircle2 size={10} /> Saffron Category
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Categories Grid */}
      <motion.section 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="mx-auto max-w-6xl px-6 py-16"
      >
        <div className="text-center mb-10">
          <h2 className="text-2xl font-black text-ink">Browse by Category</h2>
          <p className="mt-1.5 text-sm font-semibold text-sub">Every government assistance scheme, organized simply to match your life situations.</p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {categories.map((c) => {
            const Icon = CATEGORY_ICONS[c.key];
            return (
              <motion.button
                key={c.key}
                onClick={() => navigate(`/schemes?category=${c.key}`)}
                className="group flex flex-col items-start gap-4 rounded-3xl border border-line/60 bg-white p-5 text-left outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                whileHover={{ y: -3, scale: 1.02, boxShadow: "0 10px 20px -5px rgba(15, 23, 42, 0.04)" }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <div className="rounded-xl bg-primaryTint text-primary p-3 transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                  {Icon && <Icon size={20} />}
                </div>
                <div>
                  <p className="text-sm font-extrabold text-ink group-hover:text-primary transition-colors">{c.label}</p>
                  <p className="text-[11px] font-bold text-slate-400 mt-0.5">{c.count} schemes</p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.section>

      {/* How YojanaSetu works */}
      <section className="bg-white/60 border-y border-line/60 px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-black text-ink text-center">How YojanaSetu Works</h2>
          <p className="mt-1.5 text-sm font-semibold text-sub text-center max-w-lg mx-auto">Get matched and apply in three simple, guided steps.</p>
          
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              { t: "Tell us about you", d: "A two-minute onboarding questionnaire — age, income, location, occupation. Privacy-first, no accounts or passwords required.", icon: User },
              { t: "See your matches", d: "Every eligible scheme ranked by match fit percentage, with the primary benefits and deadline requirements spelled out plainly.", icon: Sparkles },
              { t: "Apply with confidence", d: "Plain-language application instructions, an automated document checklist, and a direct link to the official application portal.", icon: CheckCircle2 },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div 
                  key={s.t} 
                  className="group relative rounded-3xl border border-line bg-white p-6 shadow-sm hover:border-slate-300 transition-all duration-300"
                  whileHover={{ y: -3 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondaryTint text-secondary font-extrabold text-sm shadow-inner">
                      0{i + 1}
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primaryTint text-primary">
                      <Icon size={20} />
                    </div>
                  </div>
                  <h3 className="text-base font-extrabold text-ink">{s.t}</h3>
                  <p className="mt-2 text-xs sm:text-sm font-semibold text-sub leading-relaxed">{s.d}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Popular schemes */}
      <motion.section 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="mx-auto max-w-6xl px-6 py-16"
      >
        <div className="flex items-end justify-between border-b border-line/60 pb-4">
          <div>
            <h2 className="text-2xl font-black text-ink">Popular Welfare Schemes</h2>
            <p className="mt-1.5 text-sm font-semibold text-sub">Based on search queries across all states this month.</p>
          </div>
          <Link to="/schemes" className="hidden items-center gap-1.5 text-sm font-extrabold text-primary hover:text-primaryDark sm:flex transition-colors">
            See All Schemes <ChevronRight size={16} />
          </Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {status === "loading" && <LoadingState label="Loading schemes…" />}
          {status === "error" && <ErrorState onRetry={load} />}
          {status === "ready" && schemes.slice(0, 3).map((s) => <SchemeCard key={s.id} scheme={s} />)}
        </div>
      </motion.section>

      {/* Testimonials */}
      <section className="bg-slate-50 border-y border-line/60 px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-black text-ink text-center">Citizen Success Stories</h2>
          <p className="mt-1.5 text-sm font-semibold text-sub text-center max-w-lg mx-auto">Real impact across India. See how YojanaSetu connects people to eligible welfare programs.</p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="flex flex-col justify-between rounded-3xl border border-line bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300">
                <div>
                  <div className="mb-4 flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={14} fill="#F57C00" color="#F57C00" />
                    ))}
                  </div>
                  <p className="text-sm font-semibold text-ink leading-relaxed italic">"{t.text}"</p>
                </div>
                <div className="mt-6 border-t border-slate-50/50 pt-4">
                  <p className="text-sm font-extrabold text-ink">{t.name}</p>
                  <p className="text-xs font-semibold text-sub mt-0.5">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-6 py-16">
        <h2 className="text-2xl font-black text-ink text-center">Frequently Asked Questions</h2>
        <p className="mt-1.5 text-sm font-semibold text-sub text-center mb-10">Clear answers to help you navigate YojanaSetu seamlessly.</p>
        
        <div className="space-y-3.5">
          {FAQS.map((f, i) => (
            <div key={f.q} className="rounded-3xl border border-line bg-white overflow-hidden shadow-sm">
              <button 
                onClick={() => setOpenFaq(openFaq === i ? -1 : i)} 
                className="flex w-full items-center justify-between text-left px-5 py-4.5 outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                aria-expanded={openFaq === i}
              >
                <span className={`text-sm sm:text-base font-extrabold transition-colors ${openFaq === i ? "text-primary" : "text-ink"}`}>{f.q}</span>
                <ChevronDown
                  size={18}
                  className={`text-sub transition-transform duration-300 shrink-0 ${openFaq === i ? "rotate-180" : ""}`}
                />
              </button>
              
              <AnimatePresence initial={false}>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-5 pb-5 border-t border-slate-50/60 pt-3.5">
                      <p className="text-sm font-semibold text-sub leading-relaxed">{f.a}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-line/60 bg-white px-6 py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 sm:flex-row">
          <div className="max-w-sm">
            <Logo size={26} />
            <p className="mt-4 text-xs font-semibold leading-relaxed text-sub">
              YojanaSetu is India's public-service platform designed to connect citizens to the welfare benefits meant for them, eliminating legal and bureaucratic barriers.
            </p>
          </div>
          <div className="flex gap-12 text-xs font-semibold text-sub">
            <div className="flex flex-col gap-3">
              <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">Platform</span>
              <Link to="/schemes" className="hover:text-ink transition-colors">Browse Schemes</Link>
              <Link to="/assistant" className="hover:text-ink transition-colors">AI Assistant</Link>
              <Link to="/dashboard" className="hover:text-ink transition-colors">Dashboard</Link>
            </div>
            <div className="flex flex-col gap-3">
              <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">Support</span>
              <span className="text-ink">Helpline: 1800-11-XXXX</span>
              <span className="cursor-pointer hover:text-ink transition-colors">Accessibility Statement</span>
              <span className="cursor-pointer hover:text-ink transition-colors">Privacy Policy</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
