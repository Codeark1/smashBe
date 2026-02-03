import { NextRequest, NextResponse } from "next/server";
import { getBudgetProgressAsync } from "../../../../services/budgetService";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const period = searchParams.get("period");
    if (!userId || !period) throw new Error("userId and period are required");
    if (period !== "monthly" && period !== "weekly")
      throw new Error("Invalid period");
    const progress = await getBudgetProgressAsync(
      userId,
      period as "monthly" | "weekly",
    );
    return NextResponse.json(progress);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
// Removed budget progress API route
