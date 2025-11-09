import { Plus } from "lucide-react";
import { CreateEditTaskDialog } from "./dialogs/create-task-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";

export function NavBar({className}: {className?: string}){
  return (
    <div className={
      `flex gap-10 ${className ? className : "" }`
    }>
      <CreateEditTaskDialog typeDialog="create">
        <Plus />
        <span>
          Add task
        </span>
      </CreateEditTaskDialog>

      <div>
        <DropdownMenu >
          <DropdownMenuTrigger className="cursor-pointer mr-2.5">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png"/>
              <AvatarFallback>WB</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="mt-1.5 mr-1">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              Profile
            </DropdownMenuItem>

            <DropdownMenuItem>
              Billing
            </DropdownMenuItem>

            <DropdownMenuItem>
              Exit
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
