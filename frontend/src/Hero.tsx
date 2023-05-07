import React, { useState } from "react";
import { AppBar, Container, Toolbar, Typography, Menu, IconButton, Box, Button, List, ListSubheader, ListItem } from "@mui/material";
import heroStyles from "../styles/heroStyles.module.css"


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


const Hero = () => {

    return (
        <React.Fragment>
            <div id={heroStyles.bg}>
                <div id={heroStyles.gridContainer}>
                    <div className={heroStyles.buttonContainer}>
                        <Button variant="outlined" color="inherit" id={heroStyles.button}>Home</Button>
                        <Button variant="outlined" color="inherit" id={heroStyles.button}>About</Button>
                    </div>
                    <div className={heroStyles.textContainer}>
                        {/* <h1 id={heroStyles.heroText}>Spotify playlist diff tool</h1> */}
                        <Typography variant="h5">Spotify Playlist Diff Tool</Typography>
                    </div>
                    <div className={heroStyles.introContainer}>
                        <p className={heroStyles.introText}>This tool lets you compare multiple Spotify playlists and see which tracks are shared across all playlists.</p>
                        <div className={heroStyles.listContainer}>
                            <p>Notable features:</p>
                            <ul className={heroStyles.ul}>
                                <li className={heroStyles.li}>Add up to 10 different playlists</li>
                                <li className={heroStyles.li}>Each playlist can have up to 7500 songs</li>
                            </ul>
                        </div>

                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default Hero