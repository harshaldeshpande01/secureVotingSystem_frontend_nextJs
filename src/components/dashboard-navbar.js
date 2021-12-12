import PropTypes from 'prop-types';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import styled from '@emotion/styled';
import { AppBar, Badge, Box, IconButton, Toolbar, Tooltip, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';

const DashboardNavbarRoot = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[3]
}));

export const DashboardNavbar = (props) => {
  const { onSidebarOpen, ...other } = props;
  const router = useRouter();

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  }

  return (
    <>
      <DashboardNavbarRoot
        sx={{
          left: {
            lg: 280
          },
          width: {
            lg: 'calc(100% - 280px)'
          }
        }}
        {...other}>
        <Toolbar
          disableGutters
          sx={{
            minHeight: 64,
            left: 0,
            px: 2
          }}
        >
          <IconButton
            onClick={onSidebarOpen}
            sx={{
              display: {
                xs: 'inline-flex',
                lg: 'none'
              }
            }}
          >
            <MenuIcon fontSize="small" />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <Tooltip title="Home">
            <NextLink
              href="/elections"
              passHref
            >
            <IconButton 
              sx={{ ml: 1 }}
              component='a'
            >
              <Badge
                badgeContent={4}
                color="primary"
                variant="dot"
                invisible={!(router.pathname === '/elections')}
              >
                  <HomeIcon fontSize="small" />
              </Badge>
            </IconButton>
            </NextLink>
          </Tooltip>
          <Button 
            size='small' 
            color='primary'
            onClick={() => handleLogout()}
          >
            Logout
          </Button>
        </Toolbar>
      </DashboardNavbarRoot>
    </>
  );
};

DashboardNavbar.propTypes = {
  onSidebarOpen: PropTypes.func
};
