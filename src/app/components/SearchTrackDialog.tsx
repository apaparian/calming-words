import { JSX } from 'react';
import {
  Avatar,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';

interface SearchTrackDialogProps {
  open: boolean;
  onClose: () => void;
  tracks: Spotify.Track[];
  linkTrackToWord: (track: Spotify.Track) => void;
}

function SearchTrackDialog({
  open,
  onClose,
  tracks,
  linkTrackToWord,
}: SearchTrackDialogProps): JSX.Element {
  const linkSong = (i: number): void => {
    linkTrackToWord(tracks[i]);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Spotify Search Results</DialogTitle>
      <DialogContent>
        <List>
          {tracks.map((track, i) => (
            <ListItem key={track.id}>
              <ListItemAvatar>
                <Avatar
                  variant="square"
                  alt={track.name}
                  src={track.album?.images[0]?.url}
                />
              </ListItemAvatar>
              <ListItemText
                primary={track.name}
                secondary={track.artists.map((artist) => artist.name).join(', ')}
              />
              <Button onClick={() => linkSong(i)}>
                Link
              </Button>
            </ListItem>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
}

export default SearchTrackDialog;
