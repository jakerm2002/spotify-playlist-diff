import React, { useEffect, useState } from "react";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link'
import { CardActions, CardContent, CardMedia, Skeleton, Alert, InputAdornment, IconButton } from '@mui/material';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { TextField } from "@mui/material";
import axios from 'axios';
import PlaylistCardImage from "./PlaylistCardImage";
import { PlaylistData } from "../components/types/PlaylistData";

interface PlaylistCardProps {
  playlistNum: number;
  playlistData: PlaylistData | null;
  textField: string;
  setTextField: (textField: string) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  errorStatus: string;
  setErrorStatus: (errorStatus: string) => void;
  onUpdate: (playlistData: any) => void;
  remove: () => void;
}

const PlaylistCard: React.FC<PlaylistCardProps> = ({ playlistNum, playlistData, textField, setTextField, isLoading, setIsLoading, errorStatus, setErrorStatus, onUpdate, remove }) => {

  const removePlaylist = () => {
    setTextField('');
    setErrorStatus('');
    onUpdate(null)
  }

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const link = (event.currentTarget as HTMLFormElement).link.value;
    console.log(`${process.env.NEXT_PUBLIC_API_URL}/add?playlist=${link}&session=1`);
    try {
      setErrorStatus('')
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/add?playlist=${link}&session=1`)
      console.log(response.data);
      onUpdate(response.data);
    } catch (error) {
      // Error
      if ((error as any).response?.status === 404) {
          // The request was made and the server responded with a status code that falls out of the range of 2xx
          setErrorStatus('Playlist not found. Make sure that your playlist is set to public on Spotify.');
      } else if ((error as any).request) {
          console.log((error as any).request);
          setErrorStatus('Something went wrong on our end. Please try clicking the upload button again..')
      } else {
          setErrorStatus('Something went wrong with the request. Please try again.')
          console.log('Error', (error as any).message);
      }
      onUpdate(null)
    }
    finally {
        setIsLoading(false);
      }
  }

  return (
    <Card variant="outlined">
      {errorStatus && <Alert severity="error" onClose={() => {setErrorStatus('')}}>{errorStatus}</Alert>} {/* Render MUI Alert component when an error occurs */}
      <CardContent style={{ textAlign: 'center' }}>
        {(playlistData && !isLoading) ? (
          <Typography variant="h5" component="div">
            <Link target="_blank" href={playlistData.playlist_url}>
            {playlistData.playlist_name}
            </Link>
          </Typography>
        ) : (
          <Typography variant="h5" component="div">
            {`Playlist ${playlistNum}`}
          </Typography>
        )}
        {(playlistData && !isLoading) ? (
          <React.Fragment>
          <Typography variant="h6" component="div">
            by <Link target="_blank" href={playlistData.author_url}>{playlistData.author_display_name}</Link>
          </Typography>
          <Typography variant="subtitle1" component="div">
            {playlistData.num_tracks} tracks
          </Typography>
          </React.Fragment>

        ): (
          <React.Fragment>
          <Typography variant="h6" sx={{'color': 'grey'}} component="div">
            creator
          </Typography>
          <Typography variant="subtitle1" sx={{'color': 'grey'}} component="div">
            # of tracks
          </Typography>
          </React.Fragment>

        )}
        <PlaylistCardImage playlistData={playlistData} isLoading={isLoading}/>
        
        <form onSubmit={handleFormSubmit} style={{ marginTop: 20 }}>
        <Box mt={2} display="flex" flexDirection="column">
          <TextField error={errorStatus ? true: false} helperText={errorStatus} name="link" label="playlist link" variant="outlined" value={textField} onChange={(event) => {setTextField(event.target.value)}}
          InputProps={{
            endAdornment: 
            <InputAdornment position="end">
              <Button onClick={() => {setTextField(''); setErrorStatus('')}}>
                  Clear
              </Button>
            </InputAdornment>,
          }}/>
          <Button type="submit" variant="contained" color="primary" style={{ marginTop: 20 }}>
            {playlistData ? "update playlist" : "add playlist"}
          </Button>
          {playlistData && 
          <Button onClick={() => {removePlaylist(); remove();}} variant="contained" color="error" style={{ marginTop: 20 }}>
            remove playlist
          </Button>}
          </Box>
        </form>
        
      </CardContent>
    </Card>
  );
}

export default PlaylistCard;