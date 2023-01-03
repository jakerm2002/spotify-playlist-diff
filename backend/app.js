require('dotenv').config();
const axios = require('axios');
const express = require('express');
const { Model } = require('objection');
// import the models from the models folder
// const { Playlist, Track, PlaylistTrack } = require('./models');
const Playlist = require('./models/Playlist');
const Track = require('./models/Track');
const PlaylistTrack = require('./models/PlaylistTrack');
const app = express();
const PORT = process.env.PORT || 8080;

const knex = require('knex')({
    client: 'mysql',
    connection: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_DATABASE
    },
    debug: true
});

Model.knex(knex);

async function authenticate() {
    try {
        // set up request data
        const clientId = process.env.CLIENT_ID;
        const clientSecret = process.env.CLIENT_SECRET;
        const authString = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
        const data = 'grant_type=client_credentials';

        // make POST request to Spotify API to get access token
        const { data: { access_token: accessToken } } = await axios.post(
            'https://accounts.spotify.com/api/token',
            data,
            {
                headers: {
                    'Authorization': `Basic ${authString}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );

        // use access token to authenticate further API requests
        axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

        console.log('successful authentication.');
    } catch (error) {
        // console.error(error);
        next(error);
    }
}

async function createTables() {
    try {


        console.log('created tables.');
    } catch (error) {
        // console.error(error);
        next(error);
    }
}

async function fetchPlaylistTracks(playlistId, next) {
    try {
        // make HTTP GET request to Spotify API to fetch track list for playlist

        // The access_token is then used to set the Authorization header for all
        // subsequent requests made using the axios library.
        const response = await axios.get(
            `https://api.spotify.com/v1/playlists/${playlistId}`
        );

        const tracks = response.data.tracks.items;

        console.log(`tracks in playlist ${playlistId}:`)
        // console.log(response.data.tracks.items)

        response.data.tracks.items.forEach((item) => {
            // console.log(item.track.name);
            // console.log("-------------------------")
        })

        // return response.data.tracks.items;
        console.log(tracks);
        return tracks;
    } catch (error) {
        next(error);
    }
}


// v2 function
async function getPlaylistObject(playlistID, next) {
    try {
        const response = await axios.get(
            `https://api.spotify.com/v1/playlists/${playlistID}`
        );
        // console.log(response.data)
        return response.data;
    } catch (error) {
        next(error);
    }
}

// v2 function
function getPlaylistID(playlistObject) {
    console.log("getPlaylistID called")
    console.log(playlistObject.id)
    return playlistObject.id;
}

// v2 function
function getPlaylistName(playlistObject) {
    console.log("getPlaylistName called")
    console.log(playlistObject.name)
    return playlistObject.name;
}

// v2 function
function getPlaylistTracks(playlistObject) {
    console.log("getPlaylistTracks called")
    // console.log(playlistObject.tracks.items)
    return playlistObject.tracks.items;
}

// v2 function
function getPlaylistIDfromURL(playlistURL) {
    return playlistURL.split('/').pop();
}

// v2 function
async function comparePlaylistsWithDB(playlist1Url, playlist2Url, next) {
    const playlist1ID = getPlaylistIDfromURL(playlist1Url);
    const playlist2ID = getPlaylistIDfromURL(playlist2Url);

    const playlist1Object = await getPlaylistObject(playlist1ID, next);
    const playlist2Object = await getPlaylistObject(playlist2ID, next);

    const playlist1 = await addPlaylistToDB(playlist1Object);
    const playlist2 = await addPlaylistToDB(playlist2Object);

    // find intersection of the tracks in the two playlists using the objection models
    // use an inner join to find the intersection
    const intersection = await Track
        .query()
        .select('tracks.track_id')
        .join('playlist_tracks as pt1', 'tracks.track_id', 'pt1.track_id')
        .join('playlist_tracks as pt2', 'tracks.track_id', 'pt2.track_id')
        .where('pt1.playlist_id', playlist1ID)
        .andWhere('pt2.playlist_id', playlist2ID)
        .andWhere(function () {
            this.where('pt1.playlist_id', '<>', 'pt2.playlist_id').orWhere('pt2.playlist_id', '<>', 'pt1.playlist_id');
        });

    // return the intersection in JSON format and include it in the response
    console.log("INTERSECTION")
    console.log(intersection)
    return intersection;
}

// v2 function
async function addPlaylistToDB(playlistObject) {

    console.log("addPlaylistToDB called")

    // add playlist to Playlists table
    const curID = getPlaylistID(playlistObject);
    Playlist.query().where('playlist_id', '=', curID).resultSize().then((result) => {
        console.log("RESULT");
        console.log(result);
    });
    if (Playlist.query().where('playlist_id', '=', curID).resultSize() === 0) {
        const playlistTrx = await Playlist.transaction(async trx => {
            // if the playlist doesn't already exist in the database, add it
            const playlist = await Playlist.query(trx).insert({
                playlist_id: getPlaylistID(playlistObject),
                name: getPlaylistName(playlistObject),
            });
        });
    }

    // add tracks to Tracks table
    for (const item of getPlaylistTracks(playlistObject)) {
        const trackTrx = await Track.transaction(async trx => {
            // if the track doesn't already exist in the database, add it
            if (Track.query().where('track_id', item.track.id).resultSize() === 0) {
                console.log("INSERTING TRACK");
                const track = await Track.query(trx).insert({
                    track_id: item.track.id,
                    name: item.track.name,
                    artist: item.track.artists[0].name,
                    album: item.track.album.name,
                    duration_ms: item.track.duration_ms,
                });
            }
        });
    };

    // add links between playlists and tracks to PlaylistTracks table
    for (const item of getPlaylistTracks(playlistObject)) {
        const linkTrx = await PlaylistTrack.transaction(async trx => {
            // if the link doesn't already exist in the database, add it
            // we are trying to avoid duplicate links between playlists and tracks

            if (PlaylistTrack.query().where('playlist_id', getPlaylistID(playlistObject)).andWhere('track_id', item.track.id).resultSize() === 0) {
                const link = await PlaylistTrack.query(trx).insert({
                    playlist_id: getPlaylistID(playlistObject),
                    track_id: item.track.id,
                });
            }
        });
    };

}

async function comparePlaylists(playlist1Url, playlist2Url, next) {
    try {
        // extract playlist IDs from URLs
        const playlist1Id = playlist1Url.split('/').pop();
        const playlist2Id = playlist2Url.split('/').pop();

        // fetch track lists for both playlists
        const playlist1Tracks = await fetchPlaylistTracks(playlist1Id, next);
        const playlist2Tracks = await fetchPlaylistTracks(playlist2Id, next);

        // create sets for each playlist
        const set1 = new Set(playlist1Tracks.map((item) => item.track.id));
        const set2 = new Set(playlist2Tracks.map((item) => item.track.id));

        // find intersection of the two sets
        const intersection = new Set([...set1].filter((x) => set2.has(x)));

        return {
            playlist1: playlist1Url,
            playlist2: playlist2Url,
            commonTracks: [...intersection],
        };
    } catch (error) {
        next(error);
    }
}

app.listen(
    PORT,
    () => {
        console.log('hello')
        authenticate();

    }
)

app.get('/compare', (req, res, next) => {
    // retrieve playlist URLs from query parameters
    const playlist1Url = req.query.playlist1;
    const playlist2Url = req.query.playlist2;

    console.log(playlist1Url);
    console.log(playlist2Url);

    // compare the tracks of the two playlists
    comparePlaylists(playlist1Url, playlist2Url, next).then((result) => {
        res.send(result);
    });
})

app.get('/comparev2', (req, res, next) => {
    // retrieve playlist URLs from query parameters
    const playlist1Url = req.query.playlist1;
    const playlist2Url = req.query.playlist2;

    console.log(playlist1Url);
    console.log(playlist2Url);

    // compare the tracks of the two playlists
    comparePlaylistsWithDB(playlist1Url, playlist2Url, next).then((result) => {
        res.send(result);
    });
})

// app.use((err, req, res, next) => {
//     console.error(err.stack)
//     res.status(500).send('Something broke!')
//   })