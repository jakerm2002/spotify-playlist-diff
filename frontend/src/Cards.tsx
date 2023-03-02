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

type PlaylistData = {
    db_session_id: string, 
    spotify_playlist_id: string,
    playlist_name: string,
    author_display_name: string,
    image_url: string,
    num_tracks: number,
    snapshot_id: string,
    playlist_url: string,
    author_url: string
    // add other properties here if necessary
};

interface CardData {
    playlistData: PlaylistData | null;
    textField: string;
    isLoading: boolean;
    errorStatus: string;
}

const Cards = () => {

const [playlists, setPlaylists] = useState<CardData[]>([
    {playlistData: null, textField: '', isLoading: false, errorStatus: ''},
    {playlistData: null, textField: '', isLoading: false, errorStatus: ''}
]);
const [rows, setRows] = useState([]);

//call api when all playlists are filled
useEffect(() => {
    console.log("useEffect");
    var count = 0;
    const playlistIDs: string[] = [];
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
        const response = axios.get(`${process.env.NEXT_PUBLIC_API_URL}/compare?${playlistIDs.map((n, index) => `playlist=${n}`).join('&')}&session=1`).then(response => {
            setRows(response.data);
        });
    } else {
        setRows([]);
    }

    }, [playlists]);

//create a new empty card when all other cards are full
useEffect(() => {
    var count = 0;
    playlists.forEach((playlist) => {
        if (playlist.playlistData != null) {
            count++;
        }
        if (count === playlists.length) {
            setPlaylists([...playlists, {playlistData: null, textField: '', isLoading: false, errorStatus: ''}])
        }
    })

    }, [playlists]);

const remove = (index: number, textField: string) => {
    if (index >= 1) {
        const removed = (playlists.filter((_, i) => {
            return i !== index;
        }))
        setPlaylists(removed);
    }
}

const handlePlaylistUpdate = (index: number, playlistData: PlaylistData | null) => {
    const updatedPlaylists = [...playlists];
    updatedPlaylists[index].playlistData = playlistData;
    updatedPlaylists[index].isLoading = false;
    setPlaylists(updatedPlaylists);
};

return (
    <React.Fragment>
    <Grid container spacing={2} direction="row" justifyContent='center'>
        {playlists.map((playlist, index) => {
            console.log(index);
            return (
                <Grid item xs={12} sm={6} md={3} key={index}>
                    <PlaylistCard
                        playlistNum={index + 1}
                        playlistData={playlist.playlistData}
                        textField={playlist.textField}
                        setTextField={(textField) => {
                            const newPlaylists = [...playlists];
                            newPlaylists[index].textField = textField;
                            setPlaylists(newPlaylists);
                          }}
                        isLoading={playlist.isLoading}
                        setIsLoading={(isLoading) => {
                            const newPlaylists = [...playlists];
                            newPlaylists[index].isLoading = isLoading;
                            setPlaylists(newPlaylists);
                          }}
                        errorStatus={playlist.errorStatus}
                        setErrorStatus={(errorStatus) => {
                            const newPlaylists = [...playlists];
                            newPlaylists[index].errorStatus = errorStatus;
                            setPlaylists(newPlaylists);
                          }}
                        onUpdate={(playlistData: any) => handlePlaylistUpdate(index, playlistData)}
                        remove={(textField: string) => remove(index, textField)}
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
