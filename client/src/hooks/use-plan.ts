import { useMutation } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { GeneratePlanRequest, Plan } from "@shared/schema";

export function useGeneratePlan() {
  return useMutation({
    mutationFn: async (data: GeneratePlanRequest): Promise<Plan> => {
      // Input validation before sending
      const validatedData = api.plans.generate.input.parse(data);

      const res = await fetch(api.plans.generate.path, {
        method: api.plans.generate.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validatedData),
      });

      if (!res.ok) {
        let errorMessage = "Failed to generate plan";
        try {
          const errorData = await res.json();
          const parsedError = api.plans.generate.responses[400].parse(errorData);
          errorMessage = parsedError.message;
        } catch (e) {
          // Fallback error
        }
        throw new Error(errorMessage);
      }

      const responseData = await res.json();
      return api.plans.generate.responses[200].parse(responseData);
    },
  });
}
