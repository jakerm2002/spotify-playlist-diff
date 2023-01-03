const { Model } = require('objection');
const PlaylistTrack = require('./PlaylistTrack');

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
                    from: 'playlists.playlist_id',
                    to: 'playlist_tracks.playlist_id'
                }
            }
        };
    }
}

module.exports = Playlist;