import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcrypt';
import { generateOtp } from '@/utils/generateOtp';
import { sendEmail } from '@/utils/sendEmail';
import { SafeUser } from '@/models/user';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if user exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', normalizedEmail)
      .single();

    if (existingUser) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const { data, error } = await supabase
      .from('users')
      .insert([{ name, email: normalizedEmail, password: hashedPassword, verified: false }])
      .select('id, name, email, verified, created_at')
      .single();

    if (error || !data) {
      return NextResponse.json({ error: error?.message || 'Failed to create user' }, { status: 400 });
    }

    const user = data as SafeUser;

    // Generate OTP
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

    // Save OTP
    await supabase.from('email_otps').insert([{ user_id: user.id, otp, expires_at: expiresAt }]);

    // Send OTP email
    await sendEmail(
      normalizedEmail,
      'Verify Your Email',
      `Your OTP is ${otp}. It expires in 5 minutes.`,
      `<p>Your OTP is <strong>${otp}</strong>. It expires in 5 minutes.</p>`
    );

    return NextResponse.json({ message: 'User created successfully. OTP sent.', user });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
