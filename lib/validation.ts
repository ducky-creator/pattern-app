import { z } from "zod";

export const logEntrySchema = z.object({
  trigger: z.string().trim().min(3).max(300),
  emotion: z.string().trim().min(2).max(80),
  intensity: z.number().int().min(1).max(10),
  action: z.string().trim().min(3).max(300)
});
