import Head from 'next/head';
import { Box, Container, Typography, Alert } from '@mui/material';
// import { DashboardLayout } from '../components/dashboard-layout';
import { SettingsNotifications } from '../components/settings/settings-notifications';
import { SettingsPassword } from '../components/settings/settings-password';

import dynamic from 'next/dynamic'

const DashboardLayout = dynamic(
  () => import('../components/dashboard-layout'),
  { ssr: false }
)

const Settings = () => (
  <>
    <Head>
      <title>
        Settings | secure voting platform
      </title>
    </Head>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8
      }}
    >
      <Container maxWidth="lg">
        <Typography
          sx={{ mb: 3 }}
          variant="h4"
        >
          Settings
        </Typography>
        <Alert 
          severity="info" 
          style={{marginBottom: '2em'}}
        >
          Page under development. Fully pending!
        </Alert>
        <SettingsNotifications />
        <Box sx={{ pt: 3 }}>
          <SettingsPassword />
        </Box>
      </Container>
    </Box>
  </>
);

Settings.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Settings;
