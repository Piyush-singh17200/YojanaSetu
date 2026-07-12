import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronDown, Check, AlertCircle } from "lucide-react";
import { useSchemeContext } from "../context/SchemeContext";
import { matchSchemes } from "../api";

const STEPS = [
  { key: "basics", title: "Personal Details", desc: "Age, gender, and disability status help filter targeted programs.", fields: ["age", "gender", "disability"] },
  { key: "work", title: "Education & Career", desc: "Select details to search for student scholarships and farmer supports.", fields: ["occupation", "education"] },
  { key: "household", title: "Income & Category", desc: "Financial stats determine eligibility for central economic aids.", fields: ["income", "category"] },
  { key: "location", title: "Your Location", desc: "State, district, and communications help map local benefits.", fields: ["state", "district", "language"] },
];

const FIELD_MAP = {
  age: { label: "Age", type: "number", placeholder: "Enter your age (e.g. 34)", min: 1, max: 120, help: "Used to determine school-age scholarships and senior pension programs." },
  gender: { label: "Gender", type: "select", options: ["Female", "Male", "Other / prefer not to say"], help: "Required for women-focused welfare schemes." },
  disability: { label: "Person with Disability (PwD)", type: "select", options: ["Yes", "No"], help: "Required for disability welfare and support schemes." },
  occupation: {
    label: "Occupation",
    type: "select",
    options: ["Student", "Farmer", "Salaried employee", "Self-employed / business owner", "Homemaker", "Unemployed / job seeker", "Retired"],
    help: "Filters job-seeker aids, farming subsidies, or business capital loans."
  },
  education: {
    label: "Highest Education Level",
    type: "select",
    options: ["Below 10th", "10th / 12th pass", "Undergraduate", "Postgraduate", "Doctorate", "Vocational / diploma"],
    help: "Required for pre-matric, post-matric, or higher study fellowship programs."
  },
  income: {
    label: "Annual Family Income",
    type: "select",
    options: ["Below ₹1,00,000", "₹1,00,000 – ₹2,50,000", "₹2,50,000 – ₹5,00,000", "₹5,00,000 – ₹8,00,000", "Above ₹8,00,000"],
    help: "Total gross family income before tax deductions."
  },
  category: { label: "Social Category", type: "select", options: ["General", "OBC", "SC", "ST", "EWS", "Prefer not to say"], help: "Determines eligibility for reserved social category benefits." },
  state: {
    label: "State / UT",
    type: "select",
    options: ["Uttar Pradesh", "Maharashtra", "Bihar", "West Bengal", "Tamil Nadu", "Karnataka", "Rajasthan", "Other"],
    help: "Matches state-level welfare programs."
  },
  district: { label: "District", type: "text", placeholder: "Enter your district (e.g. Varanasi)", help: "Used for municipal or local block-level grants." },
  language: {
    label: "Preferred Notification Language",
    type: "select",
    options: ["English", "Hindi", "Bengali", "Marathi", "Telugu", "Tamil", "Gujarati"],
    help: "Language choice for notification reminders and checklists."
  }
};

