import Player from './Player';
import { useEffect, useRef, useState } from "react";
import "../styles/app.scss";
import { get_Songs, Song } from "../data/api_requests";
import { getUrl } from "../data/api_requests";
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
  const [volume, setVolume] = useState<number>(0.3);
  const [songInfo, setSongInfo] = useState({
    currentTime: 0,
    duration: 0,
    animationPercentage: 0,
  });

  const audioPlayerState = trackState();

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  if (songs == null) {
    get_Songs().then(fetchedSongs => {
      setSongs(fetchedSongs);
      }).catch(error => {
        console.error('Error fetching songs:', error);
    });
  }

  useEffect(() => {
      if (audioPlayerState.newMapSong) {
          setCurrentSong(audioPlayerState.newMapSong);
          setIsPlaying(true);
          audioPlayerState.newMapSong = null;
      }
  }, [audioPlayerState.newMapSong]);

  useEffect(() => {
      if (audioRef.current && currentSong) {
          (async () => {
              const filename = currentSong.src.split('/').pop();
              if (filename) {
                  const songUrl = await getUrl(filename);
                  if (songUrl && audioRef.current) {
                      audioRef.current.src = songUrl;
                      audioRef.current.load();

                      const playWhenLoaded = () => {
                          if (isPlaying) {
                              audioRef.current?.play().catch(console.error);
                          }
                          audioRef.current?.removeEventListener('canplaythrough', playWhenLoaded);
                      };

                      audioRef.current.addEventListener('canplaythrough', playWhenLoaded);
                  }
              }
          })();
      }
  }, [currentSong]);

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


  return (
    <div>
      <Player
        songs={songs}
        songInfo={songInfo}
        setSongInfo={setSongInfo}
        audioRef={audioRef}
        volume={volume}
        setVolume={setVolume}
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
      ></audio>
    </div>
  );
}

export default AudioPlayer;
