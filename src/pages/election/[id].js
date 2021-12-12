import Head from 'next/head';
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { Box, Container, Grid, Typography, Button, Skeleton } from '@mui/material';
import { CreateElection } from '../../components/election/election-details';
import { SkeletonCard } from '../../components/election/skeleton-card';
import { DashboardLayout } from '../../components/dashboard-layout';

import axios from 'axios';
const API = axios.create({ baseURL: process.env.NEXT_PUBLIC_VOTING_SERVICE });

import Link from 'next/link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Election = () =>  {
  const [data, setData] = useState();
  const router = useRouter();

  useEffect(() => {
    if(!router.isReady) return;
    fetchData(router.query.id);
  }, [router.isReady]);

  const fetchData = async(eid) => {
    const res = await API.get(`/elections/${eid}`);
    setData(res.data.election);
  }

  return (
  <>
    <Head>
      <title>
        Election | secure voting platform
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
          <Link
            href="/elections"
            passHref
          >
            <Button
              sx={{ mb: 3 }}
              component="a"
              startIcon={<ArrowBackIcon fontSize="small" />}
            >
              Go back
            </Button>
          </Link>
        <Typography
          variant="h4"
          sx={{ml: 3, mb: 1}}
        >
          {data ? 
            data.title
            :
            <Skeleton 
              variant="rectangular" 
              width={100}
            />
          }
        </Typography>
        <Typography
            sx={{ml: 3}}
        >
          {data ? 
            data._id
            :
            <Skeleton 
              variant="rectangular" 
              width={200}
            />
          }
        </Typography>
        <br/>
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
            {
              data ? 
              <CreateElection 
                candidates={ data.candidates} 
                _id={data._id} 
              />
              :
              <SkeletonCard />
            }
          </Grid>
        </Grid>
      </Container>
    </Box>
  </>
)};

Election.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

// export const getStaticProps = async (context) => {
//     const res = await API.get(`/elections/${context.params.id}`);
//     return {
//       props: {
//         data: res.data.election,
//       },
//     }
// }

// export const getStaticPaths = async () => {
//   const res = await API.get(`/elections/all`);
//   const articles = await res.data.data;

//   const ids = articles.map((article) => article._id)
//   const paths = ids.map((id) => ({ params: { id: id.toString() } }))

//   return {
//     paths,
//     fallback: true,
//   }
// }

// export const getServerSideProps = async (context) => {
//     const res = await API.get(`/elections/${context.params.id}`);
//     return {
//       props: {
//         data: res.data.election,
//       },
//     }
// }


export default Election;