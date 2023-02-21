require('dotenv').config();
const axios = require('axios');
const express = require('express');
const { Model } = require('objection');
// import the models from the models folder
// const { Playlist, Track, PlaylistTrack } = require('./models');
const Playlist = require('./models/Playlist');
const Track = require('./models/Track');
const Session = require('./models/Session');
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
    debug: false
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
    // console.log("getPlaylistID called")
    // console.log(playlistObject.id)
    return playlistObject.id;
}

// v2 function
function getPlaylistName(playlistObject) {
    // console.log("getPlaylistName called")
    // console.log(playlistObject.name)
    return playlistObject.name;
}

// v2 function
function getPlaylistTracks(playlistObject) {
    // console.log("getPlaylistTracks called")
    // console.log(playlistObject.tracks.items)
    return playlistObject.tracks.items;
}

// v2 function
function getPlaylistTrackNames(playlistObject) {
    // console.log("getPlaylistTrackNames called")
    var array = [];
    playlistObject.tracks.items.forEach((item) => {
        array.push({id: item.track.id, name: item.track.name});
    })
    return array;
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
        .select('tracks.track_id', 'tracks.name')
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
    console.log(intersection.length)
    return intersection;
}

// v2 function
async function addPlaylistToDB(playlistObject) {

    console.log("addPlaylistToDB called")

    // add playlist to Playlists table
    const currentPlaylistID = getPlaylistID(playlistObject);
    const playlistOccurrences = await Playlist.query().where('playlist_id', knex.raw("'" + currentPlaylistID + "'")).resultSize();
    if (playlistOccurrences === 0) {
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
        const currentTrackID = item.track.id;
        const trackOccurrences = await Track.query().where('track_id', knex.raw("'" + currentTrackID + "'")).resultSize();
        if (trackOccurrences === 0) {
            const trackTrx = await Track.transaction(async trx => {
                console.log("INSERTING TRACK");
                const track = await Track.query(trx).insert({
                    track_id: item.track.id,
                    name: item.track.name,
                    artist: item.track.artists[0].name,
                    album: item.track.album.name,
                    duration_ms: item.track.duration_ms,
                });
            });
        }
    };

    // add links between playlists and tracks to PlaylistTracks table
    for (const item of getPlaylistTracks(playlistObject)) {
        const currentPlaylistID = getPlaylistID(playlistObject);
        const currentTrackID = item.track.id;
        const linkOccurrences = await PlaylistTrack.query().where('playlist_id', knex.raw("'" + currentPlaylistID + "'")).andWhere('track_id', knex.raw("'" + currentTrackID + "'")).resultSize();
        if (linkOccurrences === 0) {
            const linkTrx = await PlaylistTrack.transaction(async trx => {
                // if the link doesn't already exist in the database, add it
                // we are trying to avoid duplicate links between playlists and tracks
                const link = await PlaylistTrack.query(trx).insert({
                    playlist_id: getPlaylistID(playlistObject),
                    track_id: item.track.id
                });
            });
        }
    };

}



// v3 function
async function addPlaylistToDBv3(playlistObject, session_id) {

    console.log("addPlaylistToDBv3 called")

    // add playlist to Playlists table
    const currentPlaylistID = getPlaylistID(playlistObject);
    const playlistOccurrences = await Session.query().where('db_playlist_id', knex.raw("'" + session_id + '-' + currentPlaylistID + "'")).resultSize();
    if (playlistOccurrences === 0) {
        const playlistTrx = await Playlist.transaction(async trx => {
            // if the playlist doesn't already exist in the database, add it
            const playlist = await Playlist.query(trx).insert({
                db_playlist_id: session_id + '-' + playlistObject.id, //string concat
                db_session_id: session_id, 
                spotify_playlist_id: playlistObject.id,
                playlist_name: playlistObject.name,
                author_display_name: playlistObject.owner.display_name,
                image_url: playlistObject.images[0].url,
                num_tracks: playlistObject.tracks.total
            });
        });
    }

    // add tracks to Tracks table
    localSongCounter = 0; //count number of songs from local files for naming db_track_id
    for (const item of getPlaylistTracks(playlistObject)) {
        const currentTrackID = item.track.id;
        const trackOccurrences = await Track.query().where('track_id', knex.raw("'" + currentTrackID + "'")).resultSize();
        if (trackOccurrences === 0) {
            const trackTrx = await Track.transaction(async trx => {
                console.log("INSERTING TRACK");
                const track = await Track.query(trx).insert({
                    db_track_id: session_id + '-' + (item.track.id ? item.track.id : "local" + localSongCounter),
                    db_session_id: session_id,
                    db_playlist_id: session_id + '-' + playlistObject.id,
                    spotify_track_id: item.track.id,
                    spotify_album_id: item.track.album.id,
                    spotify_artist_id: item.track.artists[0].id,
                    album_art_url: item.track.album.images.length != 0 ? item.track.album.images[0].url : null,
                    date_added: item.added_at,
                    track_name: item.track.name,
                    album_name: item.track.album.name,
                    artist_name: item.track.artists[0].name,
                    runtime: item.track.duration_ms
                });
            });
        }
    };

}

