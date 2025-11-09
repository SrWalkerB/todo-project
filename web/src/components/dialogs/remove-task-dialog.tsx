import { Trash } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/http/api-client";
import { toast } from "sonner";

interface RemoveTaskDialogProps {
  id: string;
  title: string;
}

export function RemoveTaskDialog({id, title}: RemoveTaskDialogProps) {
  const queryClient = useQueryClient()

  function handleRemove() {
    console.log(id)
    mutation.mutate(id);
  }

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      try {
        const response = await api.delete(`/tasks/${id}`);
        return response.data;
      } catch(error){
        console.error(error)
        toast.error("Failed to remove task");
      }
    },
    onSuccess: () => {
      queryClient.resetQueries({
        queryKey: ["tasks"]
      })

      mutation.reset();
      toast.success("Task removed successfully");
    }
  })

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={"destructive"} className="cursor-pointer">
          <Trash />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to remove this task ({title})?</AlertDialogTitle>

          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="cursor-pointer"
            onClick={handleRemove}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
