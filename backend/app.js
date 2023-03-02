require('dotenv').config();
const axios = require('axios');
const axiosRetry = require('axios-retry');
const express = require('express');
const { Model } = require('objection');
// import the models from the models folder
const Playlist = require('./models/Playlist');
const Track = require('./models/Track');
const Session = require('./models/Session');
const app = express();
var cors = require('cors')
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

async function authenticate(next) {
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



axiosRetry(axios, { retries: 3 });


// Define the interceptor
axios.interceptors.response.use(undefined, function axiosRetryInterceptor(err) {
    var config = err.config;

    // console.log(err);
    console.log(err.response.headers.get('retry-after'));
    console.log(err.response.status);
  
    // If config does not exist or the retry option is not set, reject immediately
    if (!config || !config.retry) {
      return Promise.reject(err);
    }
  
    // Set the variable for the number of retries
    config.__retryCount = config.__retryCount || 0;

    // Check if we've maxed out the total number of retries
    if(config.__retryCount >= config.retry) {
        // Reject with the error
        return Promise.reject(err);
    }

    // const backOffDelay = config.retryDelay 
    //     ? ( (1/2) * (Math.pow(2, config.__retryCount) - 1) ) * 1000
    //     : 1;
  
    const delay = err.response.headers.get('retry-after') * 1000;

    // Check if the error is a 429 status code
    if (err.response.status === 429) {
      // Retry after 10 seconds for 429 status codes
      config.__retryCount += 1;
      return new Promise(function(resolve) {
        setTimeout(function() {
            console.log("resending request.");
          resolve(axios(config));
        }, delay + 1000);
      });
    }
  
    // If the error is not a 5xx or 429 status code, reject immediately
    return Promise.reject(err);
  });

  


async function getPlaylistObject(playlistID, next) {
    try {
        const response = await axios.get(
            `https://api.spotify.com/v1/playlists/${playlistID}?fields=external_urls,id,name,owner(display_name, external_urls),images,tracks(total),snapshot_id`
        );
        // console.log(response.data)
        return response.data;
    } catch (error) {
        next(error);
    }
}

function getPlaylistID(playlistObject) {
    // console.log("getPlaylistID called")
    // console.log(playlistObject.id)
    return playlistObject.id;
}

function getPlaylistName(playlistObject) {
    // console.log("getPlaylistName called")
    // console.log(playlistObject.name)
    return playlistObject.name;
}

function getPlaylistTracks(playlistObject) {
    // console.log("getPlaylistTracks called")
    // console.log(playlistObject.tracks.items)
    return playlistObject.tracks.items;
}

async function getAllPlaylistTracks(playlistObject, session_id, next) {
    const playlistID = playlistObject.id;
    const playlistLength = playlistObject.tracks.total;

    try {
        const fields = `fields=next,items(track(name, album(name, images, id), artists(name, id), id, duration_ms), added_at)`
        let allResponses = [];
        const numCalls = Math.ceil(playlistLength / 100);
        for (var i = 0; i < numCalls; i++) {
            let nextURL = `https://api.spotify.com/v1/playlists/${playlistID}/tracks?limit=100&offset=${(i * 100)}&${fields}`;
            allResponses[i] = axios.get(nextURL, { retry: 2 });
        }
        
        let playlist_order_counter = {count: 1};
        let localSongCounter = {count : 1}; //count number of songs from local files for naming db_track_id

        for (var i = 0; i < numCalls; i++) {
            response = await allResponses[i];
            addTracks(response.data.items, playlistObject, session_id, playlist_order_counter, localSongCounter);
        }

        console.log("finished adding all playlist tracks to DB.");
    } catch (error) {
        next(error);
    }
}

function getPlaylistIDfromURL(playlistURL) {
    return (playlistURL.split('/').pop()).split('?')[0];
}

function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
  }

//gets an array of ~100 max items and adds them in bulk insert to DB
async function addTracks(response_items, playlistObject, session_id, playlist_order_counter, localSongCounter) {

    items = [];

    response_items.forEach((item) => {
        if (item.track != null) {
            items.push({
                db_session_id: session_id,
                spotify_playlist_id: playlistObject.id,
                spotify_track_id: (item.track.id ? item.track.id : "local" + localSongCounter.count++),
                spotify_album_id: item.track.album.id,
                spotify_artist_id: item.track.artists[0].id,
                cover_art_url: item.track.album.images.length != 0 ? item.track.album.images[0].url : null,
                date_added: item.added_at,
                track_name: item.track.name,
                album_name: item.track.album.name,
                artist_name: item.track.artists[0].name,
                runtime_ms: item.track.duration_ms,
                runtime: millisToMinutesAndSeconds(item.track.duration_ms),
                playlist_order: playlist_order_counter.count++
            });
        } else {
        }
    });

    // add tracks to Tracks table
    const track = await Track.knexQuery().insert(items);

    return items.length;
}


