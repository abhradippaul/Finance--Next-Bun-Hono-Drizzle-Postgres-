"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UseCreateAccount } from "@/features/accounts/api/UseCreateAccount";
import { Plus } from "lucide-react";
import { Payment, columns } from "./columns";
import { DataTable } from "@/components/DataTable";

const data: Payment[] = [
  {
    id: "738ed52f",
    amount: 100,
    status: "pending",
    email: "a@example.com",
  },
  {
    id: "758ed52f",
    amount: 200,
    status: "pending",
    email: "b@example.com",
  },
  {
    id: "722ed52f",
    amount: 300,
    status: "pending",
    email: "c@example.com",
  },
  {
    id: "728ed42f",
    amount: 300,
    status: "pending",
    email: "d@example.com",
  },
  {
    id: "722ed52f",
    amount: 200,
    status: "pending",
    email: "e@example.com",
  },
];

function AccountsPage() {
  const createAccount = UseCreateAccount();
  return (
    <div className="max-w-7xl mx-auto w-full pb-10 -mt-24">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle>Accounts page</CardTitle>
          <Button size="sm">
            <Plus className="size-4 mr-2" />
            Add new
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={data} filterKey="email" />
        </CardContent>
        <CardFooter>
          <p>Card Footer</p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default AccountsPage;
