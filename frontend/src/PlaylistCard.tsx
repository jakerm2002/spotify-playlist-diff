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
import ClearIcon from '@mui/icons-material/Clear';

interface PlaylistCardProps {
  playlistNum: number;
  playlistData: any; // replace `any` with the actual type of `playlistData` object
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  onUpdate: (playlistData: any) => void;
}

const PlaylistCard: React.FC<PlaylistCardProps> = ({ playlistNum, playlistData, isLoading, setIsLoading, onUpdate }) => {

  // const [playlistData, setPlaylistData] = useState(null); // define state to store API response
  // const [playlistImage, setPlaylistImage] = useState(null);
  // const [filled, setFilled] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);

  const [textField, setTextField] = useState('');
  const [errorStatus, setErrorStatus] = useState(''); // internal error state

  const removePlaylist = () => {
    onUpdate(null)
    setTextField('');
    setErrorStatus('');
  }

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const link = (event.currentTarget as HTMLFormElement).link.value;
    console.log("hEY");
    console.log(`${process.env.NEXT_PUBLIC_API_URL}/add?playlist=${link}&session=1`);
    try {
      setErrorStatus('')
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/add?playlist=${link}&session=1`)
      console.log(response.data);
      onUpdate(response.data);
    } catch (error) {
      // Error
      if ((error as any).response?.status === 404) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          // console.log(error.response.data);
          // console.log(error.response.status);
          // console.log(error.response.headers)
          console.error('Playlist Not found');
          setErrorStatus('Playlist not found. Make sure that your playlist is set to public on Spotify.');
          // throw new Error("an error occured");
      } else if ((error as any).request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the 
          // browser and an instance of
          // http.ClientRequest in node.js
          console.log((error as any).request);
          setErrorStatus('Something went wrong. Please try again.')
      } else {
          // Something happened in setting up the request that triggered an Error
          setErrorStatus('Something went wrong with the request. Please try again.')
          console.log('Error', (error as any).message);
      }
      onUpdate(null)
    }
    finally {
        setIsLoading(false);
      }
      // console.log(error.config);
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
          <Typography variant="h6" component="div">
            artist placeholder
          </Typography>
          <Typography variant="subtitle1" component="div">
            # tracks placeholder
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
              <Button
                  // aria-label="toggle password visibility"
                  onClick={() => {setTextField(''); setErrorStatus('')}}
                  // onMouseDown={handleMouseDownPassword}
                  // edge="end"
                >
                  Clear
                </Button>
            </InputAdornment>,
          }}/>
          <Button type="submit" variant="contained" color="primary" style={{ marginTop: 20 }}>
            {playlistData ? "update playlist" : "add playlist"}
          </Button>
          {playlistData && 
          <Button onClick={() => {removePlaylist()}} variant="contained" color="error" style={{ marginTop: 20 }}>
            remove playlist
          </Button>}
          </Box>
        </form>
        
      </CardContent>
    </Card>
  );
}

export default PlaylistCard;