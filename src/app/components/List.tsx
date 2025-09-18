import React from 'react';
import axios from 'axios';
import { Word } from '@/types';
import ListItem from './ListItem';

interface ListProps {
  setCurrWordIndex: React.Dispatch<React.SetStateAction<number>>;
  setTracks: React.Dispatch<React.SetStateAction<Spotify.Track[]>>;
  wordList: Word[];
  deleteWord: (index: number) => void;
  deviceId: string | null;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

const List: React.FC<ListProps> = ({
  setTracks,
  wordList,
  deleteWord,
  deviceId,
  setOpenDialog,
  setCurrWordIndex,
}) => {
  const linkSong = async (index: number) => {
    const res = await axios.get(`/api/search?q=${wordList[index].word}`);

    setTracks(res.data.tracks.items);
    setCurrWordIndex(index);
    setOpenDialog(true);
  };

  const listItems = wordList.reduce<React.ReactElement[]>((arr, word) => {
    arr.push(<ListItem
      key={arr.length}
      word={word}
      index={arr.length}
      deleteWord={deleteWord}
      linkSong={linkSong}
      deviceId={deviceId}
    />);
    return arr;
  }, []);

  return (
    [listItems]
  );
};

export default List;
