import { TitlePage } from '@/components/title-page';
import { createFileRoute } from '@tanstack/react-router';
import { TaskReport } from './components/task-report';
import { TaskSummaryCard } from './components/task-summary-card';


export const Route = createFileRoute('/dashboard/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <div className='flex flex-col gap-5'>
        <TitlePage>
          Tasks
        </TitlePage>

        <TaskSummaryCard />
      </div>
      <TaskReport />
    </>
  )
}
