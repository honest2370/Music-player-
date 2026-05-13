import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCast, FiMonitor, FiUsers, FiGlobe, FiRadio, FiHeadphones } from 'react-icons/fi';

export default function ImmersiveModes() {
  const [activeMode, setActiveMode] = useState(null);

  const immersiveFeatures = [
    { id: 'ar-cinema', title: 'AR Cinema', desc: 'Immersive augmented reality theater', icon: '🎬', color: '#7b2ff7' },
    { id: 'vr-concert', title: 'VR Concert', desc: 'Virtual reality concert experience', icon: '🎭', color: '#00f0ff' },
    { id: 'collab', title: 'Real-time Collaboration', desc: 'Listen together with friends', icon: '👥', color: '#ff006e' },
  ];

  const socialFeatures = [
    { icon: FiCast, label: 'Casting audio', desc: 'Cast to nearby devices' },
    { icon: FiRadio, label: 'Multichannel audio', desc: 'Multi-room playback' },
    { icon: FiMonitor, label: 'Real-time mode', desc: 'Live streaming mode' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ minHeight: '100vh', padding: '16px', paddingBottom: '160px' }}
    >
      <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: 700, marginBottom: '4px' }}>
        Immersive Modes
      </h1>
      <p style={{ color: '#6b7b8d', fontSize: '13px', marginBottom: '20px' }}>
        Social & Extended Reality
      </p>

      {/* Shared Session Banner */}
      <motion.div
        whileTap={{ scale: 0.98 }}
        style={{
          borderRadius: '20px',
          overflow: 'hidden',
          marginBottom: '20px',
          position: 'relative',
          background: 'linear-gradient(135deg, #1a237e, #4a148c)',
          padding: '24px',
          cursor: 'pointer',
        }}
      >
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <FiUsers size={18} color="#00f0ff" />
            <span style={{
              padding: '3px 8px', borderRadius: '8px',
              background: 'rgba(0,240,255,0.2)', border: '1px solid rgba(0,240,255,0.3)',
              color: '#00f0ff', fontSize: '10px', fontWeight: 700,
            }}>LIVE</span>
          </div>
          <div style={{ color: '#fff', fontSize: '20px', fontWeight: 700, marginBottom: '4px' }}>
            Shared Session with Friends
          </div>
          <div style={{ color: '#aab', fontSize: '13px' }}>Start a listening party or join one</div>

          <div style={{ display: 'flex', marginTop: '16px' }}>
            {['🧑', '👩', '🧔', '👱'].map((emoji, i) => (
              <div key={i} style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: `linear-gradient(135deg, ${['#ff006e','#7b2ff7','#00f0ff','#ffab00'][i]}, ${['#ff4444','#b388ff','#40c4ff','#ffd740'][i]})`,
                border: '2px solid #1a237e',
                marginLeft: i > 0 ? '-8px' : '0',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '16px', zIndex: 4 - i,
              }}>{emoji}</div>
            ))}
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.15)', border: '2px solid #1a237e',
              marginLeft: '-8px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: '11px', fontWeight: 700,
            }}>+5</div>
          </div>
        </div>
      </motion.div>

      {/* Immersive Feature Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '24px' }}>
        {immersiveFeatures.map(feat => (
          <motion.div
            key={feat.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveMode(feat.id === activeMode ? null : feat.id)}
            style={{
              borderRadius: '16px',
              padding: '16px 12px',
              background: activeMode === feat.id ? `${feat.color}15` : 'rgba(255,255,255,0.03)',
              border: `1px solid ${activeMode === feat.id ? `${feat.color}40` : 'rgba(255,255,255,0.08)'}`,
              textAlign: 'center',
              cursor: 'pointer',
            }}
          >
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>{feat.icon}</div>
            <div style={{ color: activeMode === feat.id ? feat.color : '#fff', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
              {feat.title}
            </div>
            <div style={{ color: '#556', fontSize: '10px', lineHeight: '1.3' }}>{feat.desc}</div>
          </motion.div>
        ))}
      </div>

      {/* Social Features */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ color: '#fff', fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>Connectivity</div>
        {socialFeatures.map((feat, i) => (
          <motion.div
            key={feat.label}
            whileTap={{ scale: 0.98 }}
            style={{
              display: 'flex', alignItems: 'center', gap: '14px',
              padding: '14px 16px', borderRadius: '14px',
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)',
              marginBottom: '8px', cursor: 'pointer',
            }}
          >
            <div style={{
              width: '40px', height: '40px', borderRadius: '12px',
              background: `rgba(${['0,240,255','123,47,247','255,0,110'][i]}, 0.1)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <feat.icon size={20} color={['#00f0ff','#7b2ff7','#ff006e'][i]} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: '#fff', fontSize: '14px', fontWeight: 500 }}>{feat.label}</div>
              <div style={{ color: '#556', fontSize: '12px', marginTop: '2px' }}>{feat.desc}</div>
            </div>
            <div style={{ color: '#556' }}>›</div>
          </motion.div>
        ))}
      </div>

      {/* Multi-Device */}
      <motion.div
        whileTap={{ scale: 0.98 }}
        style={{
          padding: '20px', borderRadius: '16px',
          background: 'linear-gradient(135deg, rgba(0,240,255,0.08), rgba(123,47,247,0.08))',
          border: '1px solid rgba(0,240,255,0.15)', cursor: 'pointer',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <FiGlobe size={22} color="#00f0ff" />
          <div>
            <div style={{ color: '#fff', fontSize: '15px', fontWeight: 700 }}>Cross-Device Library</div>
            <div style={{ color: '#6b7b8d', fontSize: '12px', marginTop: '2px' }}>Access your media library across all devices</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          {['📱', '💻', '🖥️', '📺'].map((device, i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -3, 0] }}
              transition={{ delay: i * 0.2, duration: 2, repeat: Infinity }}
              style={{
                width: '44px', height: '44px', borderRadius: '12px',
                background: 'rgba(0,240,255,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px',
              }}
            >
              {device}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
