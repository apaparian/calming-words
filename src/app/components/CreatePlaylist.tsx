import { Word } from '@/types';
import { Tooltip, Button } from '@mui/material';
import axios from 'axios';
import { JSX } from 'react';

interface CreatePlaylistProps {
  wordList: Word[];
  setPlaylistCreated: React.Dispatch<React.SetStateAction<boolean>>;
  playlistId: string;
  setPlaylistId: React.Dispatch<React.SetStateAction<string>>;
}

function CreatePlaylist({
  wordList,
  setPlaylistCreated,
  playlistId,
  setPlaylistId,
}: CreatePlaylistProps): JSX.Element {
  const createPlaylist = async () => {
    const trackUris = wordList.map(({ track }) => track?.uri).filter((uri) => !!uri);

    if (playlistId) {
      axios.post(`/api/playlists/${playlistId}`, { trackUris });
    } else {
      const res = await axios.post('/api/playlists/create', { trackUris });
      if (res.data.id) {
        setPlaylistId(res.data.id);
        setPlaylistCreated(true);
      }
    }
  };

  return (
    <Tooltip title={playlistId
      ? 'Add to Calming Words Playlist'
      : 'Adds a new playlist to your Spotify account'}
    >
      <Button
        size="medium"
        onClick={() => createPlaylist()}
        disabled={!wordList.some((word) => word?.track)}
      >
        {playlistId ? 'Add to Playlist' : 'Create Playlist'}
      </Button>
    </Tooltip>
  );
}

export default CreatePlaylist;
