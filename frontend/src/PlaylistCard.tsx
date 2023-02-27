import React, { useEffect, useState } from "react";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { CardActions, CardContent, CardMedia, Skeleton } from '@mui/material';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { TextField } from "@mui/material";
import axios from 'axios';

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

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // setFilled(false);
    setIsLoading(true);
    const link = (event.currentTarget as HTMLFormElement).link.value;
    const response = await axios.post(`http://localhost:8080/add?playlist=${link}&session=1`); // replace YOUR_API_URL_HERE with your actual API endpoint
    const data = await response.data;
    onUpdate(data);
    setIsLoading(false);
    // setFilled(true);
    // setPlaylistImage(data.image_url);
  }

  return (
    <Card variant="outlined" style={{ width: 300, height: 500 }}>
      <CardContent style={{ textAlign: 'center' }}>
        {(playlistData && !isLoading) ? (
          <Typography variant="h5" component="div">
            {playlistData.playlist_name}
          </Typography>
        ) : (
          <Typography variant="h5" component="div">
            {`Playlist ${playlistNum}`}
          </Typography>
        )}
        {(playlistData && !isLoading) && (
          <React.Fragment>
          <Typography variant="h6" component="div">
            by {playlistData.author_display_name}
          </Typography>
          <Typography variant="h7" component="div">
            {playlistData.num_tracks} tracks
          </Typography>
          </React.Fragment>

        )}
        {(playlistData && !isLoading) && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <CardMedia
              component="img"
              alt="Playlist Image"
              sx={{ height: 200, width: 200, objectFit: 'cover' }}
              image={playlistData.image_url}
              title="Playlist Image"
            />
          </div>
        )}
        {isLoading && (<div style={{ display: 'flex', justifyContent: 'center' }}><Skeleton variant="rounded" animation="wave" width={200} height={200} /></div>)}
        <form onSubmit={handleFormSubmit} style={{ marginTop: 20 }}>
          <TextField name="link" label="enter link" variant="outlined" fullWidth />
          <Button type="submit" variant="contained" color="primary" style={{ marginTop: 20 }}>
            {playlistData ? "update playlist" : "add playlist"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default PlaylistCard;