import { Button, Box, Card, CardContent, Divider, Grid, Typography } from '@mui/material';
import { Clock as ClockIcon } from '../../icons/clock';

import NextLink from 'next/link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export const ElectionCard = (props) => {
  const { _id, title, description, phase } = props.election;

  return (
  <Card
    sx={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    }}
    // {...rest}
  >
    <CardContent>
      {/* <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          pb: 3
        }}
      >
        <Avatar
          alt="Product"
          src={product.media}
          variant="square"
        />
      </Box> */}
      <Typography
        align="center"
        color="textPrimary"
        gutterBottom
        variant="h5"
      >
        {title}
      </Typography>
      <Typography
        align="center"
        color="textPrimary"
        variant="body1"
      >
        {description}
      </Typography>
    </CardContent>
    <Box sx={{ flexGrow: 1 }} />
    <Divider />
    <Box sx={{ p: 2 }}>
      <Grid
        container
        spacing={2}
        sx={{ justifyContent: 'space-between' }}
      >
        <Grid
          item
          sx={{
            alignItems: 'center',
            display: 'flex'
          }}
        >
          <ClockIcon color="action" />
          <Typography
            color="textSecondary"
            display="inline"
            sx={{ pl: 1 }}
            variant="body2"
          >
            {phase}
          </Typography>
        </Grid>
        <Grid
          item
          sx={{
            alignItems: 'center',
            display: 'flex'
          }}
        >
          <NextLink
            href={`/election/${_id}`}
            passHref
          >
            <Button
              component="a"
              // startIcon={<ArrowBackIcon fontSize="small" />}
            >
              Learn more
            </Button>
          </NextLink>
        </Grid>
      </Grid>
    </Box>
  </Card>
)};
