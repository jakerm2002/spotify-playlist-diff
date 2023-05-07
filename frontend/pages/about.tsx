import Head from 'next/head'
import React from "react";
import { Link } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import AboutHero from '../src/AboutHero';
import aboutStyles from "../styles/aboutStyles.module.css"

const list = [
    'Authentication with the Spotify API',
    'Looking at Spotify API response headers',
    'Making multiple calls to Spotify API at once using Promises',
    'Optimizing bulk inserts into MySQL database using Objection.js and knex',
    'Determining when and when not to use transactions in SQL',
    'Creating a hero banner using CSS grid layout',
    'Using React to keep track of frontend state; adding/hiding/deleting cards from view',
    'Designing a REST API using Express.js to serve as the backend for determining shared tracks',
    'Writing SQL queries to determine shared tracks, implementing the queries using knex query builder',
    'Use snapshot_id of Spotify playlist to determine if a playlist has been updated since added to database',
    'Designing a user-friendly frontend UI that fits Spotify\'s theme',
]

const technologies = [
    'Frontend: Next.js, React.js, Material UI',
    'Backend: Express.js, Node.js',
    'Database: MySQL, AWS RDS',
    'ORM/Query building: Objection.js, knex',
    'Hosting: AWS Amplify, Elastic Beanstalk, EC2, name.com',
    'REST API: Spotify API, axios'
]

export default function About() {
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
        <AboutHero/>
        <div className={aboutStyles.gridContainer}>
            <div className={aboutStyles.aboutText}>
                <p>Hi! I&apos;m Jake, a junior computer science student at the University of Texas at Austin. Add me on LinkedIn <Link target="_blank" href="https://www.linkedin.com/in/jake-medina/">here!</Link></p>
                <p>I built this tool because, despite there being other similar websites like this one, there were none that could handle more than two playlists at once or handle a large number of playlists.</p>
                <p>I put in a lot of effort to make sure that this tool could handle a large number of songs/playlists without taking huge performance hits.</p>
            </div>
            <div>
                <p>Things I&apos;ve worked on/learned about during this project:</p>
                <ul className={aboutStyles.ul}>
                    {list.map((desc, index) => 
                        <li key={index}>{desc}</li>
                    )}
                </ul>
            </div>
            <div>
                <p>Technologies used:</p>
                <ul className={aboutStyles.ul}>
                    {technologies.map((desc, index) => 
                        <li key={index}>{desc}</li>
                    )}
                </ul>
            </div>
        </div>
      </main>
    </>
  )
}
