const { Model } = require('objection');
const Playlist = require('./Playlist');
const Track = require('./Track');

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
                    to: 'playlists.playlist_id'
                }
            },
            track: {
                relation: Model.BelongsToOneRelation,
                modelClass: Track,
                join: {
                    from: 'playlist_tracks.track_id',
                    to: 'tracks.track_id'
                }
            }
        };
    }
}

module.exports = PlaylistTrack;