import { Link as RouterLink, Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import {
  Card,
  Link,
  Container,
  Typography,
  Snackbar,
  Alert,
} from '@mui/material';

import useResponsive from '../../hooks/useResponsive';

import Page from '../Page';
import Logo from '../Logo';

import { LoginForm } from '../../sections/auth/login';

import Cookies from 'js-cookie';

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const HeaderStyle = styled('header')(({ theme }) => ({
  top: 0,
  zIndex: 9,
  lineHeight: 0,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  position: 'absolute',
  padding: theme.spacing(3),
  justifyContent: 'space-between',
  [theme.breakpoints.up('md')]: {
    alignItems: 'flex-start',
    padding: theme.spacing(7, 5, 0, 7),
  },
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 464,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: theme.spacing(2, 0, 2, 2),
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

export const Login = () => {
  const smUp = useResponsive('up', 'sm');

  const mdUp = useResponsive('up', 'md');

  const navigate = useNavigate();

  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState(
    'Adminn Logged In successfully!'
  );
  const [snackColor, setSnackColor] = useState('success');

  const handleSnackClick = () => {
    setSnackOpen(true);
  };

  const handleSnackClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackOpen(false);
  };

  let user = Cookies.get('user');

  if (user) {
    navigate('/dashboard/app', { replace: true });
  }

  return (
    <Page title="Login">
      <RootStyle>
        <HeaderStyle>
          <Logo />

          {smUp && (
            <Typography variant="body2" sx={{ mt: { md: -2 } }}>
              Don’t have an account? {''}
              <Link variant="subtitle2" component={RouterLink} to="/register">
                Get started
              </Link>
            </Typography>
          )}
        </HeaderStyle>

        {mdUp && (
          <SectionStyle>
            <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
              Hi, Welcome Back
            </Typography>
            <img
              src="/static/illustrations/illustration_login.png"
              alt="login"
            />
          </SectionStyle>
        )}

        <Container maxWidth="sm">
          <ContentStyle>
            <Typography variant="h4" gutterBottom>
              Sign in to Inventory Management System
            </Typography>

            <Typography sx={{ color: 'text.secondary', mb: 5 }}>
              Enter your details below.
            </Typography>

            {/* <AuthSocial /> */}

            <LoginForm
              setSnackOpen={setSnackOpen}
              setSnackMessage={setSnackMessage}
              setSnackColor={setSnackColor}
            />

            {!smUp && (
              <Typography variant="body2" align="center" sx={{ mt: 3 }}>
                Don’t have an account?{' '}
                <Link variant="subtitle2" component={RouterLink} to="/register">
                  Get started
                </Link>
              </Typography>
            )}
          </ContentStyle>
        </Container>

        <Snackbar
          open={snackOpen}
          autoHideDuration={6000}
          onClose={handleSnackClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          // key={'top'+'right'}
        >
          <Alert
            onClose={handleSnackClose}
            severity={snackColor}
            sx={{ width: '100%' }}
          >
            {snackMessage}
          </Alert>
        </Snackbar>
      </RootStyle>
    </Page>
  );
};
