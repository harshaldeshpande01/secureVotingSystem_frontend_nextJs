import { useState, useEffect } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Button, Container, Snackbar, Alert, Link, TextField, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from "axios";
import jwt_decode from 'jwt-decode';
import withAuth1 from "../hoc/withAuth1";

const Login = () => {
  const router = useRouter();
  const [loading, setLoading] = useState();
  const [open, setOpen] = useState();
  const [error, setError] = useState();

  const handleClose = (_event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const sendOTP = async() => {
    let token = localStorage.getItem("accessToken");

    let temp = jwt_decode(token).phone;
    if(temp[0] === '+') {
      temp = temp.substring(1);
    }
    const config = {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    };

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_AUTH_LEVEL2}/sendOTP`,
        { phone: temp },
        config
      );
      localStorage.setItem("hashOTP", res.data.hash);
      setOpen(true);
      setError('');
    } catch (error) {
      if(error.response.status === 401) {
        alert("Your session has expired. Please login again to continue"); 
        localStorage.clear();
        router.push('/login')
      }
      if(error.response.status === 429) {
        alert("Too many attempts!! Try again later"); 
        localStorage.clear();
        router.push('/login')
      }
      else {
        setError(error.response.data);
      }
    }  
  }

  useEffect(() => {
    // const at = localStorage.getItem("accessToken");
    // if(!at) {
    //   localStorage.clear();
    //   router.push('/login');
    // }
    // if(at && jwt_decode(token).authLevel2) {
    //   router.push('/elections');
    // }
    sendOTP();
  }, [])

  const handleSubmit = async (values) => {
    let token = localStorage.getItem("accessToken");
    let hash = localStorage.getItem("hashOTP");
    const { otp } = values;
    let temp = jwt_decode(token).phone;
    if(temp[0] === '+') {
        temp = temp.substring(1);
    }
    setLoading(true);
    const config = {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
    };

    try {
        const res  = await axios.post(
          `${process.env.NEXT_PUBLIC_AUTH_LEVEL2}/verifyOTP`,
          { 
            phone: temp, 
            hash, 
            otp 
          },
          config
        );
        localStorage.removeItem("accessToken");
        localStorage.setItem("accessToken", res.data.accessToken);
        localStorage.setItem("refreshToken", res.data.refreshToken);
        localStorage.removeItem("hashOTP");
        router.push("/");
    } catch (error) {
        console.log(error)
          setError('Something went wrong');
          setOpen(true);
          setLoading(false);
      }  
  }

  const formik = useFormik({
    initialValues: {
      otp: ''
    },
    validationSchema: Yup.object({
      otp: Yup
        .string()
        .required('Please provide OTP')
        .matches(/^[0-9]+$/, "Must be only digits")
        .min(6, 'Must be exactly 6 digits')
        .max(6, 'Must be exactly 6 digits')
    }),
    onSubmit: (values) => {
      handleSubmit(values)
    }
  });

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login')
  }

  return (
    <>
      <Head>
        <title>OTP verification | secure voting platform</title>
      </Head>
      <Box
        component="main"
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexGrow: 1,
          minHeight: '100%'
        }}
      >
        <Container maxWidth="sm">
          <NextLink
            href="/login"
            passHref
          >
            <Button
              onClick={() => handleLogout()}
              startIcon={<ArrowBackIcon fontSize="small" />}
            >
              Login
            </Button>
          </NextLink>
          <form onSubmit={formik.handleSubmit}>
            <Box sx={{ my: 3 }}>
              <Typography
                color="textPrimary"
                variant="h4"
              >
                2 Step Verification
              </Typography>
              <Typography
                color="textSecondary"
                gutterBottom
                variant="body2"
              >
                Please enter the 6 digit verification code sent to your registered mobile number to continue
              </Typography>
            </Box>
            <TextField
              autoFocus
              error={Boolean(formik.touched.otp && formik.errors.otp)}
              fullWidth
              helperText={formik.touched.otp && formik.errors.otp}
              label="OTP"
              margin="normal"
              name="otp"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="otp"
              value={formik.values.otp}
              variant="outlined"
            />
            <Box sx={{ py: 2 }}>
              <Button
                color="primary"
                disabled={loading}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
              >
                Verify OTP
              </Button>
            </Box>
          </form>

          {/* <Typography
              color="textSecondary"
              variant="body2"
            >
              Didnt recieve OTP?
              {' '} */}
              <Link
                  component="button"
                  onClick={() => sendOTP()}
                  variant="body2"
                  underline="hover"
                  sx={{
                    cursor: 'pointer'
                  }}
              >
                  Resend verification code
              </Link>
          {/* </Typography> */}

        <Snackbar 
            open={open} 
            autoHideDuration={6000} 
            onClose={handleClose}
            anchorOrigin={{
            vertical: "top",
            horizontal: "right"
            }}
        >
        {
          error?
          <Alert 
            onClose={handleClose} 
            severity="error" 
            sx={{ width: '100%', height: '100%' }}
          >
            {error}
          </Alert>
          :
          <Alert 
            onClose={handleClose} 
            severity="success" 
            sx={{ width: '100%', height: '100%' }}
          >
            OTP sent sucsessfully
          </Alert>
        }
      </Snackbar>

        </Container>
      </Box>
    </>
  );
};

export default withAuth1(Login);
