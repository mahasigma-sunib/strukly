import type { CategoryKey } from "../utils/CategoryConfig";

export type GoalItem = {
  id: string;
  name: string;
  category: CategoryKey;
  price: number;
  deposit: number;
  isCompleted: boolean;
  createdAt: Date;
};
