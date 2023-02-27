import React from 'react';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { Typography } from '@mui/material';

export default function SharedTable() {

    var rows = [
        {
            "playlist_order": 1,
            "track_name": "Flowers",
            "album_name": "Flowers",
            "artist_name": "Miley Cyrus",
            "runtime": 200454
        },
        {
            "playlist_order": 2,
            "track_name": "TQG",
            "album_name": "MAÑANA SERÁ BONITO",
            "artist_name": "KAROL G",
            "runtime": 197933
        },
        {
            "playlist_order": 3,
            "track_name": "Kill Bill",
            "album_name": "SOS",
            "artist_name": "SZA",
            "runtime": 153946
        },
        {
            "playlist_order": 4,
            "track_name": "Die For You - Remix",
            "album_name": "Die For You (Remix)",
            "artist_name": "The Weeknd",
            "runtime": 232857
        },
        {
            "playlist_order": 5,
            "track_name": "Boy's a liar Pt. 2",
            "album_name": "Boy's a liar Pt. 2",
            "artist_name": "PinkPantheress",
            "runtime": 131013
        },
        {
            "playlist_order": 6,
            "track_name": "Shakira: Bzrp Music Sessions, Vol. 53",
            "album_name": "Shakira: Bzrp Music Sessions, Vol. 53",
            "artist_name": "Bizarrap",
            "runtime": 214945
        },
        {
            "playlist_order": 7,
            "track_name": "Creepin' (with The Weeknd & 21 Savage)",
            "album_name": "HEROES & VILLAINS",
            "artist_name": "Metro Boomin",
            "runtime": 221520
        },
        {
            "playlist_order": 8,
            "track_name": "As It Was",
            "album_name": "Harry's House",
            "artist_name": "Harry Styles",
            "runtime": 167303
        },
        {
            "playlist_order": 10,
            "track_name": "Unholy (feat. Kim Petras)",
            "album_name": "Gloria",
            "artist_name": "Sam Smith",
            "runtime": 156943
        },
        {
            "playlist_order": 12,
            "track_name": "Die For You",
            "album_name": "Starboy",
            "artist_name": "The Weeknd",
            "runtime": 260253
        },
        {
            "playlist_order": 13,
            "track_name": "Calm Down (with Selena Gomez)",
            "album_name": "Calm Down (with Selena Gomez)",
            "artist_name": "Rema",
            "runtime": 239317
        },
        {
            "playlist_order": 14,
            "track_name": "X SI VOLVEMOS",
            "album_name": "MAÑANA SERÁ BONITO",
            "artist_name": "KAROL G",
            "runtime": 200120
        },
        {
            "playlist_order": 15,
            "track_name": "I'm Good (Blue)",
            "album_name": "I'm Good (Blue)",
            "artist_name": "David Guetta",
            "runtime": 175238
        },
        {
            "playlist_order": 16,
            "track_name": "Here With Me",
            "album_name": "Here With Me",
            "artist_name": "d4vd",
            "runtime": 242484
        },
        {
            "playlist_order": 17,
            "track_name": "OMG",
            "album_name": "NewJeans 'OMG'",
            "artist_name": "NewJeans",
            "runtime": 212253
        },
        {
            "playlist_order": 18,
            "track_name": "Escapism.",
            "album_name": "My 21st Century Blues",
            "artist_name": "RAYE",
            "runtime": 272373
        },
        {
            "playlist_order": 20,
            "track_name": "Anti-Hero",
            "album_name": "Midnights",
            "artist_name": "Taylor Swift",
            "runtime": 200690
        },
        {
            "playlist_order": 21,
            "track_name": "Until I Found You (with Em Beihold) - Em Beihold Version",
            "album_name": "Until I Found You (Em Beihold Version)",
            "artist_name": "Stephen Sanchez",
            "runtime": 176440
        },
        {
            "playlist_order": 24,
            "track_name": "golden hour",
            "album_name": "this is what ____ feels like (Vol. 1-4)",
            "artist_name": "JVKE",
            "runtime": 209259
        },
        {
            "playlist_order": 26,
            "track_name": "Bebe Dame",
            "album_name": "Sigan Hablando",
            "artist_name": "Fuerza Regida",
            "runtime": 271861
        },
        {
            "playlist_order": 28,
            "track_name": "Players",
            "album_name": "Players",
            "artist_name": "Coi Leray",
            "runtime": 139560
        },
        {
            "playlist_order": 29,
            "track_name": "Heaven",
            "album_name": "Heaven",
            "artist_name": "Niall Horan",
            "runtime": 186043
        },
        {
            "playlist_order": 33,
            "track_name": "Sure Thing",
            "album_name": "All I Want Is You",
            "artist_name": "Miguel",
            "runtime": 195373
        },
        {
            "playlist_order": 35,
            "track_name": "I Ain't Worried",
            "album_name": "OneRepublic (Japan Paradise Tour Edition)",
            "artist_name": "OneRepublic",
            "runtime": 148120
        },
        {
            "playlist_order": 36,
            "track_name": "Snooze",
            "album_name": "SOS",
            "artist_name": "SZA",
            "runtime": 201800
        },
        {
            "playlist_order": 43,
            "track_name": "Just Wanna Rock",
            "album_name": "Just Wanna Rock",
            "artist_name": "Lil Uzi Vert",
            "runtime": 123890
        },
        {
            "playlist_order": 46,
            "track_name": "PAINTING PICTURES",
            "album_name": "5LBS OF PRESSURE",
            "artist_name": "Superstar Pride",
            "runtime": 122070
        },
        {
            "playlist_order": 47,
            "track_name": "Romantic Homicide",
            "album_name": "Romantic Homicide",
            "artist_name": "d4vd",
            "runtime": 132630
        },
        {
            "playlist_order": 48,
            "track_name": "Last Night",
            "album_name": "3 Songs At A Time Sampler",
            "artist_name": "Morgan Wallen",
            "runtime": 163854
        },
        {
            "playlist_order": 49,
            "track_name": "Rich Flex",
            "album_name": "Her Loss",
            "artist_name": "Drake",
            "runtime": 239359
        }
    ];

    const columns: GridColDef[] = [
        { field: 'playlist_order', headerName: 'Playlist Order', width: 70 },
        { field: 'track_name', headerName: 'Track', width: 130 },
        { field: 'album_name', headerName: 'Album', width: 130 },
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
                    checkboxSelection
                    getRowId={(row) => row.playlist_order}
                />
            </div>
        </React.Fragment>);
}