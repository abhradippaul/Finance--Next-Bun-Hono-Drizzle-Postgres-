import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import ImportTable from "./ImportTable";
import { format, parse } from "date-fns";

const dateFormat = "yyyy-MM-dd HH:mm:ss";
const outputFormat = "yyyy-MM-dd";

const requiredOptions = ["amount", "date", "payee"];

interface SelectedColumnsState {
  [key: string]: string | null;
}

interface Props {
  data: string[][];
  onCancel: () => void;
  onSubmit: (data: any) => void;
}

function ImportCard({ data, onCancel, onSubmit }: Props) {
  const [selectedColumn, setSeletectedColumn] = useState<SelectedColumnsState>(
    {}
  );

  const header = data[0];
  const body = data.slice(1);

  const onTableHeadSelectChange = (
    columnIndex: number,
    value: string | null
  ) => {
    setSeletectedColumn((prev) => {
      const newSelectedColumn = { ...prev };
      if (value === "skip") {
        value = null;
      }
      newSelectedColumn[`column_${columnIndex}`] = value;
      return newSelectedColumn;
    });
  };

  const handleContinue = () => {
    const getColumnIndex = (column: string) => {
      return column.split("_")[1];
    };
    const mappedData = {
      headers: header.map((_, i) => {
        // const columnIndex = getColumnIndex(i)
        return selectedColumn[`column_${i}`] || null;
      }),
      body: body.map((row) => {
        const transFormRow = row.map((cell, i) => {
          return selectedColumn[`column_${i}`] ? cell : null;
        });
        return transFormRow;
      }),
    };

    const arrayOfData = mappedData.body.map((row) => {
      return row.reduce((acc: any, cell, index) => {
        const header = mappedData.headers[index];
        if (header !== null) {
          acc[header] = cell;
        }
        return acc;
      }, {});
    });
    const formattedData = arrayOfData.map((item) => ({
      ...item,
      amount: item.amount * 1000,
      date: format(parse(item.date, dateFormat, new Date()), outputFormat),
    }));
    onSubmit(formattedData);
  };

  return (
    <div className="max-w-7xl mx-auto w-full pb-10 -mt-24">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle>Import Transaction</CardTitle>
          <div className="flex flex-col lg:flex-row gap-2 items-center gap-x-2">
            <Button size="sm" onClick={onCancel} className="w-full lg:w-auto">
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleContinue}
              className="w-full lg:w-auto"
            >
              Continue
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ImportTable
            header={header}
            data={body}
            selectedColumn={selectedColumn}
            onTableHeadSelectChange={onTableHeadSelectChange}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default ImportCard;
