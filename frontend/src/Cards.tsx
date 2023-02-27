import React, {useEffect, useState} from 'react';
import { Grid, IconButton } from '@mui/material';
import { makeStyles } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PlaylistCard from './PlaylistCard';
import { Varela } from '@next/font/google';
import SharedTable from './SharedTable';
import axios from 'axios';

// const useStyles = makeStyles(theme => ({
//   addButton: {
//     marginLeft: 'auto'
//   }
// }));

const Cards = () => {
//   const classes = useStyles();
// let playlists = [];

const [playlists, setPlaylists] = useState([{playlistData: null, isLoading: false}, {playlistData: null, isLoading: false}]);
const [rows, setRows] = useState([]);

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


//call api when all playlists are filled
useEffect(() => {
    var count = 0;
    const playlistIDs = [];
    var api_string = `?`
    playlists.forEach((playlist) => {
        if (playlist.playlistData != null) {
            playlistIDs.push(playlist.playlistData.spotify_playlist_id)
            count++;
        }
        if (count === playlists.length) {
            const response = axios.get(`http://localhost:8080/compare?${playlistIDs.map((n, index) => `playlist=${n}`).join('&')}&session=1`).then(response => {
                setRows(response.data);
            }); // replace YOUR_API_URL_HERE with your actual API endpoint
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
    <React.Fragment>
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
    <SharedTable rows={rows}/>
    </React.Fragment>

  );
};

export default Cards;
