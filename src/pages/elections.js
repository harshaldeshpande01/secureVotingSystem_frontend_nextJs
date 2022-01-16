import Head from 'next/head';
import { useRouter } from 'next/router'

import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  // SvgIcon,
  Typography,
  IconButton,
  Container, 
  Grid, 
  Pagination
} from '@mui/material';

import { Search as SearchIcon } from '../icons/search';
import NextLink from 'next/link';

// import { ElectionListToolbar } from '../components/elections/election-list-toolbar';
import { ElectionCard } from '../components/elections/election-card';
import { SkeletonCard } from '../components/elections/skeleton-card';
import { DashboardLayout } from '../components/dashboard-layout';
import RefreshIcon from '@mui/icons-material/Refresh';

import axios from 'axios';
const API = axios.create({ baseURL: process.env.NEXT_PUBLIC_VOTING_SERVICE });

import { useEffect, useState } from 'react';

const Elections = () => {
  const router = useRouter();
  const skeletons = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const [elections, setElections] = useState();
  const [count, setCount] = useState();
  const [current, setCurrent] = useState(1);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const at = localStorage.getItem("accessToken");
    if(!at) {
      localStorage.clear();
      router.push('/login');
    }
    fetchElections(current, search)
  }, []);

  const fetchElections = async(page, search) => {
    console.log(`Fectching ${page} and ${search}`)
    let token = localStorage.getItem("accessToken");
    const config = {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    };

    try {
      const res = await API.get(
        `/elections?page=${page}&title=${search}`,
        config
      );
      setElections(res.data.data);
      setCount(res.data.numberOfPages);
    }
    catch(err) {
      if(err.response.status === 401) {
        localStorage.clear();
        alert("Your session has expired");
        router.push('/login')
        // refreshAccessToken();
      }
    }
  }

  const handlePagination = (_event, value) => {
    setCurrent(value)
    fetchElections(value, search)
  };

  const handleSearch = (reset) => {
    setCurrent(1)
    if(reset) {
      setSearch('');
      fetchElections(1, '');
    }
    else {
      fetchElections(1, search);
    }
  };

  return(
  // <>
  // {
  //   render &&
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
      <Box>
    <Box
      sx={{
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        m: -1
      }}
    >
      <Typography
        sx={{ m: 1 }}
        variant="h4"
      >
        Browse elections
      </Typography>
      <Box sx={{ m: 1 }}>
          <NextLink
            href="/host"
            passHref
          >
            <Button
              component="a"
              color="primary"
              variant="contained"
            >
              Host new election
            </Button>
          </NextLink>
      </Box>
    </Box>
    <Box sx={{ mt: 3 }}>
      <Card>
        <CardContent>
          <Box 
            sx={{ 
              maxWidth: 500,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center' 
            }}
          >
            <TextField
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton 
                      edge="end" 
                      color="default"
                      onClick={() => handleSearch(false)}
                      sx={{ marginRight: 1}}
                    >
                      <SearchIcon />
                    </IconButton>
                    <IconButton
                      edge="end" 
                      color="inherit"
                      onClick={() => handleSearch(true)}
                    >
                      <RefreshIcon/>
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              // InputProps={{
              //   startAdornment: (
              //     <InputAdornment position="start">
              //       <SvgIcon
              //         fontSize="small"
              //         color="action"
              //       >
              //         <SearchIcon />
              //       </SvgIcon>
              //     </InputAdornment>
              //   )
              // }}
              placeholder="Search..."
              variant="outlined"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  </Box>
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
            onChange={handlePagination}
          />
        </Box>
      </Container>
    </Box>
  </>
  // }
  // </>
)};

Elections.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Elections;
