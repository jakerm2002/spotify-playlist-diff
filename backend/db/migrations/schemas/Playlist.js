const playlistSchema = (table) => {
    table.primary(['db_session_id', 'spotify_playlist_id']);
    table.string('db_session_id').notNullable()
    table.string('spotify_playlist_id').notNullable()
    table.string('playlist_name').notNullable()
    table.string('author_display_name').notNullable()
    table.string('image_url')
    table.integer('num_tracks')
    table.string('snapshot_id')
    table.string('playlist_url')
    table.string('author_url')
}

module.exports = playlistSchema;