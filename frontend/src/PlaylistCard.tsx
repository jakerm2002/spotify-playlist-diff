import React, {useEffect, useState} from "react";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import {CardActions, CardContent, CardMedia, Skeleton} from '@mui/material';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { TextField } from "@mui/material";
import axios from 'axios';

export default function PlaylistCard() {

    const [playlistData, setPlaylistData] = useState(null); // define state to store API response
    const [playlistImage, setPlaylistImage] = useState(null);
    const [filled, setFilled] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

        const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            setFilled(false);
            setIsLoading(true);
            const link = (event.currentTarget as HTMLFormElement).link.value;
            const response = await axios.post(`http://localhost:8080/add?playlist=${link}&session=1`); // replace YOUR_API_URL_HERE with your actual API endpoint
            const data = await response.data;
            setPlaylistData(data);
            setIsLoading(false);
            setFilled(true);
            setPlaylistImage(data.image_url);
        }

    return (
        <Card variant="outlined" style={{ width: 300, height: 500 }}>
          <CardContent style={{ textAlign: 'center' }}>
          {filled ? (
          <Typography variant="h4" component="div">
            {playlistData.playlist_name}
          </Typography>
        ) : (
          <Typography variant="h4" component="div">
            Playlist 1
          </Typography>
        )}
            {filled && (<CardMedia
          component="img"
          alt="Playlist Image"
          sx={{ height: 200, width:200, objectFit: 'cover' }}
          image={playlistData.image_url}
          title="Playlist Image"
        />)}
        {isLoading && (<Skeleton variant="rounded" animation="wave" width={200} height={200} />)}
            <form onSubmit={handleFormSubmit} style={{ marginTop: 20 }}>
              <TextField name="link" label="enter link" variant="outlined" fullWidth />
              <Button type="submit" variant="contained" color="primary" style={{ marginTop: 20 }}>
                {filled ? "update playlist" : "add playlist"}
              </Button>
            </form>
            {playlistData && (
          <div style={{ marginTop: 20 }}>
            <Typography variant="body1">
              API response: {JSON.stringify(playlistData)}
            </Typography>
          </div>
        )}
          </CardContent>
        </Card>
      );
  }
  