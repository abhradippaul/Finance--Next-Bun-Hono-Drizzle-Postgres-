import dynamic from "next/dynamic";
import { useAppDispatch, useAppSelector } from "@/app/hooks/ReduxHook";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { onChange } from "@/redux/slices/NewAccounts";

const AccountForm = dynamic(() => import("./AccountForm"));

function NewAccountSheet() {
  const isOpen = useAppSelector((state) => state.isOpen);
  const dispatch = useAppDispatch();
  return (
    <Sheet open={isOpen} onOpenChange={() => dispatch(onChange())}>
      {/* <SheetTrigger>Open</SheetTrigger> */}
      <SheetContent className="overflow-y-auto w-full lg:max-w-md">
        <SheetHeader>
          <SheetTitle>New Account</SheetTitle>
          <SheetDescription>
            Create a new account to tract transaction
          </SheetDescription>
        </SheetHeader>
        <AccountForm />
      </SheetContent>
    </Sheet>
  );
}

export default NewAccountSheet;
