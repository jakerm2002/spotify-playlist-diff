const sessionSchema = (table) => {
    table.string('db_session_id').primary().unique()
    table.string('spotify_playlist_id').notNullable()
}

module.exports = sessionSchema;