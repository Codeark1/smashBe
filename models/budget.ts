import { z } from "zod";

export const BudgetSchema = z.object({
  id: z.string().optional(),
  userId: z.string(),
  category: z.string(),
  amount: z.number(),
  period: z.enum(["monthly", "weekly"]),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type Budget = z.infer<typeof BudgetSchema>;
// Removed budget model
