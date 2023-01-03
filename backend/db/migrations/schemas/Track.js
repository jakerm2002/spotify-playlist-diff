const trackSchema = (table) => {
    table.string('track_id').primary().unique()
    table.string('name').notNullable()
    table.string('artist').notNullable()
    table.string('album').notNullable()
    table.integer('duration_ms').notNullable()
}

module.exports = trackSchema;