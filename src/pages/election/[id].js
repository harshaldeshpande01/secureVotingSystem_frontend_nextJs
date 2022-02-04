import Head from 'next/head';
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { Box, Container, Grid, Typography, Button, Skeleton, Alert } from '@mui/material';

import dynamic from 'next/dynamic'

const DashboardLayout = dynamic(
  () => import('../../components/dashboard-layout'),
  { ssr: false }
)

const ElectionDetails = dynamic(
  () => import('../../components/election/election-details'),
  { ssr: false }
)

const SkeletonCard = dynamic(
  () => import('../../components/election/skeleton-card'),
  { ssr: false }
)

import axios from 'axios';
const API = axios.create({ baseURL: process.env.NEXT_PUBLIC_VOTING_SERVICE });

import Link from 'next/link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Election = () =>  {
  const [data, setData] = useState();
  const [ admin, setAdmin ] = useState();
  const [ phase, setPhase ] = useState();
  const [ isRegistered, setIsRegistered] = useState();
  const [ voted, setVoted ] = useState();
  const router = useRouter();

  useEffect(() => {
    if(!router.isReady) return;
    fetchData(router.query.id);
  }, [router.isReady]);


  const fetchData = async(eid) => {
    let token = localStorage.getItem("accessToken");
    const config = {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    };
    
    try {
      const res = await API.get(
        `/elections/${eid}`,
        config
      );
      setData(res.data.election);
      setAdmin(res.data.isAdmin)
      setIsRegistered(res.data.isRegistered)
      setPhase(res.data.election.phase)
      setVoted(res.data.alreadyVoted)
    }
    catch (err) {
      if(err.response.status === 401) {
        localStorage.clear();
        alert("Your session has expired");
        router.push('/login')
        // refreshAccessToken();
      }
    }
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
            sx={{ml: 3, mb: 2}}
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
        <Alert 
          severity="info" 
          width={100}
        >
          Recording your vote on the public blockchain may require upto 15secs! Please be patient and do not navigate while submitting
        </Alert>
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
              <ElectionDetails 
                candidates={ data.candidates} 
                _id={data._id} 
                admin={admin}
                isRegistered={isRegistered}
                phase={phase}
                voted={voted}
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