import { motion } from "framer-motion";
import { ArrowRight, MapPin, Clock, DollarSign, Star, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Step, Plan } from "@shared/schema";
import { useState } from "react";

interface LocationDetailProps {
  step: Step;
  onClose: () => void;
  suggestions?: Plan["suggestions"];
}

export function LocationDetail({ step, onClose, suggestions = [] }: LocationDetailProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % step.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + step.images.length) % step.images.length);
  };

  const averageRating = step.reviews.length > 0
    ? (step.reviews.reduce((sum, r) => sum + r.rating, 0) / step.reviews.length).toFixed(1)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        onClick={(e) => e.stopPropagation()}
        className="fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto bg-background rounded-t-3xl shadow-2xl"
      >
        <div className="p-6 pb-32">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-foreground hover:bg-white/20 mb-4 transition-colors"
          >
            <ArrowRight className="w-5 h-5 rotate-180" />
          </button>

          {/* Image Carousel */}
          <div className="relative mb-6 rounded-2xl overflow-hidden h-64 bg-secondary">
            {step.images.length > 0 ? (
              <>
                <img
                  key={currentImageIndex}
                  src={step.images[currentImageIndex]}
                  alt={step.placeName}
                  onError={(e) => {
                    // Fallback to a placeholder image if the image fails to load
                    e.currentTarget.src = `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&auto=format`;
                  }}
                  className="w-full h-full object-cover transition-opacity duration-300"
                />

                {step.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition backdrop-blur-sm"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition backdrop-blur-sm"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                      {step.images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`w-2 h-2 rounded-full transition ${
                            idx === currentImageIndex ? "bg-white" : "bg-white/50"
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                <div className="text-center">
                  <MapPin className="w-12 h-12 mx-auto text-primary/60 mb-2" />
                  <p className="text-sm text-muted-foreground">No images available</p>
                </div>
              </div>
            )}
          </div>

          {/* Place Info */}
          <h1 className="text-3xl font-bold mb-2">{step.placeName}</h1>
          <p className="text-muted-foreground mb-6">{step.description}</p>

          {/* Details Grid */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="glass-panel p-3 rounded-xl text-center">
              <Clock className="w-4 h-4 mx-auto text-primary mb-1" />
              <p className="text-xs font-semibold">{step.time}</p>
            </div>
            <div className="glass-panel p-3 rounded-xl text-center">
              <DollarSign className="w-4 h-4 mx-auto text-emerald-600 mb-1" />
              <p className="text-xs font-semibold">{step.cost === 0 ? "Free" : `${step.cost}`}</p>
            </div>
            <div className="glass-panel p-3 rounded-xl text-center">
              <MapPin className="w-4 h-4 mx-auto text-primary mb-1" />
              <p className="text-xs font-semibold">{step.distance}</p>
            </div>
          </div>

          {/* Reviews Section */}
          {step.reviews.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Reviews</h3>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{averageRating}</span>
                </div>
              </div>

              <div className="space-y-3">
                {step.reviews.map((review, idx) => (
                  <div key={idx} className="glass-panel p-3 rounded-xl">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-semibold">{review.author}</p>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-muted-foreground/30"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{review.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Nearby Places Section */}
          {suggestions.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-accent" />
                Nearby Places
              </h3>
              <div className="space-y-3">
                {suggestions.map((suggestion) => (
                  <div key={suggestion.id} className="glass-panel p-4 rounded-xl">
                    <div className="text-xs font-bold text-primary uppercase tracking-wider mb-2">
                      {suggestion.type}
                    </div>
                    <h4 className="font-semibold text-foreground mb-1">{suggestion.name}</h4>
                    <p className="text-xs text-muted-foreground">{suggestion.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Map CTA Button */}
          <button
            onClick={() => {
              // TODO: Open maps functionality
              console.log('Open maps for:', step.placeName);
            }}
            className="w-full py-3 px-4 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          >
            <MapPin className="w-4 h-4" />
            Open in Maps
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}