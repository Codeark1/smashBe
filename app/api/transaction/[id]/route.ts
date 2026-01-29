import { NextRequest } from "next/server";
import { authMiddleware } from "@/middleware/auth";
import { transactionController } from "@/controllers/transactionController";

/* ------------------------- PATCH /api/transaction/[id] ------------------------- */
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  console.log("✏️ TRANSACTION UPDATE ROUTE HIT - PATCH /api/transaction/[id]");
  const user = authMiddleware(req);
  console.log("👤 User authenticated:", user ? `ID: ${user.id}` : "FAILED");
  if (!user)
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });

  const { id } = await context.params;
  return transactionController.update(req, user.id, id);
}

/* ------------------------- DELETE /api/transaction/[id] ------------------------- */
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  console.log("🗑️ TRANSACTION DELETE ROUTE HIT - DELETE /api/transaction/[id]");
  const user = authMiddleware(req);
  console.log("👤 User authenticated:", user ? `ID: ${user.id}` : "FAILED");
  if (!user)
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });

  const { id } = await context.params;
  return transactionController.delete(user.id, id);
}
