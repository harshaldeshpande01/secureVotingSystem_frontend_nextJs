import { Box, Card, CardContent, Divider, Grid, Typography, Skeleton } from '@mui/material';
import { Clock as ClockIcon } from '../../icons/clock';

export const SkeletonCard = () => {
  return (
  <Card
    sx={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    }}
  >
    <CardContent>
      <Typography
        align="center"
        color="textPrimary"
        gutterBottom
        variant="h5"
      >
          <Skeleton 
            variant="rectangular" 
            fullWidth
          />
      </Typography>
      <Typography
        align="center"
        color="textPrimary"
        variant="body1"
      >
        <Skeleton 
            variant="rectangular" 
            fullWidth
        />
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
            <Skeleton 
            variant="rectangular" 
            />
          </Typography>
        </Grid>
        <Grid
          item
          sx={{
            alignItems: 'center',
            display: 'flex'
          }}
        >
          <Skeleton 
            variant="rectangular" 
          />
        </Grid>
      </Grid>
    </Box>
  </Card>
)};
