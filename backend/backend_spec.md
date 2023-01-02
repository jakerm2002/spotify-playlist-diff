
Takes multiple spotify playlist links and returns a JSON response containing two arrays:

One array will contain the [CATEGORY] that are shared between all of the playlists, and the other array will contain the [CATEGORY] that are NOT shared between the playlists.

The API should be able to take in different CATEGORIES:
    - Tracks
    - Artists
    - Album

Additional features:
    1. (must have) For every category, allow the ability to see tracks, and allow sorting based alphabetically A-Z on track name, artist name, and album name, track length.

    2. The option to intermix shared/not shared songs into one list that can be sorted like additional feature #1. If no sorting option is enabled then it will sort by date added oldest to newest.

    3. If the user is signed in, allow them to edit their playlists by adding an option to delete shared songs that exist in either of the playlists, if that playlist belongs to them.

We could do the comparisons for shared/not shared in three ways:
    1. Do comparison fully on the frontend. Use JavaScript in the browser to determine which parts of the response to show.

        Pros:
            Don't have to make multiple API calls, just one.

        Cons:
            Finding matching tracks using the browser relies on the speed of the computer running it. May be sluggish for playlists with many songs. It's possible that the code for finding shared songs might be called more than once if categories are switched.

    2. Have the server return one large response containing shared songs for every category. For example:

        tracks: {
            shared: [
                {}
            ]
            not_shared [
                {}
            ]
        }

        artists: {
            shared: [
                artist 1: {
                    artist info
                    tracks: {
                        from playlist 1: [
                            {}
                        ]
                        from playlist 2: [
                            {}
                        ]
                    }
                }
            ]
            not_shared: [

            ]
        }

    3. Make the server have an individual endpoint based on the category we want to look at. For example, if the category is...

    tracks:
        api.playlistdiff.me/tracks?plist1=...&plist2=...

    artists:
        api.playlistdiff.me/artists?plist1=...&plist2=...
    
    calculate shared/not shared for every category at once.

Internal Structure:
    Uses a MySQL database to store the track information for every playlist, and to perform JOIN operations to find tracks that are shared between playlists.

    The MySQL database will use the MEMORY engine for faster response times when performing sort operations. There is no need to permenantly store the playlist data in the database.
    
    When playlists are added to the website, each playlist will be added as a table to the database. The table name will be the ID of the playlist.

    Each playlist's table will have the following strucuture of columns:
        - track id (primary key)
        - track name
        - artist
        - album
        - duration
        - date added



Possible bugs:
    Spotify might not recognize two songs are the same because they might be a different version, which will have a different ID. The server might also have to compare name and artist to see if the tracks are similar. Same thing for albums. Or instead,
    we could put a warning on the website that details the behavior.