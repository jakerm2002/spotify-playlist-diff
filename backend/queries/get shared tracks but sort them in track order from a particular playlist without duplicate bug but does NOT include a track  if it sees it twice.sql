SELECT MIN(playlist_order) AS playlist_order, track_name FROM playlists.tracks WHERE (spotify_track_id IN (SELECT spotify_track_id FROM playlists.tracks WHERE db_session_id = 42069 GROUP BY spotify_track_id HAVING COUNT(DISTINCT spotify_playlist_id) = 2) AND spotify_playlist_id = '1pWHQ2M1tRp1rugbnSjMrz') GROUP BY spotify_track_id ORDER BY playlist_order;