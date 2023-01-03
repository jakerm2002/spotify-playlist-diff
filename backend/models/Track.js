const { Model } = require('objection');
const PlaylistTrack = require('./PlaylistTrack');

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
                    from: 'tracks.track_id',
                    to: 'playlist_tracks.track_id'
                }
            }
        };
    }
}

module.exports = Track;