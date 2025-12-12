import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcrypt';
import { generateOtp } from '@/utils/generateOtp';
import { sendEmail } from '@/utils/sendEmail';
import { User } from '@/models/user';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    // 1️⃣ Check if user already exists
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existing) return NextResponse.json({ error: 'Email already registered' }, { status: 400 });

    // 2️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3️⃣ Insert user
    const { data, error } = await supabase
      .from('users')
      .insert([{ email, password: hashedPassword, verified: false }])
      .select('id, email, verified, created_at')
      .single();

    if (error || !data) return NextResponse.json({ error: error?.message || 'Failed to create user' }, { status: 400 });

    const user = data as User;

    // 4️⃣ Generate OTP
    const otp = generateOtp(); // ✅ Declare otp first
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // 5️⃣ Store OTP in DB
    await supabase.from('email_otps').insert([{ user_id: user.id, otp, expires_at: expiresAt }]);

    // 6️⃣ Send OTP email
    await sendEmail(
      email,
      'Verify Your Email',
      `Your OTP is ${otp}. It expires in 5 minutes.`,
      `<p>Your OTP is <strong>${otp}</strong>. It expires in 5 minutes.</p>`
    );

    // 7️⃣ Return safe user (remove password)
    const { password: _, ...safeUser } = user;
    return NextResponse.json({ message: 'User created. OTP sent.', user: safeUser });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
