import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import { MapPin, Navigation2, Search, ArrowRight, Loader2, Sparkles, Map, Calendar, Wallet, CheckCircle2 } from "lucide-react";
import { useGeneratePlan } from "@/hooks/use-plan";
import { GeneratePlanRequest, Plan } from "@shared/schema";
import { PlanStepCard } from "@/components/PlanStepCard";
import { ThemeToggle } from "@/components/ThemeToggle";

type ViewState = 'welcome' | 'form' | 'loading' | 'plan';

export default function Planner() {
  const [viewState, setViewState] = useState<ViewState>('welcome');
  const [requestData, setRequestData] = useState<Partial<GeneratePlanRequest>>({
    style: 'balanced',
    duration: '1_day',
    budget: 200,
  });
  
  const { mutate: generatePlan, isPending } = useGeneratePlan();
  const [plan, setPlan] = useState<Plan | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [showConfetti, setShowConfetti] = useState(false);

  // Handle Confetti when all steps are completed
  useEffect(() => {
    if (plan && plan.steps.length > 0) {
      if (completedSteps.size === plan.steps.length) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      }
    }
  }, [completedSteps, plan]);

  const handleGenerate = () => {
    setViewState('loading');
    generatePlan(requestData as GeneratePlanRequest, {
      onSuccess: (data) => {
        setPlan(data);
        setCompletedSteps(new Set()); // Reset completions
        setViewState('plan');
      },
      onError: (err) => {
        console.error(err);
        setViewState('form');
        // You could add a toast notification here
      }
    });
  };

  const toggleStep = (id: string) => {
    setCompletedSteps(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const pageVariants = {
    initial: { opacity: 0, scale: 0.95, y: 20 },
    in: { opacity: 1, scale: 1, y: 0 },
    out: { opacity: 0, scale: 1.05, y: -20 }
  };

  const pageTransition = { type: "tween", ease: "circOut", duration: 0.5 };

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      {/* Dynamic Background Blurs */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-500/20 rounded-full blur-[120px] pointer-events-none" />
      
      {showConfetti && <Confetti recycle={false} numberOfPieces={500} />}

      {/* Header Actions */}
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <div className="max-w-md mx-auto min-h-screen flex flex-col px-6 py-12 relative z-10">
        <AnimatePresence mode="wait">
          
          {/* ================= WELCOME SCREEN ================= */}
          {viewState === 'welcome' && (
            <motion.div
              key="welcome"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
              className="flex-1 flex flex-col items-center justify-center text-center"
            >
              <div className="w-24 h-24 bg-gradient-primary rounded-3xl mb-8 flex items-center justify-center shadow-2xl shadow-primary/30">
                <Map className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-5xl font-extrabold mb-4 tracking-tight">
                Voyager <span className="text-gradient">AI</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-12 max-w-[280px]">
                Your personal, intelligent travel planner for perfect days out.
              </p>

              <div className="w-full space-y-4">
                <button
                  onClick={() => setViewState('form')}
                  className="w-full py-4 px-6 rounded-2xl bg-foreground text-background font-semibold text-lg hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-xl flex items-center justify-center gap-2"
                >
                  <Search className="w-5 h-5" />
                  Enter Destination
                </button>
                <button
                  onClick={() => {
                    setRequestData({ ...requestData, useLocation: true });
                    setViewState('form');
                  }}
                  className="w-full py-4 px-6 rounded-2xl glass-panel font-semibold text-lg text-foreground hover:scale-[1.02] active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
                >
                  <Navigation2 className="w-5 h-5 text-primary" />
                  Use My Location
                </button>
              </div>
            </motion.div>
          )}

          {/* ================= FORM SCREEN ================= */}
          {viewState === 'form' && (
            <motion.div
              key="form"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
              className="flex-1 flex flex-col justify-center py-10"
            >
              <h2 className="text-3xl font-bold mb-8">Where to next?</h2>
              
              <div className="space-y-8">
                {/* Destination Input */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-muted-foreground ml-1">Destination</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="e.g. Kyoto, Japan"
                      value={requestData.destination || ''}
                      onChange={(e) => setRequestData({ ...requestData, destination: e.target.value })}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white dark:bg-zinc-900 border-2 border-transparent focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all outline-none shadow-sm text-lg"
                    />
                  </div>
                </div>

                {/* Duration */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-muted-foreground ml-1">Duration</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'half_day', label: 'Half Day' },
                      { id: '1_day', label: 'Full Day' },
                      { id: 'weekend', label: 'Weekend' }
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setRequestData({ ...requestData, duration: opt.id as any })}
                        className={`py-3 px-2 rounded-xl text-sm font-semibold transition-all ${
                          requestData.duration === opt.id 
                            ? 'bg-primary text-white shadow-md shadow-primary/25' 
                            : 'bg-white dark:bg-zinc-900 text-muted-foreground hover:bg-secondary'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Style */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-muted-foreground ml-1">Travel Style</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'budget', label: 'Budget' },
                      { id: 'balanced', label: 'Balanced' },
                      { id: 'luxury', label: 'Luxury' }
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setRequestData({ ...requestData, style: opt.id as any })}
                        className={`py-3 px-2 rounded-xl text-sm font-semibold transition-all ${
                          requestData.style === opt.id 
                            ? 'bg-primary text-white shadow-md shadow-primary/25' 
                            : 'bg-white dark:bg-zinc-900 text-muted-foreground hover:bg-secondary'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Budget */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center ml-1">
                    <label className="text-sm font-semibold text-muted-foreground">Budget Estimate</label>
                    <span className="font-bold text-primary">${requestData.budget}</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="1000"
                    step="50"
                    value={requestData.budget}
                    onChange={(e) => setRequestData({ ...requestData, budget: parseInt(e.target.value) })}
                    className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>

              </div>

              <div className="mt-12">
                <button
                  onClick={handleGenerate}
                  disabled={!requestData.destination && !requestData.useLocation}
                  className="w-full py-4 rounded-2xl bg-gradient-primary text-white font-bold text-lg shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  Generate Magic
                  <Sparkles className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewState('welcome')}
                  className="w-full mt-4 py-3 text-muted-foreground font-medium hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}

          {/* ================= LOADING SCREEN ================= */}
          {viewState === 'loading' && (
            <motion.div
              key="loading"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
              className="flex-1 flex flex-col items-center justify-center text-center space-y-6"
            >
              <div className="relative">
                <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <Navigation2 className="w-8 h-8 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Curating your trip</h3>
                <p className="text-muted-foreground animate-pulse">Analyzing the best spots...</p>
              </div>
              
              {/* Skeleton cards */}
              <div className="w-full mt-12 space-y-4 opacity-40">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-full h-24 bg-white dark:bg-zinc-900 rounded-2xl animate-pulse" />
                ))}
              </div>
            </motion.div>
          )}

          {/* ================= PLAN VIEW SCREEN ================= */}
          {viewState === 'plan' && plan && (
            <motion.div
              key="plan"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
              className="flex-1 flex flex-col pb-32" // Padding bottom for floating card
            >
              <div className="py-6 pt-10">
                <button 
                  onClick={() => setViewState('form')}
                  className="mb-6 w-10 h-10 rounded-full glass-panel flex items-center justify-center text-muted-foreground hover:text-foreground"
                >
                  <ArrowRight className="w-5 h-5 rotate-180" />
                </button>
                <h2 className="text-3xl font-extrabold leading-tight mb-2">{plan.title}</h2>
                <p className="text-muted-foreground">{plan.description}</p>
                
                {/* Progress Bar */}
                <div className="mt-6 glass-panel p-4 rounded-2xl">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold">Progress</span>
                    <span className="text-sm font-bold text-primary">
                      {Math.round((completedSteps.size / plan.steps.length) * 100)}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${(completedSteps.size / plan.steps.length) * 100}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </div>

              {/* Timeline Steps */}
              <div className="space-y-6 mt-4">
                {plan.steps.map((step, index) => (
                  <PlanStepCard 
                    key={step.id} 
                    step={step} 
                    index={index}
                    isCompleted={completedSteps.has(step.id)}
                    onToggle={toggleStep}
                  />
                ))}
              </div>

              {/* Suggestions (Horizontal Scroll) */}
              <div className="mt-12 mb-8">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-accent" />
                  Nearby Suggestions
                </h3>
                <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar -mx-6 px-6">
                  {plan.suggestions.map((suggestion) => (
                    <div key={suggestion.id} className="min-w-[200px] glass-card rounded-2xl p-4 shrink-0 hover:-translate-y-1 transition-transform">
                      <div className="text-xs font-bold text-primary uppercase tracking-wider mb-1">
                        {suggestion.type}
                      </div>
                      <h4 className="font-semibold text-foreground mb-1">{suggestion.name}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-2">{suggestion.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Success State */}
              <AnimatePresence>
                {completedSteps.size === plan.steps.length && (
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    className="mt-8 mb-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 p-6 rounded-3xl text-center shadow-lg"
                  >
                    <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-emerald-500" />
                    <h3 className="text-2xl font-bold mb-2">Trip Completed! 🎉</h3>
                    <p className="mb-6 opacity-90">You've finished all planned activities.</p>
                    <button
                      onClick={() => {
                        setViewState('welcome');
                        setRequestData({ style: 'balanced', duration: '1_day', budget: 200 });
                      }}
                      className="px-6 py-3 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition-colors"
                    >
                      Plan Another Adventure
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Cost Summary (Only show on Plan view) */}
      <AnimatePresence>
        {viewState === 'plan' && plan && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200, delay: 0.5 }}
            className="fixed bottom-6 left-0 right-0 z-40 px-6 pointer-events-none"
          >
            <div className="max-w-md mx-auto pointer-events-auto">
              <div className="glass-panel rounded-3xl p-4 flex items-center justify-between shadow-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <Wallet className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Est. Total</p>
                    <p className="text-xl font-bold text-foreground">${plan.estimatedTotalCost}</p>
                  </div>
                </div>
                <div className="flex gap-4 text-xs font-medium text-muted-foreground text-right">
                  <div className="flex flex-col">
                    <span>Food</span>
                    <span className="text-foreground font-bold">${plan.foodCost}</span>
                  </div>
                  <div className="flex flex-col">
                    <span>Transport</span>
                    <span className="text-foreground font-bold">${plan.transportCost}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
