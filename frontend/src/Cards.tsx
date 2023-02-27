import React, {useEffect, useState} from 'react';
import { Grid, IconButton } from '@mui/material';
import { makeStyles } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PlaylistCard from './PlaylistCard';
import { Varela } from '@next/font/google';

// const useStyles = makeStyles(theme => ({
//   addButton: {
//     marginLeft: 'auto'
//   }
// }));

const Cards = () => {
//   const classes = useStyles();
// let playlists = [];

const [playlists, setPlaylists] = useState([{playlistData: null, isLoading: false}, {playlistData: null, isLoading: false}]);

useEffect(() => {
    var count = 0;
    playlists.forEach((playlist) => {
        if (playlist.playlistData != null) {
            count++;
        }
        if (count === playlists.length) {
            setPlaylists([...playlists, {playlistData: null, isLoading: false}])
        }
    })

    }, [playlists]);

const handlePlaylistUpdate = (index: number, playlistData: any) => {
    const updatedPlaylists = [...playlists];
    updatedPlaylists[index].playlistData = playlistData;
    updatedPlaylists[index].isLoading = false;
    setPlaylists(updatedPlaylists);
};

return (
    <Grid container spacing={0} direction="row" sx={{alignItems: 'center'}}>
        {playlists.map((playlist, index) => {
            return (
                <Grid item xs={2} key="index">
                    <PlaylistCard
                        playlistNum={index + 1}
                        playlistData={playlist.playlistData}
                        isLoading={playlist.isLoading}
                        setIsLoading={(isLoading) => {
                            const newPlaylists = [...playlists];
                            newPlaylists[index].isLoading = isLoading;
                            setPlaylists(newPlaylists);
                          }}
                        onUpdate={(playlistData: any) => handlePlaylistUpdate(index, playlistData)}
                    />
                </Grid>
            )
        })}
    </Grid>
  );
};

export default Cards;
