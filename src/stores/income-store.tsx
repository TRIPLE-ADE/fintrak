import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type Income = {
  id: string;
  user_id: string;
  amount: number;
  description: string;
  category_id?: string;
  date: string;
  is_recurring: boolean;
  created_at: string;
};

type IncomeCategory = {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
};

type IncomeStoreState = {
  incomes: Income[];
  categories: IncomeCategory[];

  addIncome: (income: Omit<Income, "id" | "created_at">) => void;
  updateIncome: (id: string, updatedData: Partial<Income>) => void;
  deleteIncome: (id: string) => void;

  addCategory: (category: Omit<IncomeCategory, "id" | "created_at">) => string;
  updateCategory: (id: string, updatedData: Partial<IncomeCategory>) => void;
  deleteCategory: (id: string) => void;
};

export const mockIncomeUserId = crypto.randomUUID();
const mockIncomeCategoryId1 = crypto.randomUUID();
const mockIncomeCategoryId2 = crypto.randomUUID();
const mockIncomeData: { incomes: Income[]; categories: IncomeCategory[] } = {
  incomes: [
    {
      id: crypto.randomUUID(),
      user_id: mockIncomeUserId,
      amount: 2500,
      description: "Salary",
      category_id: mockIncomeCategoryId1,
      date: "2024-11-01",
      is_recurring: true,
      created_at: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      user_id: mockIncomeUserId,
      amount: 300,
      description: "Freelance",
      category_id: mockIncomeCategoryId2,
      date: "2024-11-10",
      is_recurring: false,
      created_at: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      user_id: mockIncomeUserId,
      amount: 150,
      description: "Dividends",
      category_id: mockIncomeCategoryId2,
      date: "2024-12-02",
      is_recurring: false,
      created_at: new Date().toISOString(),
    },
  ],
  categories: [
    {
      id: mockIncomeCategoryId1,
      user_id: mockIncomeUserId,
      name: "Salary",
      created_at: new Date().toISOString(),
    },
    {
      id: mockIncomeCategoryId2,
      user_id: mockIncomeUserId,
      name: "Side Hustle",
      created_at: new Date().toISOString(),
    },
  ],
};

const useIncomeStore = create<IncomeStoreState>()(
  persist(
    (set) => ({
      incomes: mockIncomeData.incomes,
      categories: mockIncomeData.categories,

      addIncome: (income) =>
        set((state) => ({
          incomes: [
            ...state.incomes,
            { ...income, id: crypto.randomUUID(), created_at: new Date().toISOString() },
          ],
        })),
      updateIncome: (id, updatedData) =>
        set((state) => ({
          incomes: state.incomes.map((income) =>
            income.id === id
              ? { ...income, ...updatedData, updated_at: new Date().toISOString() }
              : income
          ),
        })),
      deleteIncome: (id) =>
        set((state) => ({
          incomes: state.incomes.filter((income) => income.id !== id),
        })),

      addCategory: (category) => {
        const newId = crypto.randomUUID();
        set((state) => ({
          categories: [
            ...state.categories,
            { ...category, id: newId, created_at: new Date().toISOString() },
          ],
        }));
        return newId;
      },
      updateCategory: (id, updatedData) =>
        set((state) => ({
          categories: state.categories.map((category) =>
            category.id === id
              ? { ...category, ...updatedData, updated_at: new Date().toISOString() }
              : category
          ),
        })),
      deleteCategory: (id) =>
        set((state) => ({
          categories: state.categories.filter((category) => category.id !== id),
        })),
    }),
    {
      name: "income-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useIncomeStore;


