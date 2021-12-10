import Head from 'next/head';
import { Box, Container, Grid, Typography, Alert } from '@mui/material';
import { CreateElection } from '../components/host/host-details';
import { DashboardLayout } from '../components/dashboard-layout';

const Host = () => (
  <>
    <Head>
      <title>
        Host election | secure voting platform
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
          Host your election
        </Typography>
        <Alert 
          severity="info" 
          sx={{ width: '100%', height: '100%', marginBottom: '2em' }}
        >
          You will need a wallet (like metamask) connected to the right network
        </Alert>
        <Grid
          container
          spacing={3}
        >
          <Grid
            item
            lg={12}
            md={12}
            xs={12}
          >
            <CreateElection />
          </Grid>
        </Grid>
      </Container>
    </Box>
  </>
);

Host.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Host;
