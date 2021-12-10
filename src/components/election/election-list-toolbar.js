import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  SvgIcon,
  Typography
} from '@mui/material';

import { Search as SearchIcon } from '../../icons/search';
import NextLink from 'next/link';


export const ElectionListToolbar = (props) => (
  <Box {...props}>
    <Box
      sx={{
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        m: -1
      }}
    >
      <Typography
        sx={{ m: 1 }}
        variant="h4"
      >
        Browse elections
      </Typography>
      <Box sx={{ m: 1 }}>
          <NextLink
            href="/host"
            passHref
          >
            <Button
              component="a"
              color="primary"
              variant="contained"
            >
              Host new election
            </Button>
          </NextLink>
        {/* <Button
          color="primary"
          variant="contained"
        >
          Host new election
        </Button> */}
      </Box>
    </Box>
    <Box sx={{ mt: 3 }}>
      <Card>
        <CardContent>
          <Box sx={{ maxWidth: 500 }}>
            <TextField
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SvgIcon
                      fontSize="small"
                      color="action"
                    >
                      <SearchIcon />
                    </SvgIcon>
                  </InputAdornment>
                )
              }}
              placeholder="Search..."
              variant="outlined"
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  </Box>
);
