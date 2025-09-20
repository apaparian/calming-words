'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Card, Paper, Snackbar,
} from '@mui/material';
import { Word } from '@/types';

import axios from 'axios';
import WordDisplay from '../components/WordDisplay';
import SearchTrackDialog from '../components/SearchTrackDialog';
import SpotifyPlayer from '../components/SpotifyPlayer';
import NowPlaying from '../components/NowPlaying';
import ListContainer from './ListContainer';
import Header from '../components/Header';

function MainContainer() {
  const [wordList, setWordList] = useState<Word[]>([]);
  const [unusedWords, setUnusedWords] = useState<Word[]>([]);
  const [currWord, setCurrWord] = useState<Word | null>(null);
  const [showWord, setShowWord] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [tracks, setTracks] = useState<Spotify.Track[]>([]);
  const [currWordIndex, setCurrWordIndex] = useState<number>(0);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [paused, setPaused] = useState<boolean>(true);
  const [currTrack, setCurrTrack] = useState<Spotify.Track | null>(null);
  const [playlistCreated, setPlaylistCreated] = useState<boolean>(false);
  const [playlistId, setPlaylistId] = useState<string>('');

  const playerRef = useRef<Spotify.Player | null>(null);

  const removeWord = (list: Word[], i: number) => list.slice(0, i).concat(list.slice(i + 1));

  const deleteWord = (i: number) => {
    setWordList(removeWord(wordList, i));
  };

  const addWord = (word: string) => {
    if (!wordList.some((w) => w.word === word)) {
      setWordList(wordList.concat([{ word, track: null }]));
    }
  };

  const getWord = (list: Word[]) => {
    if (list.length === 1) {
      setCurrWord(list[0]);
      setUnusedWords(wordList);
    } else {
      const i = Math.floor(Math.random() * list.length);

      setCurrWord(list[i]);
      setUnusedWords(removeWord(list, i));
    }
  };

  const linkTrackToWord = (track: Spotify.Track, i = currWordIndex) => {
    const newWordList = [...wordList];
    const word = { ...wordList[i] };
    word.track = track;
    newWordList[i] = word;
    setWordList(newWordList);
    setOpenDialog(false);
  };

  const displayWords = () => {
    getWord(wordList);
    setShowWord(true);
  };

  useEffect(() => {
    let refreshId: number;

    const handleMessage = async (e: MessageEvent) => {
      if (e.data.type === 'SPOTIFY_AUTH_CODE') {
        const verifier = localStorage.getItem('spotify_pkce_verifier');

        await axios.post('/api/token', { verifier, code: e.data.code });

        if (!playerRef.current && !document.getElementById('spotify-sdk')) {
          const script = document.createElement('script');
          script.src = 'https://sdk.scdn.co/spotify-player.js';
          script.id = 'spotify-sdk';
          script.async = true;
          document.body.appendChild(script);

          window.onSpotifyWebPlaybackSDKReady = async () => {
            const player = new window.Spotify.Player({
              getOAuthToken: async (cb) => (
                cb((await axios.get('/api/token')).data.access_token)),
              name: 'Calming Words',
              volume: 0.8,
            });
            player.addListener('ready', async (state) => {
              await axios.put('/api/player', { deviceId: state.device_id });
              setDeviceId(state.device_id);
            });
            player.addListener('player_state_changed', (state) => {
              setCurrTrack(state?.track_window.current_track);
              setPaused(state?.paused);
            });
            await player.connect();
            window.addEventListener('click', () => player.togglePlay(), { once: true });

            playerRef.current = player;
          };
        }
        refreshId = window.setInterval(() => axios.put('/api/token/'), 55 * 60 * 1000);
      }
    };
    window.addEventListener('message', handleMessage);

    return () => {
      if (playerRef.current) {
        playerRef.current.disconnect();
        playerRef.current = null;
      }
      const sdkScript = document.getElementById('spotify-sdk');
      if (sdkScript) document.body.removeChild(sdkScript);

      window.removeEventListener('message', handleMessage);

      clearInterval(refreshId);
    };
  }, []);

  useEffect(() => {
    if (deviceId && !playlistId) {
      axios.get('/api/playlists').then((res) => {
        if (res.data) setPlaylistId(res.data.id);
      });
    }
  }, [deviceId, playlistId]);

  return (
    <Paper>
      <Snackbar
        open={playlistCreated}
        autoHideDuration={3500}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        onClose={() => setPlaylistCreated(false)}
        message="Playlist Created: Calming Words"
      />
      <SearchTrackDialog
        linkTrackToWord={linkTrackToWord}
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        tracks={tracks}
      />
      <Header />
      {currTrack && (
        <NowPlaying
          wordList={wordList}
          linkTrackToWord={linkTrackToWord}
          paused={paused}
          currTrack={currTrack}
        />
      )}
      {!showWord ? (
        <Card>
          <ListContainer
            deviceId={deviceId}
            setCurrWordIndex={setCurrWordIndex}
            setTracks={setTracks}
            setOpenDialog={setOpenDialog}
            wordList={wordList}
            addWord={addWord}
            deleteWord={deleteWord}
            setPlaylistCreated={setPlaylistCreated}
            displayWords={displayWords}
            playlistId={playlistId}
            setPlaylistId={setPlaylistId}
          />
        </Card>
      )
        : (
          <Card>
            <SpotifyPlayer
              currTrack={currTrack}
              paused={paused}
              player={playerRef.current}
              deviceId={deviceId}
              word={currWord!}
            />
            <WordDisplay
              word={currWord!}
              newWord={() => getWord(unusedWords)}
              reset={() => setShowWord(false)}
            />
          </Card>
        )}
    </Paper>
  );
}

export default MainContainer;
