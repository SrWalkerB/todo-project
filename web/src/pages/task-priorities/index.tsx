import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/task-priorities/')({
  component: RouteComponent,
})

function RouteComponent() {

  return <div>Hello "/task-priorities/"!</div>
}
