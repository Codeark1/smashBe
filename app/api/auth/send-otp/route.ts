import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { generateOtp } from '@/utils/generateOtp';
import { sendEmail } from '@/utils/sendEmail';
import { User } from '@/models/user';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    const { data } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    const user = data as User | null;

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    await supabase.from('email_otps').upsert([{ user_id: user.id, otp, expires_at: expiresAt }]);

    await sendEmail(email, 'Your OTP', `Your OTP is ${otp}. It expires in 5 minutes.`);

    return NextResponse.json({ message: 'OTP sent successfully.' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
