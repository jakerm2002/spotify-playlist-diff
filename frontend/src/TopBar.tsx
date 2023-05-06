import React, { useState } from "react";
import { AppBar, Container, Toolbar, Typography, Menu, IconButton, Box, Button } from "@mui/material";


const styles = {
  background: 'linear-gradient(to right, #1DB954, #26A65B)',
  height: '200px',
  borderRadius: 0,
  padding: '20px',
  color: '#fff',
  fontWeight: 'bold',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};


const titleStyles = {
  margin: 0,
};

const TopBar = () => {

  // return (
  //     <Box sx={{ flexGrow: 1 }}>
  //     <AppBar position="static">
  //       <Toolbar>
  //         <IconButton
  //           size="large"
  //           edge="start"
  //           color="inherit"
  //           aria-label="menu"
  //           sx={{ mr: 2 }}
  //         >
  //         </IconButton>
  //         <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
  //           Spotify Playlist Diff Tool
  //         </Typography>
  //         <Button color="inherit">Login</Button>
  //       </Toolbar>
  //     </AppBar>
  //   </Box>
  // )

  return (
    <Box sx={styles}>
      <Typography variant="h4" sx={titleStyles}>
        Spotify playlist diff
      </Typography>
      <Typography variant="h5">
        hello world!
      </Typography>
    </Box>
  )
}

export default TopBar