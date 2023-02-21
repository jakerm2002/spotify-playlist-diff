//add .notNullable() to any field to prevent it from being null

const trackSchema = (table) => {
    table.string('db_track_id').primary().unique()
    table.string('db_session_id')
    table.string('db_playlist_id')
    table.string('spotify_track_id')
    table.string('spotify_album_id')
    table.string('spotify_artist_id')
    table.string('cover_art_URL')
    table.date('date_added')
    table.string('track_name')
    table.string('album_name')
    table.string('artist_name')
    table.integer('runtime')
}

module.exports = trackSchema;