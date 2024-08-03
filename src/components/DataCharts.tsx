import { eachDayOfInterval, isSameDay } from "date-fns";
import Chart, { ChartLoading } from "./Chart";
import SpendingPie, { SpendingPieLoading } from "./SpendingPie";
import { UseGetSummary } from "@/features/summary/api/UseGetSummary";

interface Props {
  data?: {
    date: string;
    income: number;
    expense: number;
  }[];
  isLoading: boolean;
  from: string;
  to: string;
}

function DataCharts({ isLoading, data, from, to }: Props) {
  const { data: category, isLoading: categoryIsLoading } = UseGetSummary();
  const listOfDays = eachDayOfInterval({
    start: from,
    end: to,
  });

  const days = listOfDays.map((date) => {
    const found = data?.find(({ date: e }) => isSameDay(new Date(e), date));
    if (found) {
      return found;
    } else {
      return {
        date: date.toString(),
        income: 0,
        expense: 0,
      };
    }
  });

  if (isLoading || categoryIsLoading) {
    <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
      <div className="col-span-1 lg:col-span-3 xl:col-span-4">
        <ChartLoading />
      </div>
      <div className="col-span-1 lg:col-span-3 xl:col-span-2">
        <SpendingPieLoading />
      </div>
    </div>;
  }
  return (
    <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
      <div className="col-span-1 lg:col-span-3 xl:col-span-4">
        <Chart data={days} />
      </div>
      <div className="col-span-1 lg:col-span-3 xl:col-span-2">
        <SpendingPie data={category?.category} />
      </div>
    </div>
  );
}

export default DataCharts;
