import { CreateEditTaskDialog } from '@/components/dialogs/create-task-dialog'
import { RemoveTaskDialog } from '@/components/dialogs/remove-task-dialog'
import { TitlePage } from '@/components/title-page'
import { Checkbox } from '@/components/ui/checkbox'
import { Spinner } from '@/components/ui/spinner'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { api } from '@/http/api-client'
import { tasksListSchema, taskStatusSchema } from '@/http/schemas/tasks'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Edit } from 'lucide-react'
import { toast } from 'sonner'
import { z } from "zod";

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const response = await api.get("/tasks");
      const data = response.data;
      return tasksListSchema.parse(data);
    },
  });

  const handledTaskStatusMutation = useMutation({
    mutationFn: async ({ id, isCompleted }: { id: string, isCompleted: boolean }) => {
      try {
        const response = await api.patch(`/tasks/status/${id}`, {
          isCompleted: isCompleted
        });

        return taskStatusSchema.parse(response.data);
      } catch(error){
        console.error(error);
        toast.error("Failed to update task status")
      }
    },
    onSuccess: (_, variabled) => {
      queryClient.setQueryData<z.infer<typeof tasksListSchema>>(["tasks"], oldData => {
        if(!oldData) return oldData;

        return {
          ...oldData,
          tasks: oldData.tasks.map(task => {
            if(task.id === variabled.id){
              return {
                ...task,
                isCompleted: variabled.isCompleted
              }
            }
            return task;
          })
        }
      })
    }
  })

  function handledTaskStatusChange(id: string, isCompleted: boolean) {
    try {
      handledTaskStatusMutation.mutate({
        id,
        isCompleted
      });
    } catch(error){
      console.log(error);
    }
  }

  return (
    <>
      <TitlePage>
        Tasks
        {
          isLoading
          ?
          <div className='flex justify-center mt-4'>
            <Spinner />
          </div>
          :
          <Table className='mt-3'>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className='text-center'>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {data?.tasks.map((todo) => (
                <TableRow key={todo.id}>
                  <TableCell>
                    <Checkbox
                      checked={todo.isCompleted}
                      onClick={() => handledTaskStatusChange(todo.id, !todo.isCompleted)}
                    />
                  </TableCell>
                  <TableCell
                    className={todo.isCompleted ? 'line-through text-muted-foreground' : ''}
                  >
                    {todo.title}
                  </TableCell>
                  <TableCell
                    className={todo.isCompleted ? 'line-through text-muted-foreground' : ''}
                  >
                    {todo.description}
                  </TableCell>

                  <TableCell
                    className={todo.isCompleted ? 'line-through text-muted-foreground' : ''}
                  >
                    {todo.taskCategory ? todo.taskCategory.name : ""}
                  </TableCell>

                  <TableCell className='flex gap-2 justify-center'>
                    <CreateEditTaskDialog
                      typeDialog="edit"
                      task={todo}
                    >
                      <Edit />
                    </CreateEditTaskDialog>

                    <RemoveTaskDialog title={todo.title} id={todo.id} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        }
      </TitlePage>
    </>
  )
}
