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
// import { Sales } from '../dashboard/sales';

import { CONTRACT_ADDRESS, CONTRACT_ABI, SINGLE_CONTRACT_ABI } from '../../config';
import axios from 'axios';
import Web3 from 'web3';


const API = axios.create({ baseURL: process.env.NEXT_PUBLIC_VOTING_SERVICE });

export const CreateElection = ({_id, candidates, admin}) => {
  const [voting, setvoting] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState();
  const [selected, setSelected] = useState('');

  const handleChange = (event) => {
    setSelected(event.target.value);
  };

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

      // const temp = await electionContract.methods.candidates(1).call();
      // console.log(temp)

      await electionContract.methods.vote((candidates.indexOf(selected) + 1))
      .send({
        from: accounts[0], 
        gas: '5000000'
      })
    } catch(err) {
      setError(err)
    }
    setvoting(false)
    setOpen(true)
  }

  return (
    <>
    {admin &&
      <Card sx={{mb: 3}}>
        <CardHeader
          title="Admin panel"
        />
        <Divider />
        {/* <Sales /> */}
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
              Get vote count
            </Button>
          </Box>
        </CardContent>
      </Card>
      }
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
              Vote recorded successfully!
            </Alert>
          }
        </Snackbar>
      </Card>
    </>
  );
};
