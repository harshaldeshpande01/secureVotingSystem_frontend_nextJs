import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider
} from '@mui/material';

import Router from 'next/router'
import axios from 'axios';
const API = axios.create({ baseURL: process.env.NEXT_PUBLIC_VOTING_SERVICE });

import { CONTRACT_ADDRESS, CONTRACT_ABI, SINGLE_CONTRACT_ABI } from '../../config';
import Web3 from 'web3';

import LinearProgress from '@mui/material/LinearProgress';
import { Bar } from 'react-chartjs-2';


export const Admin = ({_id, phase, candidates}) => {
  // console.log(candidates);
  const [fetching, setFetching] = useState(false);
  const [changingPhase, setChangingPhase] = useState(false);
  const [votes, setVotes] = useState();

  useEffect(() => {
    if(phase != 'registration') {
      getVoteCount();
    }
  }, [phase]);

  const startVotingPhase = async() => {
    setChangingPhase(true);
    let token = localStorage.getItem("accessToken");
    const config = {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    };

    try {
      const res = await API.post(
        `/startVotingPhase/${_id}`,
        {
          "admin": true
        },
        config
      );
      setChangingPhase(false);
      // console.log(res)
      Router.reload(window.location.pathname);
    }
    catch(err) {
      setChangingPhas(false);
      console.log(err)
    }
  }

  const endElection = async() => {
    setChangingPhase(true);
    let token = localStorage.getItem("accessToken");
    const config = {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    };

    try {
      const res = await API.post(
        `/endElection/${_id}`,
        {
          "admin": true
        },
        config
      );
      setChangingPhase(false);
      // console.log(res)
      Router.reload(window.location.pathname);
    }
    catch(err) {
      setChangingPhas(false);
      console.log(err)
    }
  }

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
        result.push(new1.voteCount);
      } 

      setFetching(false);
      setVotes(result);

    }catch(err) {
      console.log(err)
      setFetching(false);
    }
  }

  var data = {
    labels: candidates.map(x => x),
    datasets: [{
      label: `Candidate wise vote count`,
      data: votes?.map(x => x),
      backgroundColor: [
        'rgba(54, 162, 235, 0.2)'
      ],
    }]
  };

  var options = {
    maintainAspectRatio: false,
    scales: {
    },
    legend: {
      labels: {
        fontSize: 25,
      },
    },
  }

  return (
    <>
    { 
      (phase == 'registration') &&
      <Card sx={{mb: 3}}>
        <CardHeader
          title="Admin panel"
          subheader={`Current election phase - ${phase}`}
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
              disabled={changingPhase}
              onClick={() => startVotingPhase()}
            >
              Start Voting Phase
            </Button>
          </Box>
        </CardContent>
      </Card>
    }
    { 
      (phase == 'voting') &&
      <>
      <Card sx={{mb: 3}}>
        <CardHeader
          title="Admin panel"
          subheader={`Current election phase - ${phase}`}
          action={
            <Button
                variant="outlined" 
                color="error"
                disabled={changingPhase}
                onClick={() => endElection()}
            >
                End voting and view results
            </Button>
          }
        />
      </Card>

      <Card sx={{mb: 3}}>
        <CardHeader
          title="Live vote count"
          action={
            <Button
                variant="contained" 
                color="primary"
                disabled={fetching}
                onClick={() => getVoteCount()}
            >
              Refresh
            </Button>
          }
        />
        <Divider />
        <CardContent>
        {
          fetching?
          <LinearProgress />
          :
          <Box
            sx={{
              maxWidth: 650
            }}
          >
              <Bar
                data={data}
                height={400}
                options={options}
              />
          </Box>
        }
        </CardContent>
      </Card>
      </>
    }
    { 
      (phase == 'results') &&
      <Card sx={{mb: 3}}>
        <CardHeader
          title="Admin panel"
          subheader="Voting for this election has been completed. You can view the results below now"
        />
        <Divider />
        <CardContent>
        {
          fetching?
          <LinearProgress />
          :
          <Box
            sx={{
              maxWidth: 650
            }}
          >
              <Bar
                data={data}
                height={400}
                options={options}
              />
          </Box>
        }
        </CardContent>
      </Card>
    }
    </>
  );
};
