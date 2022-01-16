import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
  Snackbar,
  Alert
} from '@mui/material';
import { useRouter } from 'next/router'

import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../../config';
import axios from 'axios';
import Web3 from 'web3';

import { useFormik } from 'formik';
import * as Yup from 'yup';

const API = axios.create({ baseURL: process.env.NEXT_PUBLIC_VOTING_SERVICE });

export const CreateElection = (props) => {
  const router = useRouter();
  const [loading, setLoading] = useState();
  const [account, setAccount] = useState();
  const [contract, setContract] = useState();
  const [creating, setCreating] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    loadBlockchainData();
  }, []);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const loadBlockchainData = async() => {
    setLoading(true)
    try {
    const web3 = new Web3(Web3.givenProvider || "http://localhost:8545")

    await window.ethereum.enable();
    const accounts = await web3.eth.getAccounts()
    console.log(accounts[0]);
    setAccount(accounts[0])
    
    const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS)
    setContract(contract);
    console.log(contract)
    }
    catch (err) {
      console.log(err)
    }
    setLoading(false)
  }

  const createElection = async (values) => {
    setCreating(true)
    const { title, description, tags, candidates } = values;
    const _candidates = candidates.split(',');
    const _tags = tags.split(',');
    let token = localStorage.getItem("accessToken");
    const config = {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    };

    try {
      const res = await API.post('/elections',
      {
          title,
          description,
          creator: "Harshal",
          phase: "voting",
          tags: _tags,
          candidates: _candidates
      }, config
      );
      try {
        await contract.methods.createElection(_candidates.length, res.data._id)
        .send({
          from: account, 
          gas: '5000000'
        })
        setCreating(false)
        setOpen(true);
      } catch(err) {
        setCreating(false)
        API.delete(
          `/elections/${res.data._id}`, 
          {
            headers: {
              "Authorization": `Bearer ${token}` 
            }
          }
        )
        setError(true)
        setOpen(true)
      }
    }
    catch(err) {
      if(err.response.status === 401) {
        localStorage.clear();
        alert("Your session has expired");
        router.push('/login')
      }
      else {
        setCreating(false)
        setError(true)
        setOpen(true)
      }
    }
  }
  
  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      tags: '',
      candidates: ''
    },
    validationSchema: Yup.object({
      title: Yup.string()
      .required(),
    description: Yup.string()
      .required(),
    tags: Yup.string()
      .required(),
    candidates: Yup.string()
      .required()
    }),
    onSubmit: (values) => {
      createElection(values);
    }
  });

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  return (
    <form
      onSubmit={formik.handleSubmit}
    >
      <Card>
        <CardHeader
          subheader="This will require ether as a smart contract will be deployed on the etherum network to store your votes!"
          title="Provide election details to continue"
        />
        <Divider />
        <CardContent>
          <Grid
            container
            spacing={2}
          >
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                error={Boolean(formik.touched.title && formik.errors.title)}
                fullWidth
                helperText={formik.touched.title && formik.errors.title}
                label="Election title"
                margin="normal"
                name="title"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.title}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                error={Boolean(formik.touched.description && formik.errors.description)}
                fullWidth
                helperText={formik.touched.description && formik.errors.description}
                label="Description"
                margin="normal"
                name="description"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.description}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                error={Boolean(formik.touched.tags && formik.errors.tags)}
                fullWidth
                helperText={formik.touched.tags && formik.errors.tags}
                label="Tags (comma separated list)"
                margin="normal"
                name="tags"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="tags"
                value={formik.values.tags}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                error={Boolean(formik.touched.candidates && formik.errors.candidates)}
                fullWidth
                helperText={formik.touched.candidates && formik.errors.candidates}
                label="Candidates (comma separated list)"
                margin="normal"
                name="candidates"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="candidates"
                value={formik.values.candidates}
                variant="outlined"
              />
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            p: 2
          }}
        >
          <Button
            color="primary"
            variant="contained"
            type='submit'
            disabled={creating}
          >
            Create election
          </Button>
        </Box>
      </Card>

      {
        error?
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
            Election hosting failed! Initiated atomicity measures
          </Alert>
        </Snackbar>
        :
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
            Hosted successfully!
          </Alert>
        </Snackbar>
      }
    </form>
  );
};
