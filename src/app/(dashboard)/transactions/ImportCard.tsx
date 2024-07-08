import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import ImportTable from "./ImportTable";

const dateFormat = "yyyy-MM-dd HH:mm:ss";
const outputFormat = "yyyy-MM-dd";

const requiredOptions = ["amount", "date", "payee"];

interface SelectedColumnsState {
  [key: string]: string | null;
}

interface Props {
  data: string[][];
  onCancel: () => void;
  onSubmit: () => void;
}

function ImportCard({ data, onCancel, onSubmit }: Props) {
  const [selectedColumn, setSeletectedColumn] = useState<SelectedColumnsState>(
    {}
  );

  const header = data[0];
  const body = data.slice(1);

  return (
    <div className="max-w-7xl mx-auto w-full pb-10 -mt-24">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle>Import Transaction</CardTitle>
          <div className="flex flex-col lg:flex-row gap-2 items-center gap-x-2">
            <Button size="sm" onClick={onCancel} className="w-full lg:w-auto">
              Cancel
            </Button>
            <Button size="sm" onClick={onSubmit} className="w-full lg:w-auto">
              Continue
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ImportTable
            header={header}
            data={body}
            selectedColumn={selectedColumn}
            onTableHeadSelectChange={() => {}}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default ImportCard;
