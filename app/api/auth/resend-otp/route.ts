import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { generateOtp } from "@/utils/generateOtp";
import { sendEmail } from "@/utils/sendEmail";

export async function POST(req: NextRequest) {
  console.log("📤 RESEND OTP ROUTE HIT - POST /api/auth/resend-otp");
  try {
    const { email } = await req.json();
    console.log("📧 Resending OTP for email:", email);

    // 1️⃣ Find the user
    const { data: user } = await supabase
      .from("users")
      .select("id, verified")
      .eq("email", email)
      .single();

    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    if (user.verified)
      return NextResponse.json(
        { error: "Email already verified" },
        { status: 400 },
      );

    // Optional: delete old OTPs
    await supabase.from("email_otps").delete().eq("user_id", user.id);

    // 2️⃣ Generate new OTP
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // 3️⃣ Store OTP
    await supabase
      .from("email_otps")
      .insert([{ user_id: user.id, otp, expires_at: expiresAt }]);

    // 4️⃣ Send OTP email
    await sendEmail(
      email,
      "Your OTP Code",
      `Your new OTP is ${otp}. It expires in 5 minutes.`,
      `<p>Your new OTP is <strong>${otp}</strong>. It expires in 5 minutes.</p>`,
    );

    return NextResponse.json({ message: "OTP resent successfully." });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
