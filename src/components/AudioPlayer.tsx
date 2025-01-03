import Player from './Player';
import { useEffect, useRef, useState } from "react";
import "../styles/app.scss";
import { get_Songs, Song } from "../data/api_requests";
import { getUrl } from "../data/s3";
import { create } from 'zustand';

interface mapAudioState {
  newMapSong: Song | null
}

export const trackState = create<mapAudioState>((set) => ({
  newMapSong: null,
  fetchNewSong: async (song: Song) => {
    set({ newMapSong: song })
    },
}))

function AudioPlayer() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [songInfo, setSongInfo] = useState({
    currentTime: 0,
    duration: 0,
    animationPercentage: 0,
  });

  const audioPlayerState = trackState();

  useEffect(() => {
    get_Songs().then(fetchedSongs => {
      setSongs(fetchedSongs);
      setCurrentSong(fetchedSongs[0]);
    }).catch(error => {
      console.error('Error fetching songs:', error);
    });
  }, []);

  useEffect(() => {
    if (null != audioPlayerState.newMapSong) {
      if (audioRef.current && isPlaying) {
        audioRef.current.pause;
      }
      setCurrentSong(audioPlayerState.newMapSong)
      audioPlayerState.newMapSong = null
    }
  })

  useEffect(() => {
    if (audioRef.current) {
        (async () => {
            const filename = audioRef.current?.src.split('/').pop();
            if (filename) {
                const songUrl = await getUrl(filename);
                if (songUrl && audioRef.current) {
                    audioRef.current.src = songUrl;
                    console.log(songUrl);
                    audioRef.current.load();
                    if (isPlaying) {
                        audioRef.current.play().catch(console.error); }
                }
            }
        })();
    }
  }, [currentSong, isPlaying]);

  const timeUpdateHandler = (e: React.MouseEvent<HTMLAudioElement>) => {
    const target = e.currentTarget;
    const current = target.currentTime;
    const duration = target.duration;
    const roundedCurrent = Math.round(current);
    const roundedDuration = Math.round(duration);
    const animation = Math.round((roundedCurrent / roundedDuration) * 50);
    setSongInfo(prev => ({
      ...prev,
      currentTime: current,
      duration,
      animationPercentage: animation,
    }));
  };

  const songEndHandler = () => {
    if (audioRef.current) {
      let currentIndex = songs.findIndex(song => song.id === currentSong?.id);
      setCurrentSong(songs[(currentIndex + 1) % songs.length]);
      if (isPlaying) audioRef.current.play();
    }
  };

  return (
    <div>
      <Player
        songs={songs}
        songInfo={songInfo}
        setSongInfo={setSongInfo}
        audioRef={audioRef}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        currentSong={currentSong}
        setCurrentSong={setCurrentSong}
        setSongs={setSongs}
      />
      <h3 style={{ textAlign: 'center', margin: '0 auto' }}>{currentSong?.title}  {currentSong?.artist}</h3>
      <audio
        onLoadedMetadata={timeUpdateHandler}
        onTimeUpdate={timeUpdateHandler}
        src={currentSong?.src || ''}
        ref={audioRef}
        onEnded={songEndHandler}
      ></audio>
    </div>
  );
}

export default AudioPlayer;
