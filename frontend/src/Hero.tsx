import React, { useState } from "react";
import { AppBar, Container, Toolbar, Typography, Menu, IconButton, Box, Button, List, ListSubheader, ListItem, Link } from "@mui/material";
import heroStyles from "../styles/heroStyles.module.css"
import logo from './assets/spotify.png'
import Image from 'next/image';
// import { ButtonPropsColorOverrides } from "@mui/material/Button";


const styles = {
    background: 'linear-gradient(to right, #1DB954, #26A65B)',
    // height: '200px',
    // minHeight: '100%',
    margin: '25px',
    borderRadius: 2,
    padding: '20px',
    color: '#fff',
    fontWeight: 'bold',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
};


const titleStyles = {
    alignSelf: 'center',
    marginBottom: 5,
};

const helloStyles = {
    alignSelf: 'center',
};

// declare module "@mui/material/button" {
//     interface ButtonPropsColorOverrides {
//       error: true;
//       info: true;
//       success: true;
//       warning: true;
//       netural: true;
//     }
//   }


const Hero = () => {

    return (
        <React.Fragment>
            <div id={heroStyles.bg}>
                <div id={heroStyles.gridContainer}>
                    <div className={heroStyles.buttonContainer}>
                        <Button href="/" style={{minWidth: '6em'}} variant="contained" color="filled" id={heroStyles.button}>Home</Button>
                        {/* <Button style={{minWidth: '6em'}} variant="outlined" color="inherit" id={heroStyles.button}>API</Button> */}
                        <Button href="/about" style={{minWidth: '6em'}} variant="outlined" color="inherit" id={heroStyles.button}>About</Button>
                    </div>
                    <div className={heroStyles.textContainer}>
                        {/* <h1 id={heroStyles.heroText}>Spotify playlist diff tool</h1> */}
                        <Typography variant="h5">Spotify Playlist Diff Tool</Typography>
                        {/* <img src={logo.src}></img> */}
                        <Image style={{marginTop: '1em'}} src={logo} width={32} height={32} alt="Spotify logo"/>
                    </div>
                    <div className={heroStyles.introContainer}>
                        <p className={heroStyles.introText}>This tool lets you compare multiple Spotify playlists and see which tracks are shared across all playlists.</p>
                        <div className={heroStyles.listContainer}>
                            <p>Notable features:</p>
                            <ul className={heroStyles.ul}>
                                <li className={heroStyles.li}>Add up to 10 different playlists 🔢</li>
                                <li className={heroStyles.li}>Each playlist can have up to 7500 songs 🎶</li>
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