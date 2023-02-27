import React from 'react';
import { Grid, IconButton } from '@mui/material';
import { makeStyles } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PlaylistCard from './PlaylistCard';

// const useStyles = makeStyles(theme => ({
//   addButton: {
//     marginLeft: 'auto'
//   }
// }));

const Cards = () => {
//   const classes = useStyles();
let playlists = [];

return (
    <Grid container spacing={0} direction="row" sx={{alignItems: 'center'}}>
      <Grid item xs={2}>
        <PlaylistCard />
      </Grid>
      <Grid item xs={2}>
        <PlaylistCard />
      </Grid>
      <Grid item xs={2}>
        <PlaylistCard />
      </Grid>
      <Grid item xs={2}>
        <IconButton sx={
            {fontSize: '2rem'}}>
          <AddIcon fontSize="inherit" />
        </IconButton>
      </Grid>
    </Grid>
  );
};

export default Cards;
