// app/api/auth/forgot-password/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { generateOtp } from "@/utils/generateOtp";
import { sendEmail } from "@/utils/sendEmail";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const { data: user } = await supabase
      .from("users")
      .select("id, verified")
      .eq("email", email.trim().toLowerCase())
      .single();

    if (!user) {
      // Do not reveal that user doesn't exist
      return NextResponse.json({ message: "If this email exists, an OTP has been sent." });
    }

    const otp = generateOtp(); 
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await supabase.from("email_otps").insert([
      { user_id: user.id, otp, expires_at: expiresAt },
    ]);

    await sendEmail(
      email,
      "Reset Your Password",
      `Your OTP is ${otp}. It expires in 5 minutes.`,
      `<p>Your OTP is <strong>${otp}</strong>. It expires in 5 minutes.</p>`
    );

    return NextResponse.json({ message: "If this email exists, an OTP has been sent." });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
