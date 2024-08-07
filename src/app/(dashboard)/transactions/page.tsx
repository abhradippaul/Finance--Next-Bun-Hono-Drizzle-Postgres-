"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus } from "lucide-react";
import { columns } from "./columns";
import { DataTable } from "@/components/DataTable";
import { UseGetTransactions } from "@/features/transactions/api/UseGetTransactions";
import { useAppDispatch } from "@/app/hooks/ReduxHook";
import { Skeleton } from "@/components/ui/skeleton";
import { UseBulkDeleteTransactions } from "@/features/transactions/api/UseDeleteTransactions";
import { onOpen } from "@/redux/slices/NewTransaction";
import UploadButton from "./UploadButton";
import { useState } from "react";
import ImportCard from "./ImportCard";
import { transactions as transactionSchema } from "@/db/Schema";
import UseSelectAccount from "@/features/accounts/components/UseSelectAccount";
import { UseCreateTransaction } from "@/features/transactions/api/UseCreateTransaction";
import { UseCreateBulkTransaction } from "@/features/transactions/api/UseCreateBulkTransaction";

enum VARIANTS {
  LIST = "LIST",
  IMPORT = "IMPORT",
}

const INITIAL_IMPORT_RESULTS = {
  data: [],
  errors: [],
  meta: {},
};

function TransactionsPage() {
  const [accountId, setAccountId] = useState<string | undefined>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [variant, setVariant] = useState<VARIANTS>(VARIANTS.LIST);
  const [importResults, setImportResults] = useState(INITIAL_IMPORT_RESULTS);

  const dispatch = useAppDispatch();
  const transactions = UseGetTransactions();
  const createTransaction = UseCreateBulkTransaction();
  const data = transactions.data || [];
  const deleteTransactions = UseBulkDeleteTransactions();

  const onUpload = (results: typeof INITIAL_IMPORT_RESULTS) => {
    setImportResults(results);
    setVariant(VARIANTS.IMPORT);
  };

  const onCancelUpload = () => {
    setImportResults(INITIAL_IMPORT_RESULTS);
    setVariant(VARIANTS.LIST);
  };

  const onSubmitImport = async (
    value: (typeof transactionSchema.$inferInsert)[]
  ) => {
    if (accountId) {
      const data = value.map((e) => ({
        ...e,
        accountId,
      }));
      createTransaction.mutate(data, {
        onSuccess: () => {
          onCancelUpload();
        },
      });
    } else {
      setIsOpen(true);
    }
  };

  if (transactions.isLoading) {
    return (
      <div className="max-w-7xl mx-auto w-full pb-10 -mt-24">
        <Card className="border-none drop-shadow-sm">
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent>
            <div className="h-[500px] w-full flex items-center justify-center">
              <Loader2 className="size-6 text-slate-300 animate-spin" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (variant === VARIANTS.IMPORT) {
    return (
      <>
        <UseSelectAccount
          isOpen={isOpen}
          setAccoutId={setAccountId}
          setIsOpen={setIsOpen}
          accountId={accountId}
        />
        <ImportCard
          data={importResults.data}
          onCancel={onCancelUpload}
          onSubmit={onSubmitImport}
        />
      </>
    );
  }

  return (
    <div className="max-w-7xl mx-auto w-full pb-10 -mt-24">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle>Transactions page</CardTitle>
          <div className="flex flex-col lg:flex-row items-center gap-2">
            <Button
              size="sm"
              onClick={() => dispatch(onOpen(undefined))}
              className="w-full lg:w-auto"
            >
              <Plus className="size-4 mr-2" />
              Add new
            </Button>
            <UploadButton onUpload={onUpload} />
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={data}
            filterKey="payee"
            onDelete={(row) => {
              const ids = row.map(({ original: { id } }) => id);
              deleteTransactions.mutate({ ids });
            }}
            disabled={deleteTransactions.isPending || false}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default TransactionsPage;
