import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcrypt';

export async function POST(req: NextRequest) {
  try {
    const { email, otp, newPassword } = await req.json();

    const { data: otpRecord } = await supabase
      .from('email_otps')
      .select('*')
      .eq('otp', otp)
      .single();

    if (!otpRecord || otpRecord.expires_at < new Date().toISOString()) {
      return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await supabase
      .from('users')
      .update({ password: hashedPassword, verified: true })
      .eq('id', otpRecord.user_id);

    return NextResponse.json({ message: 'Password reset successful.' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
