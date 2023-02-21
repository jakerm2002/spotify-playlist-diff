const sessionSchema = (table) => {
    table.string('db_session_id').primary().unique()
    table.string('db_playlist_id').notNullable()
}

module.exports = sessionSchema;