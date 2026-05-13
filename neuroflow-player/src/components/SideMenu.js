import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHome, FiMusic, FiVideo, FiSliders, FiActivity, FiGlobe, FiSettings, FiX, FiFolder, FiPlus } from 'react-icons/fi';

export default function SideMenu({ isOpen, onClose, activePage, onNavigate, onScanFiles, onAddFiles }) {
  const menuItems = [
    { id: 'home', label: 'Now Playing', icon: FiHome },
    { id: 'library', label: 'Media Library', icon: FiMusic },
    { id: 'controls', label: 'Advanced Controls', icon: FiSliders },
    { id: 'neuro', label: 'Neuro-Sync', icon: FiActivity },
    { id: 'immersive', label: 'Immersive Modes', icon: FiGlobe },
    { id: 'settings', label: 'Settings', icon: FiSettings },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(5px)',
              zIndex: 998,
            }}
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '280px',
              height: '100%',
              background: 'linear-gradient(180deg, #0d1117 0%, #0a0e17 100%)',
              borderRight: '1px solid rgba(0,240,255,0.15)',
              zIndex: 999,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div style={{
              padding: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid rgba(0,240,255,0.1)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #00f0ff, #7b2ff7)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                }}>
                  ▶
                </div>
                <div>
                  <div style={{ color: '#fff', fontWeight: 700, fontSize: '16px' }}>NeuroFlow</div>
                  <div style={{ color: '#00f0ff', fontSize: '11px' }}>Media Player</div>
                </div>
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: 'none',
                  borderRadius: '10px',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#8899aa',
                  cursor: 'pointer',
                }}
              >
                <FiX size={20} />
              </motion.button>
            </div>

            {/* File Actions */}
            <div style={{ padding: '12px 16px', display: 'flex', gap: '8px' }}>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => { onScanFiles?.(); onClose(); }}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: 'linear-gradient(135deg, rgba(0,240,255,0.15), rgba(123,47,247,0.15))',
                  border: '1px solid rgba(0,240,255,0.2)',
                  borderRadius: '10px',
                  color: '#00f0ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <FiFolder size={14} /> Scan Folder
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => { onAddFiles?.(); onClose(); }}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px',
                  color: '#ccc',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <FiPlus size={14} /> Add Files
              </motion.button>
            </div>

            {/* Navigation */}
            <div style={{ flex: 1, padding: '8px 12px', overflowY: 'auto' }}>
              {menuItems.map((item, i) => {
                const Icon = item.icon;
                const isActive = activePage === item.id;
                return (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => { onNavigate(item.id); onClose(); }}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      background: isActive
                        ? 'linear-gradient(90deg, rgba(0,240,255,0.15), transparent)'
                        : 'transparent',
                      border: 'none',
                      borderRadius: '12px',
                      borderLeft: isActive ? '3px solid #00f0ff' : '3px solid transparent',
                      color: isActive ? '#00f0ff' : '#8899aa',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      fontSize: '14px',
                      fontWeight: isActive ? 600 : 400,
                      cursor: 'pointer',
                      marginBottom: '4px',
                      transition: 'all 0.2s',
                    }}
                  >
                    <Icon size={20} />
                    {item.label}
                  </motion.button>
                );
              })}
            </div>

            {/* Footer */}
            <div style={{
              padding: '16px 20px',
              borderTop: '1px solid rgba(0,240,255,0.1)',
              textAlign: 'center',
            }}>
              <div style={{ color: '#445', fontSize: '11px' }}>NeuroFlow v1.0</div>
              <div style={{ color: '#334', fontSize: '10px', marginTop: '2px' }}>
                Powered by Web Audio API
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
