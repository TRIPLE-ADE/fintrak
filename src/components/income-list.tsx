import useIncomeStore from "@/stores/income-store";

type IncomeItem = {
  id: string;
  amount: number;
  description: string;
  category_id?: string;
  date: string;
};

interface IncomeListProps {
  totalIncome: number;
  items?: IncomeItem[];
}

const IncomeList = ({ totalIncome, items }: IncomeListProps) => {
  const { incomes } = useIncomeStore();
  const list = items ?? incomes;

  return (
    <ul className="space-y-2">
      {list.map((income: IncomeItem) => {
        const percentage = totalIncome > 0 ? (income.amount / totalIncome) * 100 : 0;

        return (
          <li
            key={income.id}
            className="bg-white p-4 rounded shadow flex justify-between items-center"
          >
            <div>
              <span className="font-semibold">{income.description}</span>
            </div>
            <div className="text-right">
              <span className="block">${income.amount.toFixed(2)}</span>
              <span className="text-sm text-gray-500">{percentage.toFixed(1)}%</span>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default IncomeList;


