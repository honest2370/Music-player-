import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiActivity, FiHeart, FiWatch, FiZap } from 'react-icons/fi';
import { usePlayer } from '../context/PlayerContext';
import Visualizer from './Visualizer';

export default function NeuroSync() {
  const { state, dispatch } = usePlayer();
  const [heartRate, setHeartRate] = useState(72);
  const [stressLevel, setStressLevel] = useState(30);
  const [mood, setMood] = useState('calm');

  useEffect(() => {
    const interval = setInterval(() => {
      setHeartRate(prev => Math.max(60, Math.min(120, prev + (Math.random() - 0.5) * 4)));
      setStressLevel(prev => Math.max(10, Math.min(90, prev + (Math.random() - 0.5) * 6)));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const moods = ['calm', 'focused', 'energetic', 'melancholic', 'euphoric'];
  const moodColors = {
    calm: '#00f0ff',
    focused: '#7b2ff7',
    energetic: '#ff006e',
    melancholic: '#4a90d9',
    euphoric: '#ffab00',
  };

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
        Neuro-Sync
      </h1>
      <p style={{ color: '#6b7b8d', fontSize: '13px', marginBottom: '20px' }}>
        Biofeedback & Adaptive Audio
      </p>

      {/* Mood Visualizer */}
      <div style={{
        borderRadius: '20px',
        overflow: 'hidden',
        border: '1px solid rgba(0,240,255,0.1)',
        marginBottom: '20px',
        position: 'relative',
      }}>
        <Visualizer type="fluid" width={380} height={160} />
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.02, 1] }}
          transition={{ duration: 60 / heartRate, repeat: Infinity }}
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(circle at 30% 50%, ${moodColors[mood]}22, transparent 60%)`,
            pointerEvents: 'none',
          }}
        />
        <div style={{
          position: 'absolute',
          bottom: '16px',
          left: '16px',
          right: '16px',
          display: 'flex',
          justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ color: '#8899aa', fontSize: '10px', fontWeight: 600 }}>CURRENT MOOD</div>
            <div style={{ color: moodColors[mood], fontSize: '22px', fontWeight: 700, textTransform: 'uppercase' }}>
              {mood}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: '#8899aa', fontSize: '10px', fontWeight: 600 }}>ADAPTS TO</div>
            <div style={{ color: '#ff006e', fontSize: '22px', fontWeight: 700 }}>
              Stress: {Math.round(stressLevel)}%
            </div>
          </div>
        </div>
      </div>

      {/* Bio Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
        <motion.div style={{
          padding: '16px',
          borderRadius: '16px',
          background: 'rgba(255,0,110,0.08)',
          border: '1px solid rgba(255,0,110,0.2)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 60 / heartRate, repeat: Infinity }}>
              <FiHeart size={18} color="#ff006e" />
            </motion.div>
            <span style={{ color: '#ff006e', fontSize: '11px', fontWeight: 600 }}>HEART RATE</span>
          </div>
          <div style={{ color: '#fff', fontSize: '28px', fontWeight: 700 }}>
            {Math.round(heartRate)}
            <span style={{ fontSize: '14px', color: '#8899aa', marginLeft: '4px' }}>BPM</span>
          </div>
        </motion.div>

        <div style={{
          padding: '16px',
          borderRadius: '16px',
          background: 'rgba(0,240,255,0.08)',
          border: '1px solid rgba(0,240,255,0.2)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <FiActivity size={18} color="#00f0ff" />
            <span style={{ color: '#00f0ff', fontSize: '11px', fontWeight: 600 }}>STRESS</span>
          </div>
          <div style={{ color: '#fff', fontSize: '28px', fontWeight: 700 }}>
            {Math.round(stressLevel)}
            <span style={{ fontSize: '14px', color: '#8899aa', marginLeft: '4px' }}>%</span>
          </div>
          <div style={{ height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,0.1)', marginTop: '8px' }}>
            <motion.div
              animate={{ width: `${stressLevel}%` }}
              style={{
                height: '100%',
                borderRadius: '2px',
                background: stressLevel > 60
                  ? 'linear-gradient(90deg, #ff006e, #ff4444)'
                  : 'linear-gradient(90deg, #00f0ff, #7b2ff7)',
              }}
            />
          </div>
        </div>
      </div>

      {/* Wearable Sync */}
      <motion.div
        whileTap={{ scale: 0.98 }}
        style={{
          padding: '16px',
          borderRadius: '16px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '20px',
          cursor: 'pointer',
        }}
      >
        <div style={{
          width: '44px', height: '44px', borderRadius: '12px',
          background: 'rgba(123,47,247,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <FiWatch size={22} color="#7b2ff7" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ color: '#fff', fontSize: '14px', fontWeight: 600 }}>Sync with Apple Watch / Fitbit</div>
          <div style={{ color: '#556', fontSize: '12px', marginTop: '2px' }}>Connect wearable for real biofeedback</div>
        </div>
        <div style={{ color: '#556', fontSize: '20px' }}>›</div>
      </motion.div>

      {/* Mood Selector */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ color: '#fff', fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>Flow Playlists</div>
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }}>
          {moods.map(m => (
            <motion.button
              key={m}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMood(m)}
              style={{
                padding: '12px 20px',
                borderRadius: '16px',
                background: mood === m ? `${moodColors[m]}20` : 'rgba(255,255,255,0.03)',
                border: `1px solid ${mood === m ? `${moodColors[m]}40` : 'rgba(255,255,255,0.08)'}`,
                color: mood === m ? moodColors[m] : '#667',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                textTransform: 'capitalize',
              }}
            >
              {m}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        style={{
          width: '100%',
          padding: '16px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #00f0ff, #7b2ff7)',
          border: 'none',
          color: '#fff',
          fontSize: '15px',
          fontWeight: 700,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          boxShadow: '0 4px 20px rgba(0,240,255,0.3)',
        }}
      >
        <FiZap size={18} />
        Generate from Mood
      </motion.button>

      {/* ECG Waveform */}
      <div style={{
        marginTop: '20px',
        padding: '16px',
        borderRadius: '16px',
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{ color: '#556', fontSize: '11px', marginBottom: '8px', fontWeight: 600 }}>BIOFEEDBACK WAVEFORM</div>
        <svg width="100%" height="60" viewBox="0 0 400 60" preserveAspectRatio="none">
          <motion.path
            d="M0,30 L40,30 L50,10 L60,50 L70,30 L110,30 L120,10 L130,50 L140,30 L180,30 L190,10 L200,50 L210,30 L250,30 L260,10 L270,50 L280,30 L320,30 L330,10 L340,50 L350,30 L400,30"
            fill="none"
            stroke="#00f0ff"
            strokeWidth="2"
            animate={{
              d: [
                "M0,30 L40,30 L50,10 L60,50 L70,30 L110,30 L120,10 L130,50 L140,30 L180,30 L190,10 L200,50 L210,30 L250,30 L260,10 L270,50 L280,30 L320,30 L330,10 L340,50 L350,30 L400,30",
                "M0,30 L40,30 L50,15 L60,45 L70,30 L110,30 L120,5 L130,55 L140,30 L180,30 L190,15 L200,45 L210,30 L250,30 L260,15 L270,45 L280,30 L320,30 L330,5 L340,55 L350,30 L400,30",
              ]
            }}
            transition={{ duration: 60 / heartRate, repeat: Infinity }}
          />
        </svg>
        <div style={{ color: '#445', fontSize: '10px', textAlign: 'center', marginTop: '4px' }}>
          Visuals pulsing based on the current state
        </div>
      </div>
    </motion.div>
  );
}
