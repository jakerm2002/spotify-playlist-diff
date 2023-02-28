SELECT spotify_track_id, track_name FROM playlists.tracks GROUP BY spotify_track_id HAVING COUNT(DISTINCT spotify_playlist_id) = 2 ORDER BY track_name
