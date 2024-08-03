import DataCard, { DataCardLoading } from "./DataCard";
import { FaPiggyBank } from "react-icons/fa";
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";

interface Props {
  data?: {
    remainingAmount: number;
    remainingChange: number;
    incomeAmount: number;
    incomeChange: number;
    expensesAmount: number;
    expensesChange: number;
  };
  to: string;
  from: string;
  isLoading: boolean;
}

function DataGrid({ data, isLoading, from, to }: Props) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 pb-2 mb-8">
        <DataCardLoading />
        <DataCardLoading />
        <DataCardLoading />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 pb-2 mb-8">
      <DataCard
        title="Remaining"
        value={data?.remainingAmount || 0}
        percentageChange={data?.remainingChange}
        icon={FaPiggyBank}
        variant="default"
        dateRange={`${to} - ${from}`}
      />
      <DataCard
        title="Income"
        value={data?.incomeAmount || 0}
        percentageChange={data?.incomeChange}
        icon={FaArrowTrendUp}
        variant="default"
        dateRange={`${to} - ${from}`}
      />
      <DataCard
        title="Expense"
        value={data?.expensesAmount ? data.expensesAmount : 0}
        percentageChange={data?.expensesChange ? data.expensesChange : 0}
        icon={FaArrowTrendDown}
        variant="default"
        dateRange={`${to} - ${from}`}
      />
    </div>
  );
}

export default DataGrid;
