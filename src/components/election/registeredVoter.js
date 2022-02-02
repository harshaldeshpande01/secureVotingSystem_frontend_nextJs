import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Snackbar,
  Alert,
} from '@mui/material';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import axios from 'axios';

const API = axios.create({ baseURL: process.env.NEXT_PUBLIC_VOTING_SERVICE });

import { CONTRACT_ADDRESS, CONTRACT_ABI, SINGLE_CONTRACT_ABI } from '../../config';
import Web3 from 'web3';

export const RegisteredVoter = ({_id, candidates, phase}) => {
  const [voting, setvoting] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState();
  const [selected, setSelected] = useState('');
  const [fetching, setFetching] = useState(false);

  const getVoteCount = async() => {
    setFetching(true);
    try {
      const web3 = new Web3(Web3.givenProvider || "http://localhost:8545")
      
      const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS)

      const electionContractAddr = await contract.methods.deployedElections(_id).call();

      const electionContract = new web3.eth.Contract(SINGLE_CONTRACT_ABI, electionContractAddr);

      let i;
      let result = []
      for(i=1; i<=candidates.length; i++) {
        let temp = await electionContract.methods.candidates(i).call();
        let new1 = (({ id, voteCount }) => ({ id, voteCount }))(temp);
        result.push(JSON.stringify(new1));
      } 

      setFetching(false);
      alert(result)

    }catch(err) {
      console.log(err)
      setFetching(false);
    }
  }

  const handleChange = (event) => {
    setSelected(event.target.value);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const submitVote = async () => {
    setvoting(true)
    try {
      const web3 = new Web3(Web3.givenProvider || "http://localhost:8545")

      await window.ethereum.enable();
      const accounts = await web3.eth.getAccounts()
      
      const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS)

      const electionContractAddr = await contract.methods.deployedElections(_id).call();

      const electionContract = new web3.eth.Contract(SINGLE_CONTRACT_ABI, electionContractAddr);

      const response = await electionContract.methods.vote((candidates.indexOf(selected) + 1))
      .send({
        from: accounts[0], 
        gas: '5000000'
      })

      let token = localStorage.getItem("accessToken");
      const config = {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      };

      try {
        await API.post('/voteConfirmed', 
          {
            "txn": response.transactionHash
          },
          config
        );
      } catch(err) {
        console.log(err)
      }
      console.log(response.transactionHash);

    } catch(err) {
      setError(err)
    }
    setvoting(false)
    setOpen(true)
  }

  return (
    <>
    {
      (phase == 'voting') &&
      <Card>
        <CardHeader
          subheader="Voting will require ether as a your vote will be stored on the ethereum network!"
          title="Select candidate to vote for"
        />
        <Divider />
        <CardContent>
          <Grid
            container
            spacing={2}
          >
            <Grid
              item
              md={8}
              xs={12}
            >
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Candidates</InputLabel>
                <Select
                  value={selected}
                  label="Candidates"
                  onChange={handleChange}
                >
                  {
                    candidates.map((c, _id) => {
                      return(
                        <MenuItem 
                          key={c}
                          value={c}
                        >
                          {c}
                        </MenuItem>
                      )
                    })
                  }
                </Select>
              </FormControl>
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
            disabled={voting || !selected}
            onClick={() => submitVote()}
          >
            Submit Vote
          </Button>
        </Box>
      </Card>
    }
    {
        (phase == 'results') &&
        <Card sx={{mb: 3}}>
            <CardHeader
            title="Election results"
            subheader="Voting for this election has been completed. You can view the results below now"
            />
            <Divider />
            <CardContent>
            <Box
                sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                // p: 2
                }}
            >
                <Button
                color="primary"
                variant="contained"
                disabled={fetching}
                onClick={() => getVoteCount()}
                >
                View results
                </Button>
            </Box>
            </CardContent>
        </Card>
    }
    {
        (phase == 'registration') &&
        <Card sx={{mb: 3}}>
            <CardHeader
            title="Election in registration phase"
            subheader="You are eligible to vote! Voting window will open soon, stay tuned!"
            />
        </Card>
    }
    <Snackbar 
          open={open} 
          autoHideDuration={6000} 
          onClose={handleClose}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right"
          }}
        >
          {error?
            <Alert 
              onClose={handleClose} 
              severity="error" 
              sx={{ width: '100%', height: '100%' }}
            >
              Something went wrong! Seems like you have already voted 
            </Alert>
            :
            <Alert 
              onClose={handleClose} 
              severity="success" 
              sx={{ width: '100%', height: '100%' }}
            >
              Vote recorded successfully! Check your inbox for transaction details
            </Alert>
          }
        </Snackbar>
    </>
  );
};
