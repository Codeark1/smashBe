import { Budget, BudgetSchema } from "../models/budget";
import { supabase } from "../lib/supabase";

export const createOrUpdateBudgetAsync = async (
  data: Omit<Budget, "id" | "createdAt" | "updatedAt"> & { id?: string },
) => {
  const parsed = BudgetSchema.safeParse(data);
  if (!parsed.success) throw parsed.error;
  if (data.id) {
    // Update
    const { error, data: updated } = await supabase
      .from("budgets")
      .update({ ...data, updatedAt: new Date() })
      .eq("id", data.id)
      .select()
      .single();
    if (error) throw error;
    return updated;
  } else {
    // Create
    const { error, data: created } = await supabase
      .from("budgets")
      .insert([{ ...data, createdAt: new Date(), updatedAt: new Date() }])
      .select()
      .single();
    if (error) throw error;
    return created;
  }
};

export const getBudgetsAsync = async (userId: string) => {
  const { data, error } = await supabase
    .from("budgets")
    .select("*")
    .eq("userId", userId);
  if (error) throw error;
  return data;
};

export const deleteBudgetAsync = async (id: string) => {
  const { error } = await supabase.from("budgets").delete().eq("id", id);
  if (error) throw error;
  return true;
};

export const getBudgetProgressAsync = async (
  userId: string,
  period: "monthly" | "weekly",
) => {
  // Get budgets for user and period
  const { data: budgets, error } = await supabase
    .from("budgets")
    .select("*")
    .eq("userId", userId)
    .eq("period", period);
  if (error) throw error;
  // TODO: Calculate spent per category using transactions table
  return budgets?.map((b) => ({ ...b, spent: 0 })) ?? [];
};
