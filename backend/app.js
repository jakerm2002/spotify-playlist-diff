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



// v3 function
async function addPlaylistToDBv3(playlistObject, session_id) {

    console.log("addPlaylistToDBv3 called")

    // add playlist to Playlists table
    const currentPlaylistID = getPlaylistID(playlistObject);
    const playlistOccurrences = await Playlist.query().whereComposite(['db_session_id', 'spotify_playlist_id'], [session_id, currentPlaylistID]).resultSize();
    // if the playlist doesn't already exist in the database, add it
    if (playlistOccurrences === 0) {
        const playlistTrx = await Playlist.transaction(async trx => {
            const playlist = await Playlist.query(trx).insert({
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
    let localSongCounter = 0; //count number of songs from local files for naming db_track_id
    let playlist_order = 1;
    getPlaylistTracks(playlistObject).forEach(async(item) => {
        const track = await Track.query().insert({
            db_session_id: session_id,
            spotify_playlist_id: playlistObject.id,
            spotify_track_id: (item.track.id ? item.track.id : "local" + localSongCounter++),
            spotify_album_id: item.track.album.id,
            spotify_artist_id: item.track.artists[0].id,
            cover_art_url: item.track.album.images.length != 0 ? item.track.album.images[0].url : null,
            date_added: item.added_at,
            track_name: item.track.name,
            album_name: item.track.album.name,
            artist_name: item.track.artists[0].name,
            runtime: item.track.duration_ms,
            playlist_order: playlist_order++
        });
    });

    console.log("finished");

}

app.listen(
    PORT,
    () => {
        console.log('hello')
        authenticate();

    }
)




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


// v3 function
function getSpotifyIDfromURL(playlistURL) {
    return (playlistURL.split('/').pop()).split('?')[0];
}



//v3 function
async function uploadPlaylist(playlistURL, session_id, next) {
    const playlistID = getPlaylistIDfromURL(playlistURL);
    const playlistObject = await getPlaylistObject(playlistID);
    addPlaylistToDBv3(playlistObject, session_id, next);
}

// v4 function
async function comparePlaylistsWithDBv4(playlist1Url, playlist2Url, session_id, sort_attributes, next) {


    const db_playlist_id1 = getSpotifyIDfromURL(playlist1Url);
    console.log(db_playlist_id1);
    const db_playlist_id2 = getSpotifyIDfromURL(playlist2Url);

    return generate_query([db_playlist_id1, db_playlist_id2], session_id, sort_attributes);
}


//V4#
app.get('/comparev4', (req, res, next) => {
    // retrieve playlist URLs from query parameters
    const playlist1Url = req.query.playlist1;
    const playlist2Url = req.query.playlist2;
    const session_id = req.query.session;
    sort_filter_fields = [
        'track_name',
        'artist_name',
        'album_name'
    ]

    console.log(playlist1Url);
    console.log(playlist2Url);
    const sort_attributes = get_sort_attributes(req.query, sort_filter_fields);
    // const sort_attributes = null;

    comparePlaylistsWithDBv4(playlist1Url, playlist2Url, session_id, sort_attributes).then((result) => {
        res.send(result);
    });
})
//v4 function
async function generate_query(playlist_ids, session_id, sort_attributes) {

    const query = await Track
        .query()
        .select()
        .modify((queryBuilder) => {

            queryBuilder.whereIn('spotify_track_id', 
            Track.query().select('spotify_track_id')
            .where('db_session_id', session_id)
            .groupBy('spotify_track_id')
            .having(knex.raw('count(*) > 1')))
            .andWhere('spotify_playlist_id', playlist_ids[0]);

            if (sort_attributes) {
                queryBuilder.orderBy(sort_attributes);
            }

        });

    return query;
}

//determine a sort parameter
//should default to sorting by
//track order of playlist1
function get_sort_attributes(request_args, sort_filter_fields) {

    //confirm that we have a sort parameter
    if ('sort' in request_args) {
        console.log('found sort parameter in request')
        // console.log(request_args.sort);
        //confirmt that the sort parameter passed in is a valid field to sort by
        for (const element of sort_filter_fields) {
            console.log(element);
            if (request_args.sort === element) {
                console.log('found match');
                console.log('SORTING BY:::')
                console.log(request_args.sort);
                return request_args.sort;
            }
        }
    }
}

//upload a playlist into the database, 
app.post('/add', (req, res, next) => {
    const playlistURL = req.query.playlist;
    const session_id = req.query.session;
    
    uploadPlaylist(playlistURL, session_id, next);
    res.status(200).send();
})


// app.use((err, req, res, next) => {
//     console.error(err.stack)
//     res.status(500).send('Something broke!')
//   })