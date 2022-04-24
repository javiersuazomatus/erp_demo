// @mui
import { Button, Divider, Grid, Typography } from '@mui/material';
// components
import Iconify from '../../components/Iconify';
//hooks
import useAuth from '../../hooks/useAuth';
import { useState } from 'react';

// ----------------------------------------------------------------------

export default function AuthFirebaseSocial() {
  const { loginWithGoogle/*, loginWithFacebook, loginWithTwitter */} = useAuth();

  const handleLoginGoogle = async () => {
    try {
      window.sessionStorage.setItem("authenticating", "1");
      await loginWithGoogle?.();
    } catch (error) {
      window.sessionStorage.removeItem("authenticating");
      console.error(error);
    }
  };

/*  const handleLoginFacebook = async () => {
    try {
      await loginWithFacebook?.();
    } catch (error) {
      console.error(error);
    }
  };

  const handleLoginTwitter = async () => {
    try {
      await loginWithTwitter?.();
    } catch (error) {
      console.error(error);
    }
  };*/

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs>
          <Button
            fullWidth
            size="large"
            color="inherit"
            variant="outlined"
            onClick={handleLoginGoogle}
          >
            <Iconify
              icon={'eva:google-fill'}
              color="#DF3E30"
              width={24}
              height={24}
              sx={{ mr: 1 }}
            />
            login with Google
          </Button>
        </Grid>

{/*        <Grid item xs>
          <Button
            fullWidth
            size="large"
            color="inherit"
            variant="outlined"
            onClick={handleLoginFacebook}
          >
            <Iconify icon={'eva:facebook-fill'} color="#1877F2" width={24} height={24} />
          </Button>
        </Grid>

        <Grid item xs>
          <Button
            fullWidth
            size="large"
            color="inherit"
            variant="outlined"
            onClick={handleLoginTwitter}
          >
            <Iconify icon={'eva:twitter-fill'} color="#1C9CEA" width={24} height={24} />
          </Button>
        </Grid>*/}
      </Grid>

      <Divider sx={{ my: 3 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          OR
        </Typography>
      </Divider>
    </>
  );
}
