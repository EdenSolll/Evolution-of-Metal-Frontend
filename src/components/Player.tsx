import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPlay,
    faAngleLeft,
    faAngleRight,
    faPause,
} from "@fortawesome/free-solid-svg-icons";
import { Song } from "../data/api_requests";
import VolumeSlider from "./VolumeSlider";

export interface PlayerProps {
  currentSong: Song | null;
  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  audioRef: React.MutableRefObject<HTMLAudioElement | null>;
  setSongInfo: React.Dispatch<React.SetStateAction<{ currentTime: number; duration: number; animationPercentage: number }>>;
  songInfo: { currentTime: number; duration: number; animationPercentage: number };
  songs: Song[];
  volume: number;
  setVolume: React.Dispatch<React.SetStateAction<number>>;
  setCurrentSong: React.Dispatch<React.SetStateAction<Song | null>>;
  setSongs: React.Dispatch<React.SetStateAction<Song[]>>;
}

const Player: React.FC<PlayerProps> = ({
    currentSong,
    isPlaying,
    setIsPlaying,
    audioRef,
    setSongInfo,
    songInfo,
    volume,
    setVolume,
    songs,
    setCurrentSong,
}) => {
    //Event Handlers
    const dragHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (audioRef.current) {
        audioRef.current.currentTime = Number(e.target.value);
        setSongInfo({ ...songInfo, currentTime: Number(e.target.value)});
      }
    };

  const playSongHandler = () => {
      if (isPlaying) {
          audioRef.current?.pause();
      } else {
          audioRef.current?.play();
      }
      setIsPlaying(!isPlaying);
  };

    const getTime = (time: number) =>
        Math.floor(time / 60) + ":" + ("0" + Math.floor(time % 60)).slice(-2);

    const skipTrackHandler = async (direction: String) => {
        let currentIndex = songs.findIndex(
            (song) => song.id === currentSong?.id
        );
        if (direction === "skip-forward") {
            setCurrentSong(songs[(currentIndex + 1) % songs.length])
            setIsPlaying(true)
            return
        }
        if (direction === "skip-back") {
            if ((currentIndex - 1) === - 1) {
                setCurrentSong(songs[currentIndex - 1 % songs.length])
                setIsPlaying(true)
                return;
            }
            setCurrentSong(songs[(currentIndex - 1) % songs.length])
        }
    };

    const trackAnim = {
        transform: `translateX(${songInfo.animationPercentage}%)`,
    };

    return (
        <div className="player">
            <div className="time-control">
                <p>{getTime(songInfo.currentTime)}</p>
                <div
                    className="track"
                >
                    <input
                        min={0}
                        max={songInfo.duration || 0}
                        value={songInfo.currentTime}
                        onChange={dragHandler}
                        type="range"
                    />
                    <div style={trackAnim} className="animate-track"></div>
                </div>
                <p>
                    {songInfo.duration ? getTime(songInfo.duration) : "00:00"}
                </p>
                <div>
                  <VolumeSlider volume={volume} setVolume={setVolume} />
                </div>

            </div>
            <div className="play-control">
                <FontAwesomeIcon
                    onClick={() => skipTrackHandler("skip-back")}
                    size="1x"
                    className="skip-back"
                    icon={faAngleLeft}
                />
                {!isPlaying ? (
                    <FontAwesomeIcon
                        onClick={playSongHandler}
                        size="1x"
                        className="play"
                        icon={faPlay}
                    />
                ) : (
                    <FontAwesomeIcon
                        onClick={playSongHandler}
                        size="1x"
                        className="pause"
                        icon={faPause}
                    />
                )}

                <FontAwesomeIcon
                    onClick={() => skipTrackHandler("skip-forward")}
                    size="1x"
                    className="skip-forward"
                    icon={faAngleRight}
                />
            </div>

        </div>
    );
};

export default Player;
