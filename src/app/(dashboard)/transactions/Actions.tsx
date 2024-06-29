import { useAppDispatch } from "@/app/hooks/ReduxHook";
import UseConfirm from "@/app/hooks/UseConfirm";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UseBulkDeleteTransactions } from "@/features/transactions/api/UseDeleteTransactions";
import { onOpen } from "@/redux/slices/NewTransaction";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { useState } from "react";

interface Props {
  id: string;
}
function Actions({ id }: Props) {
  const dispatch = useAppDispatch();
  const deleteTransactions = UseBulkDeleteTransactions();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <DropdownMenu open={isOpen} onOpenChange={() => setIsOpen(false)}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="size-8 p-0"
          onClick={() => setIsOpen(true)}
        >
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          disabled={false}
          onClick={() => {
            dispatch(onOpen(id));
            setIsOpen(false);
          }}
        >
          <Edit className="size-4 mr-2" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem disabled={false} onClick={() => setIsOpen(false)}>
          <UseConfirm
            title="Are you sure?"
            description="You are about to delete this category?"
            onClickConfirm={() => deleteTransactions.mutate({ ids: [id] })}
            trigger={
              <div className="size-full flex items-center text-red-500 hover:text-red-600">
                <Trash className="size-4 mr-2" />
                Delete
              </div>
            }
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default Actions;
