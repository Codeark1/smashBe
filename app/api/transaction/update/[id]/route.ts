import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { authMiddleware } from '@/middleware/auth';
import { Transaction } from '@/models/transaction';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const user = authMiddleware(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { amount, type, category, note, date } = await req.json();
    const { id } = params;

    const { data, error } = await supabase
      .from('transactions')
      .update({ amount, type, category, note, date })
      .eq('id', id)
      .eq('user_id', user.id)
      .select('*')
      .single();

    const transaction = data as Transaction | null;

    if (error || !transaction) return NextResponse.json({ error: error?.message || 'Failed to update transaction' }, { status: 400 });

    return NextResponse.json({ transaction });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
