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

//call api when all playlists are filled
useEffect(() => {
    console.log("useEffect");
    var count = 0;
    const playlistIDs = [];
    // var api_string = `?`
    playlists.forEach((playlist) => {
        if (playlist.playlistData != null && playlist.isLoading == false) {
            console.log("playlist has data and is not loading");
            playlistIDs.push(playlist.playlistData.spotify_playlist_id)
            count++;
        }
    })

    console.log("COUNT IS", count);
    if (count >= 2) {
        console.log("PLAYLIST LENGTH", playlists.length);
        const response = axios.get(`http://localhost:8080/compare?${playlistIDs.map((n, index) => `playlist=${n}`).join('&')}&session=1`).then(response => {
            setRows(response.data);
        }); // replace YOUR_API_URL_HERE with your actual API endpoint
    }

    }, [playlists]);

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
    <React.Fragment>
    <Grid container spacing={0} direction="row" sx={{alignItems: 'center'}}>
        {playlists.map((playlist, index) => {
            console.log(index);
            return (
                <Grid item xs={2} key={index}>
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
