const { Model } = require('objection');
const Track = require('./Track')

class Playlist extends Model {
    static get tableName() {
        return 'playlists';
    }

    static get relationMappings() {
        return {
            tracks: {
                relation: Model.HasManyRelation,
                modelClass: Track,
                join: {
                    from: 'playlists.db_playlist_id',
                    to: 'tracks.db_playlist_id'
                }
            }
        };
    }
}

module.exports = Playlist;