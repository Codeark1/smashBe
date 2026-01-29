import { NextRequest } from "next/server";
import { authMiddleware } from "@/middleware/auth";
import { transactionController } from "@/controllers/transactionController";

/* -------------------------------------------------------------------------- */
/*                              GET /api/transaction                           */
/* -------------------------------------------------------------------------- */
export async function GET(req: NextRequest) {
  console.log("📊 TRANSACTION LIST ROUTE HIT - GET /api/transaction");
  const user = authMiddleware(req);
  console.log("👤 User authenticated:", user ? `ID: ${user.id}` : "FAILED");

  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  return transactionController.list(user.id);
}

/* -------------------------------------------------------------------------- */
/*                              POST /api/transaction                          */
/* -------------------------------------------------------------------------- */
export async function POST(req: NextRequest) {
  console.log("💰 TRANSACTION CREATE ROUTE HIT - POST /api/transaction");
  const user = authMiddleware(req);
  console.log("👤 User authenticated:", user ? `ID: ${user.id}` : "FAILED");

  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  return transactionController.create(req, user.id);
}
