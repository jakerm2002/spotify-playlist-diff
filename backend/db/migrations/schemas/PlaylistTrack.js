const playlistTrackSchema = (table) => {
    table.string('playlist_id').notNullable()
    table.string('track_id').notNullable()
}

module.exports = playlistTrackSchema;