import React from "react";
import { Typography, Button, Link } from "@mui/material";
import heroStyles from "../styles/heroStyles.module.css"
import logo from './assets/spotify.png'
import Image from 'next/image';

const Hero = () => {

    return (
        <React.Fragment>
            <div id={heroStyles.bg}>
                <div id={heroStyles.gridContainer}>
                    <div className={heroStyles.buttonContainer}>
                        <Button href="/" style={{minWidth: '6em'}} variant="contained" color="filled" id={heroStyles.button}>Home</Button>
                        <Button href="/about" style={{minWidth: '6em'}} variant="outlined" color="inherit" id={heroStyles.button}>About</Button>
                    </div>
                    <div className={heroStyles.textContainer}>
                        <Typography variant="h5">Spotify Playlist Comparison Tool</Typography>
                        <img style={{marginTop: '1em'}} src={logo.src} width={32} height={32} alt="Spotify logo"/>
                    </div>
                    <div className={heroStyles.introContainer}>
                        <p className={heroStyles.introText}>This tool lets you compare multiple Spotify playlists, showing which tracks are shared across all playlists.</p>
                        <div className={heroStyles.listContainer}>
                            <p>Notable features:</p>
                            <ul className={heroStyles.ul}>
                                <li className={heroStyles.li}>Add up to 10 different playlists 🔢</li>
                                <li className={heroStyles.li}>Each playlist can have up to 7500 tracks 🎶</li>
                                <li className={heroStyles.li}>Sort/filter the results by clicking on any of the header fields ⬆️ ⬇️</li>
                            </ul>
                        </div>
                    </div>
                    <p className={heroStyles.textContainer}>Created by Jake, see <Link sx={{color: '#fff', 'text-decoration-color': '#fff'}} href="/about" underline="always">About</Link></p>
                </div>
            </div>
        </React.Fragment>
    )
}

export default Hero