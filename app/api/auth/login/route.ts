import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcrypt";
import { SafeUser } from "@/models/user";
import { signToken } from "@/lib/jwt";

export async function POST(req: NextRequest) {
  console.log("🔐 LOGIN ROUTE HIT - POST /api/auth/login");
  try {
    const { email, password } = await req.json();
    console.log("📧 Login attempt for email:", email);

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    const { data: userData, error } = await supabase
      .from("users")
      .select("id, name, email, password, verified, created_at")
      .eq("email", normalizedEmail)
      .single();

    console.log("🔍 Database query result:", { userData: userData ? "USER_FOUND" : "NO_USER", error: error ? error.message : "NO_ERROR" });

    if (error || !userData) {
      console.log("❌ Login failed: User not found in database");
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    const user = userData as SafeUser & { password: string };
    console.log("👤 User found:", { id: user.id, email: user.email, verified: user.verified });

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("🔐 Password match result:", isMatch);
    
    if (!isMatch) {
      console.log("❌ Login failed: Password does not match");
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    console.log("✅ Password verified, creating JWT token...");
    const token = signToken({ id: user.id, email: user.email });
    console.log("🎟️ JWT token created successfully");

    const { password: _pw, ...safeUser } = user;

    console.log("✅ Login successful for user:", user.email);
    return NextResponse.json({
      message: "Login successful",
      user: safeUser,
      token,
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
