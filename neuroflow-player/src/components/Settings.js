import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiSmartphone, FiEye, FiActivity, FiHeadphones, FiZap, FiMusic,
  FiGlobe, FiClock, FiLayers, FiWifi, FiCpu, FiStar,
  FiChevronRight, FiToggleRight
} from 'react-icons/fi';
import { useMotionControl } from '../hooks/useMotionControl';

export default function Settings() {
  const [settings, setSettings] = useState({
    motionControl: false,
    gestures: true,
    eyeTracking: false,
    headMovement: false,
    biofeedback: false,
    hapticFeedback: true,
    neuroPlaylists: false,
    genreShifting: false,
    timeMachine: false,
    spatialAudio3D: true,
    deepfakeFilters: false,
    upscaling4K: false,
    languageTranslation: false,
    realtimeSubtitles: false,
    multiDeviceCasting: false,
    brainwaveAnalysis: false,
    collaborationHub: false,
  });

  const { requestPermission } = useMotionControl(settings.motionControl);

  const toggleSetting = async (key) => {
    if (key === 'motionControl' && !settings.motionControl) {
      const granted = await requestPermission();
      if (!granted) return;
    }
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const settingGroups = [
    {
      title: 'Motion Control',
      icon: FiSmartphone,
      items: [
        { key: 'motionControl', label: 'Motion Control', desc: 'Control with device motion', icon: FiSmartphone },
        { key: 'gestures', label: 'Gestures', desc: 'Swipe and tap controls', icon: FiZap },
        { key: 'eyeTracking', label: 'Eye Tracking', desc: 'Navigate with eye movement', icon: FiEye },
        { key: 'headMovement', label: 'Head Movement', desc: 'Control with head tilts', icon: FiCpu },
      ]
    },
    {
      title: 'Biofeedback & AI',
      icon: FiActivity,
      items: [
        { key: 'biofeedback', label: 'Biofeedback Sync', desc: 'Sync with heart rate sensors', icon: FiActivity },
        { key: 'hapticFeedback', label: 'Haptic Feedback', desc: 'Vibration feedback on interactions', icon: FiSmartphone },
        { key: 'neuroPlaylists', label: 'AI Neuro-Sync Playlists', desc: 'AI adaptive playlists', icon: FiMusic },
        { key: 'genreShifting', label: 'Genre Shifting', desc: 'Dynamic genre transitions', icon: FiLayers },
        { key: 'brainwaveAnalysis', label: 'Brainwave Analysis', desc: 'EEG-based music selection', icon: FiZap },
      ]
    },
    {
      title: 'Audio & Visual',
      icon: FiHeadphones,
      items: [
        { key: 'spatialAudio3D', label: '3D Spatial Audio', desc: 'Immersive 3D sound', icon: FiHeadphones },
        { key: 'timeMachine', label: 'Time Machine Mode', desc: 'Vintage effects & filters', icon: FiClock },
        { key: 'deepfakeFilters', label: 'Video Deepfake Filters', desc: 'AI-powered video filters', icon: FiEye },
        { key: 'upscaling4K', label: '4K/8K Upscaling', desc: 'AI video enhancement', icon: FiStar },
      ]
    },
    {
      title: 'Connectivity',
      icon: FiGlobe,
      items: [
        { key: 'collaborationHub', label: 'Collaboration Hub', desc: 'Shared listening sessions', icon: FiWifi },
        { key: 'languageTranslation', label: 'Language Translation', desc: 'Real-time lyric translation', icon: FiGlobe },
        { key: 'realtimeSubtitles', label: 'Real-time Subtitles', desc: 'Live subtitles for videos', icon: FiLayers },
        { key: 'multiDeviceCasting', label: 'Multi-Device Casting', desc: 'Cast to multiple devices', icon: FiWifi },
      ]
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ minHeight: '100vh', padding: '16px', paddingBottom: '160px' }}
    >
      <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: 700, marginBottom: '4px' }}>Settings</h1>
      <p style={{ color: '#6b7b8d', fontSize: '13px', marginBottom: '20px' }}>Crazy Features & Configuration</p>

      {settingGroups.map((group) => (
        <div key={group.title} style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <group.icon size={16} color="#00f0ff" />
            <span style={{ color: '#00f0ff', fontSize: '12px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>
              {group.title}
            </span>
          </div>
          <div style={{ borderRadius: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
            {group.items.map((item, i) => (
              <motion.div
                key={item.key}
                whileTap={{ scale: 0.99 }}
                onClick={() => toggleSetting(item.key)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '14px',
                  padding: '14px 16px',
                  borderBottom: i < group.items.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                  cursor: 'pointer',
                }}
              >
                <div style={{
                  width: '36px', height: '36px', borderRadius: '10px',
                  background: settings[item.key] ? 'rgba(0,240,255,0.1)' : 'rgba(255,255,255,0.03)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <item.icon size={18} color={settings[item.key] ? '#00f0ff' : '#556'} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: '#fff', fontSize: '14px', fontWeight: 500 }}>{item.label}</div>
                  <div style={{ color: '#556', fontSize: '11px', marginTop: '1px' }}>{item.desc}</div>
                </div>
                <motion.div style={{
                  width: '44px', height: '24px', borderRadius: '12px',
                  background: settings[item.key] ? 'linear-gradient(90deg, #00f0ff, #7b2ff7)' : 'rgba(255,255,255,0.1)',
                  position: 'relative', flexShrink: 0,
                }}>
                  <motion.div
                    animate={{ x: settings[item.key] ? 20 : 2 }}
                    transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                    style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#fff', position: 'absolute', top: '2px' }}
                  />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      ))}

      <div style={{ textAlign: 'center', padding: '20px', color: '#334' }}>
        <div style={{ fontSize: '12px', fontWeight: 600, color: '#556' }}>NeuroFlow Player</div>
        <div style={{ fontSize: '11px', marginTop: '4px' }}>Version 1.0.0</div>
        <div style={{ fontSize: '10px', marginTop: '8px', color: '#445' }}>Built with React • Web Audio API • Framer Motion</div>
      </div>
    </motion.div>
  );
}
