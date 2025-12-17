export interface User {
  id: string;
  name: string;
  email: string;
  password: string;  
  verified: boolean;
  created_at: string;
  updated_at?: string; 
}

export type SafeUser = Omit<User, 'password'>; 
