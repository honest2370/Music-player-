import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlay, FiPause, FiSkipForward, FiSkipBack } from 'react-icons/fi';
import { usePlayer } from '../context/PlayerContext';

export default function MiniPlayer({ onExpand }) {
  const { state, togglePlay, playNext, playPrevious } = usePlayer();

  if (!state.currentTrack) return null;

  const progress = state.duration ? (state.currentTime / state.duration) * 100 : 0;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      style={{
        position: 'fixed',
        bottom: '70px',
        left: '8px',
        right: '8px',
        background: 'linear-gradient(135deg, rgba(13,17,23,0.95), rgba(10,14,23,0.98))',
        backdropFilter: 'blur(20px)',
        borderRadius: '16px',
        border: '1px solid rgba(0,240,255,0.15)',
        zIndex: 900,
        overflow: 'hidden',
      }}
    >
      {/* Progress bar */}
      <div style={{ height: '2px', background: 'rgba(255,255,255,0.05)' }}>
        <motion.div
          style={{
            height: '100%',
            background: 'linear-gradient(90deg, #00f0ff, #7b2ff7)',
            width: `${progress}%`,
          }}
        />
      </div>

      <div
        onClick={onExpand}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '10px 14px',
          gap: '12px',
          cursor: 'pointer',
        }}
      >
        {/* Artwork */}
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '10px',
          background: state.currentTrack.artwork
            ? `url(${state.currentTrack.artwork}) center/cover`
            : 'linear-gradient(135deg, #1a1f2e, #0d1117)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          border: '1px solid rgba(0,240,255,0.1)',
        }}>
          {!state.currentTrack.artwork && (
            <span style={{ fontSize: '18px' }}>🎵</span>
          )}
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            color: '#fff',
            fontSize: '13px',
            fontWeight: 600,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {state.currentTrack.title}
          </div>
          <div style={{
            color: '#6b7b8d',
            fontSize: '11px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {state.currentTrack.artist}
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
             onClick={(e) => e.stopPropagation()}>
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={playPrevious}
            style={{
              background: 'none',
              border: 'none',
              color: '#8899aa',
              padding: '8px',
              cursor: 'pointer',
              display: 'flex',
            }}
          >
            <FiSkipBack size={18} />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={togglePlay}
            style={{
              background: 'linear-gradient(135deg, #00f0ff, #7b2ff7)',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            {state.isPlaying ? <FiPause size={16} /> : <FiPlay size={16} style={{ marginLeft: '2px' }} />}
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={playNext}
            style={{
              background: 'none',
              border: 'none',
              color: '#8899aa',
              padding: '8px',
              cursor: 'pointer',
              display: 'flex',
            }}
          >
            <FiSkipForward size={18} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
