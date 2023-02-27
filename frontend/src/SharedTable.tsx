import React from 'react';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { Typography } from '@mui/material';

export default function SharedTable({rows}) {

    const columns: GridColDef[] = [
        { field: 'playlist_order', headerName: 'Playlist Order', width: 70 },
        {   field: 'cover_art_url', 
            headerName: 'Cover',
            width: 130,
            renderCell: (params) => <img src={params.value} width='30' height='30'/>
        },
        { field: 'track_name', headerName: 'Track', width: 250 },
        { field: 'album_name', headerName: 'Album', width: 250 },
        { field: 'artist_name', headerName: 'Artist', width: 130 },
        {
            field: 'runtime',
            headerName: 'Runtime',
            type: 'number',
            width: 90,
        }
    ];


    return (
        <React.Fragment>
            <Typography variant="h5">
                Shared Tracks
            </Typography>
            <div style={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    // pageSize={20}
                    rowsPerPageOptions={[20, 30, 50, 100]}
                    // checkboxSelection
                    getRowId={(row) => row.playlist_order}
                />
            </div>
        </React.Fragment>);
}