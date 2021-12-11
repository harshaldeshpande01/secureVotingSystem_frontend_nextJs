import Head from 'next/head';
import { useRouter } from 'next/router'
import { Box, Container, Grid, Pagination, Alert, Skeleton } from '@mui/material';
import { ElectionListToolbar } from '../components/elections/election-list-toolbar';
import { ElectionCard } from '../components/elections/election-card';
import { SkeletonCard } from '../components/elections/skeleton-card';
import { DashboardLayout } from '../components/dashboard-layout';

import axios from 'axios';
const API = axios.create({ baseURL: process.env.NEXT_PUBLIC_VOTING_SERVICE });

import { useEffect, useState } from 'react';
import Router from 'next/router';
import NProgress from 'nprogress';

NProgress.configure({ showSpinner: false });

const Elections = ({elections, count, current}) => {
  const skeletons = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (_event, value) => {
    router.push(`/elections?page=${value}`)
  };

  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) jssStyles.parentElement.removeChild(jssStyles);

    const start = () => {
      console.log('start');
      NProgress.start();
      setLoading(true);
    };
    const end = () => {
      console.log('findished');
      NProgress.done();
      setLoading(false);
    };

    Router.events.on('routeChangeStart', start);
    Router.events.on('routeChangeComplete', end);
    Router.events.on('routeChangeError', end);
    return () => {
      Router.events.off('routeChangeStart', start);
      Router.events.off('routeChangeComplete', end);
      Router.events.off('routeChangeError', end);
    };
  }, []);

  return(
  <>
    <Head>
      <title>
        Elections | secure voting platform
      </title>
    </Head>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8
      }}
    >
      <Container maxWidth={false}>
        <ElectionListToolbar />
        <Alert 
          severity="info" 
          style={{marginTop: '2em'}}
        >
          Page under development. Search feature pending!
        </Alert>
        <Box sx={{ pt: 3 }}>
          <Grid
            container
            spacing={3}
          >
            {
                elections ?
                elections.map((election, _id) => {
                    return(
                        <Grid 
                          item
                          key={election._id}
                          lg={4}
                          md={6}
                          xs={12}
                        >
                            <ElectionCard
                              election={election}
                            />
                        </Grid>
                    )
                })
                :
                skeletons.map((s, id) => {
                  return(
                    <Grid 
                      item
                      key={id}
                      lg={4}
                      md={6}
                      xs={12}
                    >
                      <SkeletonCard/>
                    </Grid>
                  ) 
                })
            }
          </Grid>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            pt: 3
          }}
        >
          <Pagination
            color="primary"
            count={count}
            size="small"
            page={parseInt(current)}
            onChange={handleChange}
          />
        </Box>
      </Container>
    </Box>
  </>
)};

Elections.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Elections;

export async function getServerSideProps(context) {
  const page = context.query.page; 
  const res = await API.get(`/elections?page=${page}`);
  const elections = res.data.data
  const count = res.data.numberOfPages

  return {
    props: {
      elections,
      count,
      current: page
    },
  }
}
