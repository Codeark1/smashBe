import { NextRequest, NextResponse } from "next/server";
import { transactionService } from "@/services/transactionService";

export const transactionController = {
  async create(req: NextRequest, userId: string) {
    try {
      const body = await req.json();

      // 🔐 Controller-level validation
      const { amount, category, date, type } = body;

      if (!amount || !category || !date || !type) {
        return NextResponse.json(
          { error: "amount, category, date and type are required" },
          { status: 400 }
        );
      }

      if (!["income", "expense"].includes(type)) {
        return NextResponse.json(
          { error: "Invalid transaction type" },
          { status: 400 }
        );
      }

      const transaction = await transactionService.create(userId, body);

      return NextResponse.json({ transaction }, { status: 201 });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Internal Server Error";
      return NextResponse.json({ error: message }, { status: 500 });
    }
  },

  async list(userId: string) {
    try {
      const transactions = await transactionService.list(userId);
      return NextResponse.json({ transactions });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Internal Server Error";
      return NextResponse.json({ error: message }, { status: 500 });
    }
  },

  async update(req: NextRequest, userId: string, id: string) {
    try {
      const body = await req.json();
      const transaction = await transactionService.update(userId, id, body);
      return NextResponse.json({ transaction });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Internal Server Error";
      return NextResponse.json({ error: message }, { status: 500 });
    }
  },

  async delete(userId: string, id: string) {
    try {
      await transactionService.delete(userId, id);
      return NextResponse.json({
        message: "Transaction deleted successfully",
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Internal Server Error";
      return NextResponse.json({ error: message }, { status: 500 });
    }
  },
};
