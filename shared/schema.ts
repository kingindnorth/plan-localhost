import { z } from "zod";

export const stepSchema = z.object({
  id: z.string(),
  time: z.string(),
  placeName: z.string(),
  description: z.string(),
  cost: z.number(),
  distance: z.string(),
  travelMethod: z.enum(["walk", "auto", "cab", "transit"]),
  isCompleted: z.boolean().default(false),
});

export const planSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  estimatedTotalCost: z.number(),
  transportCost: z.number(),
  foodCost: z.number(),
  activityCost: z.number(),
  steps: z.array(stepSchema),
  suggestions: z.array(z.object({
    id: z.string(),
    type: z.enum(["cafe", "viewpoint", "market", "museum"]),
    name: z.string(),
    description: z.string()
  }))
});

export type Step = z.infer<typeof stepSchema>;
export type Plan = z.infer<typeof planSchema>;

export const generatePlanRequestSchema = z.object({
  destination: z.string().optional(),
  useLocation: z.boolean().optional(),
  budget: z.number(),
  style: z.enum(["budget", "balanced", "luxury"]),
  duration: z.enum(["half_day", "1_day", "weekend"])
});

export type GeneratePlanRequest = z.infer<typeof generatePlanRequestSchema>;
