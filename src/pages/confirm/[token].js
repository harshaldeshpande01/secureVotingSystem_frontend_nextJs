import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from "axios";
import Head from 'next/head';

import {
  CssBaseline,
  Box,
  Container,
  Typography,
  CircularProgress
} from '@mui/material';

import withAuth from '../../hoc/withAuth'

const Confirm = React.memo(() => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState();
  const router = useRouter();

  const confirmEmail = async() => {
    setLoading(true);
    const config = {
        header: {
          "Content-Type": "application/json",
        },
    };
    try {
        const token = router.query.token;
        const { data } = await axios.put(
          `${process.env.NEXT_PUBLIC_AUTH_LEVEL1}/confirmation/${token}`,
          {},
          config
        );
        setLoading(false);
        setSuccess(data.data);
      } catch (error) {
        setError(error.response.data);
        setLoading(false);
      }
  }

//   useEffect(() => {
//     if (localStorage.getItem("authToken")) {
//       history.push("/authLevel2");
//     }    
//   }, [history]);

  useEffect(() => {
    if(!router.isReady) return;
    confirmEmail();
  }, [router.isReady]);


  return (
    <>
        <Head>
                <title>
                Email confirmation | secure voting platform
                </title>
            </Head>
      {
        loading?
            <div style={{position:"fixed",display:"flex",justifyContent:"center",alignItems:"center",width:'100%',height:'100%',zIndex:999999}}> 
                <CircularProgress/> 
            </div>
        :
            <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div style={{marginTop: '6em', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                {
                    error &&
                    <Typography component="h1" variant="h5" gutterBottom>
                        Something went wrong &#x1F915;
                    </Typography>
                }
                {
                    success &&
                    <>
                        <Typography component="h1" variant="h5" gutterBottom>
                            Email verified succesfully &#x1F389;
                        </Typography>
                        <Link href="/login" variant="body2">
                            {"Login to access your account"}
                        </Link>
                    </>
                }
            </div>
            </Container>
        }
      </>
  );
})

export default withAuth(Confirm);