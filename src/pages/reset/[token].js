import { useState, useRef } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Button, Container, Snackbar, Alert, Link, TextField, Typography , Stack} from '@mui/material';
import ReCAPTCHA from "react-google-recaptcha";
import axios from "axios";

import withAuth from '../../hoc/withAuth'

const Forgot = () => {
  const router = useRouter();
  const [loading, setLoading] = useState();
  const [open, setOpen] = useState();
  const [error, setError] = useState();
  const recaptchaRef = useRef();

  const handleClose = (_event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const handleSubmit = async (values) => {
    const {password} = values;

    setLoading(true);
    
    const config = {
      header: {
        "Content-Type": "application/json",
      },
    };

  const captchaToken = await recaptchaRef.current.executeAsync();
  recaptchaRef.current.reset();

  const token = router.query.token;

    try {
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_AUTH_LEVEL1}/passwordreset/${token}`,
        {
          password,
          captchaToken
        },
        config
      );
      setLoading(false);
      setOpen(true);
    } catch (error) {
      setLoading(false);
      setError(error.response.data)
      setOpen(true);
    }
    
    return true;
  }

  const formik = useFormik({
    initialValues: {
      password: ''
    },
    validationSchema: Yup.object({
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
        <title>Reset password | secure voting platform</title>
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
                Reset password
              </Typography>
              <Typography
                color="textSecondary"
                gutterBottom
                variant="body2"
              >
                Set new password for your account
              </Typography>
            </Box>
            <TextField
              error={Boolean(formik.touched.password && formik.errors.password)}
              fullWidth
              helperText={formik.touched.password && formik.errors.password}
              label="New password"
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
                Reset password
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
                Password update success
            </Alert>
        }
      </Snackbar>

        </Container>
      </Box>
    </>
  );
};

export default withAuth(Forgot);
