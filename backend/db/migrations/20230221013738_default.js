/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema
        .createTable('sessions', require('./schemas/Session'))
        .createTable('playlists', require('./schemas/Playlist'))
        .createTable('tracks', require('./schemas/Track'))
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema
        .dropTableIfExists('tracks')
        .dropTableIfExists('playlists')
        .dropTableIfExists('sessions');
        
};