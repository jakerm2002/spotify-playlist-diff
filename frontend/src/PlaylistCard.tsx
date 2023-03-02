import React, { useEffect, useState } from "react";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link'
import { CardActions, CardContent, CardMedia, Skeleton } from '@mui/material';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { TextField } from "@mui/material";
import axios from 'axios';
import PlaylistCardImage from "./PlaylistCardImage";

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
    console.log("hEY");
    console.log(`${process.env.NEXT_PUBLIC_API_URL}/add?playlist=${link}&session=1`);
    const r = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/add?playlist=${link}&session=1`).then(response => {
      console.log(response.data);
      onUpdate(response.data);
      setIsLoading(false);
    });; // replace YOUR_API_URL_HERE with your actual API endpoint
    // setFilled(true);
    // setPlaylistImage(data.image_url);
  }

  return (
    <Card variant="outlined" style={{ width: 300, height: 500 }}>
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
          <TextField name="link" label="playlist link" variant="outlined" fullWidth />
          <Button type="submit" variant="contained" color="primary" style={{ marginTop: 20 }}>
            {playlistData ? "update playlist" : "add playlist"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default PlaylistCard;