app.listen(
    PORT,
    () => {
        console.log('hello')
        authenticate();

    }
)


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


//v3 function
async function printTracks(playlistURL, next) {
    const playlistID = getPlaylistIDfromURL(playlistURL);
    const playlistObject = await getPlaylistObject(playlistID);
    const res = getPlaylistTracks(playlistObject);
    console.log(res);
    return res;
}

async function printPlaylist(playlistURL, session_id, next) {
    const playlistID = getPlaylistIDfromURL(playlistURL);
    const playlistObject = await getPlaylistObject(playlistID);

    const playlist = {
        db_playlist_id: session_id + '-' + playlistObject.id, //string concat
        db_session_id: session_id, 
        spotify_playlist_id: playlistObject.id,
        playlist_name: playlistObject.name,
        author_display_name: playlistObject.owner.display_name,
        image_url: playlistObject.images[0].url ?? "",
        num_tracks: playlistObject.tracks.total
    };

    console.log(playlist);
    return playlist;
}

async function printTracks2(playlistURL, session_id, next) {
    const playlistID = getPlaylistIDfromURL(playlistURL);
    const playlistObject = await getPlaylistObject(playlistID);

    var tracks = [];
    localSongCounter = 0;
    for (const item of getPlaylistTracks(playlistObject)) {
        console.log(item.track.name);
        const track = {
            db_track_id: session_id + '-' + (item.track.id ? item.track.id : "local" + localSongCounter),
            db_session_id: session_id,
            db_playlist_id: session_id + '-' + playlistObject.id,
            spotify_track_id: item.track.id,
            spotify_album_id: item.track.album.id,
            spotify_artist_id: item.track.artists[0].id,
            album_art_url: item.track.album.images.length != 0 ? item.track.album.images[0].url : null,
            date_added: item.added_at,
            track_name: item.track.name,
            album_name: item.track.album.name,
            artist_name: item.track.artists[0].name,
            runtime: item.track.duration_ms
        }
        tracks.push(track);
    }

    // console.log(tracks);
    return tracks;
}



//v3 function
async function getTrackNames(playlistURL, next) {
    const playlistID = getPlaylistIDfromURL(playlistURL);
    const playlistObject = await getPlaylistObject(playlistID);
    const res = getPlaylistTrackNames(playlistObject);
    console.log(res);
    return res;
}

app.get('/playlist', (req, res, next) => {
    const playlistURL = req.query.playlist;
    const session_id = req.query.session;
    console.log(playlistURL);
    
    printPlaylist(playlistURL, session_id, next).then((result) => {
        res.send(result);
    })
})

app.get('/tracks', (req, res, next) => {
    const playlistURL = req.query.playlist;
    const session_id = req.query.session;
    console.log(playlistURL);
    
    printTracks2(playlistURL, session_id, next).then((result) => {
        res.send(result);
    });

    // printTracks(playlistURL, next).then((result) => {
    //     res.send(result);
    // })
})


//v3 function
async function uploadPlaylist(playlistURL, session_id, next) {
    const playlistID = getPlaylistIDfromURL(playlistURL);
    const playlistObject = await getPlaylistObject(playlistID);
    addPlaylistToDBv3(playlistObject, session_id, next);
}

//upload a playlist into the database, 
app.post('/add', (req, res, next) => {
    const playlistURL = req.query.playlist;
    const session_id = req.query.session;
    
    uploadPlaylist(playlistURL, session_id, next);
})


// app.use((err, req, res, next) => {
//     console.error(err.stack)
//     res.status(500).send('Something broke!')
//   })