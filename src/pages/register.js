import { useState, useRef } from 'react'

import Head from 'next/head';
import NextLink from 'next/link';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormHelperText,
  Link,
  TextField,
  Typography,
  Alert,
  Snackbar
} from '@mui/material';

import ReCAPTCHA from "react-google-recaptcha";
import axios from "axios";

import withAuth from '../hoc/withAuth'

const Register = () => {
  const [loading, setLoading] = useState()
  const recaptchaRef = useRef();
  const [open, setOpen] = useState();
  const [error, setError] = useState();

  const handleClose = (_event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const registerUser = async (values) => {
    setLoading(true);
    const { email, phone, password } = values;
    let temp=phone;
    if(temp[0] === '+') {
      temp = temp.substring(1);
    }
    if(temp.length === 10){
      temp = "91" + temp;
    }

    const config = {
      header: {
        "Content-Type": "application/json",
      },
    };

    const captchaToken = await recaptchaRef.current.executeAsync();
    recaptchaRef.current.reset();
  
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_AUTH_LEVEL1}/register`,
        { 
          email, 
          password, 
          phone: temp,
          captchaToken 
        },
        config
      );
      setLoading(false);
      console.log(res.data.data);
      setError('');
      setOpen(true)
    } catch (error) {
      setLoading(false);
      console.log(error.response.data)
      setError(error.response.data)
      setOpen(true)
    }
  }

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      phone: '',
      policy: false
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
        .min(6)
        .max(255)
        .required(
          'Password is required'),
      phone: Yup
        .string()
        .matches(/^[6-9]\d{9}$/, {message: "Please enter valid number."})
        .required('Required'),
      policy: Yup
        .boolean()
        .oneOf(
          [true],
          'This field must be checked'
        )
    }),
    onSubmit: (values) => {
      registerUser(values)
    }
  });

  return (
    <>
      <Head>
        <title>
          Register | secure voting platform
        </title>
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
                Create a new account
              </Typography>
              <Typography
                color="textSecondary"
                gutterBottom
                variant="body2"
              >
                Use your email to create a new account
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
            <TextField
              error={Boolean(formik.touched.phone && formik.errors.phone)}
              fullWidth
              helperText={formik.touched.phone && formik.errors.phone}
              label="Phone number"
              margin="normal"
              name="phone"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="text"
              value={formik.values.phone}
              variant="outlined"
            />
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                ml: -1
              }}
            >
              <Checkbox
                checked={formik.values.policy}
                name="policy"
                onChange={formik.handleChange}
              />
              <Typography
                color="textSecondary"
                variant="body2"
              >
                I have read the
                {' '}
                <NextLink
                  href="#"
                  passHref
                >
                  <Link
                    color="primary"
                    underline="always"
                    variant="subtitle2"
                  >
                    Terms and Conditions
                  </Link>
                </NextLink>
              </Typography>
            </Box>
            {Boolean(formik.touched.policy && formik.errors.policy) && (
              <FormHelperText error>
                {formik.errors.policy}
              </FormHelperText>
            )}
            <Box sx={{ py: 2 }}>
              <Button
                color="primary"
                disabled={loading}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
              >
                Sign Up Now
              </Button>
            </Box>
            <Typography
              color="textSecondary"
              variant="body2"
            >
              Have an account?
              {' '}
              <NextLink
                href="/login"
                passHref
              >
                <Link
                  variant="subtitle2"
                  underline="hover"
                >
                  Sign In
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
        </Container>
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
              Check your inbox for email verification!
            </Alert>
          }
        </Snackbar>
      </Box>
    </>
  );
};

export default withAuth(Register);
