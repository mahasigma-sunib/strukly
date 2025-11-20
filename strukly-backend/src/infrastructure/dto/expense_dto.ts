import { z } from "zod";
import Expense from "../../domain/aggregates/expense";
import { moneyToDTO, MoneyDTOSchema } from "./money_dto";
import {
  expenseItemToDTO,
  ExpenseItemDTOSchema,
  CreateExpenseItemDTOSchema,
} from "./expense_item_dto";

export const CreateExpenseDTOSchema = z.object({
  vendorName: z.string(),
  category: z.string(),
  dateTime: z.iso.datetime(),

  subtotalAmount: MoneyDTOSchema,
  taxAmount: MoneyDTOSchema,
  discountAmount: MoneyDTOSchema,
  serviceAmount: MoneyDTOSchema,

  items: z.array(CreateExpenseItemDTOSchema),
});

export const ExpenseDTOSchema = CreateExpenseDTOSchema.extend({
  id: z.uuid("Invalid expense ID format"),
  totalAmount: MoneyDTOSchema,
  userID: z.uuid("Invalid user ID format"),
  items: z.array(ExpenseItemDTOSchema),
});

export type CreateExpenseDTO = z.infer<typeof CreateExpenseDTOSchema>;
export type ExpenseDTO = z.infer<typeof ExpenseDTOSchema>;

export function expenseToDTO(expense: Expense): ExpenseDTO {
  return {
    id: expense.header.id.value,
    vendorName: expense.header.vendorName,
    category: expense.header.category.value,
    dateTime: expense.header.dateTime.toISOString(),

    subtotalAmount: moneyToDTO(expense.header.subtotalAmount),
    taxAmount: moneyToDTO(expense.header.taxAmount),
    discountAmount: moneyToDTO(expense.header.discountAmount),
    serviceAmount: moneyToDTO(expense.header.serviceAmount),
    totalAmount: moneyToDTO(expense.header.totalAmount),

    userID: expense.header.userID.value,

    items: expense.items.map((item) => expenseItemToDTO(item)),
  };
}
