import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { authMiddleware } from "@/middleware/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = authMiddleware(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 👇 REQUIRED in Next 16
    const { id } = await params;

    const {
      amount,
      type,
      category,
      note,
      date,
    }: {
      amount?: number;
      type?: "income" | "expense";
      category?: string;
      note?: string;
      date?: string;
    } = await req.json();

    const { data, error } = await supabase
      .from("transactions")
      .update({ amount, type, category, note, date })
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ transaction: data });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
