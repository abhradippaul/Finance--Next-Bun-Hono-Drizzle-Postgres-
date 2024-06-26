import dynamic from "next/dynamic";
import { useAppDispatch, useAppSelector } from "@/app/hooks/ReduxHook";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { onClose } from "@/redux/slices/NewAccounts";
import { UseGetSpecificAccount } from "../api/UseGetSpecificAccount";
import { Loader2 } from "lucide-react";

const AccountForm = dynamic(() => import("./AccountForm"));

function NewAccountSheet() {
  const { isOpen, id: accountId } = useAppSelector(
    ({ accountSheet }) => accountSheet
  );
  const dispatch = useAppDispatch();
  const { data, isLoading } = UseGetSpecificAccount(accountId);
  return (
    <Sheet open={isOpen} onOpenChange={() => dispatch(onClose())}>
      <SheetContent className="overflow-y-auto w-full lg:max-w-md">
        <SheetHeader>
          <SheetTitle>{accountId ? "Edit account" : "New Account"}</SheetTitle>
          <SheetDescription>
            {accountId
              ? "Edit an existing account"
              : "Create a new account to tract transaction"}
          </SheetDescription>
        </SheetHeader>
        {isLoading ? (
          <div className="w-full h-[200px] flex items-center justify-center">
            <Loader2 className="size-8 text-slate-300 animate-spin" />
          </div>
        ) : (
          <AccountForm defaultValue={data} id={data?.id} />
        )}
      </SheetContent>
    </Sheet>
  );
}

export default NewAccountSheet;
