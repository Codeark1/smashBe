import { NextRequest, NextResponse } from "next/server";
import { deleteBudgetAsync } from "../../../../services/budgetService";

  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;
    if (!id) throw new Error("id is required");
    await deleteBudgetAsync(id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
