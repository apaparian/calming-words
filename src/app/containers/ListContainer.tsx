import {
  Card, CardContent, CardActions, Button,
} from '@mui/material';
import { Word } from '@/types';
import { JSX } from 'react';
import CreatePlaylist from '../components/CreatePlaylist';
import List from '../components/List';
import Input from '../components/Input';

interface ListContainerProps {
  setCurrWordIndex: React.Dispatch<React.SetStateAction<number>>;
  setTracks: React.Dispatch<React.SetStateAction<Spotify.Track[]>>;
  wordList: Word[];
  addWord: (word: string) => void;
  deleteWord: (index: number) => void;
  deviceId: string | null;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setPlaylistCreated: React.Dispatch<React.SetStateAction<boolean>>;
  displayWords: () => void;
  playlistId: string;
  setPlaylistId: React.Dispatch<React.SetStateAction<string>>;
}

function ListContainer({
  setCurrWordIndex,
  setTracks,
  wordList,
  addWord,
  deleteWord,
  deviceId,
  setOpenDialog,
  setPlaylistCreated,
  displayWords,
  playlistId,
  setPlaylistId,
}: ListContainerProps): JSX.Element {
  return (
    <Card>
      <Input
        addWord={addWord}
      />
      <CardContent>
        <List
          setCurrWordIndex={setCurrWordIndex}
          setTracks={setTracks}
          setOpenDialog={setOpenDialog}
          deviceId={deviceId}
          wordList={wordList}
          deleteWord={deleteWord}
        />
      </CardContent>
      <CardActions sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <CreatePlaylist
          setPlaylistCreated={setPlaylistCreated}
          wordList={wordList}
          playlistId={playlistId}
          setPlaylistId={setPlaylistId}
        />
        <Button
          size="medium"
          onClick={() => displayWords()}
          disabled={!wordList[0]}
        >
          Item Display
        </Button>
      </CardActions>
    </Card>
  );
}

export default ListContainer;
