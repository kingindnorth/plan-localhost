import { motion } from "framer-motion";
import { Check, Navigation, MapPin, Footprints, Car, Train, Clock, DollarSign } from "lucide-react";
import { Step } from "@shared/schema";
import { cn } from "@/lib/utils";

interface PlanStepCardProps {
  step: Step;
  index: number;
  isCompleted: boolean;
  onToggle: (id: string) => void;
  onViewDetails: (step: Step) => void;
}

const methodIcons = {
  walk: Footprints,
  auto: Car,
  cab: Car,
  transit: Train,
};

export function PlanStepCard({ step, index, isCompleted, onToggle, onViewDetails }: PlanStepCardProps) {
  const MethodIcon = methodIcons[step.travelMethod] || Navigation;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4, ease: "easeOut" }}
      className="relative flex gap-4 md:gap-6 group"
    >
      {/* Timeline connector */}
      <div className="flex flex-col items-center pt-2">
        <button
          onClick={() => onToggle(step.id)}
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 z-10 shrink-0",
            isCompleted 
              ? "bg-primary border-primary text-white shadow-lg shadow-primary/30" 
              : "bg-background border-muted-foreground/30 text-transparent hover:border-primary/50"
          )}
        >
          <Check className="w-4 h-4" />
        </button>
        <div className="w-0.5 h-full bg-gradient-to-b from-border to-border/30 mt-2 -mb-2 group-last:hidden" />
      </div>

      {/* Card Content */}
      <div 
        onClick={() => onViewDetails(step)}
        className={cn(
          "flex-1 glass-card rounded-2xl p-5 transition-all duration-300 cursor-pointer",
          isCompleted ? "opacity-60 grayscale-[0.3]" : "hover:-translate-y-1"
        )}
      >
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
            <Clock className="w-4 h-4" />
            {step.time}
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-secondary rounded-full text-xs font-medium text-muted-foreground">
            <MethodIcon className="w-3 h-3" />
            {step.distance}
          </div>
        </div>

        <h3 className="text-xl font-bold text-foreground mb-2 flex items-center gap-2">
          {step.placeName}
        </h3>
        
        <p className="text-muted-foreground text-sm leading-relaxed mb-4">
          {step.description}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <div className="flex items-center gap-1 text-sm font-medium text-emerald-600 dark:text-emerald-400">
            <DollarSign className="w-4 h-4" />
            {step.cost === 0 ? "Free" : step.cost}
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              // TODO: Open maps functionality
              console.log('Open maps for:', step.placeName);
            }}
            className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
          >
            <MapPin className="w-3 h-3" />
            Open Maps
          </button>
        </div>
      </div>
    </motion.div>
  );
}
