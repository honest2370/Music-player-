import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiMusic, FiVideo, FiGrid, FiList, FiPlay, FiClock, FiHardDrive } from 'react-icons/fi';
import { usePlayer } from '../context/PlayerContext';

export default function MediaLibrary() {
  const { state, playTrack } = usePlayer();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState('list');
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'recent', label: 'New Releases' },
    { id: 'genres', label: 'Genres' },
    { id: 'moods', label: 'Moods' },
    { id: 'trending', label: 'Trending' },
  ];

  const allMedia = useMemo(() => {
    let items = [];
    if (activeTab === 'all' || activeTab === 'audio') {
      items = [...items, ...state.tracks];
    }
    if (activeTab === 'all' || activeTab === 'video') {
      items = [...items, ...state.videos];
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      items = items.filter(item =>
        item.title.toLowerCase().includes(q) ||
        item.artist?.toLowerCase().includes(q) ||
        item.album?.toLowerCase().includes(q)
      );
    }

    return items;
  }, [state.tracks, state.videos, activeTab, searchQuery]);

  const formatSize = (bytes) => {
    if (!bytes) return '';
    if (bytes > 1073741824) return `${(bytes / 1073741824).toFixed(1)} GB`;
    if (bytes > 1048576) return `${(bytes / 1048576).toFixed(1)} MB`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  const formatDuration = (d) => {
    if (!d) return '';
    const m = Math.floor(d / 60);
    const s = Math.floor(d % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
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
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
      }}>
        <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: 700 }}>Library</h1>
        <div style={{ display: 'flex', gap: '8px' }}>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
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
            {viewMode === 'list' ? <FiGrid size={16} /> : <FiList size={16} />}
          </motion.button>
        </div>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: '16px' }}>
        <FiSearch style={{
          position: 'absolute',
          left: '14px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: '#556',
        }} />
        <input
          type="text"
          placeholder="Search music, videos, artists..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 14px 12px 40px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '14px',
            color: '#fff',
            fontSize: '14px',
            outline: 'none',
          }}
        />
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '16px',
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
        msOverflowStyle: 'none',
        scrollbarWidth: 'none',
      }}>
        {[
          { id: 'all', label: 'All', icon: null },
          { id: 'audio', label: 'Music', icon: FiMusic },
          { id: 'video', label: 'Videos', icon: FiVideo },
        ].map(tab => (
          <motion.button
            key={tab.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '8px 18px',
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
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            {tab.icon && <tab.icon size={14} />}
            {tab.label}
            <span style={{ fontSize: '11px', opacity: 0.7 }}>
              ({tab.id === 'all' ? allMedia.length :
                tab.id === 'audio' ? state.tracks.length :
                state.videos.length})
            </span>
          </motion.button>
        ))}
      </div>

      {/* Categories */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '20px',
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
        paddingBottom: '4px',
      }}>
        {categories.map(cat => (
          <motion.button
            key={cat.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveCategory(cat.id)}
            style={{
              padding: '6px 14px',
              borderRadius: '16px',
              background: activeCategory === cat.id ? 'rgba(0,240,255,0.15)' : 'transparent',
              border: `1px solid ${activeCategory === cat.id ? 'rgba(0,240,255,0.3)' : 'rgba(255,255,255,0.08)'}`,
              color: activeCategory === cat.id ? '#00f0ff' : '#667',
              fontSize: '12px',
              fontWeight: 500,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {cat.label}
          </motion.button>
        ))}
      </div>

      {/* Dynamic Categories Cards */}
      {activeCategory !== 'all' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          gap: '12px',
          marginBottom: '20px',
        }}>
          {['AI Curated', 'Your Flow State', 'Relive Memories'].map((name, i) => (
            <motion.div
              key={name}
              whileTap={{ scale: 0.97 }}
              style={{
                borderRadius: '16px',
                overflow: 'hidden',
                background: `linear-gradient(135deg, 
                  ${['#1a237e', '#4a148c', '#004d40'][i]}, 
                  ${['#0d47a1', '#6a1b9a', '#00695c'][i]})`,
                padding: '16px',
                cursor: 'pointer',
                aspectRatio: '1.2',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
              }}
            >
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                marginBottom: '8px',
              }}>
                {['🤖', '🧠', '📸'][i]}
              </div>
              <div style={{ color: '#fff', fontSize: '13px', fontWeight: 600 }}>{name}</div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Media List */}
      {allMedia.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📂</div>
          <div style={{ color: '#fff', fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>
            No Media Files
          </div>
          <div style={{ color: '#6b7b8d', fontSize: '14px', lineHeight: '1.5' }}>
            Tap the menu (☰) and use "Scan Folder" or "Add Files" to load your music and videos
          </div>
        </div>
      ) : (
        <div style={{
          display: viewMode === 'grid' ? 'grid' : 'flex',
          gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(100px, 1fr))' : undefined,
          flexDirection: viewMode === 'list' ? 'column' : undefined,
          gap: viewMode === 'grid' ? '12px' : '2px',
        }}>
          <AnimatePresence>
            {allMedia.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => playTrack(item, index)}
                style={{
                  ...(viewMode === 'list' ? {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 12px',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    background: state.currentTrack?.id === item.id ? 'rgba(0,240,255,0.08)' : 'transparent',
                    borderBottom: '1px solid rgba(255,255,255,0.03)',
                  } : {
                    borderRadius: '12px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    background: state.currentTrack?.id === item.id ? 'rgba(0,240,255,0.1)' : 'rgba(255,255,255,0.03)',
                    border: state.currentTrack?.id === item.id ? '1px solid rgba(0,240,255,0.3)' : '1px solid rgba(255,255,255,0.05)',
                  }),
                }}
              >
                {viewMode === 'list' ? (
                  <>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '10px',
                      background: item.artwork ? `url(${item.artwork}) center/cover` : 'linear-gradient(135deg, #1a1f2e, #0d1117)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      border: '1px solid rgba(0,240,255,0.08)',
                      position: 'relative',
                    }}>
                      {!item.artwork && (
                        <span style={{ fontSize: '20px' }}>{item.type === 'video' ? '🎬' : '🎵'}</span>
                      )}
                      {state.currentTrack?.id === item.id && state.isPlaying && (
                        <motion.div
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 1, repeat: Infinity }}
                          style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'rgba(0,240,255,0.2)',
                            borderRadius: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <div style={{ color: '#00f0ff', fontSize: '16px' }}>♪</div>
                        </motion.div>
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        color: state.currentTrack?.id === item.id ? '#00f0ff' : '#fff',
                        fontSize: '14px',
                        fontWeight: 500,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>
                        {item.title}
                      </div>
                      <div style={{
                        color: '#6b7b8d',
                        fontSize: '12px',
                        marginTop: '2px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}>
                        <span>{item.artist}</span>
                        {item.duration > 0 && (
                          <>
                            <span>•</span>
                            <span>{formatDuration(item.duration)}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
                      <span style={{
                        padding: '2px 6px',
                        borderRadius: '4px',
                        background: item.type === 'video' ? 'rgba(255,0,110,0.15)' : 'rgba(0,240,255,0.1)',
                        color: item.type === 'video' ? '#ff006e' : '#00f0ff',
                        fontSize: '9px',
                        fontWeight: 600,
                      }}>
                        {item.format}
                      </span>
                      <span style={{ color: '#445', fontSize: '10px' }}>{formatSize(item.size)}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{
                      aspectRatio: '1',
                      background: item.artwork ? `url(${item.artwork}) center/cover` : 'linear-gradient(135deg, #1a1f2e, #0d1117)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      {!item.artwork && (
                        <span style={{ fontSize: '28px' }}>{item.type === 'video' ? '🎬' : '🎵'}</span>
                      )}
                    </div>
                    <div style={{ padding: '8px' }}>
                      <div style={{
                        color: '#fff',
                        fontSize: '11px',
                        fontWeight: 500,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>
                        {item.title}
                      </div>
                      <div style={{ color: '#6b7b8d', fontSize: '10px', marginTop: '2px' }}>{item.artist}</div>
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Stats */}
      {allMedia.length > 0 && (
        <div style={{
          marginTop: '20px',
          padding: '16px',
          borderRadius: '12px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          justifyContent: 'space-around',
        }}>
          <div style={{ textAlign: 'center' }}>
            <FiMusic style={{ color: '#00f0ff', marginBottom: '4px' }} />
            <div style={{ color: '#fff', fontSize: '16px', fontWeight: 700 }}>{state.tracks.length}</div>
            <div style={{ color: '#556', fontSize: '10px' }}>Tracks</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <FiVideo style={{ color: '#7b2ff7', marginBottom: '4px' }} />
            <div style={{ color: '#fff', fontSize: '16px', fontWeight: 700 }}>{state.videos.length}</div>
            <div style={{ color: '#556', fontSize: '10px' }}>Videos</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <FiHardDrive style={{ color: '#ff006e', marginBottom: '4px' }} />
            <div style={{ color: '#fff', fontSize: '16px', fontWeight: 700 }}>
              {formatSize(allMedia.reduce((acc, item) => acc + (item.size || 0), 0))}
            </div>
            <div style={{ color: '#556', fontSize: '10px' }}>Total</div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
