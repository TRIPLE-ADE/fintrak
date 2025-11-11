import { useMemo } from "react";
import { useState } from "react";
import { PlusCircle } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import useDisclosure from "@/hooks/use-disclosure";
import useExpenseStore from "@/stores/expense-store";
import useIncomeStore from "@/stores/income-store";

import ExpenseList from "@/components/expense-list";
import ExpenseChart from "@/components/expense-chart";
import ExpenseTrends from "@/components/expense-trends";
import AddExpenseModal from "@/components/add-expense-modal";
import AddIncomeModal from "@/components/add-income-modal";
import IncomeChart from "@/components/income-chart";
import IncomeTrends from "@/components/income-trends";
import IncomeList from "@/components/income-list";
import { toCsv, downloadCsv } from "@/lib/utils/csv";

const categories = [
  { name: "Housing", percentage: 38, color: "bg-blue-400" },
  { name: "Food", percentage: 30, color: "bg-pink-400" },
  { name: "Transport", percentage: 13, color: "bg-purple-400" },
  { name: "Entertainment", percentage: 11, color: "bg-indigo-400" },
  { name: "Others", percentage: 8, color: "bg-teal-400" },
];

const Dashboard = () => {
  const { isOpen: isExpenseOpen, onClose: onExpenseClose, onOpen: onExpenseOpen } = useDisclosure();
  const { expenses, categories: expenseCategories } = useExpenseStore();
  const { isOpen: isIncomeOpen, onClose: onIncomeClose, onOpen: onIncomeOpen } = useDisclosure();
  const { incomes, categories: incomeCategories } = useIncomeStore();

  const [expenseFilters, setExpenseFilters] = useState({
    category_id: "all",
    sortBy: "date-desc" as "date-desc" | "date-asc" | "amount-desc" | "amount-asc",
  });
  const [incomeFilters, setIncomeFilters] = useState({
    category_id: "all",
    sortBy: "date-desc" as "date-desc" | "date-asc" | "amount-desc" | "amount-asc",
  });

  const totalExpenses = useMemo(
    () => expenses.reduce((sum, expense) => sum + expense.amount, 0),
    [expenses],
  );
  const totalIncome = useMemo(
    () => incomes.reduce((sum, income) => sum + income.amount, 0),
    [incomes],
  );

  const filteredSortedExpenses = useMemo(() => {
    let list = [...expenses];
    if (expenseFilters.category_id !== "all") {
      list = list.filter((e) => e.category_id === expenseFilters.category_id);
    }
    switch (expenseFilters.sortBy) {
      case "date-asc":
        list.sort((a, b) => +new Date(a.date) - +new Date(b.date));
        break;
      case "amount-desc":
        list.sort((a, b) => b.amount - a.amount);
        break;
      case "amount-asc":
        list.sort((a, b) => a.amount - b.amount);
        break;
      default:
        list.sort((a, b) => +new Date(b.date) - +new Date(a.date));
    }
    return list;
  }, [expenses, expenseFilters]);

  const filteredSortedIncomes = useMemo(() => {
    let list = [...incomes];
    if (incomeFilters.category_id !== "all") {
      list = list.filter((i) => i.category_id === incomeFilters.category_id);
    }
    switch (incomeFilters.sortBy) {
      case "date-asc":
        list.sort((a, b) => +new Date(a.date) - +new Date(b.date));
        break;
      case "amount-desc":
        list.sort((a, b) => b.amount - a.amount);
        break;
      case "amount-asc":
        list.sort((a, b) => a.amount - b.amount);
        break;
      default:
        list.sort((a, b) => +new Date(b.date) - +new Date(a.date));
    }
    return list;
  }, [incomes, incomeFilters]);

  return (
    <div className="p-4">
      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          {
            icon: <PlusCircle />,
            label: "Add Expense",
            action: onExpenseOpen,
          },
          {
            icon: <PlusCircle />,
            label: "Add Income",
            action: onIncomeOpen,
          },
        ].map((action, index) => (
          <Button
            key={index}
            className="bg-primary text-white h-24 flex flex-col items-center justify-center gap-2 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-200"
            variant="ghost"
            onClick={action.action}
          >
            {action.icon}
            <span className="text-sm font-medium">{action.label}</span>
          </Button>
        ))}
      </div>

      {/* Expense Charts and Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Expense Chart */}
        <Card className="bg-gray-100 p-6 rounded-xl shadow relative">
          <h3 className="text-xl font-semibold mb-4 text-primary">Spending Distribution</h3>
          <ExpenseChart />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <p className="text-2xl font-bold">${totalExpenses.toLocaleString()}</p>
          </div>
          <div className="grid grid-cols-5 gap-2 mt-4">
            {categories.map((category) => (
              <div key={category.name} className="text-center">
                <div className={`w-full h-1 ${category.color} rounded mb-1`} />
                <p className="text-xs text-gray-600">{category.percentage}%</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Spending Trends Chart */}
        <Card className="bg-gray-100 p-6 rounded-xl shadow relative">
          <h3 className="text-xl font-semibold mb-4 text-primary">Spending Trends</h3>
          <ExpenseTrends />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <p className="text-2xl font-bold">${totalExpenses.toLocaleString()}</p>
          </div>
        </Card>
      </div>

      {/* Income Charts and Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Income Distribution */}
        <Card className="bg-gray-100 p-6 rounded-xl shadow relative">
          <h3 className="text-xl font-semibold mb-4 text-primary">Income Distribution</h3>
          <IncomeChart />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <p className="text-2xl font-bold">${totalIncome.toLocaleString()}</p>
          </div>
        </Card>

        {/* Income Trends */}
        <Card className="bg-gray-100 p-6 rounded-xl shadow relative">
          <h3 className="text-xl font-semibold mb-4 text-primary">Income Trends</h3>
          <IncomeTrends />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <p className="text-2xl font-bold">${totalIncome.toLocaleString()}</p>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-gray-100 p-6 rounded-xl shadow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-primary">Recent Activity</h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                const rows = expenses.map((e) => ({
                  id: e.id,
                  amount: e.amount,
                  description: e.description,
                  category: expenseCategories.find((c) => c.id === e.category_id)?.name ?? "",
                  date: e.date,
                }));
                const csv = toCsv(rows);
                downloadCsv(csv, "expenses.csv");
              }}
            >
              Export Expenses CSV
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                const rows = incomes.map((i) => ({
                  id: i.id,
                  amount: i.amount,
                  description: i.description,
                  category: incomeCategories.find((c) => c.id === i.category_id)?.name ?? "",
                  date: i.date,
                }));
                const csv = toCsv(rows);
                downloadCsv(csv, "income.csv");
              }}
            >
              Export Income CSV
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div className="flex gap-2 items-center">
            <span className="text-sm font-medium w-16">Expenses</span>
            <Select
              value={expenseFilters.category_id}
              onValueChange={(v) => setExpenseFilters((p) => ({ ...p, category_id: v }))}
            >
              <SelectTrigger className="border rounded p-2">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {expenseCategories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={expenseFilters.sortBy}
              onValueChange={(v: "date-desc" | "date-asc" | "amount-desc" | "amount-asc") =>
                setExpenseFilters((p) => ({ ...p, sortBy: v }))
              }
            >
              <SelectTrigger className="border rounded p-2">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-desc">Date ↓</SelectItem>
                <SelectItem value="date-asc">Date ↑</SelectItem>
                <SelectItem value="amount-desc">Amount ↓</SelectItem>
                <SelectItem value="amount-asc">Amount ↑</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2 items-center">
            <span className="text-sm font-medium w-16">Income</span>
            <Select
              value={incomeFilters.category_id}
              onValueChange={(v) => setIncomeFilters((p) => ({ ...p, category_id: v }))}
            >
              <SelectTrigger className="border rounded p-2">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {incomeCategories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={incomeFilters.sortBy}
              onValueChange={(v: "date-desc" | "date-asc" | "amount-desc" | "amount-asc") =>
                setIncomeFilters((p) => ({ ...p, sortBy: v }))
              }
            >
              <SelectTrigger className="border rounded p-2">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-desc">Date ↓</SelectItem>
                <SelectItem value="date-asc">Date ↑</SelectItem>
                <SelectItem value="amount-desc">Amount ↓</SelectItem>
                <SelectItem value="amount-asc">Amount ↑</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-semibold mb-2">Expenses</h4>
            <ExpenseList totalExpenses={totalExpenses} items={filteredSortedExpenses} />
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-2">Income</h4>
            <IncomeList totalIncome={totalIncome} items={filteredSortedIncomes} />
          </div>
        </div>
      </Card>
      <AddExpenseModal isOpen={isExpenseOpen} onClose={onExpenseClose} />
      <AddIncomeModal isOpen={isIncomeOpen} onClose={onIncomeClose} />
    </div>
  );
};

export default Dashboard;