import React from 'react';
import { motion } from 'framer-motion';
import { usePlayer } from '../context/PlayerContext';

const PRESETS = {
  flat: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  bass: [8, 6, 4, 2, 0, 0, 0, 0, 0, 0],
  treble: [0, 0, 0, 0, 0, 2, 4, 6, 6, 8],
  vocal: [-2, -1, 0, 3, 6, 6, 3, 0, -1, -2],
  rock: [5, 4, 2, 0, -1, 0, 2, 4, 5, 5],
  pop: [-1, 2, 4, 5, 4, 2, 0, -1, -1, -1],
  jazz: [3, 2, 0, 2, -2, -2, 0, 2, 3, 3],
  electronic: [5, 4, 2, 0, -2, 0, 2, 4, 5, 4],
  classical: [4, 3, 0, 0, -1, -1, 0, 2, 3, 4],
};

const FREQ_LABELS = ['32', '64', '125', '250', '500', '1K', '2K', '4K', '8K', '16K'];

export default function Equalizer() {
  const { state, dispatch } = usePlayer();
  const { equalizer } = state;

  const setBand = (index, value) => {
    const newBands = [...equalizer.bands];
    newBands[index] = value;
    dispatch({ type: 'SET_EQUALIZER', payload: { bands: newBands, preset: 'custom' } });
  };

  const setPreset = (name) => {
    dispatch({
      type: 'SET_EQUALIZER',
      payload: { preset: name, bands: PRESETS[name], enabled: true }
    });
  };

  return (
    <div>
      {/* Enable Toggle */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
      }}>
        <span style={{ color: '#fff', fontSize: '14px', fontWeight: 600 }}>Equalizer</span>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => dispatch({ type: 'SET_EQUALIZER', payload: { enabled: !equalizer.enabled } })}
          style={{
            width: '48px',
            height: '26px',
            borderRadius: '13px',
            background: equalizer.enabled
              ? 'linear-gradient(90deg, #00f0ff, #7b2ff7)'
              : 'rgba(255,255,255,0.1)',
            border: 'none',
            position: 'relative',
            cursor: 'pointer',
            transition: 'background 0.3s',
          }}
        >
          <motion.div
            animate={{ x: equalizer.enabled ? 22 : 2 }}
            style={{
              width: '22px',
              height: '22px',
              borderRadius: '50%',
              background: '#fff',
              position: 'absolute',
              top: '2px',
            }}
          />
        </motion.button>
      </div>

      {/* Presets */}
      <div style={{
        display: 'flex',
        gap: '6px',
        flexWrap: 'wrap',
        marginBottom: '20px',
      }}>
        {Object.keys(PRESETS).map(name => (
          <motion.button
            key={name}
            whileTap={{ scale: 0.95 }}
            onClick={() => setPreset(name)}
            style={{
              padding: '6px 12px',
              borderRadius: '16px',
              background: equalizer.preset === name
                ? 'linear-gradient(135deg, rgba(0,240,255,0.2), rgba(123,47,247,0.2))'
                : 'rgba(255,255,255,0.05)',
              border: `1px solid ${equalizer.preset === name ? 'rgba(0,240,255,0.3)' : 'rgba(255,255,255,0.08)'}`,
              color: equalizer.preset === name ? '#00f0ff' : '#667',
              fontSize: '11px',
              fontWeight: 500,
              textTransform: 'capitalize',
              cursor: 'pointer',
            }}
          >
            {name}
          </motion.button>
        ))}
      </div>

      {/* Bands */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        height: '200px',
        padding: '0 4px',
        gap: '4px',
      }}>
        {equalizer.bands.map((value, i) => (
          <div key={i} style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            height: '100%',
            justifyContent: 'flex-end',
          }}>
            <div style={{ color: '#00f0ff', fontSize: '9px', marginBottom: '4px', fontWeight: 600 }}>
              {value > 0 ? `+${value}` : value}
            </div>
            <div style={{
              width: '100%',
              maxWidth: '28px',
              flex: 1,
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
            }}>
              <input
                type="range"
                min="-12"
                max="12"
                step="1"
                value={value}
                onChange={(e) => setBand(i, parseInt(e.target.value))}
                style={{
                  width: '140px',
                  transform: 'rotate(-90deg)',
                  transformOrigin: 'center center',
                  position: 'absolute',
                  top: '50%',
                  marginTop: '-70px',
                  appearance: 'none',
                  WebkitAppearance: 'none',
                  height: '4px',
                  background: `linear-gradient(90deg, 
                    rgba(0,240,255,0.3) 0%, 
                    rgba(0,240,255,0.8) ${(value + 12) / 24 * 100}%, 
                    rgba(255,255,255,0.1) ${(value + 12) / 24 * 100}%)`,
                  borderRadius: '2px',
                  outline: 'none',
                  cursor: 'pointer',
                }}
              />
            </div>
            <div style={{ color: '#556', fontSize: '9px', marginTop: '4px', fontWeight: 500 }}>
              {FREQ_LABELS[i]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
