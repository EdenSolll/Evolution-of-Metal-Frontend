import React from 'react';
import './VolumeSlider.css';

// In your button:
interface VolumeSliderProps {
  volume: number;
  setVolume: (volume: number) => void;
}

const VolumeSlider: React.FC<VolumeSliderProps> = ({ volume, setVolume }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value) / 100;
    setVolume(newVolume);
  };

  const toggleMute = () => {
    setVolume(volume > 0 ? 0 : 1);
  };

return (
  <div className="volume-control" style={{ position: 'relative' }}> {/* Added position relative */}
    <button
      onClick={toggleMute}
      className={`volume-button ${volume > 0 ? '' : 'muted'}`}
    >
      {volume > 0 ? '🔊' : '🔇'}
    </button>
      <input
        type="range"
        min="0"
        max="100"
        value={volume * 100}
        onChange={handleChange}
        className="volume-slider"
      />
    </div>
  );
};

export default VolumeSlider;
