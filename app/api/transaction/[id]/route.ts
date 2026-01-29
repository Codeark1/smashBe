import { NextRequest } from "next/server";
import { authMiddleware } from "@/middleware/auth";
import { transactionController } from "@/controllers/transactionController";

/* ------------------------- PATCH /api/transaction/[id] ------------------------- */
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const user = authMiddleware(req);
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
  const user = authMiddleware(req);
  if (!user)
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });

  const { id } = await context.params;
  return transactionController.delete(user.id, id);
}
