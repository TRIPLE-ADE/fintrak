import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// Define types for each entity
type Expense = {
  id: string;
  user_id: string;
  amount: number;
  description?: string;
  category_id?: string;
  date: string;
  is_recurring: boolean;
  created_at: string;
};

type Category = {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
};


// Define the Zustand store state and actions
type StoreState = {
  expenses: Expense[];
  categories: Category[];

  // Actions
  addExpense: (expense: Omit<Expense, "id" | "created_at">) => void;
  updateExpense: (id: string, updatedData: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;

  addCategory: (category: Omit<Category, "id" | "created_at">) => string;
  updateCategory: (id: string, updatedData: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

};

// Mock Data
export const mockUserId = crypto.randomUUID();
const mockCategoryId1 = crypto.randomUUID();
const mockCategoryId2 = crypto.randomUUID();
const mockData = {
  expenses: [
    {
      id: crypto.randomUUID(),
      user_id: mockUserId,
      amount: 150.0,
      description: "Groceries",
      category_id: mockCategoryId1,
      date: "2024-11-01",
      is_recurring: false,
      created_at: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      user_id: mockUserId,
      amount: 50.0,
      description: "Gas",
      category_id: mockCategoryId2,
      date: "2024-11-02",
      is_recurring: true,
      created_at: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      user_id: mockUserId,
      amount: 200.0,
      description: "Gas",
      category_id: mockCategoryId2,
      date: "2024-12-02",
      is_recurring: true,
      created_at: new Date().toISOString(),
    },
  ],
  categories: [
    {
      id: mockCategoryId1,
      user_id: mockUserId,
      name: "Food",
      created_at: new Date().toISOString(),
    },
    {
      id: mockCategoryId2,
      user_id: mockUserId,
      name: "Transport",
      created_at: new Date().toISOString(),
    },
  ],
};

// Create the store
const useExpenseStore = create<StoreState>()(
  persist(
    (set) => ({
      expenses: mockData.expenses,
      categories: mockData.categories,

      // Expense Actions
      addExpense: (expense) =>
        set((state) => ({
          expenses: [
            ...state.expenses,
            {
              ...expense,
              id: crypto.randomUUID(),
              created_at: new Date().toISOString(),
            },
          ],
        })),
      updateExpense: (id, updatedData) =>
        set((state) => ({
          expenses: state.expenses.map((expense) =>
            expense.id === id
              ? {
                  ...expense,
                  ...updatedData,
                  updated_at: new Date().toISOString(),
                }
              : expense
          ),
        })),
      deleteExpense: (id) =>
        set((state) => ({
          expenses: state.expenses.filter((expense) => expense.id !== id),
        })),

      // Category Actions
      addCategory: (category) => {
        const newId = crypto.randomUUID();
        set((state) => ({
          categories: [
            ...state.categories,
            {
              ...category,
              id: newId,
              created_at: new Date().toISOString(),
            },
          ],
        }));
        return newId;
      },
      updateCategory: (id, updatedData) =>
        set((state) => ({
          categories: state.categories.map((category) =>
            category.id === id
              ? {
                  ...category,
                  ...updatedData,
                  updated_at: new Date().toISOString(),
                }
              : category
          ),
        })),
      deleteCategory: (id) =>
        set((state) => ({
          categories: state.categories.filter((category) => category.id !== id),
        })),
    }),
    {
      name: "expense-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useExpenseStore;
