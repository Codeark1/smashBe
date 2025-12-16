import { NextRequest, NextResponse } from "next/server";
import { transactionService } from "@/services/transactionService";

export const transactionController = {
  create: async (req: NextRequest, userId: string) => {
    try {
      const data = await req.json();
      const transaction = await transactionService.create(userId, data);
      return NextResponse.json({ transaction }, { status: 201 });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Internal Server Error";
      return NextResponse.json({ error: message }, { status: 500 });
    }
  },

  list: async (userId: string) => {
    try {
      const transactions = await transactionService.list(userId);
      return NextResponse.json({ transactions });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Internal Server Error";
      return NextResponse.json({ error: message }, { status: 500 });
    }
  },

  update: async (req: NextRequest, userId: string, id: string) => {
    try {
      const data = await req.json();
      const transaction = await transactionService.update(userId, id, data);
      return NextResponse.json({ transaction });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Internal Server Error";
      return NextResponse.json({ error: message }, { status: 500 });
    }
  },

  delete: async (userId: string, id: string) => {
    try {
      await transactionService.delete(userId, id);
      return NextResponse.json({ message: "Transaction deleted successfully" });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Internal Server Error";
      return NextResponse.json({ error: message }, { status: 500 });
    }
  },
};
