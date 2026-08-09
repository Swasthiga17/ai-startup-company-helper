import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, CheckCircle2, Rocket, Zap } from 'lucide-react';

const checklistItems = [
  'Idea Validation',
  'Market Research',
  'Business Planning',
  'Execution Engine',
  'Pitch Generator',
];

export default function SplashScreen({ onComplete }) {
  const [step, setStep] = useState(1);
  const [taglineSubStep, setTaglineSubStep] = useState(false);
  const [completedItems, setCompletedItems] = useState([]);
  const [isLaunching, setIsLaunching] = useState(false);

  useEffect(() => {
    // Timeline sequence:
    // Step 1: 0s - 1s (Logo entrance & pulse)
    // Step 2: 1s - 2s (Sparkles & rocket lift)
    const t2 = setTimeout(() => setStep(2), 1000);

    // Step 3: 2s - 3s (IdeaExecutor text slide & shimmer)
    const t3 = setTimeout(() => setStep(3), 2000);

    // Step 4: 3s - 4s (Taglines appear)
    const t4 = setTimeout(() => {
      setStep(4);
      setTimeout(() => setTaglineSubStep(true), 500);
    }, 3000);

    // Step 5: 4s - 5s (103% scale pop + AI Agent Loader)
    const t5 = setTimeout(() => {
      setStep(5);
    }, 4200);

    return () => {
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, []);

  // Step 5 checklist item progression
  useEffect(() => {
    if (step === 5) {
      checklistItems.forEach((_, idx) => {
        setTimeout(() => {
          setCompletedItems((prev) => [...prev, idx]);
        }, (idx + 1) * 350);
      });

      // Final launch trigger after checklist finishes
      const launchTimer = setTimeout(() => {
        setIsLaunching(true);
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 800);
      }, checklistItems.length * 350 + 600);

      return () => clearTimeout(launchTimer);
    }
  }, [step, onComplete]);

  const handleSkip = () => {
    setIsLaunching(true);
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 300);
  };

  return (
    <AnimatePresence>
      {!isLaunching && (
        <motion.div
          key="splash-container"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden select-none font-sans p-6"
          style={{
            background: 'radial-gradient(circle at center, #ffffff 0%, #f7f1ff 35%, #f2ebff 60%, #ffffff 100%)',
          }}
        >
          {/* Ambient Background Glows */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] bg-gradient-to-tr from-purple-300/35 via-pink-300/35 to-sky-300/25 rounded-full blur-[140px] pointer-events-none animate-pulse" />
          <div className="absolute top-1/4 left-1/4 w-[450px] h-[450px] bg-pink-400/25 rounded-full blur-[110px] pointer-events-none" />

          {/* Floating Particle Accents */}
          {[...Array(14)].map((_, i) => (
            <motion.div
              key={i}
              initial={{
                x: Math.random() * 900 - 450,
                y: Math.random() * 900 - 450,
                opacity: 0,
                scale: Math.random() * 0.6 + 0.6,
              }}
              animate={{
                y: [0, -35, 0],
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1.25, 1],
              }}
              transition={{
                duration: 3 + (i % 3),
                repeat: Infinity,
                delay: i * 0.15,
                ease: 'easeInOut',
              }}
              className="absolute pointer-events-none"
            >
              <Sparkles
                className={`w-${(i % 3) + 4} h-${(i % 3) + 4} ${
                  i % 2 === 0 ? 'text-purple-500/70' : 'text-pink-500/70'
                }`}
              />
            </motion.div>
          ))}

          {/* Top Skip Button */}
          <motion.button
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            onClick={handleSkip}
            className="absolute top-8 right-10 px-5 py-2.5 rounded-full bg-white/90 hover:bg-white border border-purple-200 text-sm font-extrabold text-slate-600 hover:text-purple-600 shadow-md transition backdrop-blur-md cursor-pointer flex items-center gap-2 z-50"
          >
            <span>Skip Intro</span>
            <Zap className="w-4 h-4 text-purple-600" />
          </motion.button>

          {/* Main Logo & Intro Animation Container */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 max-w-3xl">
            {/* Step 1 & 2: Logo Icon Container & Light Pulse */}
            <motion.div
              initial={{ scale: 0.6, rotate: -10, opacity: 0 }}
              animate={{
                scale: step === 5 ? [1, 1.03, 1] : 1,
                rotate: 0,
                opacity: 1,
                y: step >= 2 ? [0, -8, 0] : 0,
              }}
              transition={{
                duration: 0.9,
                ease: [0.34, 1.56, 0.64, 1],
                y: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
              }}
              className="relative mb-6"
            >
              {/* Radial Light Pulse Glow behind Logo */}
              <motion.div
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.4, 0.9, 0.4],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute inset-0 bg-gradient-to-r from-purple-500/50 via-pink-500/50 to-sky-400/40 rounded-3xl blur-3xl pointer-events-none"
              />

              {/* Sparkle burst around logo in Step 2 */}
              {step >= 2 && (
                <>
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute -top-4 -right-4 z-20"
                  >
                    <Sparkles className="w-8 h-8 text-pink-500 animate-spin" style={{ animationDuration: '6s' }} />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="absolute -bottom-3 -left-4 z-20"
                  >
                    <Sparkles className="w-7 h-7 text-purple-600 animate-pulse" />
                  </motion.div>
                </>
              )}

              {/* Core Transparent Logo Mark (Larger Dimensions) */}
              <div className="relative w-36 h-36 md:w-48 md:h-48 flex items-center justify-center p-2">
                <img
                  src="/ideaexecutor_icon.png"
                  alt="IdeaExecutor Logo Mark"
                  className="w-full h-full object-contain drop-shadow-[0_15px_35px_rgba(168,85,247,0.4)]"
                />
              </div>
            </motion.div>

            {/* Step 3: IdeaExecutor Brand Title Slide & Shimmer (Larger Typography) */}
            {step >= 3 && (
              <div className="overflow-hidden py-2 mb-4">
                <motion.div className="flex items-center justify-center text-5xl md:text-7xl font-black tracking-tight font-sans">
                  {/* "Idea" slides from left */}
                  <motion.span
                    initial={{ x: -60, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 120, damping: 14 }}
                    className="text-slate-900 drop-shadow-xs"
                  >
                    Idea
                  </motion.span>

                  {/* "Executor" slides from right with Gradient Shine */}
                  <motion.span
                    initial={{ x: 60, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 120, damping: 14, delay: 0.1 }}
                    className="bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#F43F8A] bg-clip-text text-transparent ml-1 relative drop-shadow-xs"
                  >
                    Executor
                    <motion.span
                      initial={{ left: '-100%' }}
                      animate={{ left: '200%' }}
                      transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/90 to-transparent w-1/2 pointer-events-none mix-blend-overlay"
                    />
                  </motion.span>
                </motion.div>
              </div>
            )}

            {/* Step 4: Taglines Appearance (Larger Typography) */}
            {step >= 4 && (
              <div className="space-y-3 mt-2 min-h-[90px]">
                {/* Tagline 1 */}
                <motion.p
                  initial={{ y: 15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight"
                >
                  Turn Ideas into Reality with{' '}
                  <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 bg-clip-text text-transparent font-black">
                    AI.
                  </span>
                </motion.p>

                {/* Tagline 2 */}
                {taglineSubStep && (
                  <motion.p
                    initial={{ y: 12, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-base md:text-xl font-extrabold text-slate-600 tracking-wide flex flex-wrap items-center justify-center gap-2"
                  >
                    <span>Build Your Idea.</span>
                    <span className="text-[#EC4899] font-black">Execute Your Vision.</span>
                  </motion.p>
                )}
              </div>
            )}

            {/* Step 5: AI Agent Loader Checklist (Larger Card & Fonts) */}
            {step >= 5 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mt-8 w-full max-w-md bg-white/95 backdrop-blur-2xl rounded-3xl p-6 border border-purple-200/80 shadow-[0_15px_40px_-10px_rgba(168,85,247,0.2)] space-y-3 text-left"
              >
                <div className="flex items-center gap-2.5 pb-3 border-b border-purple-100 text-sm font-black text-purple-700 uppercase tracking-wider">
                  <Rocket className="w-5 h-5 text-pink-500 animate-bounce" />
                  <span>Initializing AI Agents...</span>
                </div>

                <div className="space-y-2.5 pt-1">
                  {checklistItems.map((item, idx) => {
                    const isDone = completedItems.includes(idx);
                    return (
                      <div
                        key={idx}
                        className={`flex items-center justify-between text-sm font-extrabold transition-all duration-300 ${
                          isDone ? 'text-slate-800 opacity-100' : 'text-slate-300 opacity-50'
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <CheckCircle2
                            className={`w-5 h-5 transition-colors ${
                              isDone ? 'text-emerald-500' : 'text-slate-200'
                            }`}
                          />
                          {item}
                        </span>
                        {isDone && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="text-xs text-emerald-600 font-extrabold uppercase bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60"
                          >
                            Ready
                          </motion.span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {completedItems.length === checklistItems.length && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="pt-3 text-center text-sm font-black text-purple-600 animate-pulse tracking-wide"
                  >
                    Launching IdeaExecutor...
                  </motion.div>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
