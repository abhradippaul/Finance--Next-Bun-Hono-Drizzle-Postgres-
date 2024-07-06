import dynamic from "next/dynamic";
import { useAppDispatch, useAppSelector } from "@/app/hooks/ReduxHook";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { onClose } from "@/redux/slices/NewTransaction";
import { UseGetSpecificTransaction } from "../api/UseGetSpecificTransaction";
import { Loader2 } from "lucide-react";

const TransactionForm = dynamic(() => import("./TransactionForm"));

function NewTransactionSheet() {
  const { isOpen, id: transactionId } = useAppSelector(
    ({ transactionSheet }) => transactionSheet
  );
  const dispatch = useAppDispatch();
  const { data, isLoading } = UseGetSpecificTransaction(transactionId);
  return (
    <Sheet open={isOpen} onOpenChange={() => dispatch(onClose())}>
      <SheetContent className="overflow-y-auto w-full lg:max-w-md">
        <SheetHeader>
          <SheetTitle>
            {transactionId ? "Edit transaction" : "New transaction"}
          </SheetTitle>
          <SheetDescription>
            {transactionId
              ? "Edit an existing transaction"
              : "Add a new transaction"}
          </SheetDescription>
        </SheetHeader>
        {isLoading ? (
          <div className="w-full h-[200px] flex items-center justify-center">
            <Loader2 className="size-8 text-slate-300 animate-spin" />
          </div>
        ) : (
          <TransactionForm
            defaultValue={
              data && {
                accountId: data.accountId,
                categoryId: data.categoryId || undefined,
                amount: String(data.amount / 1000),
                date: new Date(data.date) || new Date(),
                payee: data.payee,
                notes: data.notes || undefined,
              }
            }
            id={data?.id}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}

export default NewTransactionSheet;
