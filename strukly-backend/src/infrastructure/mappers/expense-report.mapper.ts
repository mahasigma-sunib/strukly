import Expense from "src/domain/aggregates/expense";
import { ExpenseReportResponse, WeeklyData } from "../schemas/responses";
import { mapExpenseToHistoryItem } from "./expense.mapper";

export function createExpenseReportResponse(
  total: number,
  weekly: WeeklyData[],
  history: Expense[]
): ExpenseReportResponse {
  return {
    total,
    weekly,
    history: history.map(mapExpenseToHistoryItem),
  };
}
