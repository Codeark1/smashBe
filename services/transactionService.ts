import { supabase } from "@/lib/supabase";

export interface CreateTransactionDTO {
  amount: number;
  type: "income" | "expense";
  category: string;
  note?: string;
  date?: string;
}

export const transactionService = {
  /* -------------------------------------------------------------------------- */
  /*                                 CREATE                                     */
  /* -------------------------------------------------------------------------- */
  async create(userId: string, data: CreateTransactionDTO) {
    const { amount, type, category, note, date } = data;

    // Basic validation
    if (!amount || amount <= 0) {
      throw new Error("Amount must be greater than 0");
    }

    if (!type || !["income", "expense"].includes(type)) {
      throw new Error("Invalid transaction type");
    }

    if (!category) {
      throw new Error("Category is required");
    }

    const { data: transaction, error } = await supabase
      .from("transactions")
      .insert([
        {
          user_id: userId,
          amount,
          type,
          category,
          note: note || null,
          date: date || new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return transaction;
  },

  /* -------------------------------------------------------------------------- */
  /*                                   LIST                                     */
  /* -------------------------------------------------------------------------- */
  async list(userId: string) {
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  /* -------------------------------------------------------------------------- */
  /*                                  UPDATE                                    */
  /* -------------------------------------------------------------------------- */
  async update(userId: string, id: string, data: Partial<CreateTransactionDTO>) {
    const { data: updated, error } = await supabase
      .from("transactions")
      .update(data)
      .eq("id", id)
      .eq("user_id", userId) // ensures ownership
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    if (!updated) {
      throw new Error("Transaction not found or unauthorized");
    }

    return updated;
  },

  /* -------------------------------------------------------------------------- */
  /*                                  DELETE                                    */
  /* -------------------------------------------------------------------------- */
  async delete(userId: string, id: string) {
    const { error } = await supabase
      .from("transactions")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      throw new Error(error.message);
    }

    return true;
  },
};
