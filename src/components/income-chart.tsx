import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

import useIncomeStore from "@/stores/income-store";

const COLORS = ["#34D399", "#F59E0B", "#6366F1", "#EF4444", "#10B981"];

const IncomeChart: React.FC = () => {
  const { incomes } = useIncomeStore();
  const sourceTotals = incomes.reduce((acc: { [key: string]: number }, income) => {
    const key = income.description || "Other";
    acc[key] = (acc[key] || 0) + income.amount;
    return acc;
  }, {});

  const data = Object.entries(sourceTotals).map(([name, total]) => ({
    name,
    value: total,
  }));

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer height="100%" width="100%">
        <PieChart>
          <Pie
            cx="50%"
            cy="50%"
            data={data}
            dataKey="value"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={5}
          >
            {data.map((_entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                strokeLinecap="round"
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default IncomeChart;


