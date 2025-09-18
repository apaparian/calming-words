'use client';

import {
  Card, CardContent, Divider, Grid, IconButton, Typography,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { Word } from '@/types';
import axios from 'axios';

interface SpotifyPlayerProps {
  currTrack: Spotify.Track | null;
  paused: boolean;
  player: Spotify.Player | null;
  deviceId: string | null;
  word: Word;
}

function SpotifyPlayer({
  currTrack, paused, player, deviceId, word: { track },
}: SpotifyPlayerProps) {
  const play = () => {
    const trackUri = track?.uri;
    player?.getCurrentState().then((state) => {
      if (trackUri === state?.track_window.current_track.uri) {
        player?.togglePlay();
      } else {
        axios.put('/api/player/play', { deviceId, trackUri });
      }
    });
  };

  return (
    <Card>
      <Divider variant="middle" />
      <CardContent>
        <Grid container alignItems="center" spacing={2}>
          <IconButton
            size="large"
            color="primary"
            disabled={!deviceId || !track}
            onClick={play}
          >
            {paused || currTrack?.id !== track?.id ? <PlayArrowIcon /> : <PauseIcon />}
          </IconButton>
          <Grid>
            <Typography variant="subtitle1">
              {track?.name || ''}
            </Typography>
            <Typography variant="subtitle2" color="textSecondary">
              {track?.artists.map((artist) => artist.name).join(', ') || ''}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
      <Divider variant="middle" />
    </Card>
  );
}

export default SpotifyPlayer;
