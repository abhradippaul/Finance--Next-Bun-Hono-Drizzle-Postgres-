import { useAppDispatch } from "@/app/hooks/ReduxHook";
import { onOpen } from "@/redux/slices/NewAccounts";

interface Props {
  accountId: string;
  accountName: string;
}

function AccountColumn({ accountId, accountName }: Props) {
  const dispatch = useAppDispatch();
  return (
    <div
      className="flex items-center cursor-pointer hover:underline"
      onClick={() => dispatch(onOpen(accountId))}
    >
      {accountName}
    </div>
  );
}

export default AccountColumn;
