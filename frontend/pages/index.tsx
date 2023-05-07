import Head from 'next/head'
import React from "react";
import { useTheme } from '@mui/material/styles';
import Compare from '../src/Compare';
import Hero from '../src/Hero';


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
        <Hero/>
        <Compare/>
      </main>
    </>
  )
}
