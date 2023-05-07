import React from 'react';
import { Box, Typography } from '@mui/material';
import { CardActions, CardContent, CardMedia, Skeleton } from '@mui/material';

interface PlaylistCardImageProps {
    playlistData: any; // replace `any` with the actual type of `playlistData` object
    isLoading: boolean;
}

const PlaylistCardImage: React.FC<PlaylistCardImageProps> = ({ playlistData, isLoading }) => {

    if (playlistData && !isLoading) {
        return (<div style={{ display: 'flex', justifyContent: 'center' }}>
            <CardMedia
                component="img"
                alt="Playlist Image"
                sx={{ height: 200, width: 200, objectFit: 'cover' }}
                image={playlistData.image_url}
                title="Playlist Image"
            />
        </div>)
    } else if (isLoading) {
        return (isLoading && (<div style={{ display: 'flex', justifyContent: 'center' }}><Skeleton variant="rounded" animation="wave" width={200} height={200} /></div>));

    } else {
        return (<div style={{ display: 'flex', justifyContent: 'center' }}>
            <Box
                sx={{ height: 200, width: 200, backgroundColor: '#30302f' }}
            >
                <Typography variant="h6" component="div" sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    userSelect: 'none'
                }}>
                    Add a playlist
                </Typography>
            </Box>
        </div>)
    }
}


export default PlaylistCardImage;