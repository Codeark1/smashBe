import { NextRequest, NextResponse } from "next/server";
import { deleteBudgetAsync } from "../../../../services/budgetService";

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    if (!id) throw new Error("id is required");
    await deleteBudgetAsync(id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
