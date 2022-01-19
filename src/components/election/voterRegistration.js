import { useState } from 'react';
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

export const VoterRegistration = ({_id, phase}) => {
  const [registering, setRegistering] = useState(false);

  const registerVoter = async() => {
    setRegistering(true);
    let token = localStorage.getItem("accessToken");
    const config = {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    };


    console.log(`Sending req to /register/${_id}`)
    console.log(token)
    try {
      const res = await API.post(
        `/register/${_id}`,
        {
          "registering": true
        },
        config
      );
      setRegistering(false);
      console.log(res)
      Router.reload(window.location.pathname);
    }
    catch(err) {
      setRegistering(false);
      console.log(err)
      // if(err.response.status === 401) {
      //   localStorage.clear();
      //   alert("Your session has expired");
      //   router.push('/login')
      // }
    }
  }

  return (
    <>
    { 
      (phase == 'registration') ?
      <Card sx={{mb: 3}}>
        <CardHeader
          title="Voter Registeration"
          subheader="You have not registered to vote in this election. Kindly register to be eligible for voting"
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
              disabled={registering}
              onClick={() => registerVoter()}
            >
              Register now
            </Button>
          </Box>
        </CardContent>
      </Card> 
      :
        <Card sx={{mb: 3}}>
            <CardHeader
                title="Registeration has ended &#128534;"
                subheader="Registration phase is over. You are not eligible to vote in this election"
            />
        </Card>
      }
    </>
  );
};
