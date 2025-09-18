'use client';

import { JSX } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MainContainer from './containers/MainContainer';

const spotifyTheme = createTheme({
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
  palette: {
    mode: 'dark',
    background: {
      default: '#191414',
      paper: '#191414',
    },
    text: {
      primary: '#EAEAEA',
      secondary: '#B3B3B3',
    },
    primary: {
      main: '#1DB954',
      contrastText: '#191414',
    },
    secondary: {
      main: '#EAEAEA',
    },
  },
});

function App(): JSX.Element {
  return (
    <ThemeProvider theme={spotifyTheme}>
      <CssBaseline />
      <MainContainer />
    </ThemeProvider>

  );
}

export default App;
