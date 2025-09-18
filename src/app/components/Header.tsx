import { JSX } from 'react';
import {
  AppBar, Button, Toolbar, Typography,
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import axios from 'axios';

function Header(): JSX.Element {
  const initiateSpotify = async () => {
    const res = await axios.get('/api/authorize');
    localStorage.setItem('spotify_pkce_verifier', res.data.code_verifier);
    window.open(res.data.auth_url, 'Spotify Login', 'width=500,height=600');
  };

  return (
    <>
      <AppBar>
        <Toolbar variant="dense" sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography>
            Calming Words
          </Typography>
          <Button
            onClick={() => initiateSpotify()}
            endIcon={<AccountCircleIcon />}
          >
            Sign in
          </Button>
        </Toolbar>
      </AppBar>
      <Toolbar variant="dense" />
    </>
  );
}
export default Header;
