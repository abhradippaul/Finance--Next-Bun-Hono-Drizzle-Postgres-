"use client";

import { format, subDays } from "date-fns";
import { useSearchParams } from "next/navigation";
import DataCharts from "@/components/DataCharts";
import DataGrid from "@/components/DataGrid";
import { UseGetSummary } from "@/features/summary/api/UseGetSummary";

export default function DashboardPage() {
  const { data, isLoading } = UseGetSummary();
  const params = useSearchParams();
  const to = format(params.get("to") || new Date(), "LLL dd y");
  const from = format(
    params.get("from") || subDays(new Date(), 30),
    "LLL dd y"
  );

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <DataGrid data={data} isLoading={isLoading} from={from} to={to} />
      <DataCharts
        isLoading={isLoading}
        data={data?.activeDays}
        from={from}
        to={to}
      />
    </div>
  );
}
