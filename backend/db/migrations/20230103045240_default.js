/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema
        .createTable('playlist_tracks', require('./schemas/PlaylistTrack'))
        .createTable('playlists', require('./schemas/Playlist'))
        .createTable('tracks', require('./schemas/Track'))
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema
        .dropTableIfExists('playlist_tracks')
        .dropTableIfExists('playlists')
        .dropTableIfExists('tracks');
};
