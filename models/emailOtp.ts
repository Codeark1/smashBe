export type EmailOtp = {
  id?: string;
  user_id: string;
  otp: string;
  expires_at: string;
  created_at?: string;
};
