import { NextRequest, NextResponse } from "next/server";
import {
  createOrUpdateBudgetAsync,
  getBudgetsAsync,
} from "../../../services/budgetService";

  try {
    const data = await req.json();
    const budget = await createOrUpdateBudgetAsync(data);
    return NextResponse.json(budget, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

  try {
    const data = await req.json();
    const budget = await createOrUpdateBudgetAsync(data);
    return NextResponse.json(budget, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    if (!userId) throw new Error("userId is required");
    const budgets = await getBudgetsAsync(userId);
    return NextResponse.json(budgets);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
