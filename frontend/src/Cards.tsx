import React, {useEffect, useState} from 'react';
import { Grid } from '@mui/material';
import PlaylistCard from './PlaylistCard';
import axios from 'axios';
import { PlaylistData } from "../components/types/PlaylistData";
import { TrackData } from '../components/types/TrackData';

interface CardData {
    playlistData: PlaylistData | null;
    textField: string;
    isLoading: boolean;
    errorStatus: string;
}

interface CardsProps {
    rows: TrackData[];
    setRows: React.Dispatch<React.SetStateAction<TrackData[]>>;
}
  

const Cards: React.FC<CardsProps> = ( {rows, setRows} ) => {

const [playlists, setPlaylists] = useState<CardData[]>([
    {playlistData: null, textField: '', isLoading: false, errorStatus: ''},
    {playlistData: null, textField: '', isLoading: false, errorStatus: ''}
]);

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

const remove = (index: number) => {
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
    <div id="cardsComponent" style={{paddingBottom: '2em'}}>
    <Grid container spacing={2} direction="row" justifyContent='center'>
        {playlists.map((playlist, index) => {
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
                        remove={() => remove(index)}
                    />
                </Grid>
            )
        })}
    </Grid>
    </div>

  );
};

export default Cards;
