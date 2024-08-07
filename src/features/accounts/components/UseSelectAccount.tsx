import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Dispatch, SetStateAction } from "react";
import { UseGetAccounts } from "../api/UseGetAccount";
import { UseCreateAccount } from "../api/UseCreateAccount";
import Select from "@/components/Select";
import { Button } from "@/components/ui/button";

interface Props {
  setAccoutId: Dispatch<SetStateAction<string | undefined>>;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  isOpen: boolean;
  accountId: string | undefined;
}

function UseSelectAccount({
  isOpen,
  setAccoutId,
  setIsOpen,
  accountId,
}: Props) {
  const accounts = UseGetAccounts();
  const accountMutation = UseCreateAccount();
  const onCreateAccount = (name: string) =>
    accountMutation.mutate({
      name,
    });
  // const accountOptions = (accounts.data ?? []).map(({ id, name }) => ({
  //   label: name,
  //   value: id,
  // }));
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Account</DialogTitle>
          <DialogDescription>
            Please select an account to continue
          </DialogDescription>
        </DialogHeader>
        <Select
          placeholder="Select an account"
          options={accounts.data}
          onCreate={onCreateAccount}
          onChange={(value) => setAccoutId(value)}
          disabled={accounts.isLoading || accountMutation.isPending}
          type="category"
          value={accountId}
        />
        <DialogFooter>
          <Button onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button onClick={() => setIsOpen(false)}>Continue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default UseSelectAccount;
