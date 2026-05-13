import React, { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import './App.css';
import { PlayerProvider, usePlayer } from './context/PlayerContext';
import { useMediaFiles } from './hooks/useMediaFiles';
import PlayerHome from './components/PlayerHome';
import MediaLibrary from './components/MediaLibrary';
import AdvancedControls from './components/AdvancedControls';
import NeuroSync from './components/NeuroSync';
import ImmersiveModes from './components/ImmersiveModes';
import Settings from './components/Settings';
import SideMenu from './components/SideMenu';
import MiniPlayer from './components/MiniPlayer';
import Navigation from './components/Navigation';
import { FiMenu, FiCast, FiSettings } from 'react-icons/fi';

function AppContent() {
  const [activePage, setActivePage] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const { state, dispatch } = usePlayer();
  const { scanFiles, addFiles, loading } = useMediaFiles();

  const handleScanFiles = useCallback(async () => {
    const media = await scanFiles();
    if (media) {
      dispatch({ type: 'SET_TRACKS', payload: [...state.tracks, ...media.tracks] });
      dispatch({ type: 'SET_VIDEOS', payload: [...state.videos, ...media.videos] });
    }
  }, [scanFiles, dispatch, state.tracks, state.videos]);

  const handleAddFiles = useCallback(async () => {
    const media = await addFiles();
    if (media) {
      dispatch({ type: 'SET_TRACKS', payload: [...state.tracks, ...media.tracks] });
      dispatch({ type: 'SET_VIDEOS', payload: [...state.videos, ...media.videos] });
    }
  }, [addFiles, dispatch, state.tracks, state.videos]);

  const pages = {
    home: PlayerHome,
    library: MediaLibrary,
    controls: AdvancedControls,
    neuro: NeuroSync,
    immersive: ImmersiveModes,
    settings: Settings,
  };

  const CurrentPage = pages[activePage] || PlayerHome;

  return (
    <div style={{
      maxWidth: '500px',
      margin: '0 auto',
      minHeight: '100vh',
      minHeight: '100dvh',
      background: '#0a0e17',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background gradient */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '500px',
        height: '100%',
        background: 'radial-gradient(ellipse at 30% 20%, rgba(0,240,255,0.03) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(123,47,247,0.03) 0%, transparent 60%)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      {/* Top Bar */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 700,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        paddingTop: 'max(12px, env(safe-area-inset-top))',
        background: 'linear-gradient(180deg, rgba(10,14,23,0.95), rgba(10,14,23,0.8), transparent)',
        backdropFilter: 'blur(10px)',
      }}>
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() => setMenuOpen(true)}
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '10px',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#8899aa',
            cursor: 'pointer',
          }}
        >
          <FiMenu size={20} />
        </motion.button>

        <div style={{
          color: '#fff',
          fontSize: '16px',
          fontWeight: 700,
          letterSpacing: '0.5px',
        }}>
          {activePage === 'home' ? 'Now Playing' :
           activePage === 'library' ? 'Library' :
           activePage === 'controls' ? 'Controls' :
           activePage === 'neuro' ? 'Neuro-Sync' :
           activePage === 'immersive' ? 'Immersive' :
           'Settings'}
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <motion.button
            whileTap={{ scale: 0.85 }}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '10px',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#8899aa',
              cursor: 'pointer',
            }}
          >
            <FiCast size={18} />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => setActivePage('settings')}
            style={{
              background: activePage === 'settings'
                ? 'rgba(0,240,255,0.1)'
                : 'rgba(255,255,255,0.05)',
              border: `1px solid ${activePage === 'settings' ? 'rgba(0,240,255,0.2)' : 'rgba(255,255,255,0.08)'}`,
              borderRadius: '10px',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: activePage === 'settings' ? '#00f0ff' : '#8899aa',
              cursor: 'pointer',
            }}
          >
            <FiSettings size={18} />
          </motion.button>
        </div>
      </div>

      {/* Loading indicator */}
      {loading && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            position: 'fixed',
            top: '80px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '8px 20px',
            borderRadius: '20px',
            background: 'rgba(0,240,255,0.15)',
            border: '1px solid rgba(0,240,255,0.3)',
            color: '#00f0ff',
            fontSize: '12px',
            fontWeight: 600,
            zIndex: 950,
            backdropFilter: 'blur(10px)',
          }}
        >
          Loading media files...
        </motion.div>
      )}

      {/* Page Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <CurrentPage />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Mini Player */}
      <AnimatePresence>
        {state.currentTrack && activePage !== 'home' && (
          <MiniPlayer onExpand={() => setActivePage('home')} />
        )}
      </AnimatePresence>

      {/* Bottom Navigation */}
      <Navigation activePage={activePage} onNavigate={setActivePage} />

      {/* Side Menu */}
      <SideMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        activePage={activePage}
        onNavigate={setActivePage}
        onScanFiles={handleScanFiles}
        onAddFiles={handleAddFiles}
      />
    </div>
  );
}

export default function App() {
  return (
    <PlayerProvider>
      <AppContent />
    </PlayerProvider>
  );
}
