import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  console.log("✅ VERIFY OTP ROUTE HIT - POST /api/auth/verify-otp");
  try {
    const { email, otp } = await req.json();
    console.log("📧 Verifying OTP for email:", email);

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

    // 2️⃣ Find the latest OTP for this user
    const { data: otpRecord } = await supabase
      .from("email_otps")
      .select("otp, expires_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (!otpRecord)
      return NextResponse.json({ error: "OTP not found" }, { status: 404 });

    // 3️⃣ Check if OTP is expired
    if (new Date() > new Date(otpRecord.expires_at)) {
      return NextResponse.json({ error: "OTP expired" }, { status: 400 });
    }

    // 4️⃣ Check if OTP matches
    if (otpRecord.otp !== otp)
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });

    // 5️⃣ Mark user as verified
    await supabase.from("users").update({ verified: true }).eq("id", user.id);

    return NextResponse.json({ message: "Email verified successfully." });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
