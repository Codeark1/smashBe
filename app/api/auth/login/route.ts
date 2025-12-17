import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcrypt';
import { SafeUser } from '@/models/user';
import { signToken } from '@/lib/jwt';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Find user
    const { data: userData, error } = await supabase
      .from('users')
      .select('id, name, email, password, verified, created_at')
      .eq('email', normalizedEmail)
      .single();

    if (error || !userData) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const user = userData as SafeUser & { password: string };

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Optionally generate JWT
    const token = signToken({ id: user.id });

    // Return safe user (exclude password)
    const { password: _pw, ...safeUser } = user;

    return NextResponse.json({ message: 'Login successful', user: safeUser, token });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
