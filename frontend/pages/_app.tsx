import type { AppProps } from 'next/app'
import { PaletteColorOptions, ThemeOptions } from '@mui/material/styles';
import { ThemeProvider, useTheme, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import localFont from '@next/font/local';
import '../styles/styles.css';


const myFont = localFont({ 
  src: '../public/fonts/circular-medium.ttf',
  weight: '400',
  style: 'normal',
  display: 'swap'
});


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

declare module '@mui/material/styles' {
  interface CustomPalette {
    filled: PaletteColorOptions;
  }
  interface Palette extends CustomPalette {}
  interface PaletteOptions extends CustomPalette {}
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    filled: true;
  }
}




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
    filled: {
      main: '#fff',
      contrastText: '#000',
    },
  },
  typography: {
    fontFamily: 'circular-medium',
  },
  shape: {
    borderRadius: 20,
  },
  // components: {
  //   MuiCssBaseline: {
  //     styleOverrides: `
  //       @font-face {
  //         font-family: 'circular-medium';
  //         font-style: normal;
  //         font-display: swap;
  //         font-weight: 400;
  //         src: local('Circular'), local('circular-medium'), url(${myFont}) format('ttf');
  //         unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
  //       }
  //     `,
  //   },
  // },
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
