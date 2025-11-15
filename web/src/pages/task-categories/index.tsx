import { TitlePage } from '@/components/title-page'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { api } from '@/http/api-client'
import { taskCategoryListSchema } from '@/http/schemas/task-category'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Edit, Trash } from 'lucide-react'
import { toast } from 'sonner'

export const Route = createFileRoute('/task-categories/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data: taskCategoriesResponse, isLoading } = useQuery({
    queryKey: ['task-categories'],
    queryFn: async () => {
      try {
        const response = await api.get("/task-category");

        return taskCategoryListSchema.parse(response.data);
      } catch(error){
        console.error("Failed to fetch task categories", error);
        toast.error("Failed to fetch task categories");
      }

    },
  })

  return <div className='flex flex-col gap-5'>
    <TitlePage>
      Task Categories
    </TitlePage>
    {isLoading && (
      <Spinner />
    )}

    {
      taskCategoriesResponse && (
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  Name
                </TableHead>

                <TableHead>
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {
                taskCategoriesResponse.taskCategories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>{category.name}</TableCell>

                    <TableCell className='flex gap-2'>
                      <Button>
                        <Edit />
                      </Button>

                      <Button variant={"destructive"}>
                        <Trash />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              }
            </TableBody>
          </Table>
        </div>
      )
    }
  </div>
}
