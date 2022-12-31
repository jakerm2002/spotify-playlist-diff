require('dotenv').config();
const axios = require('axios');
const app = require('express')();
const PORT = 8080;

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

        console.log('successful authentication. bearer token is ' + accessToken);
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

        console.log(`tracks in playlist ${playlistId}:`)
        // console.log(response.data.tracks.items)

        response.data.tracks.items.forEach((item) => {
            console.log(item.track.name);
            // console.log("-------------------------")
        })

        return response.data.tracks.items;
    } catch (error) {
        next(error);
    }
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
        const set1 = new Set(playlist1Tracks.map((track) => track.id));
        const set2 = new Set(playlist2Tracks.map((track) => track.id));

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
        var client_id = process.env.CLIENT_ID;
        var client_secret = process.env.CLIENT_SECRET;
        console.log(client_id);
        console.log(client_secret);
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

// app.use((err, req, res, next) => {
//     console.error(err.stack)
//     res.status(500).send('Something broke!')
//   })