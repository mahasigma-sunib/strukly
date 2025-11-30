export interface WeeklyStat {
  name: string;   // "Week 1"
  amount: number; // 50000
}

export interface ExpenseStatisticType {
  month: number;
  year: number;
  weekly: WeeklyStat[]; // Changed from number[] to WeeklyStat[]
  total: number;
}