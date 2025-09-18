/** @jsxImportSource @emotion/react */

import { JSX, useState } from 'react';
import { keyframes } from '@emotion/react';
import {
  Box, Card, CardMedia, IconButton, Menu, MenuItem, Tooltip, Typography,
} from '@mui/material';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import AddIcon from '@mui/icons-material/Add';
import { Word } from '@/types';

const pulse = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scaleY(.8); opacity: 0.7; }
  100% { transform: scale(1); opacity: 1; }
`;

interface NowPlayingProps {
  wordList: Word[];
  linkTrackToWord: (track: Spotify.Track, i: number) => void;
  currTrack: Spotify.Track | null;
  paused: boolean;
}

function NowPlaying({
  linkTrackToWord,
  wordList,
  currTrack,
  paused,
}: NowPlayingProps): JSX.Element {
  const [anchor, setAnchor] = useState<any>(null);

  const selectMenuItem = (i: number) => {
    linkTrackToWord(currTrack!, i);
    setAnchor(null);
  };

  const menuItems = wordList.map((w, i) => (
    <MenuItem
      key={w.word}
      sx={{ py: 0.5 }}
      onClick={() => selectMenuItem(i)}
    >
      {w.word}
    </MenuItem>
  ));

  return (
    <Box sx={{ px: 2, py: 1 }}>
      <Card sx={{ backgroundColor: '#2a3f31ff', display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <EqualizerIcon
            color="primary"
            sx={{ ml: 1.5, mr: 0.5, opacity: paused ? 0.7 : 1 }}
            css={{
              animation: paused ? 'none' : `${pulse} 1.5s infinite`,
              transformOrigin: 'bottom',
            }}
          />
          <Card sx={{ margin: 0.75 }}>
            <CardMedia
              component="img"
              sx={{ width: 30, opacity: 0.75 }}
              image={currTrack?.album?.images[0].url}
              alt={currTrack?.name}
            />
          </Card>
          <Typography
            variant="subtitle2"
            color="textPrimary"
          >
            {currTrack?.name || ''}
          </Typography>
          <Typography sx={{ margin: 0.5 }}>•</Typography>
          <Typography
            variant="subtitle2"
            color="textSecondary"
          >
            {currTrack?.artists.map((artist) => artist.name).join(', ') || ''}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', px: 1 }}>
          <Tooltip
            arrow
            disableInteractive
            title="Add to item"
            placement="left"
            enterDelay={50}
            slotProps={{
              tooltip: { sx: { backgroundColor: 'rgba(255, 255, 255, 0.1)' } },
              arrow: { sx: { color: 'rgba(255, 255, 255, 0.1)' } },
            }}
          >
            <IconButton
              size="small"
              disabled={!wordList[0]}
              onClick={(e) => setAnchor(e.currentTarget)}
            >
              <AddIcon />
            </IconButton>
          </Tooltip>
        </Box>
        <Menu
          sx={{ mt: 1 }}
          slotProps={{ list: { sx: { py: 0.5 } } }}
          anchorEl={anchor}
          open={!!anchor}
          onClose={() => setAnchor(null)}
        >
          {menuItems}
        </Menu>
      </Card>
    </Box>
  );
}

export default NowPlaying;
