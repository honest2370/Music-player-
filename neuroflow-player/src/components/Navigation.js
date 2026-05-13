import React from 'react';
import { motion } from 'framer-motion';
import { FiHome, FiMusic, FiSliders, FiActivity, FiGlobe } from 'react-icons/fi';

export default function Navigation({ activePage, onNavigate }) {
  const tabs = [
    { id: 'home', icon: FiHome, label: 'Home' },
    { id: 'library', icon: FiMusic, label: 'Library' },
    { id: 'controls', icon: FiSliders, label: 'Controls' },
    { id: 'neuro', icon: FiActivity, label: 'Neuro' },
    { id: 'immersive', icon: FiGlobe, label: 'Social' },
  ];

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: 'linear-gradient(180deg, rgba(10,14,23,0.9), rgba(10,14,23,0.98))',
      backdropFilter: 'blur(20px)',
      borderTop: '1px solid rgba(0,240,255,0.08)',
      zIndex: 800,
      paddingBottom: 'env(safe-area-inset-bottom)',
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-around', alignItems: 'center',
        height: '64px', maxWidth: '500px', margin: '0 auto',
      }}>
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activePage === tab.id;
          return (
            <motion.button
              key={tab.id}
              whileTap={{ scale: 0.85 }}
              onClick={() => onNavigate(tab.id)}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                background: 'none', border: 'none',
                color: isActive ? '#00f0ff' : '#556',
                cursor: 'pointer', padding: '8px 12px', position: 'relative',
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="navIndicator"
                  style={{
                    position: 'absolute', top: '-1px',
                    width: '24px', height: '2px', borderRadius: '1px',
                    background: 'linear-gradient(90deg, #00f0ff, #7b2ff7)',
                  }}
                />
              )}
              <Icon size={22} />
              <span style={{ fontSize: '10px', fontWeight: isActive ? 600 : 400 }}>{tab.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
