import { CardIndicator } from "@/components/card-indicator";
import { Spinner } from "@/components/ui/spinner";
import { api } from "@/http/api-client";
import { taskSummarySchema } from "@/http/schemas/task-summay";
import { useQuery } from "@tanstack/react-query";

export function TaskSummaryCard(){
  const { data: taskSummaryResponse, isLoading } = useQuery({
    queryKey: ["task-summary"],
    queryFn: async () => {
      const response = await api.get("/tasks/summary");

      return taskSummarySchema.parse(response.data);
    }
  })

  return (
    <div>
      {
        <div className="grid grid-cols-4 gap-4">
          <>
              <CardIndicator
                title="Total Tasks"
                description={
                  isLoading ? <Spinner className="text-2xl" /> : taskSummaryResponse!.totalTasks
                }
              />
            <CardIndicator
              title="Completed"
              description={
                isLoading ? <Spinner className="text-2xl" />  :
                <span className="text-green-500">
                  {taskSummaryResponse!.completedTasks}
                </span>
              }
            />
            <CardIndicator
              title="Pending"
              description={
                isLoading ? <Spinner className="text-2xl" />  :
                <span className="text-destructive">
                  {taskSummaryResponse!.pendingTasks}
                </span>
              }
            />

            <CardIndicator
              title="Completed rate"
              description={
                isLoading ? <Spinner className="text-2xl" />  :
                <span className="text-green-500">
                  {taskSummaryResponse!.adhrence}
                </span>
              }
            />
          </>
        </div>
      }
    </div>
  )
}
