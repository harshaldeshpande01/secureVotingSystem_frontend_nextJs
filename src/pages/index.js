import Head from 'next/head';
// import { DashboardLayout } from '../components/dashboard-layout';

import dynamic from 'next/dynamic'

// const CreateElection = dynamic(
//   () => import('../components/host/host-details'),
//   { ssr: false }
// )

const DashboardLayout = dynamic(
  () => import('../components/dashboard-layout'),
  { ssr: false }
)

const Dashboard = () => (
  <>
    <Head>
      <title>
        Dashboard | secure voting system
      </title>
    </Head>
  </>
);

Dashboard.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Dashboard;
