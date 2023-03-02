import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
// import styles from '../styles/Home.module.css'
import React from "react";
import Cards from "../src/Cards";
import { ThemeProvider, useTheme, createTheme } from '@mui/material/styles';

import Box from '@mui/material/Box';
import SharedTable from '../src/SharedTable';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const theme = useTheme();
  return (
    <>
      <Head>
        <title>SpotifyDiff</title>
        <meta name="description" content="Compare two or more Spotify playlists!" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Cards/>
        {/* <SharedTable/> */}
      </main>
    </>
  )
}
