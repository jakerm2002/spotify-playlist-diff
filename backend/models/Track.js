const { Model } = require('objection');
const Playlist = require('./Playlist');

class Track extends Model {
    static get tableName() {
        return 'tracks';
    }

    static get relationMappings() {
        return {
            playlist: {
                relation: Model.HasOneRelation,
                modelClass: Playlist,
                join: {
                    from: 'tracks.db_playlist_id',
                    to: 'playlists.db_playlist_id'
                }
            }
        };
    }
}

module.exports = Track;