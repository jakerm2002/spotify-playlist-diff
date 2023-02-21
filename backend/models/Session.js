const { Model } = require('objection');
const Playlist = require('./Playlist');
const Track = require('./Track');

class Session extends Model {
    static get tableName() {
        return 'sessions';
    }

    static get relationMappings() {
        return {
            playlist: {
                relation: Model.HasManyRelation,
                modelClass: Playlist,
                join: {
                    from: 'sessions.db_playlist_id',
                    to: 'playlists.db_playlist_id'
                }
            }
        };
    }
}

module.exports = Session;