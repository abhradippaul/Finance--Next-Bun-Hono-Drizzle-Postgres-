import { useAppDispatch } from "@/app/hooks/ReduxHook";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { onOpen } from "@/redux/slices/NewAccounts";
import { Edit, MoreHorizontal } from "lucide-react";
import { useState } from "react";

interface Props {
  id: string;
}
function Actions({ id }: Props) {
  const dispatch = useAppDispatch();
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default Actions;
