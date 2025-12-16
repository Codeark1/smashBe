// export type Transaction = {
//   id: string;
//   user_id: string;
//   amount: number;
//   type: 'income' | 'expense';
//   category: string;
//   note?: string;
//   date: string; // ISO date string
//   created_at: string;
//   updated_at?: string;
// };

export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  note?: string;
  date: string;
}
