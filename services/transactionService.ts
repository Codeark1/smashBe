import { supabase } from "@/lib/supabase";
import { Transaction } from "@/models/transaction";

export const transactionService = {
  async create(userId: string, data: Omit<Transaction, "id" | "user_id">) {
    const { data: transaction, error } = await supabase
      .from("transactions")
      .insert([{ user_id: userId, ...data }])
      .select("*")
      .single();

    if (error || !transaction) throw new Error(error?.message || "Failed to create transaction");
    return transaction;
  },

  async list(userId: string) {
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false });

    if (error) throw new Error(error.message);
    return data as Transaction[];
  },

  async update(userId: string, id: string, data: Partial<Transaction>) {
    const { data: transaction, error } = await supabase
      .from("transactions")
      .update(data)
      .eq("id", id)
      .eq("user_id", userId)
      .select("*")
      .single();

    if (error || !transaction) throw new Error(error?.message || "Failed to update transaction");
    return transaction;
  },

  async delete(userId: string, id: string) {
    const { error } = await supabase
      .from("transactions")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) throw new Error(error.message);
    return true;
  },
};
