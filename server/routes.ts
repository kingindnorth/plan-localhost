import type { Express } from "express";
import { createServer, type Server } from "http";
import { api } from "@shared/routes";
import { z } from "zod";

const mockPlans = [
  {
    id: "plan_1",
    title: "Bangalore 1-Day City Tour",
    description: "Experience the perfect blend of nature, technology, and culture in the Silicon Valley of India.",
    estimatedTotalCost: 2500,
    transportCost: 800,
    foodCost: 1200,
    activityCost: 500,
    steps: [
      { id: "s1_1", time: "09:00 AM", placeName: "MTR - Mavalli Tiffin Room", description: "Authentic South Indian breakfast", cost: 250, distance: "0 km", travelMethod: "walk", isCompleted: false },
      { id: "s1_2", time: "10:30 AM", placeName: "Lalbagh Botanical Garden", description: "Morning stroll in the historic gardens", cost: 50, distance: "1.2 km", travelMethod: "auto", isCompleted: false },
      { id: "s1_3", time: "01:00 PM", placeName: "Vidhana Soudha", description: "Explore the majestic state legislature building", cost: 0, distance: "3.5 km", travelMethod: "cab", isCompleted: false },
      { id: "s1_4", time: "02:30 PM", placeName: "Meghana Foods", description: "Famous Biryani lunch", cost: 600, distance: "2.1 km", travelMethod: "auto", isCompleted: false },
      { id: "s1_5", time: "04:00 PM", placeName: "Visvesvaraya Industrial and Technological Museum", description: "Interactive science exhibits", cost: 100, distance: "1.5 km", travelMethod: "walk", isCompleted: false },
      { id: "s1_6", time: "06:30 PM", placeName: "Cubbon Park", description: "Evening relaxation", cost: 0, distance: "0.8 km", travelMethod: "walk", isCompleted: false },
      { id: "s1_7", time: "08:00 PM", placeName: "Toit", description: "Dinner", cost: 800, distance: "4 km", travelMethod: "cab", isCompleted: false },
    ],
    suggestions: [
      { id: "sug1", type: "cafe", name: "Third Wave Coffee", description: "Specialty coffee roasters" },
      { id: "sug2", type: "market", name: "Commercial Street", description: "Bustling shopping area" },
      { id: "sug3", type: "museum", name: "Bangalore Palace", description: "Historic Tudor-style palace" },
    ]
  },
  {
    id: "plan_2",
    title: "Mysore Heritage Trip",
    description: "Dive deep into the royal history and cultural richness of Mysore.",
    estimatedTotalCost: 3200,
    transportCost: 600,
    foodCost: 1000,
    activityCost: 1600,
    steps: [
      { id: "s2_1", time: "09:30 AM", placeName: "Mysore Palace", description: "Explore the magnificent royal residence", cost: 100, distance: "0 km", travelMethod: "walk", isCompleted: false },
      { id: "s2_2", time: "12:00 PM", placeName: "Mylari Hotel", description: "Traditional Mylari Dosa", cost: 200, distance: "2 km", travelMethod: "auto", isCompleted: false },
      { id: "s2_3", time: "01:30 PM", placeName: "Sri Chamarajendra Zoological Gardens", description: "Visit the historical zoo", cost: 150, distance: "1.5 km", travelMethod: "auto", isCompleted: false },
      { id: "s2_4", time: "04:30 PM", placeName: "St. Philomena's Cathedral", description: "Gothic style architecture", cost: 0, distance: "2.5 km", travelMethod: "cab", isCompleted: false },
      { id: "s2_5", time: "06:00 PM", placeName: "Chamundi Hill Viewpoint", description: "Sunset over the city", cost: 0, distance: "12 km", travelMethod: "cab", isCompleted: false }
    ],
    suggestions: [
      { id: "sug4", type: "market", name: "Devaraja Market", description: "Spices, silk, and sandalwood" },
      { id: "sug5", type: "museum", name: "Rail Museum", description: "Vintage locomotives" }
    ]
  },
  {
    id: "plan_3",
    title: "Goa Beach Hopping",
    description: "Sun, sand, and seafood along the stunning Goan coastline.",
    estimatedTotalCost: 4500,
    transportCost: 1200,
    foodCost: 2500,
    activityCost: 800,
    steps: [
      { id: "s3_1", time: "09:00 AM", placeName: "Baga Beach", description: "Morning walk and watersports", cost: 500, distance: "0 km", travelMethod: "walk", isCompleted: false },
      { id: "s3_2", time: "12:30 PM", placeName: "Britto's", description: "Seafood lunch by the beach", cost: 1200, distance: "0.5 km", travelMethod: "walk", isCompleted: false },
      { id: "s3_3", time: "02:30 PM", placeName: "Anjuna Beach", description: "Relax by the shacks", cost: 300, distance: "2 km", travelMethod: "auto", isCompleted: false },
      { id: "s3_4", time: "05:00 PM", placeName: "Vagator Beach", description: "Sunset views and rocky shores", cost: 0, distance: "5 km", travelMethod: "cab", isCompleted: false },
      { id: "s3_5", time: "07:30 PM", placeName: "Curlies", description: "Dinner and live music", cost: 1000, distance: "0.5 km", travelMethod: "walk", isCompleted: false }
    ],
    suggestions: [
      { id: "sug6", type: "viewpoint", name: "Chapora Fort", description: "Dil Chahta Hai fort" },
      { id: "sug7", type: "cafe", name: "Artjuna", description: "Bohemian cafe and lifestyle shop" }
    ]
  },
  {
    id: "plan_4",
    title: "Hampi Historical Exploration",
    description: "Wander through the ancient ruins of the Vijayanagara Empire.",
    estimatedTotalCost: 2800,
    transportCost: 800,
    foodCost: 900,
    activityCost: 1100,
    steps: [
      { id: "s4_1", time: "08:00 AM", placeName: "Virupaksha Temple", description: "Start with the majestic main temple", cost: 50, distance: "0 km", travelMethod: "walk", isCompleted: false },
      { id: "s4_2", time: "10:30 AM", placeName: "Vittala Temple Bazaar", description: "Explore the ancient marketplace ruins", cost: 0, distance: "1 km", travelMethod: "walk", isCompleted: false },
      { id: "s4_3", time: "01:00 PM", placeName: "Mango Tree Restaurant", description: "Relaxed riverside lunch", cost: 400, distance: "0.5 km", travelMethod: "walk", isCompleted: false },
      { id: "s4_4", time: "03:00 PM", placeName: "Lotus Mahal & Stone Chariot", description: "Iconic stone chariot", cost: 40, distance: "3 km", travelMethod: "auto", isCompleted: false },
      { id: "s4_5", time: "05:30 PM", placeName: "Matanga Hill", description: "Climb for a stunning sunset over ruins", cost: 0, distance: "2 km", travelMethod: "walk", isCompleted: false }
    ],
    suggestions: [
      { id: "sug8", type: "market", name: "Hampi Bazaar", description: "Local handicrafts and souvenirs" },
      { id: "sug9", type: "viewpoint", name: "Hemakuta Hill", description: "Sunrise viewpoint" }
    ]
  },
  {
    id: "plan_5",
    title: "Ooty Hill Station Trip",
    description: "Escape to the Queen of Hill Stations for cool breezes and tea gardens.",
    estimatedTotalCost: 3500,
    transportCost: 1000,
    foodCost: 1200,
    activityCost: 1300,
    steps: [
      { id: "s5_1", time: "09:00 AM", placeName: "Ooty Botanical Gardens", description: "Morning walk among exotic flora", cost: 30, distance: "0 km", travelMethod: "walk", isCompleted: false },
      { id: "s5_2", time: "11:30 AM", placeName: "Doddabetta Peak", description: "Highest viewpoint in the Nilgiris", cost: 10, distance: "9 km", travelMethod: "cab", isCompleted: false },
      { id: "s5_3", time: "01:30 PM", placeName: "Earl's Secret", description: "Cozy lunch cafe", cost: 600, distance: "8 km", travelMethod: "cab", isCompleted: false },
      { id: "s5_4", time: "03:30 PM", placeName: "Ooty Lake", description: "Boating in the serene lake", cost: 250, distance: "3 km", travelMethod: "auto", isCompleted: false },
      { id: "s5_5", time: "06:00 PM", placeName: "Homemade Chocolate Market", description: "Sweet souvenir shopping", cost: 500, distance: "1.5 km", travelMethod: "walk", isCompleted: false }
    ],
    suggestions: [
      { id: "sug10", type: "cafe", name: "Willy's Coffee Pub", description: "Great coffee and snacks" },
      { id: "sug11", type: "museum", name: "Tea Factory", description: "Learn how Nilgiri tea is made" }
    ]
  }
];

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.post(api.plans.generate.path, async (req, res) => {
    try {
      const input = api.plans.generate.input.parse(req.body);
      
      // Simulate network delay to show loading state on frontend
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const dest = input.destination?.toLowerCase() || "";
      let plan = mockPlans[0];
      
      if (dest.includes("mysore")) {
        plan = mockPlans[1];
      } else if (dest.includes("goa")) {
        plan = mockPlans[2];
      } else if (dest.includes("hampi")) {
        plan = mockPlans[3];
      } else if (dest.includes("ooty")) {
        plan = mockPlans[4];
      } else if (input.useLocation || dest === "") {
        plan = mockPlans[Math.floor(Math.random() * mockPlans.length)];
      } else {
        plan = mockPlans[Math.floor(Math.random() * mockPlans.length)];
      }

      const customizedPlan = {
        ...plan,
        title: (input.destination && !dest.includes("mysore") && !dest.includes("goa") && !dest.includes("hampi") && !dest.includes("ooty")) 
          ? `${input.destination} Exploration Trip`
          : plan.title,
        id: `plan_${Date.now()}`
      };

      res.status(200).json(customizedPlan);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  return httpServer;
}