export default function Onboarding() {
  const navigate = useNavigate();
  const { profile, setProfile, setMatched, user } = useSchemeContext();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login?redirect=/onboarding");
    }
  }, [user, navigate]);

  const total = STEPS.length;
  const current = STEPS[step];

  // Helper validation logic
  const fieldErrors = useMemo(() => {
    const errors = {};
    if (profile.age !== undefined && profile.age !== "") {
      const numAge = parseInt(profile.age, 10);
      if (isNaN(numAge) || numAge < 1 || numAge > 120) {
        errors.age = "Please enter a valid age between 1 and 120.";
      }
    }
    if (profile.district !== undefined && profile.district !== "") {
      if (/[0-9]/.test(profile.district)) {
        errors.district = "District name should not contain numbers.";
      }
    }
    return errors;
  }, [profile]);

  const canContinue = useMemo(() => {
    const fieldsFilled = current.fields.every(
      (f) => profile[f] !== undefined && profile[f].toString().trim().length > 0
    );
    const hasErrors = current.fields.some((f) => !!fieldErrors[f]);
    return fieldsFilled && !hasErrors;
  }, [current, profile, fieldErrors]);

  const update = (k, v) => setProfile((p) => ({ ...p, [k]: v }));

  const handleNext = () => {
    if (canContinue) {
      setDirection(1);
      setStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    setDirection(-1);
    setStep((s) => s - 1);
  };

  const finish = async () => {
    setSubmitting(true);
    try {
      const ranked = await matchSchemes(profile);
      setMatched(ranked);
    } catch {
      setMatched(null);
    } finally {
      setSubmitting(false);
      navigate("/schemes");
    }
  };

  // Slide transitions configs
  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.3, ease: "easeInOut" }
    },
    exit: (dir) => ({
      x: dir > 0 ? -100 : 100,
      opacity: 0,
      transition: { duration: 0.25, ease: "easeInOut" }
    })
  };

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center px-6 py-12 select-none">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-primaryTint/35 via-white to-white" />

      <div className="w-full max-w-lg bg-white/95 backdrop-blur-md border border-line rounded-3xl p-8 shadow-xl">
        
        {/* Progress Tracker bar */}
        <div className="mb-8 flex items-center gap-2">
          {STEPS.map((s, i) => (
            <div 
              key={s.key} 
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                i <= step ? "bg-secondary" : "bg-line/70"
              }`} 
            />
          ))}
        </div>

        {/* Step Indicator Header */}
        <div className="flex items-center justify-between text-[10px] font-extrabold uppercase tracking-wider text-secondary">
          <span aria-live="polite">Step {step + 1} of {total}</span>
          <span>{current.title}</span>
        </div>

        {/* Sliding form view wrapper */}
        <div className="overflow-hidden relative mt-2 min-h-[290px]">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={current.key}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full"
            >
              <h2 className="text-2xl font-black text-ink tracking-tight mt-2 leading-normal">
                {current.title}
              </h2>
              <p className="mt-2 text-xs sm:text-sm font-semibold text-sub leading-relaxed">
                {current.desc}
              </p>

              {/* Input lists */}
              <div className="mt-6 flex flex-col gap-5">
                {current.fields.map((f) => {
                  const cfg = FIELD_MAP[f];
                  const hasErr = !!fieldErrors[f];
                  
                  return (
                    <div key={f} className="flex flex-col">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs sm:text-sm font-extrabold text-ink">{cfg.label}</label>
                        {hasErr && (
                          <span className="text-[10px] font-bold text-danger flex items-center gap-0.5">
                            <AlertCircle size={10} /> {fieldErrors[f]}
                          </span>
                        )}
                      </div>
                      
                      {cfg.type === "select" ? (
                        <div className="relative">
                          <select
                            value={profile[f] || ""}
                            onChange={(e) => update(f, e.target.value)}
                            className={`w-full appearance-none rounded-2xl border bg-white pl-4 pr-10 py-3 text-xs sm:text-sm font-bold text-ink outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all cursor-pointer shadow-sm ${
                              hasErr ? "border-danger focus:border-danger focus:ring-danger/5" : "border-line/90"
                            }`}
                          >
                            <option value="">Select {cfg.label.toLowerCase()}</option>
                            {cfg.options.map((o) => (
                              <option key={o} value={o}>{o}</option>
                            ))}
                          </select>
                          <ChevronDown size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sub pointer-events-none" />
                        </div>
                      ) : (
                        <input
                          type={cfg.type}
                          value={profile[f] || ""}
                          onChange={(e) => update(f, e.target.value)}
                          placeholder={cfg.placeholder}
                          min={cfg.min}
                          max={cfg.max}
                          className={`w-full rounded-2xl border bg-white px-4 py-3 text-xs sm:text-sm font-bold text-ink outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all shadow-sm placeholder:text-slate-400 ${
                            hasErr ? "border-danger focus:border-danger focus:ring-danger/5" : "border-line/90"
                          }`}
                        />
                      )}
                      {cfg.help && (
                        <p className="mt-1.5 text-[10px] sm:text-xs font-semibold text-sub tracking-wide">
                          💡 {cfg.help}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Wizard Controls */}
        <div className="mt-8 flex items-center gap-3 border-t border-slate-100 pt-5">
          {step > 0 && (
            <button
              onClick={handleBack}
              className="flex items-center justify-center gap-1.5 rounded-2xl border border-line/80 hover:border-slate-300 bg-white px-5 py-3 text-xs sm:text-sm font-bold text-sub shadow-sm transition-all active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              <ChevronLeft size={15} /> Back
            </button>
          )}
          <button
            disabled={!canContinue || submitting}
            onClick={() => (step === total - 1 ? finish() : handleNext())}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-primary hover:bg-primaryDark text-white py-3 px-5 text-xs sm:text-sm font-bold shadow-sm transition-all disabled:opacity-40 disabled:pointer-events-none active:scale-98 outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Evaluating Eligibility...
              </span>
            ) : (
              <>
                {step === total - 1 ? "Evaluate Schemes" : "Continue"}
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </div>

        <button 
          onClick={() => navigate("/")} 
          className="mt-5 w-full text-center text-xs font-bold text-slate-400 hover:text-ink transition-colors outline-none focus-visible:underline"
        >
          Cancel and return home
        </button>
      </div>
    </div>
  );
}
