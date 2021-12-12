import { useState, useRef } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
// import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Button, Container, Snackbar, Alert, Link, TextField, Typography , Stack} from '@mui/material';
import ReCAPTCHA from "react-google-recaptcha";
import axios from "axios";

import withAuth from '../hoc/withAuth'

const Forgot = () => {
  const [loading, setLoading] = useState();
  const [open, setOpen] = useState();
//   const [error, setError] = useState();
//   const [message, setMessage] = useState();
  const recaptchaRef = useRef();

  const handleClose = (_event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    const { email } = values;
    const config = {
      header: {
        "Content-Type": "application/json",
      },
    };

    const captchaToken = await recaptchaRef.current.executeAsync();
    recaptchaRef.current.reset();
  
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_AUTH_LEVEL1}/forgotPassword`,
        { 
          email,
          captchaToken
        },
        config
      );
      setLoading(false);
    //   setMessage('Please check your inbox for furthur steps');
      setOpen(true);
    } catch (error) {
      console.log(error)
      setLoading(false);
      setOpen(true);
    }
  }

  const formik = useFormik({
    initialValues: {
      email: ''
    },
    validationSchema: Yup.object({
      email: Yup
        .string()
        .email(
          'Must be a valid email')
        .max(255)
        .required(
          'Email is required')
    }),
    onSubmit: (values) => {
      handleSubmit(values);
    }
  });

  return (
    <>
      <Head>
        <title>Forgot password | secure voting platform</title>
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
          <form onSubmit={formik.handleSubmit}>
            <Box sx={{ my: 3 }}>
              <Typography
                color="textPrimary"
                variant="h4"
              >
                Forgot password
              </Typography>
              <Typography
                color="textSecondary"
                gutterBottom
                variant="body2"
              >
                Enter your email address to continue
              </Typography>
            </Box>
            <TextField
              error={Boolean(formik.touched.email && formik.errors.email)}
              fullWidth
              helperText={formik.touched.email && formik.errors.email}
              label="Email Address"
              margin="normal"
              name="email"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="email"
              value={formik.values.email}
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
                Send reset link
              </Button>
            </Box>
              <NextLink
                href="/login"
              >
                <Link
                  to="/login"
                  variant="subtitle2"
                  underline="hover"
                  sx={{
                    cursor: 'pointer'
                  }}
                >
                  Back to Login
                </Link>
              </NextLink>
          </form>
          <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
              size="invisible"
              badge='bottomleft'
          />

      <Snackbar 
        open={open} 
        autoHideDuration={6000} 
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
      >
        <Alert 
          onClose={handleClose} 
          severity="success" 
          sx={{ width: '100%', height: '100%' }}
        >
            Please check your inbox for furthur steps
        </Alert>
      </Snackbar>

        </Container>
      </Box>
    </>
  );
};

export default withAuth(Forgot);
