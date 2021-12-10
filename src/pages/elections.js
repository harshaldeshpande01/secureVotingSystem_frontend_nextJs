import { useState, useEffect } from 'react';
import Head from 'next/head';
import { Box, Container, Grid, Pagination, Alert, Skeleton } from '@mui/material';
import { ElectionListToolbar } from '../components/election/election-list-toolbar';
import { ElectionCard } from '../components/election/election-card';
import { SkeletonCard } from '../components/election/skeleton-card';
import { DashboardLayout } from '../components/dashboard-layout';

import axios from 'axios';

const API = axios.create({ baseURL: process.env.NEXT_PUBLIC_VOTING_SERVICE });

const Elections = () => {
  const [elections, setElections] = useState();
  const skeletons = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const [count, setCount] = useState();
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchElections(page);
  }, [page]);

  const fetchElections = async(page) => {
    const res = await API.get(`/elections?page=${page}`);
    setElections(res.data.data);
    setCount(res.data.numberOfPages);
  }

  const handleChange = (_event, value) => {
    setPage(value);
  };

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
          Page under development. Search and learn more pending!
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
            page={page} 
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
