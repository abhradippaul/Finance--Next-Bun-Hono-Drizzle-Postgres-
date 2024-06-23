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
          <SheetTitle>
            {accountId ? "Update account" : "New Account"}
          </SheetTitle>
          <SheetDescription>
            {accountId
              ? "Update account for transaction"
              : "Create a new account to tract transaction"}
          </SheetDescription>
        </SheetHeader>
        {!isLoading && <AccountForm defaultValue={data} id={data?.id} />}
      </SheetContent>
    </Sheet>
  );
}

export default NewAccountSheet;
