"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Plus } from "lucide-react";
import { columns } from "./columns";
import { DataTable } from "@/components/DataTable";
import { UseGetAccounts } from "@/features/accounts/api/UseGetAccount";
import { useAppDispatch } from "@/app/hooks/ReduxHook";
import { Skeleton } from "@/components/ui/skeleton";
import { UseBulkDeleteAccounts } from "@/features/accounts/api/UseDeleteAccount";
import { onOpen } from "@/redux/slices/NewAccounts";

function AccountsPage() {
  const dispatch = useAppDispatch();
  const accounts = UseGetAccounts();
  const data = accounts.data || [];
  const deleteAccounts = UseBulkDeleteAccounts();

  if (accounts.isLoading) {
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

  return (
    <div className="max-w-7xl mx-auto w-full pb-10 -mt-24">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle>Accounts page</CardTitle>
          <Button size="sm" onClick={() => dispatch(onOpen())}>
            <Plus className="size-4 mr-2" />
            Add new
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={data}
            filterKey="name"
            onDelete={(row) => {
              const ids = row.map(({ original: { id } }) => id);
              deleteAccounts.mutate({ ids });
            }}
            disabled={deleteAccounts.isPending || false}
          />
        </CardContent>
        <CardFooter>
          <p>Card Footer</p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default AccountsPage;
