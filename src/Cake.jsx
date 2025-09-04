import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const CakeWithSoundDetection = () => {
  const [showPermissionDialog, setShowPermissionDialog] = useState(true);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const flameRef = useRef(null);
  const canvasRef = useRef(null);
  const hasRedirectedRef = useRef(false);
  const navigate = useNavigate();

  // Audio processing variables
  const audioContextRef = useRef(null);
  const meterRef = useRef(null);
  const mediaStreamSourceRef = useRef(null);
  const rafIdRef = useRef(null);

  const CLIP_LEVEL = 0.60;
  const AVERAGING = 0.99;
  const CLIP_LAG = 3500;

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      if (meterRef.current) {
        meterRef.current.disconnect();
        if (meterRef.current.onaudioprocess) {
          meterRef.current.onaudioprocess = null;
        }
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, []);

  const hideFlame = () => {
    if (flameRef.current) {
      flameRef.current.style.display = 'none';
    }
    if (!hasRedirectedRef.current) {
      hasRedirectedRef.current = true;
      setTimeout(() => {
        navigate('/card');
      }, 1000);
    }
  };

  const showFlame = () => {
    if (flameRef.current) {
      flameRef.current.style.display = 'block';
    }
  };

  const createAudioMeter = (audioContext, clipLevel, averaging, clipLag) => {
    const processor = audioContext.createScriptProcessor(512);
    processor.onaudioprocess = volumeAudioProcess;
    processor.clipping = false;
    processor.lastClip = 0;
    processor.volume = 0;
    processor.clipLevel = clipLevel || 0.98;
    processor.averaging = averaging || 0.95;
    processor.clipLag = clipLag || 750;

    processor.connect(audioContext.destination);

    processor.checkClipping = function() {
      if (!this.clipping) return false;
      if ((this.lastClip + this.clipLag) < window.performance.now()) {
        this.clipping = false;
      }
      return this.clipping;
    };

    processor.shutdown = function() {
      this.disconnect();
      this.onaudioprocess = null;
    };

    return processor;
  };

  const volumeAudioProcess = function(event) {
    const buf = event.inputBuffer.getChannelData(0);
    const bufLength = buf.length;
    let sum = 0;
    let x;

    for (let i = 0; i < bufLength; i++) {
      x = buf[i];
      if (Math.abs(x) >= this.clipLevel) {
        this.clipping = true;
        this.lastClip = window.performance.now();
      }
      sum += x * x;
    }

    const rms = Math.sqrt(sum / bufLength);
    this.volume = Math.max(rms, this.volume * this.averaging);
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (this.checkClipping()) {
      ctx.fillStyle = "red";      
      hideFlame();
    } else {
      ctx.fillStyle = "green";      
      showFlame();      
    }

    ctx.fillRect(0, 0, this.volume * canvas.width * 1.4, canvas.height);
  };

  const onMicrophoneGranted = (stream) => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    audioContextRef.current = audioContext;
    
    mediaStreamSourceRef.current = audioContext.createMediaStreamSource(stream);
    meterRef.current = createAudioMeter(audioContext, CLIP_LEVEL, AVERAGING, CLIP_LAG);
    mediaStreamSourceRef.current.connect(meterRef.current);

    const onLevelChange = () => {
      rafIdRef.current = requestAnimationFrame(onLevelChange);
    };
    rafIdRef.current = requestAnimationFrame(onLevelChange);
    
    setPermissionGranted(true);
    setShowPermissionDialog(false);
  };

  const onMicrophoneDenied = () => {
    alert('Microphone access is required to blow out the candle. Please refresh and allow microphone access.');
    setPermissionGranted(false);
    setShowPermissionDialog(true);
  };

  const startListening = () => {
    setShowPermissionDialog(false);
    hasRedirectedRef.current = false;
    
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    try {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(onMicrophoneGranted)
        .catch(onMicrophoneDenied);
    } catch (e) {
      alert('Error accessing microphone: ' + e);
      setPermissionGranted(false);
      setShowPermissionDialog(true);
    }
  };

  const [displayText, setDisplayText] = useState('');
  const fullText = 'Blow out the candle';
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + fullText[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 100);
      
      return () => clearTimeout(timeout);
    }
  }, [currentIndex]);

  return (
    <div className='bro'>
      {showPermissionDialog && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          className="permission-dialog"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            color: 'white',
            textAlign: 'center',
            padding: '20px'
          }}
        >
          <h2>Microphone Access Required</h2>
          <p style={{ fontSize: '1.2rem', margin: '20px 0' }}>
            To blow out the candle, we need access to your microphone.
            <br />
            This will only be used to detect when you blow on the candle.Dont forget to unmute the audio
          </p>
          <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
            <button 
              onClick={startListening}
              style={{
                padding: '10px 20px',
                fontSize: '1rem',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Allow Microphone
            </button>
            <button 
              onClick={() => {
                alert('You need to allow microphone access to continue.');
              }}
              style={{
                padding: '10px 20px',
                fontSize: '1rem',
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Deny
            </button>
          </div>
        </motion.div>
      )}

      <motion.h1 
        className='text'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {displayText}
      </motion.h1>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="cake"
      >
        <div className="plate"></div>
        <div className="layer layer-bottom"></div>
        <div className="layer layer-middle"></div>
        <div className="layer layer-top"></div>
        <div className="icing"></div>
        <div className="drip drip1"></div>
        <div className="drip drip2"></div>
        <div className="drip drip3"></div>
        <div className="candle">
          <motion.div 
            className="flame" 
            ref={flameRef}
            initial={{ opacity: 1 }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      </motion.div>

      {permissionGranted && (
        <motion.canvas
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          id="meter" 
          width="500" 
          height="50"
          ref={canvasRef}
        />
      )}
    </div>
  );
};

export default CakeWithSoundDetection;