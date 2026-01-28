import { ListView } from '@/components/refine-ui/views/list-view'
import { Breadcrumb } from '@/components/refine-ui/layout/breadcrumb'

const Dashboard = () => {
  return (
    <ListView>
      <Breadcrumb />
      <h1 className='page-title'>Dashboard</h1>
      <p>Welcome to the dashboard.</p>
    </ListView>
  )
}

export default Dashboard
