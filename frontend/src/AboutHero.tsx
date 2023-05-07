import React, { useState } from "react";
import { AppBar, Container, Toolbar, Typography, Menu, IconButton, Box, Button, List, ListSubheader, ListItem, Link } from "@mui/material";
import heroStyles from "../styles/heroStyles.module.css"
import logo from './assets/spotify.png'
import Image from 'next/image';

const AboutHero = () => {

    return (
        <React.Fragment>
            <div id={heroStyles.bg}>
                <div id={heroStyles.gridContainer}>
                    <div className={heroStyles.buttonContainer}>
                    <Button href="/" style={{minWidth: '6em'}} variant="outlined" color="inherit" id={heroStyles.button}>Home</Button>
                        {/* <Button style={{minWidth: '6em'}} variant="outlined" color="inherit" id={heroStyles.button}>API</Button> */}
                        <Button href="/about" style={{minWidth: '6em'}} variant="contained" color="filled" id={heroStyles.button}>About</Button>
                    </div>
                    <div className={heroStyles.textContainer}>
                        {/* <h1 id={heroStyles.heroText}>Spotify playlist diff tool</h1> */}
                        <Typography variant="h5">Spotify Playlist Diff Tool</Typography>
                        {/* <img src={logo.src}></img> */}
                        <Image style={{marginTop: '1em'}} src={logo} width={32} height={32} alt="Spotify logo"/>
                    </div>
                    <div>
                        <p></p>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default AboutHero