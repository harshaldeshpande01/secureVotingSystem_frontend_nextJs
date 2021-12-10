import { useState, useRef } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Button, Container, Snackbar, Alert, Link, TextField, Typography } from '@mui/material';
import ReCAPTCHA from "react-google-recaptcha";
import axios from "axios";

const Login = () => {
  const router = useRouter();
  const [loading, setLoading] = useState();
  const [open, setOpen] = useState();
  const recaptchaRef = useRef();

  const handleClose = (_event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    const {email, password} = values;
    const config = {
      header: {
        "Content-Type": "application/json",
      },
    };

    const captchaToken = await recaptchaRef.current.executeAsync();
    recaptchaRef.current.reset();
    
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_AUTH_LEVEL1}/login`,
        { 
          email, 
          password, 
          captchaToken 
        },
        config
      );
      setLoading(false);
      localStorage.setItem("accessToken", res.data.token);
      router.push('/otp');
    } catch (error) {
      setLoading(false);
      setOpen(true);
    }
    setLoading(false);
  }

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: Yup.object({
      email: Yup
        .string()
        .email(
          'Must be a valid email')
        .max(255)
        .required(
          'Email is required'),
      password: Yup
        .string()
        .max(255)
        .required(
          'Password is required')
    }),
    onSubmit: (values) => {
      handleSubmit(values);
    }
  });

  return (
    <>
      <Head>
        <title>Login | secure voting platform</title>
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
                Sign in
              </Typography>
              <Typography
                color="textSecondary"
                gutterBottom
                variant="body2"
              >
                Sign in to the secure voting platform
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
            <TextField
              error={Boolean(formik.touched.password && formik.errors.password)}
              fullWidth
              helperText={formik.touched.password && formik.errors.password}
              label="Password"
              margin="normal"
              name="password"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="password"
              value={formik.values.password}
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
                Sign In Now
              </Button>
            </Box>
            <Typography
              color="textSecondary"
              variant="body2"
            >
              Don&apos;t have an account?
              {' '}
              <NextLink
                href="/register"
              >
                <Link
                  to="/register"
                  variant="subtitle2"
                  underline="hover"
                  sx={{
                    cursor: 'pointer'
                  }}
                >
                  Sign Up
                </Link>
              </NextLink>
            </Typography>
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
          severity="error" 
          sx={{ width: '100%', height: '100%' }}
        >
          Invalid username or password!
        </Alert>
      </Snackbar>

        </Container>
      </Box>
    </>
  );
};

export default Login;
