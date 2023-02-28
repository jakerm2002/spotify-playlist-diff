import React from 'react';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import ImageIcon from '@mui/icons-material/Image';
import { Typography } from '@mui/material';

interface Row {
    playlist_order: number;
    cover_art_url: string;
    track_name: string;
    album_name: string;
    artist_name: string;
    runtime: string;
    runtime_ms: number;
    spotify_track_id: string;
}

interface Props {
    rows: Row[];
  }

export default function SharedTable({rows}: Props) {

    const columns: GridColDef[] = [
        { field: 'playlist_order', headerName: '1st appearance in P1', width: 200 },
        {   field: 'cover_art_url', 
            headerName: 'Art',
            width: 130,
            sortable: false,
            filterable: false,
            renderCell: (params) => <img src={params.value} width='45' height='45'/>
        },
        { field: 'track_name', headerName: 'Track', width: 250 },
        { field: 'album_name', headerName: 'Album', width: 250 },
        { field: 'artist_name', headerName: 'Artist', width: 250 },
        {
            field: 'runtime_ms',
            headerName: 'Runtime',
            valueGetter: (params) => params.row.runtime,
            type: 'string',
            width: 150,
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
                    getRowId={(row) => row.spotify_track_id}
                    initialState={{
                        sorting: {
                          sortModel: [{ field: 'playlist_order', sort: 'asc' }],
                        },
                    }}
                    disableSelectionOnClick
                />
            </div>
        </React.Fragment>);
}