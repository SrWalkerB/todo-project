import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Controller, useForm } from  "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/http/api-client";
import { toast } from "sonner"
import { useEffect, useState, type ComponentProps, type ReactNode } from "react";
import { taskCategoryListSchema } from "@/http/schemas/task-category";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from "../ui/field";
import type { tasksListItemSchema } from "@/http/schemas/tasks";

const taskSchema = z.object({
  title: z.string().min(1, {
    message: "Task name is required"
  }),
  description: z.string().optional(),
  taskCategoryId: z.string().optional()
});

interface CreateTaskDiaologProps extends ComponentProps<"button">{
  typeDialog: "create" | "edit";
  task?: z.infer<typeof tasksListItemSchema>;
  children: ReactNode;
}

type TaskSchema = z.infer<typeof taskSchema>

export function CreateEditTaskDialog({ typeDialog, task, ...props }: CreateTaskDiaologProps){
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm<TaskSchema>({
    resolver: zodResolver(taskSchema),
    defaultValues: typeDialog === "edit" && task ? {
      title: task.title,
      description: task.description || "",
      taskCategoryId: task.taskCategory ? task.taskCategory.id : ""
    } : {
      title: "",
      description: "",
      // taskCategoryId: ""
    }
  });
  const [opengDialog, setOpenDialog] = useState(false);
  const queryClient = useQueryClient();

  if(typeDialog === "edit" && !task){
    throw new Error("Task data is required for edit mode");
  }

  const {data: taskCategories } = useQuery({
    queryKey: ["tasksCategory"],
    queryFn: async () => {
      try {
        const response = await api.get("/task-category");
        return taskCategoryListSchema.parse(response.data);
      } catch(error){
        console.log("error",error)
        toast.error("Failed to load task categories")
      }
    }
  })

  useEffect(() => {
    if(!opengDialog){
      reset()
    }
  }, [opengDialog, reset])

  const mutation = useMutation({
    mutationFn: async (newTask: TaskSchema) => {
      if(typeDialog === "edit" && task){
        return await api.put(`/tasks/${task.id}`, newTask)
      }

      return await api.post("/tasks", newTask)
    },
    onSuccess: () => {
      queryClient.resetQueries({
        queryKey: ["tasks"]
      })
      setOpenDialog(false)
      toast.success(`Task ${typeDialog == "create" ? 'created' : 'updated'} successfully`)
    },
    onError: (error) => {
      console.error(error)
      toast.error(`Failed to ${typeDialog == "create" ? 'create' : 'update'} task`)
    }
  })

  async function handledFormSubmit(data: TaskSchema){
    try {
      mutation.mutate(data)
    } catch(error){
      console.log(error)
    }
  }

  return (
    <Dialog open={opengDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild className="cursor-pointer">
        <Button {...props}>
          {props.children}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(handledFormSubmit)}>
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
            <DialogDescription>
              Fill in the information below to create a new task.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-5 mt-4">
            <FieldSet>
              <FieldGroup>
                <Field>
                  <FieldLabel>
                    Task name
                    <span className="text-destructive">*</span>
                  </FieldLabel>

                  <Input
                    placeholder="Buy coffee"
                    {...register("title")}
                  />

                  {errors.title && (
                    <FieldError>{errors.title.message}</FieldError>
                  )}
                </Field>

                <Field>
                  <FieldLabel>
                    Description
                  </FieldLabel>

                  <Input
                    placeholder="Need to buy coffee"
                    {...register("description")}
                  />

                  {errors.description && (
                    <FieldError>{errors.description.message}</FieldError>
                  )}
                </Field>

                <Field>
                  <FieldLabel>Category</FieldLabel>
                  <Controller
                    name="taskCategoryId"
                    control={control}
                    render={({field}) => (
                      <Select
                          onValueChange={field.onChange}
                          value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category"/>
                        </SelectTrigger>

                        <SelectContent>
                          <SelectGroup>
                            {
                              taskCategories?.taskCategories.map((category) => (
                                <SelectItem
                                  key={category.id}
                                  value={category.id}
                                >
                                  {category.name}
                                </SelectItem>
                              ))
                            }
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </Field>
              </FieldGroup>
            </FieldSet>

          </div>

          <DialogFooter className="mt-5">
            <DialogClose asChild>
              <Button className="cursor-pointer" variant={"destructive"}>Cancel</Button>
            </DialogClose>

            <Button className="cursor-pointer" type="submit">
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
