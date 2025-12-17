// app/api/auth/reset-password/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  try {
    const { otp, newPassword } = await req.json();

    if (!otp || !newPassword) {
      return NextResponse.json(
        { error: "OTP and new password are required" },
        { status: 400 }
      );
    }

    const { data: otpRecord } = await supabase
      .from("email_otps")
      .select("*")
      .eq("otp", otp)
      .single();

    if (!otpRecord) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    if (new Date(otpRecord.expires_at) < new Date()) {
      return NextResponse.json({ error: "OTP expired" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await supabase
      .from("users")
      .update({ password: hashedPassword, verified: true })
      .eq("id", otpRecord.user_id);

    // Optional: delete the OTP after use
    await supabase.from("email_otps").delete().eq("id", otpRecord.id);

    return NextResponse.json({ message: "Password reset successfully" });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
