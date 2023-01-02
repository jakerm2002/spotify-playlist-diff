const { Model } = require('objection');
const knex = require('knex')({
    client: 'mysql',
    connection: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_DATABASE
    },
    debug: true
});

Model.knex(knex);


class Playlist extends Model {
    static get tableName() {
        return 'playlists';
    }

    static get relationMappings() {
        return {
            tracks: {
                relation: Model.HasManyRelation,
                modelClass: PlaylistTrack,
                join: {
                    from: 'playlists.id',
                    to: 'playlist_tracks.playlist_id'
                }
            }
        };
    }
}

class Track extends Model {
    static get tableName() {
        return 'tracks';
    }

    static get relationMappings() {
        return {
            playlist: {
                relation: Model.HasManyRelation,
                modelClass: PlaylistTrack,
                join: {
                    from: 'tracks.id',
                    to: 'playlist_tracks.track_id'
                }
            }
        };
    }
}

class PlaylistTrack extends Model {
    static get tableName() {
        return 'playlist_tracks';
    }

    static get relationMappings() {
        return {
            playlist: {
                relation: Model.BelongsToOneRelation,
                modelClass: Playlist,
                join: {
                    from: 'playlist_tracks.playlist_id',
                    to: 'playlists.id'
                }
            },
            track: {
                relation: Model.BelongsToOneRelation,
                modelClass: Track,
                join: {
                    from: 'playlist_tracks.track_id',
                    to: 'tracks.id'
                }
            }
        };
    }
}