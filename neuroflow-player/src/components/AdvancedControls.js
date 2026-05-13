import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { usePlayer } from '../context/PlayerContext';
import Equalizer from './Equalizer';
import Visualizer from './Visualizer';

export default function AdvancedControls() {
  const { state, dispatch } = usePlayer();
  const [activeTab, setActiveTab] = useState('eq');

  const tabs = [
    { id: 'eq', label: 'Equalizer' },
    { id: 'effects', label: 'Effects' },
    { id: 'spatial', label: 'Spatial' },
    { id: 'video', label: 'Video FX' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        minHeight: '100vh',
        padding: '16px',
        paddingBottom: '160px',
      }}
    >
      <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: 700, marginBottom: '4px' }}>
        Advanced Controls
      </h1>
      <p style={{ color: '#6b7b8d', fontSize: '13px', marginBottom: '16px' }}>
        Audio & Video Processing
      </p>

      {/* Mini Visualizer */}
      <div style={{
        marginBottom: '16px',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid rgba(0,240,255,0.1)',
      }}>
        <Visualizer type="bars" width={380} height={80} />
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '20px', overflowX: 'auto' }}>
        {tabs.map(tab => (
          <motion.button
            key={tab.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              background: activeTab === tab.id
                ? 'linear-gradient(135deg, #00f0ff, #7b2ff7)'
                : 'rgba(255,255,255,0.05)',
              border: activeTab === tab.id ? 'none' : '1px solid rgba(255,255,255,0.1)',
              color: activeTab === tab.id ? '#fff' : '#8899aa',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {tab.label}
          </motion.button>
        ))}
      </div>

      {/* Content */}
      <div style={{
        background: 'rgba(255,255,255,0.02)',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.05)',
        padding: '16px',
      }}>
        {activeTab === 'eq' && <Equalizer />}

        {activeTab === 'effects' && (
          <div>
            <h3 style={{ color: '#fff', fontSize: '16px', marginBottom: '16px' }}>Audio Effects</h3>
            {[
              { key: 'reverb', label: 'Reverb', desc: 'Add space and depth' },
              { key: 'delay', label: 'Delay', desc: 'Echo effect' },
              { key: 'binaural', label: 'Binaural', desc: '3D audio processing' },
            ].map(effect => (
              <div key={effect.key} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '14px 0',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
              }}>
                <div>
                  <div style={{ color: '#fff', fontSize: '14px', fontWeight: 500 }}>{effect.label}</div>
                  <div style={{ color: '#556', fontSize: '12px', marginTop: '2px' }}>{effect.desc}</div>
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => dispatch({
                    type: 'SET_EFFECTS',
                    payload: { [effect.key]: !state.effects[effect.key] }
                  })}
                  style={{
                    width: '48px',
                    height: '26px',
                    borderRadius: '13px',
                    background: state.effects[effect.key]
                      ? 'linear-gradient(90deg, #00f0ff, #7b2ff7)'
                      : 'rgba(255,255,255,0.1)',
                    border: 'none',
                    position: 'relative',
                    cursor: 'pointer',
                  }}
                >
                  <motion.div
                    animate={{ x: state.effects[effect.key] ? 22 : 2 }}
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
            ))}

            {/* Playback Speed */}
            <div style={{ marginTop: '20px' }}>
              <div style={{ color: '#fff', fontSize: '14px', fontWeight: 500, marginBottom: '12px' }}>
                Playback Speed: {state.playbackRate}x
              </div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {[0.5, 0.75, 1, 1.25, 1.5, 2].map(rate => (
                  <motion.button
                    key={rate}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => dispatch({ type: 'SET_PLAYBACK_RATE', payload: rate })}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '12px',
                      background: state.playbackRate === rate ? 'rgba(0,240,255,0.2)' : 'rgba(255,255,255,0.05)',
                      border: `1px solid ${state.playbackRate === rate ? 'rgba(0,240,255,0.3)' : 'rgba(255,255,255,0.08)'}`,
                      color: state.playbackRate === rate ? '#00f0ff' : '#667',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {rate}x
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'spatial' && (
          <div>
            <h3 style={{ color: '#fff', fontSize: '16px', marginBottom: '16px' }}>Spatial Audio</h3>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              {['Stereo', '7.1', 'Binaural', '3D'].map(mode => (
                <motion.button
                  key={mode}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => dispatch({ type: 'SET_EFFECTS', payload: { spatial: mode.toLowerCase() } })}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '12px',
                    background: state.effects.spatial === mode.toLowerCase()
                      ? 'linear-gradient(135deg, rgba(0,240,255,0.2), rgba(123,47,247,0.2))'
                      : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${state.effects.spatial === mode.toLowerCase() ? 'rgba(0,240,255,0.3)' : 'rgba(255,255,255,0.08)'}`,
                    color: state.effects.spatial === mode.toLowerCase() ? '#00f0ff' : '#667',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {mode}
                </motion.button>
              ))}
            </div>

            {/* 3D Position Visualization */}
            <div style={{
              width: '100%',
              aspectRatio: '1',
              maxWidth: '250px',
              margin: '0 auto',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(0,240,255,0.05), rgba(0,0,0,0.3))',
              border: '1px solid rgba(0,240,255,0.15)',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #00f0ff, #7b2ff7)',
                  boxShadow: '0 0 20px rgba(0,240,255,0.5)',
                }}
              />
              <div style={{ position: 'absolute', top: '10px', color: '#556', fontSize: '10px' }}>Front</div>
              <div style={{ position: 'absolute', bottom: '10px', color: '#556', fontSize: '10px' }}>Back</div>
              <div style={{ position: 'absolute', left: '10px', color: '#556', fontSize: '10px' }}>L</div>
              <div style={{ position: 'absolute', right: '10px', color: '#556', fontSize: '10px' }}>R</div>
            </div>
          </div>
        )}

        {activeTab === 'video' && (
          <div>
            <h3 style={{ color: '#fff', fontSize: '16px', marginBottom: '16px' }}>Video Effects</h3>
            {[
              { label: 'Color Grading', desc: 'Cinematic color correction' },
              { label: 'Sharpen', desc: 'Enhance detail clarity' },
              { label: 'AI Upscaling', desc: 'Enhance video resolution' },
            ].map((fx) => (
              <div key={fx.label} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '14px 0',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
              }}>
                <div>
                  <div style={{ color: '#fff', fontSize: '14px', fontWeight: 500 }}>{fx.label}</div>
                  <div style={{ color: '#556', fontSize: '12px', marginTop: '2px' }}>{fx.desc}</div>
                </div>
                <div style={{ color: '#00f0ff', fontSize: '12px', cursor: 'pointer' }}>›</div>
              </div>
            ))}

            <div style={{
              marginTop: '16px',
              padding: '16px',
              borderRadius: '12px',
              background: 'rgba(123,47,247,0.08)',
              border: '1px solid rgba(123,47,247,0.2)',
            }}>
              <div style={{ color: '#b388ff', fontSize: '12px', fontWeight: 600 }}>
                🎨 Visualization Reactions
              </div>
              <div style={{ color: '#667', fontSize: '11px', marginTop: '4px' }}>
                Visualizations react in real-time to audio frequencies and beats
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
