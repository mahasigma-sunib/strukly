export interface WeeklyStat {
  name: string;
  week: number;
  spending: number;
  startDate: number;
  endDate: number;
}

export interface ExpenseStatisticType {
  month: number;
  year: number;
  weekly: WeeklyStat[]; // Changed from number[] to WeeklyStat[]
  total: number;
}