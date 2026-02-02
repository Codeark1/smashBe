import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  // Fetch all transactions (optionally filter by user)
  const { data, error } = await supabase
    .from("transactions")
    .select("amount, type");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  let totalIncome = 0;
  let totalExpense = 0;

  data?.forEach((tx: { amount: number; type: string }) => {
    if (tx.type === "income") {
      totalIncome += tx.amount;
    } else if (tx.type === "expense") {
      totalExpense += tx.amount;
    }
  });

  const balance = totalIncome - totalExpense;

  return NextResponse.json({
    totalIncome,
    totalExpense,
    balance,
  });
}
