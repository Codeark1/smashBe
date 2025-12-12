import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { authMiddleware } from '@/middleware/auth';
import { Transaction } from '@/models/transaction';

export async function GET(req: NextRequest) {
  const user = authMiddleware(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    const transactions = data as Transaction[] | null;

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json({ transactions });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
