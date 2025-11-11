import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import useIncomeStore from "@/stores/income-store";

const IncomeTrends: React.FC = () => {
  const { incomes } = useIncomeStore();

  const monthlyIncome = incomes.reduce((acc, income) => {
    const month = new Date(income.date).getMonth();
    acc[month] = (acc[month] || 0) + income.amount;
    return acc;
  }, Array(12).fill(0));

  const chartData = monthlyIncome.map((amount, index) => ({
    month: new Date(0, index).toLocaleString("default", { month: "short" }),
    amount,
  }));

  return (
    <ResponsiveContainer height={300} width="100%">
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Line dataKey="amount" stroke="#10B981" type="monotone" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default IncomeTrends;


