import { useState, useEffect } from 'react';
import Head from 'next/head';
import { Box, Container, Grid, Pagination, Alert } from '@mui/material';
import { ProductListToolbar } from '../components/product/product-list-toolbar';
import { ProductCard } from '../components/product/product-card';
import { DashboardLayout } from '../components/dashboard-layout';

import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

const Products = () => {
  const [elections, setElections] = useState();

  useEffect(() => {
    fetchElections(1);
  }, []);

  const fetchElections = async(page) => {
    const res = await API.get(`/elections?page=${page}`);
    setElections(res.data.data);
  }
  return(
  <>
    <Head>
      <title>
        Products | Material Kit
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

      <Alert 
        severity="info" 
        style={{marginBottom: '2em'}}
      >
        Page under development. Search, learn more and pagination pending!
      </Alert>
        <ProductListToolbar />
        <Box sx={{ pt: 3 }}>
          <Grid
            container
            spacing={3}
          >
            {
                elections &&
                elections.map((election, _id) => {
                    return(
                        <Grid 
                          item
                          key={election.id}
                          lg={4}
                          md={6}
                          xs={12}
                        >
                            <ProductCard
                                title={election.title}
                                description={election.description}
                                phase={election.phase}
                            />
                        </Grid>
                    )
                })
            }
            {/* { 
            elections &&
              elections.map((election) => (
              <Grid
                item
                key={election.id}
                lg={4}
                md={6}
                xs={12}
              >
                <ProductCard 
                 
                 />
              </Grid>
            ))} */}
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
            count={3}
            size="small"
          />
        </Box>
      </Container>
    </Box>
  </>
)};

Products.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Products;
