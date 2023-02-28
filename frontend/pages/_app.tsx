// import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ThemeOptions } from '@mui/material/styles';
import { ThemeProvider, useTheme, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

declare module '@mui/material/styles' {
  interface Theme {
    status: {
      danger: string;
    };
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    status?: {
      danger?: string;
    };
  }
}
// import { green, purple } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1DB954',
    },
    secondary: {
      main: '#1DB954',
    },
    background: {
      default: '#131313',
      paper: '#171717',
    },
  },
});

export default function App({ Component, pageProps }: AppProps) {
  // return <Component {...pageProps} />

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