// v3 function
async function addPlaylistToDB(playlistObject, session_id, next) {

    const plistObject = {
        db_session_id: session_id, 
        spotify_playlist_id: playlistObject.id,
        playlist_name: playlistObject.name,
        author_display_name: playlistObject.owner.display_name,
        image_url: playlistObject.images.length != 0 ? playlistObject.images[0].url : null,
        num_tracks: playlistObject.tracks.total,
        snapshot_id: playlistObject.snapshot_id,
        playlist_url: playlistObject.external_urls.spotify,
        author_url: playlistObject.owner.external_urls.spotify
    }

    console.log("adding playlist")

    // add playlist to Playlists table
    const currentPlaylistID = getPlaylistID(playlistObject);
    const currentSnapshotID = playlistObject.snapshot_id;
    const playlistOccurrences = await Playlist.query().whereComposite(['db_session_id', 'spotify_playlist_id'], [session_id, currentPlaylistID]).resultSize();
    // if the playlist doesn't already exist in the database, add it
    console.log(playlistOccurrences, 'playlist occurrences');
    if (playlistOccurrences === 0) {
        const playlistTrx = await Playlist.transaction(async trx => {
            const playlist = await Playlist.query(trx).insert(plistObject);
        });
        await getAllPlaylistTracks(playlistObject, session_id, next);
    } else {
        //if the playlist does exist, check to see if the session id already exists
        const snapshotOccurrences = await Playlist.query().whereComposite(['db_session_id', 'spotify_playlist_id', 'snapshot_id'], [session_id, currentPlaylistID, currentSnapshotID]).resultSize();
        console.log(snapshotOccurrences, 'snapshot occurrences');
        if (snapshotOccurrences === 0) { //means we've never seen this snapshot before
            //in this case, we will remove all tracks from the playlist and re-add them
            const playlistTrx = await Playlist.transaction(async trx => {

                //remove all tracks of playlist with old session id
                const numDeletedTracks = await Track.query(trx).delete().where('db_session_id', session_id).andWhere('spotify_playlist_id', currentPlaylistID);

                //remove old records of playlist from playlists table?
                const numDeletedPlaylists = await Playlist.query(trx).delete().where('db_session_id', session_id).andWhere('spotify_playlist_id', currentPlaylistID);

                const playlist = await Playlist.query(trx).insert(plistObject);
                
            });
            await getAllPlaylistTracks(playlistObject, session_id, next);
        }
    }
    return plistObject;
}

app.use(cors());

app.listen(
    PORT,
    (next) => {
        console.log('hello')
        authenticate(next);

    }
)

async function uploadPlaylist(playlistURL, session_id, next) {
    const playlistID = getPlaylistIDfromURL(playlistURL);
    const playlistObject = await getPlaylistObject(playlistID, next);
    return await addPlaylistToDB(playlistObject, session_id, next);
}

app.get('/compare', (req, res, next) => {
    // retrieve playlist URLs from query parameters
    const playlists = req.query.playlist;

    //TODO
    // if more than one paylist parameter is passed
    //then this variable turns into an arry
    //we need to check if this is an array
    //if we only get one parameter, do nothing

    const session_id = req.query.session;

    sort_filter_fields = [
        'playlist_order',
        'track_name',
        'artist_name',
        'album_name'
    ]

    const playlistIDs = [];
    playlists.forEach((element) => {
        playlistIDs.push(getPlaylistIDfromURL(element));
    });
    
    const sort_attributes = get_sort_attributes(req.query, sort_filter_fields);

    getSharedTracks(playlistIDs, session_id, sort_attributes).then((result) => {
        res.send(result);
    });
})

//v4 function
async function getSharedTracks(playlist_ids, session_id, sort_attributes) {

    // let subquery = Track.query().select('spotify_track_id')
    //     .where('db_session_id', session_id)
    //     .groupBy('spotify_track_id')
    //     .having(knex.raw('count(DISTINCT spotify_playlist_id)'), '=', playlist_ids.length);

    const query = await Track
        .query()
        .min('playlist_order as playlist_order')
        .select('track_name', 'album_name', 'artist_name', 'runtime_ms', 'runtime', 'cover_art_url', 'spotify_track_id')
        .modify((queryBuilder) => {

            queryBuilder.whereIn('spotify_track_id', 
            Track.query().select('spotify_track_id')
            .whereIn('spotify_playlist_id', playlist_ids)
            .where('db_session_id', session_id)
            .groupBy('spotify_track_id')
            .having(knex.raw('count(DISTINCT spotify_playlist_id)'), '=', playlist_ids.length))
            .andWhere('spotify_playlist_id', playlist_ids[0]);
            queryBuilder.groupBy('spotify_track_id');

            if (sort_attributes) {
                queryBuilder.orderBy(sort_attributes);
            }

        });

    console.log("getting shared tracks")
    // console.log(query)
    console.log(query.length, "shared tracks")
    return query;
}


//determine a sort parameter
//should default to sorting by
//track order of playlist1
function get_sort_attributes(request_args, sort_filter_fields) {
    //confirm that we have a sort parameter
    if ('sort' in request_args) {
        //confirmt that the sort parameter passed in is a valid field to sort by
        for (const element of sort_filter_fields) {
            if (request_args.sort === element) {
                return request_args.sort;
            }
        }
    }
    return 'playlist_order'
}

//upload a playlist into the database, 
app.post('/add', async (req, res, next) => {
    const playlistURL = req.query.playlist;
    const session_id = req.query.session;
    
    try {
        const result = await uploadPlaylist(playlistURL, session_id, next);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
})


//v3 function
async function printPlaylistObject(playlistURL, next) {
    const playlistID = getPlaylistIDfromURL(playlistURL);
    const playlistObject = await getPlaylistObject(playlistID, next);
    const res = await getAllPlaylistTracks(playlistObject, next);
    
    console.log(res);
    console.log("returning", res.length, "tracks");
    // const res = playlistObject;
    
    return res;
}

app.get('/playlist', (req, res, next) => {
    const playlistURL = req.query.playlist;
    const session_id = req.query.session;
    console.log(playlistURL);
    
    printPlaylistObject(playlistURL, next).then((result) => {
        res.send(result);
    })
})



app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
  })