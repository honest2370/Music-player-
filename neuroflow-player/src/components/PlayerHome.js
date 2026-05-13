import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlay, FiPause, FiSkipForward, FiSkipBack, FiRepeat, FiShuffle, FiHeart, FiShare2, FiVolume2, FiVolumeX } from 'react-icons/fi';
import { usePlayer } from '../context/PlayerContext';
import { useGestures } from '../hooks/useGestures';
import Visualizer from './Visualizer';

export default function PlayerHome() {
  const { state, dispatch, togglePlay, playNext, playPrevious, seekTo } = usePlayer();
  const [liked, setLiked] = useState(false);
  const [showVolume, setShowVolume] = useState(false);
  const [vizType, setVizType] = useState('fluid');
  const containerRef = useRef(null);

  useGestures(containerRef, {
    onSwipeLeft: () => playNext(),
    onSwipeRight: () => playPrevious(),
    onSwipeUp: () => setVizType(prev => {
      const types = ['wave', 'bars', 'fluid', 'circular', 'particles'];
      const idx = (types.indexOf(prev) + 1) % types.length;
      return types[idx];
    }),
  });

  const formatTime = (t) => {
    if (!t || isNaN(t)) return '0:00';
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const progress = state.duration ? (state.currentTime / state.duration) * 100 : 0;

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        minHeight: '100vh',
        padding: '20px',
        paddingBottom: '100px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* Status Bar Area */}
      <div style={{
        width: '100%',
        textAlign: 'center',
        marginBottom: '10px',
      }}>
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            color: '#00f0ff',
            fontSize: '12px',
            fontWeight: 600,
            letterSpacing: '2px',
          }}
        >
          {state.isPlaying ? '♪ FLUID PLAYING' : 'NEUROFLOW'}
        </motion.div>
        <div style={{ color: '#556', fontSize: '10px', marginTop: '2px' }}>
          Gesture Nav • Swipe to control
        </div>
      </div>

      {/* Visualizer / Album Art */}
      <motion.div
        style={{
          width: '100%',
          maxWidth: '350px',
          aspectRatio: '1',
          borderRadius: '24px',
          overflow: 'hidden',
          position: 'relative',
          background: '#0d1117',
          border: '1px solid rgba(0,240,255,0.1)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(0,240,255,0.05)',
          margin: '10px 0',
        }}
      >
        {state.currentTrack?.artwork ? (
          <>
            <img
              src={state.currentTrack.artwork}
              alt="Album Art"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                position: 'absolute',
                top: 0,
                left: 0,
              }}
            />
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '50%',
              background: 'linear-gradient(transparent, rgba(10,14,23,0.9))',
            }} />
          </>
        ) : (
          <Visualizer
            type={vizType}
            width={350}
            height={350}
            style={{ width: '100%', height: '100%', borderRadius: 0 }}
          />
        )}

        {/* Viz Type badges */}
        <div style={{
          position: 'absolute',
          bottom: '12px',
          left: '12px',
          display: 'flex',
          gap: '6px',
        }}>
          {['wave', 'bars', 'fluid', 'circular', 'particles'].map(t => (
            <motion.button
              key={t}
              whileTap={{ scale: 0.9 }}
              onClick={() => setVizType(t)}
              style={{
                padding: '4px 10px',
                borderRadius: '12px',
                background: vizType === t
                  ? 'rgba(0,240,255,0.3)'
                  : 'rgba(0,0,0,0.5)',
                border: vizType === t
                  ? '1px solid rgba(0,240,255,0.5)'
                  : '1px solid rgba(255,255,255,0.1)',
                color: vizType === t ? '#00f0ff' : '#667',
                fontSize: '9px',
                fontWeight: 600,
                textTransform: 'capitalize',
                cursor: 'pointer',
                backdropFilter: 'blur(10px)',
              }}
            >
              {t}
            </motion.button>
          ))}
        </div>

        {/* AR Mode badge */}
        <div style={{
          position: 'absolute',
          bottom: '12px',
          right: '12px',
          display: 'flex',
          gap: '6px',
        }}>
          <span style={{
            padding: '4px 8px',
            borderRadius: '8px',
            background: 'rgba(123,47,247,0.3)',
            border: '1px solid rgba(123,47,247,0.5)',
            color: '#b388ff',
            fontSize: '8px',
            fontWeight: 600,
          }}>
            AR Mode
          </span>
        </div>
      </motion.div>

      {/* Track Info */}
      <div style={{
        width: '100%',
        maxWidth: '350px',
        padding: '16px 0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <motion.div
            key={state.currentTrack?.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              color: '#fff',
              fontSize: '20px',
              fontWeight: 700,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {state.currentTrack?.title || 'No Track Selected'}
          </motion.div>
          <div style={{
            color: '#6b7b8d',
            fontSize: '14px',
            marginTop: '2px',
          }}>
            {state.currentTrack?.artist || 'Select media to play'}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => setLiked(!liked)}
            style={{
              background: 'none',
              border: 'none',
              color: liked ? '#ff006e' : '#556',
              cursor: 'pointer',
              padding: '8px',
            }}
          >
            <FiHeart size={22} fill={liked ? '#ff006e' : 'none'} />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => {
              if (navigator.share && state.currentTrack) {
                navigator.share({ title: state.currentTrack.title });
              }
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#556',
              cursor: 'pointer',
              padding: '8px',
            }}
          >
            <FiShare2 size={20} />
          </motion.button>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ width: '100%', maxWidth: '350px' }}>
        <div
          style={{
            width: '100%',
            height: '6px',
            background: 'rgba(255,255,255,0.08)',
            borderRadius: '3px',
            cursor: 'pointer',
            position: 'relative',
          }}
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const pct = (e.clientX - rect.left) / rect.width;
            seekTo(pct * state.duration);
          }}
        >
          <motion.div
            style={{
              height: '100%',
              borderRadius: '3px',
              background: 'linear-gradient(90deg, #00f0ff, #7b2ff7)',
              width: `${progress}%`,
              position: 'relative',
            }}
          >
            <div style={{
              position: 'absolute',
              right: '-6px',
              top: '-3px',
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: '#00f0ff',
              boxShadow: '0 0 10px rgba(0,240,255,0.5)',
            }} />
          </motion.div>
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '6px',
        }}>
          <span style={{ color: '#6b7b8d', fontSize: '12px' }}>{formatTime(state.currentTime)}</span>
          <span style={{ color: '#6b7b8d', fontSize: '12px' }}>{formatTime(state.duration)}</span>
        </div>
      </div>

      {/* Main Controls */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        marginTop: '20px',
        width: '100%',
        maxWidth: '350px',
      }}>
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() => dispatch({ type: 'TOGGLE_SHUFFLE' })}
          style={{
            background: 'none',
            border: 'none',
            color: state.isShuffled ? '#00f0ff' : '#556',
            cursor: 'pointer',
            padding: '8px',
          }}
        >
          <FiShuffle size={20} />
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={playPrevious}
          style={{
            background: 'none',
            border: 'none',
            color: '#ccc',
            cursor: 'pointer',
            padding: '8px',
          }}
        >
          <FiSkipBack size={28} fill="#ccc" />
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={togglePlay}
          style={{
            background: 'linear-gradient(135deg, #00f0ff, #7b2ff7)',
            border: 'none',
            borderRadius: '50%',
            width: '64px',
            height: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            cursor: 'pointer',
            boxShadow: '0 0 30px rgba(0,240,255,0.3)',
          }}
        >
          {state.isPlaying
            ? <FiPause size={28} />
            : <FiPlay size={28} style={{ marginLeft: '3px' }} />
          }
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={playNext}
          style={{
            background: 'none',
            border: 'none',
            color: '#ccc',
            cursor: 'pointer',
            padding: '8px',
          }}
        >
          <FiSkipForward size={28} fill="#ccc" />
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() => dispatch({ type: 'SET_REPEAT' })}
          style={{
            background: 'none',
            border: 'none',
            color: state.repeatMode !== 'off' ? '#00f0ff' : '#556',
            cursor: 'pointer',
            padding: '8px',
            position: 'relative',
          }}
        >
          <FiRepeat size={20} />
          {state.repeatMode === 'one' && (
            <span style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              fontSize: '8px',
              color: '#00f0ff',
              fontWeight: 700,
            }}>1</span>
          )}
        </motion.button>
      </div>

      {/* Volume Control */}
      <div style={{
        width: '100%',
        maxWidth: '350px',
        marginTop: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}>
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() => dispatch({ type: 'TOGGLE_MUTE' })}
          style={{
            background: 'none',
            border: 'none',
            color: '#6b7b8d',
            cursor: 'pointer',
            padding: '4px',
          }}
        >
          {state.isMuted ? <FiVolumeX size={18} /> : <FiVolume2 size={18} />}
        </motion.button>
        <div
          style={{
            flex: 1,
            height: '4px',
            background: 'rgba(255,255,255,0.08)',
            borderRadius: '2px',
            cursor: 'pointer',
          }}
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const vol = (e.clientX - rect.left) / rect.width;
            dispatch({ type: 'SET_VOLUME', payload: Math.max(0, Math.min(1, vol)) });
          }}
        >
          <div style={{
            width: `${(state.isMuted ? 0 : state.volume) * 100}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #00f0ff, #7b2ff7)',
            borderRadius: '2px',
          }} />
        </div>
      </div>

      {/* Feature Badges */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginTop: '24px',
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}>
        {['Neuro-Sync', 'AR Mode', 'Multi-Haptics', 'Spatial'].map(badge => (
          <motion.div
            key={badge}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              background: 'rgba(0,240,255,0.08)',
              border: '1px solid rgba(0,240,255,0.15)',
              color: '#00f0ff',
              fontSize: '11px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            {badge}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
