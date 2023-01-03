const playlistSchema = (table) => {
    table.string('playlist_id').primary().unique()
    table.string('name').notNullable()
}

module.exports = playlistSchema;