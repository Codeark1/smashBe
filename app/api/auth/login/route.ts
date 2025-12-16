import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcrypt';
import { signToken } from '@/lib/jwt';
import { User } from '@/models/user';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const { data, error } = await supabase
      .from('users')
      .select('id, email, password, verified, created_at, updated_at')
      .eq('email', normalizedEmail)
      .single();

    const user = data as User | null;

    // Supabase returns null data if user not found
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    if (!user.verified) return NextResponse.json({ error: 'Email not verified' }, { status: 403 });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return NextResponse.json({ error: 'Invalid password' }, { status: 400 });

    const token = signToken({ id: user.id, email: user.email }, '7d');

    const { password: _, ...safeUser } = user;
    return NextResponse.json({ token, user: safeUser });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
