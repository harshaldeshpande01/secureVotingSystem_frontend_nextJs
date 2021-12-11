// import { useRouter } from 'next/router'

import axios from 'axios';
const API = axios.create({ baseURL: process.env.NEXT_PUBLIC_VOTING_SERVICE });

import Head from 'next/head';
import { Box, Container, Grid, Typography, Button } from '@mui/material';
import { CreateElection } from '../../components/election/election-details';
import { DashboardLayout } from '../../components/dashboard-layout';

import Link from 'next/link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Election = ({data}) => (
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
            href="/elections?page=1"
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
          sx={{ml: 3}}
        >
          {data.title}
        </Typography>
        <Typography
            sx={{ml: 3}}
        >
          {data._id}
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
            <CreateElection 
                candidates={data.candidates} 
                _id={data._id} 
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  </>
);

Election.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export const getStaticProps = async (context) => {
    const res = await API.get(`/elections/${context.params.id}`);
    return {
      props: {
        data: res.data.election,
      },
    }
}

export const getStaticPaths = async () => {
  const res = await API.get(`/elections/all`);
  const articles = await res.data.data;

  const ids = articles.map((article) => article._id)
  const paths = ids.map((id) => ({ params: { id: id.toString() } }))

  return {
    paths,
    fallback: true,
  }
}

// export const getServerSideProps = async (context) => {
//     const res = await API.get(`/elections/${context.params.id}`);
//     const res2 = await API.get(`/elections/all`);
//     console.log(res2)
//     return {
//       props: {
//         data: res.data.election,
//       },
//     }
// }


export default Election;