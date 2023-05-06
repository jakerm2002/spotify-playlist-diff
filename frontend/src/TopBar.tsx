import React, { useState } from "react";
import { AppBar, Container, Toolbar, Typography, Menu, IconButton, Box, Button, List, ListSubheader, ListItem } from "@mui/material";


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


const TopBar = () => {

  return (
    <Box sx={styles}>
      <Toolbar>
        <Box>
          <Button variant="outlined" color="inherit">Home</Button>
          <Button variant="outlined" color="inherit">About</Button>
        </Box>
      </Toolbar>
      <Typography variant="h4" sx={titleStyles}>
        Spotify Playlist Diff Tool
      </Typography>
      <Typography variant="h5" sx={helloStyles}>
        This tool lets you compare multiple Spotify playlists and see which tracks are shared across all playlists.
      </Typography>
      <List sx={{ listStyleType: 'disc' }}>
        <ListSubheader sx={{
          fontWeight: 700, lineHeight: '24px', fontSize: '16px', color: 'white'
        }}
        >
          Feature set:
        </ListSubheader>
        <ListItem>Add up to 10 playlists</ListItem>
        <ListItem>Each playlist can have up to 7500 songs</ListItem>
      </List>
    </Box>
  )
}

export default TopBar