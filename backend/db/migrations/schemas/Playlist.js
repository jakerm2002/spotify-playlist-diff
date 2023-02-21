const playlistSchema = (table) => {
    table.string('db_playlist_id').primary().unique()
    table.string('db_session_id').notNullable()
    table.string('spotify_playlist_id').notNullable()
    table.string('playlist_name').notNullable()
    table.string('author_display_name').notNullable()
    table.string('image_url').notNullable()
    table.integer('num_tracks')
}

module.exports = playlistSchema;