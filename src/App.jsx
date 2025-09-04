import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CakeWithSoundDetection from './Cake';
import CardSlider from '../src/Card';
import audiosrc from '../public/Export-Ruth.MP3'

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // Try to autoplay (with user interaction fallback)
  useEffect(() => {
    const attemptAutoPlay = async () => {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (err) {
        console.log("Auto-play was prevented - will require user interaction");
      }
    };
    
    attemptAutoPlay();
  }, []);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <Router>
      {/* Music controls fixed position so they're always accessible */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 1000
      }}>
        <button 
          onClick={togglePlay}
          style={{
            padding: '10px 10px',
            borderRadius: '50%',
            border: 'none',
            background: isPlaying ? '#ff4d4d' : '#4CAF50',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          {isPlaying ? '🔊' : '🔇'}
        </button>
      </div>

      <audio 
        ref={audioRef}
        src={audiosrc} 
        loop
        preload="auto"
      />

      <Routes>
        <Route path="/" element={<CakeWithSoundDetection />} />
        <Route path="/card" element={<CardSlider />} />
      </Routes>
    </Router>
  );
}

export default App;