import React from 'react';

import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Skeleton
} from '@mui/material';
const SkeletonCard = () => {

  return (
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
              <Skeleton/>
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
            disabled={true}
          >
            Submit Vote
          </Button>
        </Box>
      </Card>
  );
};

export default React.memo(SkeletonCard);
