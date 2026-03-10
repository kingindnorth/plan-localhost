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
      { 
        id: "s1_1", 
        time: "09:00 AM", 
        placeName: "MTR - Mavalli Tiffin Room", 
        description: "Authentic South Indian breakfast", 
        cost: 250, 
        distance: "0 km", 
        travelMethod: "walk", 
        isCompleted: false,
        images: [
          "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&h=300&fit=crop"
        ],
        reviews: [
          { author: "Priya S.", rating: 5, text: "Best masala dosa in Bangalore! The chutneys are incredible." },
          { author: "Raj M.", rating: 4, text: "Authentic taste, but expect long queues during weekends." }
        ]
      },
      { 
        id: "s1_2", 
        time: "10:30 AM", 
        placeName: "Lalbagh Botanical Garden", 
        description: "Morning stroll in the historic gardens", 
        cost: 50, 
        distance: "1.2 km", 
        travelMethod: "auto", 
        isCompleted: false,
        images: [
          "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop"
        ],
        reviews: [
          { author: "Anita K.", rating: 5, text: "Beautiful gardens with amazing variety of plants. Perfect for morning walks." },
          { author: "Vikram R.", rating: 4, text: "Peaceful place in the heart of the city. The glass house is a must-see." }
        ]
      },
      { 
        id: "s1_3", 
        time: "01:00 PM", 
        placeName: "Vidhana Soudha", 
        description: "Explore the majestic state legislature building", 
        cost: 0, 
        distance: "3.5 km", 
        travelMethod: "cab", 
        isCompleted: false,
        images: [
          "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop"
        ],
        reviews: [
          { author: "Deepak T.", rating: 4, text: "Impressive architecture! Great for photography from outside." }
        ]
      },
      { 
        id: "s1_4", 
        time: "02:30 PM", 
        placeName: "Meghana Foods", 
        description: "Famous Biryani lunch", 
        cost: 600, 
        distance: "2.1 km", 
        travelMethod: "auto", 
        isCompleted: false,
        images: [
          "https://images.unsplash.com/photo-1563379091339-03246963d51a?w=400&h=300&fit=crop"
        ],
        reviews: [
          { author: "Arjun P.", rating: 5, text: "The mutton biryani is absolutely delicious! Worth the wait." },
          { author: "Sneha L.", rating: 4, text: "Great taste but portions could be bigger for the price." }
        ]
      },
      { 
        id: "s1_5", 
        time: "04:00 PM", 
        placeName: "Visvesvaraya Industrial and Technological Museum", 
        description: "Interactive science exhibits", 
        cost: 100, 
        distance: "1.5 km", 
        travelMethod: "walk", 
        isCompleted: false,
        images: [
          "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=300&fit=crop"
        ],
        reviews: [
          { author: "Kavya N.", rating: 4, text: "Great for kids and adults alike. Interactive exhibits are engaging." }
        ]
      },
      { 
        id: "s1_6", 
        time: "06:30 PM", 
        placeName: "Cubbon Park", 
        description: "Evening relaxation", 
        cost: 0, 
        distance: "0.8 km", 
        travelMethod: "walk", 
        isCompleted: false,
        images: [
          "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1574263867128-a3d5c1b1deaa?w=400&h=300&fit=crop"
        ],
        reviews: [
          { author: "Rohit G.", rating: 5, text: "Perfect place to unwind after a busy day. Great for jogging too." },
          { author: "Meera D.", rating: 4, text: "Lovely green space in the city center. Very peaceful in the evenings." }
        ]
      },
      { 
        id: "s1_7", 
        time: "08:00 PM", 
        placeName: "Toit", 
        description: "Dinner", 
        cost: 800, 
        distance: "4 km", 
        travelMethod: "cab", 
        isCompleted: false,
        images: [
          "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&h=300&fit=crop"
        ],
        reviews: [
          { author: "Aditya S.", rating: 5, text: "Excellent craft beer and wood-fired pizzas. Great ambiance!" },
          { author: "Pooja M.", rating: 4, text: "Good food and drinks, but can get quite crowded on weekends." }
        ]
      },
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
      { 
        id: "s2_1", 
        time: "09:30 AM", 
        placeName: "Mysore Palace", 
        description: "Explore the magnificent royal residence", 
        cost: 100, 
        distance: "0 km", 
        travelMethod: "walk", 
        isCompleted: false, 
        images: [
          "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&h=300&fit=crop"
        ], 
        reviews: [
          { author: "Rajesh K.", rating: 5, text: "Absolutely stunning palace! The architecture is breathtaking and the light show in the evening is magical." },
          { author: "Priya M.", rating: 4, text: "Beautiful palace with rich history. Can get crowded during weekends." }
        ]
      },
      { 
        id: "s2_2", 
        time: "12:00 PM", 
        placeName: "Mylari Hotel", 
        description: "Traditional Mylari Dosa", 
        cost: 200, 
        distance: "2 km", 
        travelMethod: "auto", 
        isCompleted: false, 
        images: [
          "https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&h=300&fit=crop"
        ], 
        reviews: [
          { author: "Suresh R.", rating: 5, text: "Best dosa in Mysore! The ghee dosa is absolutely divine." },
          { author: "Anita S.", rating: 4, text: "Authentic taste but very crowded during peak hours." }
        ]
      },
      { 
        id: "s2_3", 
        time: "01:30 PM", 
        placeName: "Sri Chamarajendra Zoological Gardens", 
        description: "Visit the historical zoo", 
        cost: 150, 
        distance: "1.5 km", 
        travelMethod: "auto", 
        isCompleted: false, 
        images: [
          "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1551135049-8a33b5883817?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1549366021-9f761d040a94?w=400&h=300&fit=crop"
        ], 
        reviews: [
          { author: "Kavya N.", rating: 4, text: "Great place for families. Well-maintained zoo with diverse animals." },
          { author: "Arjun P.", rating: 4, text: "Nice zoo but could use better facilities. Kids loved it!" }
        ]
      },
      { 
        id: "s2_4", 
        time: "04:30 PM", 
        placeName: "St. Philomena's Cathedral", 
        description: "Gothic style architecture", 
        cost: 0, 
        distance: "2.5 km", 
        travelMethod: "cab", 
        isCompleted: false, 
        images: [
          "https://images.unsplash.com/photo-1520637836862-4d197d17c93a?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop"
        ], 
        reviews: [
          { author: "Maria F.", rating: 5, text: "Beautiful Gothic architecture. Very peaceful and serene atmosphere." },
          { author: "David L.", rating: 4, text: "Impressive cathedral with stunning stained glass windows." }
        ]
      },
      { 
        id: "s2_5", 
        time: "06:00 PM", 
        placeName: "Chamundi Hill Viewpoint", 
        description: "Sunset over the city", 
        cost: 0, 
        distance: "12 km", 
        travelMethod: "cab", 
        isCompleted: false, 
        images: [
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop"
        ], 
        reviews: [
          { author: "Vikram R.", rating: 5, text: "Spectacular sunset views! The climb is worth it for the panoramic view of Mysore." },
          { author: "Sneha L.", rating: 4, text: "Beautiful viewpoint but can get very crowded during sunset hours." }
        ]
      }
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
      { 
        id: "s3_1", 
        time: "09:00 AM", 
        placeName: "Baga Beach", 
        description: "Morning walk and watersports", 
        cost: 500, 
        distance: "0 km", 
        travelMethod: "walk", 
        isCompleted: false,
        images: [
          "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop"
        ],
        reviews: [
          { author: "Rahul K.", rating: 5, text: "Amazing beach with great water sports. Perfect for adventure lovers!" },
          { author: "Sanya P.", rating: 4, text: "Beautiful beach but can get crowded during peak season." }
        ]
      },
      { 
        id: "s3_2", 
        time: "12:30 PM", 
        placeName: "Britto's", 
        description: "Seafood lunch by the beach", 
        cost: 1200, 
        distance: "0.5 km", 
        travelMethod: "walk", 
        isCompleted: false,
        images: [
          "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop"
        ],
        reviews: [
          { author: "Maria F.", rating: 5, text: "Fresh seafood with amazing beach views. The fish curry is exceptional!" },
          { author: "John D.", rating: 4, text: "Great food and location, but service can be slow during busy hours." }
        ]
      },
      { 
        id: "s3_3", 
        time: "02:30 PM", 
        placeName: "Anjuna Beach", 
        description: "Relax by the shacks", 
        cost: 300, 
        distance: "2 km", 
        travelMethod: "auto", 
        isCompleted: false,
        images: [
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"
        ],
        reviews: [
          { author: "Lisa M.", rating: 4, text: "Laid-back vibe with great beach shacks. Perfect for relaxation." }
        ]
      },
      { 
        id: "s3_4", 
        time: "05:00 PM", 
        placeName: "Vagator Beach", 
        description: "Sunset views and rocky shores", 
        cost: 0, 
        distance: "5 km", 
        travelMethod: "cab", 
        isCompleted: false,
        images: [
          "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop"
        ],
        reviews: [
          { author: "Alex R.", rating: 5, text: "Stunning sunset views! The rocky cliffs make it unique among Goa beaches." },
          { author: "Priya J.", rating: 4, text: "Beautiful beach with dramatic landscapes. Great for photography." }
        ]
      },
      { 
        id: "s3_5", 
        time: "07:30 PM", 
        placeName: "Curlies", 
        description: "Dinner and live music", 
        cost: 1000, 
        distance: "0.5 km", 
        travelMethod: "walk", 
        isCompleted: false,
        images: [
          "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&h=300&fit=crop"
        ],
        reviews: [
          { author: "David L.", rating: 5, text: "Iconic beach shack with amazing live music and great food!" },
          { author: "Nina S.", rating: 4, text: "Great atmosphere and music, but drinks are a bit pricey." }
        ]
      }
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
      { 
        id: "s4_1", 
        time: "08:00 AM", 
        placeName: "Virupaksha Temple", 
        description: "Start with the majestic main temple", 
        cost: 50, 
        distance: "0 km", 
        travelMethod: "walk", 
        isCompleted: false, 
        images: [
          "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1520637836862-4d197d17c93a?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&h=300&fit=crop"
        ], 
        reviews: [
          { author: "Ramesh K.", rating: 5, text: "Ancient temple with incredible architecture. The spiritual atmosphere is amazing." },
          { author: "Lisa M.", rating: 4, text: "Beautiful temple complex with rich history. Great starting point for Hampi exploration." }
        ]
      },
      { 
        id: "s4_2", 
        time: "10:30 AM", 
        placeName: "Vittala Temple Bazaar", 
        description: "Explore the ancient marketplace ruins", 
        cost: 0, 
        distance: "1 km", 
        travelMethod: "walk", 
        isCompleted: false, 
        images: [
          "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"
        ], 
        reviews: [
          { author: "Alex R.", rating: 5, text: "Fascinating ruins that tell the story of ancient trade. Perfect for history lovers." },
          { author: "Priya J.", rating: 4, text: "Impressive ruins but can get very hot during midday. Visit early morning." }
        ]
      },
      { 
        id: "s4_3", 
        time: "01:00 PM", 
        placeName: "Mango Tree Restaurant", 
        description: "Relaxed riverside lunch", 
        cost: 400, 
        distance: "0.5 km", 
        travelMethod: "walk", 
        isCompleted: false, 
        images: [
          "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop"
        ], 
        reviews: [
          { author: "John D.", rating: 4, text: "Great riverside location with decent food. Perfect for a relaxing lunch break." },
          { author: "Nina S.", rating: 4, text: "Nice ambiance by the river. Good variety of food options." }
        ]
      },
      { 
        id: "s4_4", 
        time: "03:00 PM", 
        placeName: "Lotus Mahal & Stone Chariot", 
        description: "Iconic stone chariot", 
        cost: 40, 
        distance: "3 km", 
        travelMethod: "auto", 
        isCompleted: false, 
        images: [
          "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1520637836862-4d197d17c93a?w=400&h=300&fit=crop"
        ], 
        reviews: [
          { author: "David L.", rating: 5, text: "The stone chariot is absolutely magnificent! A masterpiece of ancient Indian architecture." },
          { author: "Maria F.", rating: 5, text: "Iconic symbol of Hampi. The craftsmanship is incredible and well-preserved." }
        ]
      },
      { 
        id: "s4_5", 
        time: "05:30 PM", 
        placeName: "Matanga Hill", 
        description: "Climb for a stunning sunset over ruins", 
        cost: 0, 
        distance: "2 km", 
        travelMethod: "walk", 
        isCompleted: false, 
        images: [
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop"
        ], 
        reviews: [
          { author: "Vikram R.", rating: 5, text: "Best sunset viewpoint in Hampi! The panoramic view of the ruins is breathtaking." },
          { author: "Sneha L.", rating: 4, text: "Amazing views but the climb can be challenging. Wear good shoes and carry water." }
        ]
      }
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
      { 
        id: "s5_1", 
        time: "09:00 AM", 
        placeName: "Ooty Botanical Gardens", 
        description: "Morning walk among exotic flora", 
        cost: 30, 
        distance: "0 km", 
        travelMethod: "walk", 
        isCompleted: false, 
        images: [
          "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1574263867128-a3d5c1b1deaa?w=400&h=300&fit=crop"
        ], 
        reviews: [
          { author: "Anita K.", rating: 5, text: "Beautiful botanical gardens with amazing variety of plants. Perfect for nature lovers!" },
          { author: "Rohit G.", rating: 4, text: "Well-maintained gardens with exotic flowers. Great for morning walks." }
        ]
      },
      { 
        id: "s5_2", 
        time: "11:30 AM", 
        placeName: "Doddabetta Peak", 
        description: "Highest viewpoint in the Nilgiris", 
        cost: 10, 
        distance: "9 km", 
        travelMethod: "cab", 
        isCompleted: false, 
        images: [
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop"
        ], 
        reviews: [
          { author: "Deepak T.", rating: 5, text: "Spectacular views from the highest peak! Clear weather offers amazing panoramic views." },
          { author: "Meera D.", rating: 4, text: "Beautiful viewpoint but can get foggy. Best visited on clear days." }
        ]
      },
      { 
        id: "s5_3", 
        time: "01:30 PM", 
        placeName: "Earl's Secret", 
        description: "Cozy lunch cafe", 
        cost: 600, 
        distance: "8 km", 
        travelMethod: "cab", 
        isCompleted: false, 
        images: [
          "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop"
        ], 
        reviews: [
          { author: "Kavya N.", rating: 5, text: "Cozy cafe with excellent food and great ambiance. Perfect for a relaxing lunch." },
          { author: "Arjun P.", rating: 4, text: "Good food and service. Nice place to warm up with hot coffee." }
        ]
      },
      { 
        id: "s5_4", 
        time: "03:30 PM", 
        placeName: "Ooty Lake", 
        description: "Boating in the serene lake", 
        cost: 250, 
        distance: "3 km", 
        travelMethod: "auto", 
        isCompleted: false, 
        images: [
          "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"
        ], 
        reviews: [
          { author: "Pooja M.", rating: 4, text: "Peaceful lake with boating facilities. Great for families and couples." },
          { author: "Aditya S.", rating: 4, text: "Nice lake for boating but can get crowded during peak season." }
        ]
      },
      { 
        id: "s5_5", 
        time: "06:00 PM", 
        placeName: "Homemade Chocolate Market", 
        description: "Sweet souvenir shopping", 
        cost: 500, 
        distance: "1.5 km", 
        travelMethod: "walk", 
        isCompleted: false, 
        images: [
          "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1511381939415-e44015466834?w=400&h=300&fit=crop"
        ], 
        reviews: [
          { author: "Sanya P.", rating: 5, text: "Amazing homemade chocolates! Perfect souvenirs to take back home." },
          { author: "Rahul K.", rating: 4, text: "Great variety of chocolates and reasonable prices. Must-visit for chocolate lovers." }
        ]
      }
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
