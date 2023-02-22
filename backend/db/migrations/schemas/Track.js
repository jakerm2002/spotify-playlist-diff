//add .notNullable() to any field to prevent it from being null

//track
//primary key consists of
//session id + spotify_playlist_id + spotify_track_id

const trackSchema = (table) => {
    table.primary(['db_session_id', 'spotify_playlist_id', 'spotify_track_id']);
    table.string('db_session_id')
    table.string('spotify_playlist_id')
    table.string('spotify_track_id')
    table.string('spotify_album_id')
    table.string('spotify_artist_id')
    table.string('cover_art_URL')
    table.date('date_added')
    table.string('track_name')
    table.string('album_name')
    table.string('artist_name')
    table.integer('runtime')

    // table.foreign('db_session_id').references('playlists.db_session_id');
    // table.foreign('spotify_playlist_id').references('playlists.spotify_playlist_id');

    table.foreign(['db_session_id', 'spotify_playlist_id']).references(['db_session_id', 'spotify_playlist_id']).inTable('playlists');
}

module.exports = trackSchema;