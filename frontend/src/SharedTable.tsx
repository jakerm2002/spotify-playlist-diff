import React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Typography } from '@mui/material';
import { TrackData } from '../components/types/TrackData';

interface SharedTableProps {
    rows: TrackData[];
}

const SharedTable: React.FC<SharedTableProps> = ({ rows }) => {

    const columns: GridColDef[] = [
        { field: 'playlist_order', headerName: '1st appearance in P1', width: 200 },
        {
            field: 'cover_art_url',
            headerName: 'Art',
            width: 130,
            sortable: false,
            filterable: false,
            renderCell: (params) => <img src={params.value} width='45' height='45' />
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
            <div style={{marginLeft: '2.5%', marginRight: '2.5%'}}>
                <Typography variant="h5">
                    Shared Tracks
                </Typography>
                <div style={{ height: 400, width: '100%' }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        rowsPerPageOptions={[20, 30, 50, 100]}
                        getRowId={(row) => row.spotify_track_id}
                        initialState={{
                            sorting: {
                                sortModel: [{ field: 'playlist_order', sort: 'asc' }],
                            },
                        }}
                        disableSelectionOnClick
                    />
                </div>
            </div>
        </React.Fragment>);
}

export default SharedTable;